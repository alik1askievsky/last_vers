// src/pages/ChatBot.jsx
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { logout as apiLogout } from "../services/auth";
import { getAccessToken } from "../services/api";

// Анимированный логотип-пингвин
const PenguinAI = ({ className = "" }) => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 100 100"
    fill="none"
    className={`flex-shrink-0 drop-shadow-2xl ${className}`}
  >
    <circle cx="50" cy="50" r="50" fill="url(#sphereGradient)">
      <animate attributeName="r" values="50;48;50;52;50" dur="4s" repeatCount="indefinite" />
    </circle>
    <g transform="rotate(0 50 50)">
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="url(#ringGradient)"
        strokeWidth="2"
        strokeDasharray="4 4"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="8s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
    <ellipse cx="50" cy="62" rx="24" ry="18" fill="#2D3748" stroke="#4A5568" strokeWidth="2" />
    <ellipse cx="50" cy="56" rx="20" ry="14" fill="white" />
    <circle cx="50" cy="35" r="16" fill="#2D3748" stroke="#4A5568" strokeWidth="2" />
    <circle cx="50" cy="35" r="13" fill="white" />
    <path d="M32 50 Q50 68 68 50 L68 72 Q50 78 32 72 Z" fill="url(#bellyGradient)" />
    <g className="animate-pulse">
      <circle cx="43" cy="33" r="3.5" fill="#1A202C">
        <animate attributeName="r" values="3.5;4;3.5" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="57" cy="33" r="3.5" fill="#1A202C">
        <animate attributeName="r" values="3.5;4;3.5" dur="2s" repeatCount="indefinite" begin="0.5s" />
      </circle>
      <circle cx="44" cy="32" r="1.2" fill="white" />
      <circle cx="58" cy="32" r="1.2" fill="white" />
    </g>
    <path d="M45 40L55 40L50 45Z" fill="url(#beakGradient)" filter="url(#beakGlow)" />
    <ellipse cx="40" cy="72" rx="4" ry="2.5" fill="url(#feetGradient)" />
    <ellipse cx="60" cy="72" rx="4" ry="2.5" fill="url(#feetGradient)" />
    <g stroke="url(#neuralGradient)" strokeWidth="2.5" fill="none" opacity="0.9">
      <path d="M40 25C35 18 40 14 45 17" strokeLinecap="round">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="stroke-width" values="2.5;3.5;2.5" dur="1.8s" repeatCount="indefinite" />
      </path>
      <path d="M50 22C50 17 55 17 55 22" strokeLinecap="round">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite" begin="0.2s" />
        <animate attributeName="stroke-width" values="2.5;3.5;2.5" dur="1.8s" repeatCount="indefinite" begin="0.2s" />
      </path>
      <path d="M60 25C65 18 60 14 55 17" strokeLinecap="round">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite" begin="0.4s" />
        <animate attributeName="stroke-width" values="2.5;3.5;2.5" dur="1.8s" repeatCount="indefinite" begin="0.4s" />
      </path>
    </g>
    <rect x="38" y="52" width="24" height="8" rx="3" fill="#1A202C" opacity="0.95" />
    <g className="animate-pulse">
      <circle cx="42" cy="56" r="2" fill="#48BB78">
        <animate attributeName="fill" values="#48BB78;#68D391;#48BB78" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="56" r="2" fill="#ED8936">
        <animate attributeName="fill" values="#ED8936;#F6AD55;#ED8936" dur="1.2s" repeatCount="indefinite" begin="0.4s" />
      </circle>
      <circle cx="58" cy="56" r="2" fill="#4299E1">
        <animate attributeName="fill" values="#4299E1;#63B3ED;#4299E1" dur="1.2s" repeatCount="indefinite" begin="0.8s" />
      </circle>
    </g>
    <rect x="62" y="55" width="1" height="3" fill="#FFFFFF">
      <animate attributeName="opacity" values="1;0;1" dur="0.8s" repeatCount="indefinite" />
    </rect>

    {/* Важно: Math.random() в рендере может "дрожать" при обновлениях, но оставляю как у тебя */}
    <g>
      {[...Array(8)].map((_, i) => (
        <circle
          key={i}
          cx={50 + Math.cos(i * 0.785) * 35}
          cy={50 + Math.sin(i * 0.785) * 35}
          r={1 + Math.random() * 1.5}
          fill="url(#particleGradient)"
          opacity="0.8"
        >
          <animate
            attributeName="r"
            values={`${1 + Math.random() * 1.5};${2 + Math.random() * 2};${1 + Math.random() * 1.5}`}
            dur={`${2 + Math.random() * 2}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.4;0.9;0.4"
            dur={`${3 + Math.random() * 2}s`}
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 50 50`}
            to={`360 50 50`}
            dur={`${12 + Math.random() * 8}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </g>

    <g stroke="url(#waveGradient)" strokeWidth="2" fill="none" opacity="0.7">
      <circle cx="50" cy="50" r="40" strokeDasharray="5 5">
        <animate attributeName="r" values="40;43;40" dur="3s" repeatCount="indefinite" />
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to={`360 50 50`}
          dur="10s"
          repeatCount="indefinite"
        />
      </circle>
    </g>

    <defs>
      <radialGradient id="sphereGradient" cx="30%" cy="30%">
        <stop offset="0%" stopColor="#4C51BF" />
        <stop offset="50%" stopColor="#434190" />
        <stop offset="100%" stopColor="#322659" />
      </radialGradient>
      <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4299E1" />
        <stop offset="50%" stopColor="#9F7AEA" />
        <stop offset="100%" stopColor="#4299E1" />
      </linearGradient>
      <linearGradient id="bellyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F7FAFC" />
      </linearGradient>
      <linearGradient id="beakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ED8936" />
        <stop offset="100%" stopColor="#DD6B20" />
      </linearGradient>
      <linearGradient id="feetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ED8936" />
        <stop offset="50%" stopColor="#E53E3E" />
        <stop offset="100%" stopColor="#ED8936" />
      </linearGradient>
      <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4299E1" />
        <stop offset="50%" stopColor="#9F7AEA" />
        <stop offset="100%" stopColor="#4299E1" />
      </linearGradient>
      <linearGradient id="particleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4299E1" />
        <stop offset="100%" stopColor="#9F7AEA" />
      </linearGradient>
      <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4299E1" />
        <stop offset="50%" stopColor="#9F7AEA" />
        <stop offset="100%" stopColor="#4299E1" />
      </linearGradient>
      <filter id="beakGlow">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
        <feColorMatrix
          in="blur"
          type="matrix"
          values="1 0 0 0 0  0 0.5 0 0 0  0 0 0 0 0  0 0 0 1 0"
          result="glow"
        />
        <feComposite in="SourceGraphic" in2="glow" operator="over" />
      </filter>
    </defs>
  </svg>
);

// ---- utils (uuid / urls / markdown) ----
function uuidv4() {
  try {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  } catch {}
  // fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function trimTrailingSlashes(s) {
  return String(s || "").trim().replace(/\/+$/, "");
}

function normalizeWsUrl(u) {
  let x = String(u || "").trim().replace(/\s+/g, "");
  if (!x) return "";
  if (!x.startsWith("ws://") && !x.startsWith("wss://")) x = "ws://" + x;
  return x;
}

function deriveWsFromHttp(httpBase, wsPath = "/ws") {
  const base = trimTrailingSlashes(httpBase);
  if (!base) return "";
  const wsBase = base.replace(/^https?:\/\//i, (m) => (m.toLowerCase() === "https://" ? "wss://" : "ws://"));
  return normalizeWsUrl(wsBase + wsPath);
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Мини-рендер markdown -> HTML (без сторонних библиотек).
 * Поддержка: ```code```, `inline`, **bold**, *italic*, заголовки, списки, ссылки, переносы строк.
 */
function mdToHtml(md) {
  const src = String(md ?? "");
  if (!src) return "";

  // 1) fenced code blocks -> placeholders
  const codeBlocks = [];
  let tmp = src.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push({ lang: lang || "", code: code || "" });
    return `@@CODEBLOCK_${idx}@@`;
  });

  // escape everything (we'll inject safe html ourselves)
  tmp = escapeHtml(tmp);

  // 2) inline code
  tmp = tmp.replace(/`([^`]+)`/g, (_, c) => {
    return `<code class="px-1 py-0.5 rounded bg-slate-100 border border-slate-200 text-[0.85em]">${c}</code>`;
  });

  // 3) links [text](url)
  tmp = tmp.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, text, url) => {
    const t = text;
    const u = escapeHtml(url);
    return `<a class="text-blue-600 underline hover:text-blue-700" href="${u}" target="_blank" rel="noreferrer">${t}</a>`;
  });

  // 4) headings
  tmp = tmp
    .replace(/^###\s+(.+)$/gm, `<h3 class="text-base font-semibold mt-3 mb-2">$1</h3>`)
    .replace(/^##\s+(.+)$/gm, `<h2 class="text-lg font-semibold mt-3 mb-2">$1</h2>`)
    .replace(/^#\s+(.+)$/gm, `<h1 class="text-xl font-bold mt-3 mb-2">$1</h1>`);

  // 5) bold / italic
  tmp = tmp.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  tmp = tmp.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, "$1<em>$2</em>");

  // 6) lists + paragraphs (line-based)
  const lines = tmp.split("\n");
  let out = "";
  let inUL = false;
  let inOL = false;

  const closeLists = () => {
    if (inUL) out += `</ul>`;
    if (inOL) out += `</ol>`;
    inUL = false;
    inOL = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // restore codeblock placeholder later; treat as its own "paragraph"
    if (/^@@CODEBLOCK_\d+@@$/.test(line.trim())) {
      closeLists();
      out += `<div class="my-3">${line.trim()}</div>`;
      continue;
    }

    const ulMatch = line.match(/^\s*[-*]\s+(.+)$/);
    const olMatch = line.match(/^\s*(\d+)\.\s+(.+)$/);

    if (ulMatch) {
      if (inOL) {
        out += `</ol>`;
        inOL = false;
      }
      if (!inUL) {
        out += `<ul class="list-disc pl-5 my-2 space-y-1">`;
        inUL = true;
      }
      out += `<li>${ulMatch[1]}</li>`;
      continue;
    }

    if (olMatch) {
      if (inUL) {
        out += `</ul>`;
        inUL = false;
      }
      if (!inOL) {
        out += `<ol class="list-decimal pl-5 my-2 space-y-1">`;
        inOL = true;
      }
      out += `<li>${olMatch[2]}</li>`;
      continue;
    }

    // empty line -> close lists and add spacing
    if (!line.trim()) {
      closeLists();
      out += `<div class="h-2"></div>`;
      continue;
    }

    // normal text line -> paragraph-ish with <br/>
    closeLists();
    out += `<div class="leading-relaxed">${line}</div>`;
  }
  closeLists();

  // 7) inject code blocks
  out = out.replace(/@@CODEBLOCK_(\d+)@@/g, (_, n) => {
    const idx = Number(n);
    const blk = codeBlocks[idx];
    if (!blk) return "";
    const code = escapeHtml(blk.code);
    const lang = escapeHtml(blk.lang);
    const label = lang ? `<div class="text-[11px] text-slate-300 mb-2">${lang}</div>` : "";
    return `
      <pre class="bg-slate-950 text-slate-100 rounded-xl p-4 overflow-x-auto border border-slate-800">
        ${label}
        <code class="text-xs whitespace-pre">${code}</code>
      </pre>
    `;
  });

  return out;
}

// --- backend model names (как у бэкендера в тестовом html) ---
const MODEL_LABELS = ["Qwen-2.5-1.5B-Instruct", "Llama-3-8B-Instruct"];
const MODEL_TO_BACKEND = {
  "Qwen-2.5-1.5B-Instruct": "qwen2-5_instruct",
  "Llama-3-8B-Instruct": "llama3-8b_instruct",
};

function titleFromPrompt(s) {
  s = String(s ?? "").trim();
  if (!s) return "New chat";
  let cut = s.length;
  for (const sep of [".", "!", "?", "\n"]) {
    const i = s.indexOf(sep);
    if (i >= 0 && i < cut) cut = i;
  }
  let t = s.slice(0, cut).trim();
  if (!t) t = s.trim();
  if (t.length > 80) t = t.slice(0, 80);
  return t || "New chat";
}

const ChatBot = () => {
  const navigate = useNavigate();

  // ---------- STATE
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // WS
  const wsRef = useRef(null);
  const wsConnectingRef = useRef(false);

  // лог
  const [logText, setLogText] = useState(() => localStorage.getItem("tuxbot-dev-log") || "Готово.\n");
  const addLog = useCallback((line) => {
    const ts = new Date().toLocaleTimeString();
    setLogText((prev) => {
      const next = `${prev.replace(/\s*$/, "")}\n[${ts}] ${line}\n`;
      localStorage.setItem("tuxbot-dev-log", next.slice(-50_000)); // ограничим размер
      return next;
    });
  }, []);

  const [wsStatus, setWsStatus] = useState({ ok: false, text: "WS не подключён" });

  const initializeState = () => {
    const savedChats = localStorage.getItem("tuxbot-chats");
    const savedCurrentChat = localStorage.getItem("tuxbot-current-chat");

    return {
      chats: savedChats ? JSON.parse(savedChats) : [],
      currentChatId: savedCurrentChat ? JSON.parse(savedCurrentChat) : null,
    };
  };

  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState(initializeState().chats);
  const [currentChatId, setCurrentChatId] = useState(initializeState().currentChatId);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // настройки API/WS (как у бэкендера)
  const defaultHttpBase =
    trimTrailingSlashes(import.meta.env.VITE_CHAT_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:52052");
  const [apiBaseHttp, setApiBaseHttp] = useState(() => trimTrailingSlashes(localStorage.getItem("tuxbot-api-base") || defaultHttpBase));
  const [wsUrl, setWsUrl] = useState(() => {
    const saved = localStorage.getItem("tuxbot-ws-url");
    return normalizeWsUrl(saved || deriveWsFromHttp(defaultHttpBase, "/ws"));
  });
  const [userId, setUserId] = useState(() => {
    const v = localStorage.getItem("tuxbot-user-id");
    return v != null ? v : "123";
  });
  const [modelVersion, setModelVersion] = useState(() => localStorage.getItem("tuxbot-model-version") || "v1");
  const [showDev, setShowDev] = useState(false);

  // ✅ Модель выбирается ДО создания чата
  const [draftModel, setDraftModel] = useState("Qwen-2.5-1.5B-Instruct");

  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const models = MODEL_LABELS;

  // текущий чат + “зафиксированная” модель этого чата
  const currentChat = useMemo(() => (currentChatId ? chats.find((c) => c.id === currentChatId) : null), [currentChatId, chats]);
  const lockedModelLabel = currentChat?.model_label ?? draftModel;
  const lockedModelName = currentChat?.model_name ?? (MODEL_TO_BACKEND[lockedModelLabel] || lockedModelLabel);
  const lockedModelVersion = currentChat?.model_version ?? modelVersion;

  // persist settings
  useEffect(() => {
    localStorage.setItem("tuxbot-api-base", trimTrailingSlashes(apiBaseHttp));
  }, [apiBaseHttp]);
  useEffect(() => {
    localStorage.setItem("tuxbot-ws-url", normalizeWsUrl(wsUrl));
  }, [wsUrl]);
  useEffect(() => {
    localStorage.setItem("tuxbot-user-id", String(userId ?? ""));
  }, [userId]);
  useEffect(() => {
    localStorage.setItem("tuxbot-model-version", String(modelVersion ?? ""));
  }, [modelVersion]);

  // ---------- PERSISTENCE (чаты локально)
  useEffect(() => {
    localStorage.setItem("tuxbot-chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem("tuxbot-current-chat", JSON.stringify(currentChatId));
  }, [currentChatId]);

  // ---------- LOAD MESSAGES ON CHAT SWITCH
  useEffect(() => {
    if (currentChatId) {
      const chat = chats.find((c) => c.id === currentChatId);
      setMessages(chat?.messages || []);
    } else {
      setMessages([]);
    }
  }, [currentChatId, chats]);

  // ---------- TEXTAREA AUTO HEIGHT
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue, adjustTextareaHeight]);

  // ---------- SCROLL TO BOTTOM
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ---------- HELPERS
  const updateChatById = useCallback((chatId, updater) => {
    setChats((prev) => prev.map((c) => (c.id === chatId ? updater(c) : c)));
  }, []);

  const updateCurrentChatMessages = useCallback(
    (newMessages) => {
      if (!currentChatId) return;
      updateChatById(currentChatId, (chat) => ({
        ...chat,
        messages: newMessages,
        lastUpdated: new Date().toISOString(),
      }));
    },
    [currentChatId, updateChatById]
  );

  const restFetch = useCallback(
    async (path, { method = "GET", body } = {}) => {
      const base = trimTrailingSlashes(apiBaseHttp);
      const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

      const headers = { Accept: "application/json" };
      let bodyToSend = undefined;

      if (body !== undefined) {
        headers["Content-Type"] = "application/json";
        bodyToSend = JSON.stringify(body);
      }

      // если access_token есть (у тебя он в памяти) — добавим в заголовок, как в проекте
      const token = getAccessToken?.() || null;
      if (token) headers["access_token"] = token;

      addLog(`${method} ${url}`);
      if (body !== undefined) addLog(`body: ${JSON.stringify(body)}`);

      const r = await fetch(url, {
        method,
        headers,
        body: bodyToSend,
        credentials: "include",
      });

      const txt = await r.text().catch(() => "");
      addLog(`REST status: ${r.status}`);
      addLog(`REST resp: ${txt || "(empty)"}`);

      let data = null;
      try {
        data = txt ? JSON.parse(txt) : null;
      } catch {
        data = txt;
      }

      if (!r.ok) {
        const err = new Error((data && data.message) || `HTTP ${r.status}`);
        err.status = r.status;
        err.data = data;
        throw err;
      }

      return data;
    },
    [apiBaseHttp, addLog]
  );

  const createChatOnly = useCallback(
    async ({ chat_uuid, title, model_name, model_version }) => {
      const body = {
        chat_uuid,
        user_id: Number(userId),
        model_name,
        model_version,
        title,
      };

      const data = await restFetch("/chats", { method: "POST", body });
      return data?.chat_uuid || chat_uuid;
    },
    [restFetch, userId]
  );

  const listChatsRemote = useCallback(async () => {
    const u = Number(userId);
    return await restFetch(`/chats?user_id=${encodeURIComponent(u)}`, { method: "GET" });
  }, [restFetch, userId]);

  const listMessagesRemote = useCallback(
    async (chat_uuid) => {
      const u = Number(userId);
      return await restFetch(`/chats/${encodeURIComponent(chat_uuid)}/messages?user_id=${encodeURIComponent(u)}`, { method: "GET" });
    },
    [restFetch, userId]
  );

  const sendFeedbackRemote = useCallback(
    async ({ bot_uuid, is_positive }) => {
      const body = {
        user_id: Number(userId),
        is_positive: !!is_positive,
      };
      return await restFetch(`/messages/${encodeURIComponent(bot_uuid)}/feedback`, { method: "POST", body });
    },
    [restFetch, userId]
  );

  const closeWSIfAny = useCallback(() => {
    try {
      const ws = wsRef.current;
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        ws.close(1000, "restart");
      }
    } catch {}
    wsRef.current = null;
    wsConnectingRef.current = false;
    setWsStatus({ ok: false, text: "WS не подключён" });
  }, []);

  const ensureWsConnected = useCallback(async () => {
    const url = normalizeWsUrl(wsUrl) || deriveWsFromHttp(apiBaseHttp, "/ws");
    if (!url) throw new Error("WS URL пустой");

    // already open
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return true;

    if (wsConnectingRef.current) {
      // подождём, пока подключится
      await new Promise((r) => setTimeout(r, 200));
      return !!(wsRef.current && wsRef.current.readyState === WebSocket.OPEN);
    }

    wsConnectingRef.current = true;

    addLog(`WS connect: ${url}`);

    await new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsStatus({ ok: true, text: "WS подключён" });
        addLog("WS connected ✅");
        wsConnectingRef.current = false;
        resolve();
      };

      ws.onerror = (e) => {
        addLog(`WS error: ${e?.message || "unknown"}`);
        wsConnectingRef.current = false;
        setWsStatus({ ok: false, text: "WS ошибка" });
        reject(new Error("WS error"));
      };

      ws.onclose = (e) => {
        setWsStatus({ ok: false, text: `WS closed (code ${e.code})` });
        addLog(`WS closed: code=${e.code} reason=${e.reason || ""}`);
        wsConnectingRef.current = false;
      };

      ws.onmessage = (event) => {
        // 1) raw
        addLog("WS RAW: " + event.data);

        // 2) parse
        let data;
        try {
          data = JSON.parse(event.data);
        } catch (err) {
          addLog("WS JSON.parse ERROR: " + err);
          return;
        }

        // 3) ping/pong
        if (data && data.type === "ping") {
          try {
            ws.send(JSON.stringify({ type: "pong" }));
            addLog("WS ping → pong");
          } catch {}
          return;
        }

        // 4) нормальный ответ (WSBotMessage)
        const chat_uuid = data?.chat_uuid;
        const user_message_uuid = data?.user_message_uuid;
        const bot_message_uuid = data?.bot_message_uuid;
        const response = data?.response ?? "";
        const created_at = data?.created_at ?? null;

        if (!chat_uuid || !user_message_uuid) {
          addLog("WS PARSED: " + JSON.stringify(data));
          return;
        }

        // обновим чат + сообщения (целиковый ответ в response)
        setChats((prev) =>
          prev.map((c) => {
            if (c.id !== chat_uuid) return c;

            const nextMessages = (c.messages || []).map((m) => {
              if (m.id === `pending-${user_message_uuid}`) {
                return {
                  ...m,
                  id: bot_message_uuid || m.id,
                  uuid: bot_message_uuid || m.uuid || null,
                  text: response,
                  created_at: created_at || m.created_at || null,
                  pending: false,
                  timestamp:
                    created_at
                      ? new Date(created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : m.timestamp,
                };
              }
              return m;
            });

            // если placeholder не нашли — просто добавим в конец
            const hasPlaceholder = (c.messages || []).some((m) => m.id === `pending-${user_message_uuid}`);
            const appended = hasPlaceholder
              ? nextMessages
              : [
                  ...(c.messages || []),
                  {
                    id: bot_message_uuid || uuidv4(),
                    uuid: bot_message_uuid || null,
                    role: "assistant",
                    text: response,
                    created_at,
                    pending: false,
                    feedback: null,
                    timestamp:
                      created_at
                        ? new Date(created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  },
                ];

            return {
              ...c,
              messages: appended,
              lastUpdated: new Date().toISOString(),
              last_user_message_uuid: user_message_uuid,
              last_bot_message_uuid: bot_message_uuid || c.last_bot_message_uuid || null,
            };
          })
        );

        // если это текущий чат — синхронизируем messages state тоже
        setMessages((prev) => {
          const idx = prev.findIndex((m) => m.id === `pending-${user_message_uuid}`);
          if (idx < 0) return prev;
          const next = [...prev];
          next[idx] = {
            ...next[idx],
            id: bot_message_uuid || next[idx].id,
            uuid: bot_message_uuid || next[idx].uuid || null,
            text: response,
            created_at: created_at || next[idx].created_at || null,
            pending: false,
            timestamp:
              created_at
                ? new Date(created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                : next[idx].timestamp,
          };
          return next;
        });

        setIsLoading(false);
        addLog("WS PARSED: " + JSON.stringify(data));
      };
    });

    return true;
  }, [wsUrl, apiBaseHttp, addLog]);

  const sendWSMessage = useCallback(
    ({ chat_uuid, user_message_uuid, model_name, message }) => {
      const ws = wsRef.current;
      if (!ws || ws.readyState !== WebSocket.OPEN) throw new Error("WS не подключён");

      const payload = {
        chat_uuid,
        uuid: user_message_uuid, // как у бэкендера
        model_name,
        message,
      };

      ws.send(JSON.stringify(payload));
      addLog("WS sent: " + JSON.stringify(payload));
    },
    [addLog]
  );

  // закрывать ws при уходе со страницы
  useEffect(() => {
    return () => closeWSIfAny();
  }, [closeWSIfAny]);

  // ---------- ACTIONS
  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    setInputValue("");

    const user_message_uuid = uuidv4();
    const nowTs = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMessage = {
      id: user_message_uuid,
      uuid: user_message_uuid,
      role: "user",
      text,
      timestamp: nowTs,
      feedback: null,
    };

    const placeholderBot = {
      id: `pending-${user_message_uuid}`,
      uuid: null,
      role: "assistant",
      text: "Генерирую ответ…",
      timestamp: nowTs,
      pending: true,
      feedback: null,
    };

    let chat_uuid = currentChatId;

    // если чата нет — создаём чат (REST /chats), как у бэкендера
    if (!chat_uuid) {
      const new_chat_uuid = uuidv4();
      const title = titleFromPrompt(text);

      const model_label = draftModel;
      const model_name = MODEL_TO_BACKEND[model_label] || model_label;
      const model_version = modelVersion;

      // добавим локально сразу, чтобы UI не тормозил
      const newChat = {
        id: new_chat_uuid,
        title: title,
        date: new Date().toLocaleDateString(),
        messages: [userMessage, placeholderBot],
        lastUpdated: new Date().toISOString(),
        model_label,
        model_name,
        model_version,
        last_user_message_uuid: user_message_uuid,
        last_bot_message_uuid: null,
      };

      setChats((prev) => [newChat, ...prev]);
      setCurrentChatId(new_chat_uuid);
      setMessages([userMessage, placeholderBot]);
      chat_uuid = new_chat_uuid;

      try {
        const created = await createChatOnly({
          chat_uuid: new_chat_uuid,
          title,
          model_name,
          model_version,
        });

        // если сервер вдруг вернул другой chat_uuid — обновим (на практике обычно одинаковый)
        if (created && created !== new_chat_uuid) {
          const oldId = new_chat_uuid;
          const newId = created;

          setChats((prev) => prev.map((c) => (c.id === oldId ? { ...c, id: newId } : c)));
          setCurrentChatId(newId);
          chat_uuid = newId;

          addLog(`chat_uuid updated: ${oldId} -> ${newId}`);
        }
      } catch (e) {
        setIsLoading(false);
        // заменим placeholder на ошибку
        setMessages((prev) =>
          prev.map((m) =>
            m.id === `pending-${user_message_uuid}` ? { ...m, text: `Ошибка создания чата: ${e?.message || e}`, pending: false } : m
          )
        );
        updateChatById(chat_uuid, (c) => ({
          ...c,
          messages: (c.messages || []).map((m) =>
            m.id === `pending-${user_message_uuid}` ? { ...m, text: `Ошибка создания чата: ${e?.message || e}`, pending: false } : m
          ),
        }));
        return;
      }
    } else {
      // чат уже есть — добавим сообщения в него
      const newMsgs = [...messages, userMessage, placeholderBot];
      setMessages(newMsgs);
      updateCurrentChatMessages(newMsgs);
      updateChatById(chat_uuid, (c) => ({
        ...c,
        last_user_message_uuid: user_message_uuid,
      }));
    }

    setIsLoading(true);

    try {
      await ensureWsConnected();
      // отправляем WS сообщение (как у бэкендера)
      sendWSMessage({
        chat_uuid,
        user_message_uuid,
        model_name: lockedModelName, // важно: backend model_name
        message: text,
      });
    } catch (e) {
      setIsLoading(false);
      const msg = `Ошибка WS: ${e?.message || e}`;

      setMessages((prev) => prev.map((m) => (m.id === `pending-${user_message_uuid}` ? { ...m, text: msg, pending: false } : m)));
      updateChatById(chat_uuid, (c) => ({
        ...c,
        messages: (c.messages || []).map((m) => (m.id === `pending-${user_message_uuid}` ? { ...m, text: msg, pending: false } : m)),
      }));
    }
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setInputValue("");
  };

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);
  };

  const requestDeleteChat = (chatId, e) => {
    e?.stopPropagation?.();
    setShowDeleteConfirm(chatId);
  };

  const handleConfirmDelete = () => {
    setChats((prev) => prev.filter((c) => c.id !== showDeleteConfirm));
    if (currentChatId === showDeleteConfirm) {
      setCurrentChatId(null);
      setMessages([]);
    }
    setShowDeleteConfirm(null);
  };

  const handleCancelDelete = () => setShowDeleteConfirm(null);

  const handleLogout = () => setShowLogoutConfirm(true);

  const handleConfirmLogout = async () => {
    try {
      await apiLogout();
    } finally {
      closeWSIfAny();
      localStorage.removeItem("tuxbot-chats");
      localStorage.removeItem("tuxbot-current-chat");
      navigate("/", { replace: true });
    }
  };
  const handleCancelLogout = () => setShowLogoutConfirm(false);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && inputValue.trim() && !isLoading) {
      e.preventDefault();
      handleSend();
    }
  };

  // лайк/дизлайк -> POST /messages/{bot_uuid}/feedback (как у бэкендера)
  const handleFeedback = async (messageId, feedbackType) => {
    const updated = messages.map((m) => (m.id === messageId ? { ...m, feedback: feedbackType } : m));
    setMessages(updated);
    if (currentChatId) {
      updateCurrentChatMessages(updated);
    }

    // отправим на бэк, если есть bot uuid
    const target = messages.find((m) => m.id === messageId);
    const bot_uuid = target?.uuid || target?.id;

    if (!bot_uuid) {
      addLog("feedback: bot uuid missing");
      return;
    }

    try {
      await sendFeedbackRemote({ bot_uuid, is_positive: feedbackType === "like" });
      addLog(`feedback sent: bot_uuid=${bot_uuid} is_positive=${feedbackType === "like"}`);
    } catch (e) {
      addLog(`feedback ERROR: ${e?.message || e}`);
    }
  };

  // helpers (dev): GET /chats, GET /messages for current
  const devGetChats = async () => {
    try {
      const data = await listChatsRemote();
      addLog("GET /chats PARSED: " + JSON.stringify(data));
    } catch (e) {
      addLog("GET /chats ERROR: " + (e?.message || e));
    }
  };

  const devGetMessages = async () => {
    if (!currentChatId) {
      addLog("GET /messages: currentChatId пустой");
      return;
    }
    try {
      const data = await listMessagesRemote(currentChatId);
      addLog("GET /messages PARSED: " + JSON.stringify(data));

      // если сервер вернул items — можно быстро “синкнуть” в локальный чат
      const items = data?.items;
      if (Array.isArray(items)) {
        const mapped = items.map((it) => {
          const roleRaw = String(it?.role || "").toLowerCase();
          const role = roleRaw === "bot" || roleRaw === "assistant" ? "assistant" : "user";
          const text = it?.message ?? it?.text ?? it?.content ?? it?.response ?? "";
          const id = it?.id ?? it?.uuid ?? uuidv4();
          const created_at = it?.created_at ?? null;
          const timestamp = created_at
            ? new Date(created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          return {
            id,
            uuid: id,
            role,
            text: String(text),
            created_at,
            timestamp,
            feedback: null,
            pending: false,
          };
        });

        setMessages(mapped);
        updateChatById(currentChatId, (c) => ({
          ...c,
          messages: mapped,
          lastUpdated: new Date().toISOString(),
          last_bot_message_uuid: [...mapped].reverse().find((m) => m.role === "assistant")?.uuid || c.last_bot_message_uuid || null,
        }));
        addLog("messages synced into local state ✅");
      }
    } catch (e) {
      addLog("GET /messages ERROR: " + (e?.message || e));
    }
  };

  const clearLog = () => {
    setLogText("Готово.\n");
    localStorage.setItem("tuxbot-dev-log", "Готово.\n");
  };

  // ---------- RENDER
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex">
      {/* ЛЕВАЯ ПАНЕЛЬ */}
      <div className="w-80 bg-white/95 backdrop-blur-sm border-r border-slate-200/80 flex flex-col shadow-xl">
        {/* Новый чат */}
        <div className="p-6 border-b border-slate-200/60">
          <button
            onClick={handleNewChat}
            className="w-full p-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center group"
          >
            <span className="mr-3 group-hover:scale-110 transition-transform">+</span>
            <span>Новый чат</span>
          </button>

          {/* WS статус + настройки */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className={`inline-block w-2 h-2 rounded-full ${wsStatus.ok ? "bg-emerald-500" : "bg-slate-400"}`} />
              <span className="truncate max-w-[190px]" title={wsStatus.text}>
                {wsStatus.text}
              </span>
            </div>
            <button
              onClick={() => setShowDev(true)}
              className="text-xs px-3 py-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
              title="Настройки API/WS и лог"
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* Список чатов */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {chats.length === 0 ? (
              <div className="text-center text-slate-500 py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium">Нет сохраненных чатов</p>
                <p className="text-xs mt-2 text-slate-400">Начните новый диалог с TuxBot</p>
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-300 group border-2 ${
                    currentChatId === chat.id
                      ? "bg-blue-50/80 border-blue-200 shadow-md backdrop-blur-sm"
                      : "bg-white/60 border-transparent hover:bg-white/80 hover:border-slate-200/60 backdrop-blur-sm"
                  }`}
                  onClick={() => handleSelectChat(chat.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 truncate mb-2">{chat.title}</div>
                      <div className="text-xs text-slate-500 flex justify-between items-center">
                        <span>{chat.date}</span>
                        <span className="bg-slate-100 px-2 py-1 rounded-full text-slate-600">{chat.messages?.length || 0} сообщ.</span>
                      </div>
                    </div>

                    {/* Удаление чата */}
                    <button
                      onClick={(e) => requestDeleteChat(chat.id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 ml-3 text-red-500 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-xl"
                      title="Удалить чат"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* 🔒 отображаем модель */}
                  {(chat.model_label || chat.model_name) && (
                    <div className="mt-2 text-[11px] text-slate-500">
                      Модель: <span className="font-medium text-slate-700">{chat.model_label || chat.model_name}</span>
                    </div>
                  )}

                  {/* chat_uuid (для удобства) */}
                  <div className="mt-1 text-[10px] text-slate-400 truncate">
                    chat_uuid: <span className="font-mono">{chat.id}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Выход */}
        <div className="p-6 border-t border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <button
            onClick={handleLogout}
            className="w-full p-4 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center group"
          >
            <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Выйти из аккаунта
          </button>
        </div>
      </div>

      {/* ПРАВАЯ ЧАСТЬ */}
      <div className="flex-1 flex flex-col">
        {/* Заголовок для существующего чата: модель read-only */}
        {currentChatId && (
          <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 px-8 py-6 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                  <PenguinAI className="w-full h-full" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">TuxBot AI Assistant</h1>
                  <p className="text-sm text-slate-600">REST: создаём чат • WS: получаем целиковый markdown-ответ</p>
                </div>
              </div>

              {/* 🔒 зафиксированная модель + кнопка dev */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-xs text-slate-500">Model</div>
                  <div className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm border border-slate-200">{lockedModelLabel}</div>
                  <div className="mt-1 text-[10px] text-slate-400">
                    backend: <span className="font-mono">{lockedModelName}</span> • {lockedModelVersion}
                  </div>
                </div>
                <button
                  onClick={() => setShowDev(true)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                  title="Настройки API/WS и лог"
                >
                  ⚙️
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Область контента */}
        {!currentChatId ? (
          // Экран нового чата
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-white/50 to-blue-50/20">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-xl overflow-hidden mb-6">
              <PenguinAI className="w-full h-full" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">TuxBot AI Assistant</h2>
            <p className="text-slate-600 mb-6">Чем сегодня я могу Вам помочь?</p>

            {/* ✅ Выбор модели ДО создания чата */}
            <div className="w-full max-w-3xl mb-4 flex items-center justify-end gap-3">
              <span className="text-sm text-slate-600 font-medium">Модель:</span>
              <select
                value={draftModel}
                onChange={(e) => setDraftModel(e.target.value)}
                className="border border-slate-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 shadow-sm hover:border-slate-400 transition-colors"
              >
                {models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Поле ввода */}
            <div className="w-full max-w-3xl bg-white/90 border border-slate-200 rounded-2xl p-4 shadow-lg">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder='Опишите задачу, например: «Как посмотреть размер файлов в текущей директории?»'
                className="w-full resize-none outline-none bg-transparent text-slate-800 placeholder-slate-400"
                rows={1}
              />
              {inputValue.trim() && (
                <div className="mt-4 flex justify-end">
                  <button onClick={handleSend} disabled={isLoading} className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
                    Отправить
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Диалог
          <>
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-white/50 to-blue-50/20">
              {messages.length === 0 ? (
                <div className="text-center text-slate-500 py-20">
                  <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-3xl flex items-center justify-center shadow-inner">
                    <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-slate-700">Этот чат пуст — напишите свой первый вопрос.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    onMouseEnter={() => setHoveredMessage(msg.id)}
                    onMouseLeave={() => setHoveredMessage(null)}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-3xl rounded-2xl px-4 py-3 shadow-sm border text-sm leading-relaxed ${
                        msg.role === "user" ? "bg-blue-600 text-white border-blue-700" : "bg-white text-slate-800 border-slate-200"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="whitespace-normal" dangerouslySetInnerHTML={{ __html: mdToHtml(msg.text) }} />
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      )}

                      <div className={`mt-2 text-[11px] ${msg.role === "user" ? "text-blue-100/90" : "text-slate-400"}`}>
                        {msg.timestamp}
                        {msg.pending ? <span className="ml-2">• ⏳</span> : null}
                      </div>

                      {/* Иконки лайк/дизлайк для ответа бота (регенерация убрана) */}
                      {msg.role === "assistant" && !msg.pending && (
                        <div className={`mt-2 flex items-center gap-2 transition-opacity ${hoveredMessage === msg.id ? "opacity-100" : "opacity-0"}`}>
                          <button
                            className={`px-2 py-1 rounded-lg border text-xs ${
                              msg.feedback === "like"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "text-slate-500 border-slate-200 hover:bg-slate-50"
                            }`}
                            onClick={() => handleFeedback(msg.id, "like")}
                            title="Полезно (POST /messages/{bot_uuid}/feedback)"
                          >
                            👍
                          </button>
                          <button
                            className={`px-2 py-1 rounded-lg border text-xs ${
                              msg.feedback === "dislike"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "text-slate-500 border-slate-200 hover:bg-slate-50"
                            }`}
                            onClick={() => handleFeedback(msg.id, "dislike")}
                            title="Бесполезно (POST /messages/{bot_uuid}/feedback)"
                          >
                            👎
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Поле ввода под диалогом */}
            <div className="border-t border-slate-200 bg-white/90 backdrop-blur-sm p-4">
              <div className="max-w-5xl mx-auto">
                <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Введите ваш вопрос для TuxBot..."
                    className="w-full resize-none outline-none bg-transparent text-slate-800 placeholder-slate-400"
                    rows={1}
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-xs text-slate-400">Enter — отправить • Shift+Enter — новая строка</div>
                    <button
                      onClick={handleSend}
                      disabled={isLoading || !inputValue.trim()}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isLoading ? "Генерация..." : "Отправить"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* МОДАЛЫ */}
      {/* Подтверждение удаления чата */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-2">Удалить чат?</h3>
            <p className="text-slate-600 mb-6">Это действие необратимо.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={handleCancelDelete} className="px-4 py-2 rounded-lg border">
                Нет
              </button>
              <button onClick={handleConfirmDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white">
                Да
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Подтверждение выхода */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-2">Выйти из аккаунта?</h3>
            <p className="text-slate-600 mb-6">Вы будете перенаправлены на главную страницу.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={handleCancelLogout} className="px-4 py-2 rounded-lg border">
                Нет
              </button>
              <button onClick={handleConfirmLogout} className="px-4 py-2 rounded-lg bg-slate-800 text-white">
                Да
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEV MODAL: настройки + helpers + log (функциональность как у бэкендера) */}
      {showDev && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-3xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">API / WS настройки и лог</h3>
              <button onClick={() => setShowDev(false)} className="px-3 py-2 rounded-lg border hover:bg-slate-50">
                Закрыть
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500">API Base (HTTP)</label>
                <input
                  value={apiBaseHttp}
                  onChange={(e) => setApiBaseHttp(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200"
                  placeholder="http://localhost:52052"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">WS URL</label>
                <input
                  value={wsUrl}
                  onChange={(e) => setWsUrl(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200"
                  placeholder="ws://localhost:52052/ws"
                />
                <div className="text-[11px] text-slate-400 mt-1">Можно оставить как есть. Пробелы внутри удаляются автоматически.</div>
              </div>

              <div>
                <label className="text-xs text-slate-500">User ID</label>
                <input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200"
                  placeholder="123"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Model version</label>
                <input
                  value={modelVersion}
                  onChange={(e) => setModelVersion(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200"
                  placeholder="v1"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={async () => {
                  try {
                    await ensureWsConnected();
                  } catch (e) {
                    addLog("WS connect ERROR: " + (e?.message || e));
                  }
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
              >
                WS connect
              </button>
              <button onClick={closeWSIfAny} className="px-4 py-2 rounded-xl bg-slate-700 text-white hover:bg-slate-800">
                WS close
              </button>
              <button onClick={devGetChats} className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50">
                GET /chats?user_id=...
              </button>
              <button onClick={devGetMessages} className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50">
                GET /chats/{`{chat_uuid}`}/messages?user_id=...
              </button>
              <button onClick={clearLog} className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50">
                Clear log
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500">current chat_uuid</div>
                <div className="font-mono text-slate-800 break-all">{currentChatId || "(none)"}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500">last user_message_uuid</div>
                <div className="font-mono text-slate-800 break-all">{currentChat?.last_user_message_uuid || "(none)"}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-slate-500">last bot_message_uuid</div>
                <div className="font-mono text-slate-800 break-all">{currentChat?.last_bot_message_uuid || "(none)"}</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-slate-500 mb-2">Log</div>
              <pre className="w-full h-56 overflow-auto rounded-xl bg-slate-950 text-slate-100 p-4 border border-slate-800 text-xs whitespace-pre-wrap">
                {logText}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
