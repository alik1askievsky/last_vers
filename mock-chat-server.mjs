// mock-chat-server.mjs
import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import { WebSocketServer } from "ws";

// =====================
// CONFIG
// =====================
const PORT = Number(process.env.PORT || 52052);
const WS_PATH = "/ws";

// Разрешаем любой localhost/127.0.0.1 с любым портом (Vite/React)
function isAllowedOrigin(origin) {
  if (!origin) return true; // curl/postman
  try {
    const u = new URL(origin);
    return u.hostname === "localhost" || u.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

function nowISO() {
  return new Date().toISOString();
}
function uuid() {
  return crypto.randomUUID();
}

// =====================
// IN-MEMORY STORE
// =====================
/**
 * chats: Map<chat_uuid, {
 *   chat_uuid, user_id, title, model_name, model_version,
 *   created_at, updated_at,
 *   messages: Array<{ id, role, message, created_at, feedback?: { user_id, is_positive } }>
 * }>
 */
const chats = new Map();
/** messagesIndex: Map<message_id, { chat_uuid, ...message }> */
const messagesIndex = new Map();

// markdown demo
function makeMarkdownReply(userText, modelName) {
  const safe = String(userText ?? "").trim();

  return [
    `# Ответ от ${modelName || "mock-model"}`,
    ``,
    `**Вы написали:** \`${safe || "(пусто)"}\``,
    ``,
    `## Демонстрация Markdown`,
    `- **Жирный** и *курсив*`,
    `- Inline code: \`const x = 42\``,
    `- Ссылка: [OpenAI](https://openai.com)`,
    ``,
    `### Код-блок`,
    "```bash",
    "ls -la",
    'echo "hello from mock server"',
    "```",
    ``,
    `### Шаги`,
    `1. Открой Dev Modal (⚙️)`,
    `2. Проверь: API Base = http://localhost:${PORT}`,
    `3. Проверь: WS URL = ws://localhost:${PORT}${WS_PATH}`,
    `4. Отправь сообщение`,
    ``,
    `> Это цитата. Ниже — небольшая подсказка.`,
    ``,
    `Если хочешь проверить списки:`,
    `- item A`,
    `- item B`,
    ``,
    `---`,
    `**Timestamp:** ${new Date().toLocaleString()}`,
  ].join("\n");
}

// =====================
// EXPRESS APP (REST)
// =====================
const app = express();
app.use(express.json());
app.use(cookieParser());

// Логи запросов (очень помогает ловить 404)
app.use((req, res, next) => {
  console.log(`[REST] ${req.method} ${req.url}`);
  next();
});

app.use(
  cors({
    origin(origin, cb) {
      cb(null, isAllowedOrigin(origin));
    },
    credentials: true,
  })
);

// чтобы preflight не падал
app.options("*", cors());

// Health
app.get("/health", (req, res) => {
  res.json({ ok: true, time: nowISO() });
});

// POST /chats  (как у тебя createChatOnly)
app.post("/chats", (req, res) => {
  const { chat_uuid, user_id, model_name, model_version, title } = req.body || {};
  if (!chat_uuid || user_id == null) {
    return res.status(400).json({ message: "chat_uuid and user_id are required" });
  }

  const exists = chats.has(chat_uuid);
  const created_at = exists ? chats.get(chat_uuid).created_at : nowISO();

  const chat = {
    chat_uuid: String(chat_uuid),
    user_id: Number(user_id),
    title: String(title || "New chat"),
    model_name: String(model_name || "mock-model"),
    model_version: String(model_version || "v1"),
    created_at,
    updated_at: nowISO(),
    messages: exists ? (chats.get(chat_uuid).messages || []) : [],
  };

  chats.set(chat_uuid, chat);

  return res.status(exists ? 200 : 201).json({
    chat_uuid: chat.chat_uuid,
    created_at: chat.created_at,
    updated_at: chat.updated_at,
  });
});

// GET /chats?user_id=...
app.get("/chats", (req, res) => {
  const user_id = req.query.user_id;
  if (user_id == null) return res.status(400).json({ message: "user_id is required" });

  const u = Number(user_id);
  const items = [...chats.values()]
    .filter((c) => c.user_id === u)
    .sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)))
    .map((c) => ({
      uuid: c.chat_uuid,
      title: c.title,
      created_at: c.created_at,
      updated_at: c.updated_at,
      model_name: c.model_name,
      model_version: c.model_version,
    }));

  res.json({ items });
});

// GET /chats/{chat_uuid}/messages?user_id=...
// В МОКЕ НЕ ДЕЛАЕМ 403 по user_id (чтобы не мешало тестам)
app.get("/chats/:chat_uuid/messages", (req, res) => {
  const { chat_uuid } = req.params;

  const chat = chats.get(chat_uuid);
  if (!chat) return res.status(404).json({ message: "chat not found" });

  const items = (chat.messages || []).map((m) => ({
    id: m.id,
    role: m.role, // "user" | "bot"
    message: m.message,
    created_at: m.created_at,
    feedback: m.feedback || null,
  }));

  res.json({ items });
});

// POST /messages/{bot_uuid}/feedback
app.post("/messages/:bot_uuid/feedback", (req, res) => {
  const { bot_uuid } = req.params;
  const { user_id, is_positive } = req.body || {};

  if (user_id == null) return res.status(400).json({ message: "user_id is required" });

  const msg = messagesIndex.get(bot_uuid);
  if (!msg) return res.status(404).json({ message: "bot message not found" });

  msg.feedback = { user_id: Number(user_id), is_positive: !!is_positive };

  // обновим внутри чата
  const chat = chats.get(msg.chat_uuid);
  if (chat) {
    chat.messages = (chat.messages || []).map((m) => (m.id === bot_uuid ? { ...m, feedback: msg.feedback } : m));
    chat.updated_at = nowISO();
    chats.set(chat.chat_uuid, chat);
  }

  return res.json({ ok: true, bot_uuid, feedback: msg.feedback });
});

// понятный 404 (чтобы ты видел, что именно не найдено)
app.use((req, res) => {
  res.status(404).json({
    message: "Not Found",
    method: req.method,
    path: req.originalUrl,
    hint: "Проверь API Base в UI: должен быть http://localhost:52052 (без /ws, без /api)",
  });
});

// =====================
// HTTP SERVER + WS
// =====================
const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: WS_PATH });

wss.on("connection", (ws) => {
  console.log("[WS] client connected");

  ws.send(JSON.stringify({ type: "hello", created_at: nowISO(), message: "mock ws connected" }));

  // ping, клиент ответит pong (у тебя это есть)
  const pingTimer = setInterval(() => {
    try {
      ws.send(JSON.stringify({ type: "ping" }));
    } catch {}
  }, 25000);

  ws.on("close", (e) => {
    clearInterval(pingTimer);
    console.log("[WS] client closed");
  });

  ws.on("message", async (buf) => {
    let payload;
    try {
      payload = JSON.parse(String(buf));
    } catch {
      ws.send(JSON.stringify({ type: "error", message: "invalid json" }));
      return;
    }

    // обработаем pong от клиента
    if (payload?.type === "pong") return;

    const chat_uuid = payload?.chat_uuid;
    const user_message_uuid = payload?.uuid; // у тебя именно uuid
    const model_name = payload?.model_name || "mock-model";
    const message = payload?.message ?? "";

    if (!chat_uuid || !user_message_uuid) {
      ws.send(JSON.stringify({ type: "error", message: "chat_uuid and uuid are required" }));
      return;
    }

    const chat = chats.get(chat_uuid);
    if (!chat) {
      // В твоём фронте чат создаётся REST-ом ДО WS.
      // Поэтому если сюда попали без чата — лучше вернуть ошибку, чтобы это было видно.
      ws.send(
        JSON.stringify({
          type: "error",
          message: `chat not found: ${chat_uuid}. Сначала сделай POST /chats`,
        })
      );
      return;
    }

    // сохраняем user message
    const userMsg = {
      id: user_message_uuid,
      role: "user",
      message: String(message),
      created_at: nowISO(),
      feedback: null,
    };
    chat.messages.push(userMsg);
    messagesIndex.set(userMsg.id, { chat_uuid, ...userMsg });

    // задержка генерации
    const delay = 350 + Math.floor(Math.random() * 700);
    await new Promise((r) => setTimeout(r, delay));

    // bot message
    const bot_message_uuid = uuid();
    const response = makeMarkdownReply(String(message), String(model_name));
    const created_at = nowISO();

    const botMsg = {
      id: bot_message_uuid,
      role: "bot",
      message: response,
      created_at,
      feedback: null,
    };
    chat.messages.push(botMsg);
    chat.updated_at = nowISO();

    messagesIndex.set(botMsg.id, { chat_uuid, ...botMsg });
    chats.set(chat_uuid, chat);

    // формат под твой парсер (WSBotMessage)
    ws.send(
      JSON.stringify({
        type: "bot_message",
        chat_uuid,
        user_message_uuid,
        bot_message_uuid,
        response,
        created_at,
      })
    );
  });
});

server.listen(PORT, () => {
  console.log(`Mock REST+WS server running on http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`WS path: ws://localhost:${PORT}${WS_PATH}`);
});
 