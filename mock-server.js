// mock-server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import crypto from "crypto";

const app = express();

// ====== CONFIG ======
const PORT = 8080;

// По ТЗ: access 15 минут, refresh 1 день
const ACCESS_TTL_SEC = 15 * 60;
const REFRESH_TTL_SEC = 24 * 60 * 60;

app.use(express.json());
app.use(cookieParser());

// ====== CORS (важно для cookie + чтения access_token из headers) ======
function isAllowedOrigin(origin) {
  if (!origin) return true; // curl/postman
  try {
    const u = new URL(origin);
    const host = u.hostname;
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}

const corsOptions = {
  origin(origin, cb) {
    // если origin отсутствует (postman/curl) — разрешаем
    if (!origin) return cb(null, true);

    // если разрешён — отразим конкретный origin (надёжнее, чем boolean)
    if (isAllowedOrigin(origin)) return cb(null, origin);

    // иначе запрещаем
    return cb(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  // добавили Authorization на всякий случай (часто появляется в dev)
  allowedHeaders: ["Content-Type", "Accept", "access_token", "Authorization"],
  // ВАЖНО: чтобы фронт мог прочитать access_token из response headers
  exposedHeaders: ["access_token", "access_token_expires_in"],
};

app.use(cors(corsOptions));
// ВАЖНО: regex вместо "*" чтобы не ловить PathError в некоторых версиях
app.options(/.*/, cors(corsOptions));

// ====== Лог запросов ======
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.path}` +
      ` | access=${req.headers["access_token"] ? "yes" : "no"}` +
      ` | cookie.refresh=${req.cookies?.refresh_token ? "yes" : "no"}`
  );
  next();
});

// ====== "DB" in memory ======
const usersByEmail = new Map();     // email -> user
const usersByUsername = new Map();  // username -> user

// refresh storage: refresh_token -> { email, expMs, revoked }
const refreshStore = new Map();

// ====== base64url helpers ======
function b64urlEncode(str) {
  return Buffer.from(str, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function b64urlDecodeToString(b64url) {
  const b64 = String(b64url).replace(/-/g, "+").replace(/_/g, "/");
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  return Buffer.from(b64 + pad, "base64").toString("utf8");
}

function b64urlJson(obj) {
  return b64urlEncode(JSON.stringify(obj));
}

function randHex(bytes = 16) {
  return crypto.randomBytes(bytes).toString("hex");
}

function makeAccessToken(email) {
  const expMs = Date.now() + ACCESS_TTL_SEC * 1000;
  const payload = { email, expMs };
  return `acc.${b64urlJson(payload)}.${randHex(10)}`;
}

function makeRefreshToken(email) {
  const expMs = Date.now() + REFRESH_TTL_SEC * 1000;
  const payload = { email, expMs, jti: randHex(12) };
  return `ref.${b64urlJson(payload)}.${randHex(10)}`;
}

function decodeToken(token) {
  try {
    const parts = String(token).split(".");
    if (parts.length < 3) return null;
    return JSON.parse(b64urlDecodeToString(parts[1]));
  } catch {
    return null;
  }
}

function saveRefresh(refresh, email) {
  const payload = decodeToken(refresh);
  refreshStore.set(refresh, {
    email,
    expMs: payload?.expMs ?? Date.now() + REFRESH_TTL_SEC * 1000,
    revoked: false,
  });
}

function revokeRefresh(refresh) {
  if (!refresh) return;
  const row = refreshStore.get(refresh);
  if (row) row.revoked = true;
}

function setAuth(res, email, { rotateRefresh = true, oldRefresh = null } = {}) {
  const access = makeAccessToken(email);

  // access в заголовке + TTL в секундах
  res.setHeader("access_token", access);
  res.setHeader("access_token_expires_in", String(ACCESS_TTL_SEC));

  let refresh = oldRefresh;

  if (rotateRefresh || !oldRefresh) {
    refresh = makeRefreshToken(email);
    saveRefresh(refresh, email);

    // refresh в HttpOnly cookie
    res.cookie("refresh_token", refresh, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: REFRESH_TTL_SEC * 1000,
      path: "/",
    });

    if (oldRefresh) revokeRefresh(oldRefresh);
  }

  return { access, refresh };
}

// ====== ROUTES ======

// quick check
app.get("/health", (req, res) => {
  return res.status(200).json({ ok: true, now: new Date().toISOString() });
});

// "who am i" check (по refresh cookie или access header)
app.get("/me", (req, res) => {
  const access = req.headers["access_token"];
  const refresh = req.cookies?.refresh_token;

  if (refresh) {
    const row = refreshStore.get(refresh);
    if (row && !row.revoked && row.expMs > Date.now()) {
      return res.status(200).json({
        email: row.email,
        has_access: !!access,
        has_refresh_cookie: true,
      });
    }
  }

  if (access) {
    const payload = decodeToken(access);
    if (payload?.email) {
      return res.status(200).json({
        email: payload.email,
        has_access: true,
        has_refresh_cookie: !!refresh,
      });
    }
  }

  return res.status(401).json({ message: "unauthorized" });
});

// protected endpoint (проверка access_token)
app.get("/protected", (req, res) => {
  const access = req.headers["access_token"];
  if (!access) return res.status(401).json({ message: "no access_token" });

  const payload = decodeToken(access);
  if (!payload?.email) return res.status(401).json({ message: "bad access_token" });
  if (payload.expMs && payload.expMs <= Date.now()) {
    return res.status(401).json({ message: "access_token expired" });
  }

  return res.status(200).json({ ok: true, email: payload.email });
});

// ✅ POST /users (регистрация БЕЗ токенов)
app.post("/users", (req, res) => {
  const { name, surname, username, email, password } = req.body || {};

  const n = String(name ?? "").trim();
  const s = String(surname ?? "").trim();
  const u = String(username ?? "").trim();
  const e = String(email ?? "").trim().toLowerCase();
  const p = String(password ?? "");

  if (!n || !s || !u || !e || !p) {
    return res.status(400).json({ message: "Некорректные данные" });
  }

  if (usersByEmail.has(e)) {
    return res.status(409).json({ message: "Пользователь уже существует" });
  }
  if (usersByUsername.has(u)) {
    return res.status(409).json({ message: "Имя пользователя уже занято" });
  }

  const user = {
    name: n,
    surname: s,
    username: u,
    email: e,
    password: p,
  };

  usersByEmail.set(e, user);
  usersByUsername.set(u, user);

  // ❌ НЕ выдаём токены — только создаём пользователя
  return res.status(201).json({ message: "CREATED" });
});

// POST /users/verifications — отключено
app.post("/users/verifications", (req, res) => {
  return res.status(410).json({ message: "Подтверждение кода отключено" });
});

// POST /auth/login
app.post("/auth/login", (req, res) => {
  const { email, username, password } = req.body || {};
  if (!password || (!email && !username)) {
    return res.status(400).json({ message: "Некорректные данные" });
  }

  const pass = String(password);
  let user = null;

  if (email) {
    const emailKey = String(email).trim().toLowerCase();
    user = usersByEmail.get(emailKey) || null;
  }

  if (!user && username) {
    const uname = String(username).trim();
    user = usersByUsername.get(uname) || null;
  }

  if (!user || user.password !== pass) {
    return res.status(401).json({ message: "Неверный логин или пароль" });
  }

  setAuth(res, user.email, { rotateRefresh: true });
  return res.status(200).json({ message: "OK" });
});

// GET /auth/refresh — чтобы было видно, что метод неправильный
app.get("/auth/refresh", (req, res) => {
  return res.status(405).json({ message: "Use POST /auth/refresh" });
});

// POST /auth/refresh (refresh cookie → новый access + новый refresh)
app.post("/auth/refresh", (req, res) => {
  const refresh = req.cookies?.refresh_token;
  if (!refresh) return res.status(401).json({ message: "Нет refresh cookie" });

  const row = refreshStore.get(refresh);
  if (!row) return res.status(401).json({ message: "Refresh неизвестен" });
  if (row.revoked) return res.status(401).json({ message: "Refresh отозван" });
  if (row.expMs <= Date.now()) return res.status(401).json({ message: "Refresh истёк" });

  setAuth(res, row.email, { rotateRefresh: true, oldRefresh: refresh });
  return res.status(200).json({ message: "refreshed" });
});

// POST /auth/logout (отзываем refresh + чистим cookie)
app.post("/auth/logout", (req, res) => {
  const refresh = req.cookies?.refresh_token;
  revokeRefresh(refresh);

  res.clearCookie("refresh_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  });

  return res.status(200).json({ message: "logout" });
});

app.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`);
  console.log(`CORS origins allowed: http://localhost:* , http://127.0.0.1:*`);
});
