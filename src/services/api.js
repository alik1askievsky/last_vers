// src/services/api.js
// fetch wrapper + in-memory access token
// refresh_token НЕ храним — он в HttpOnly cookie и уходит автоматически через credentials: "include"

const RAW_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
const BASE_URL = RAW_BASE_URL || (import.meta.env.DEV ? "http://localhost:8080" : "");

// refresh endpoint
const REFRESH_PATH = import.meta.env.VITE_REFRESH_PATH ?? "/auth/refresh";

// По ТЗ: access ~15 минут
const ACCESS_TTL_MS = 15 * 60 * 1000;
const EARLY_REFRESH_MS = 10 * 1000;

// ===== In-memory access token storage =====
let _accessToken = null;
let _accessExpiresAt = 0;

// single-flight refresh (чтобы не дергать /auth/refresh пачкой)
let _refreshPromise = null;

export function setAccessToken(accessToken, expiresAtMs) {
  _accessToken = accessToken || null;
  _accessExpiresAt = typeof expiresAtMs === "number" ? expiresAtMs : 0;
}

export function clearAccessToken() {
  _accessToken = null;
  _accessExpiresAt = 0;
}

export function getAccessToken() {
  return _accessToken;
}

export function getAccessExpiresAt() {
  return _accessExpiresAt;
}

function isAccessExpired() {
  if (!_accessToken) return true;
  if (!_accessExpiresAt) return false; // если время не задано — считаем валидным
  return Date.now() + EARLY_REFRESH_MS >= _accessExpiresAt;
}

// ===== Helpers =====
function buildUrl(path) {
  if (/^https?:\/\//i.test(path)) return path;
  if (!BASE_URL) return path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function getHeader(headers, name) {
  try {
    return headers?.get?.(name) ?? null;
  } catch {
    return null;
  }
}

// access приходит в заголовках (refresh в cookie — не читаем)
export function saveAccessFromResponseHeaders(headers) {
  const access = getHeader(headers, "access_token");
  if (!access) return null;

  const accessSecRaw = getHeader(headers, "access_token_expires_in");
  const accessSec =
    accessSecRaw != null && !Number.isNaN(Number(accessSecRaw))
      ? Number(accessSecRaw)
      : null;

  const expiresAt = Date.now() + (accessSec ? accessSec * 1000 : ACCESS_TTL_MS);
  setAccessToken(access, expiresAt);

  return { access_token: access, access_expires_at: expiresAt };
}

async function readBody(res) {
  if (res.status === 204) return null;

  const text = await res.text().catch(() => "");
  if (!text) return null;

  const ct = (res.headers.get("content-type") || "").toLowerCase();
  const looksJson = ct.includes("application/json");

  if (looksJson) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  // иногда бэк забывает content-type — пробуем парсить
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// ===== Refresh (HttpOnly cookie) =====
export function refreshAccessToken() {
  if (!REFRESH_PATH) return Promise.resolve(false);

  // если refresh уже в процессе — ждём один и тот же промис
  if (_refreshPromise) return _refreshPromise;

  const url = buildUrl(REFRESH_PATH);

  const p = (async () => {
    try {
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) return false;

      return !!saveAccessFromResponseHeaders(res.headers)?.access_token;
    } catch {
      return false;
    }
  })();

  // гарантируем: промис всегда резолвится boolean и чистится после завершения
  _refreshPromise = p.then(
    (ok) => {
      _refreshPromise = null;
      return ok;
    },
    () => {
      _refreshPromise = null;
      return false;
    }
  );

  return _refreshPromise;
}

// ===== Main fetch wrapper =====
export async function apiFetch(
  path,
  { method = "GET", headers = {}, body, withAuth = true, _retried = false } = {}
) {
  const url = buildUrl(path);

  const finalHeaders = {
    Accept: "application/json",
    ...(headers || {}),
  };

  let bodyToSend = undefined;

  if (body !== undefined && body !== null) {
    if (typeof FormData !== "undefined" && body instanceof FormData) {
      bodyToSend = body; // браузер сам поставит boundary
    } else if (typeof body === "string") {
      bodyToSend = body;
      // ставим JSON только если явно не задано
      if (!finalHeaders["Content-Type"]) finalHeaders["Content-Type"] = "application/json";
    } else {
      bodyToSend = JSON.stringify(body);
      if (!finalHeaders["Content-Type"]) finalHeaders["Content-Type"] = "application/json";
    }
  }

  // --- защита от случайного цикла, если кто-то вызовет apiFetch("/auth/refresh")
  const refreshUrl = REFRESH_PATH ? buildUrl(REFRESH_PATH) : "";
  const isRefreshRequest = refreshUrl && url === refreshUrl;

  // ----- AUTH HEADER -----
  let refreshTriedBeforeRequest = false;

  if (withAuth && !isRefreshRequest) {
    if (_accessToken && !isAccessExpired()) {
      finalHeaders["access_token"] = _accessToken;
    } else if (!_retried) {
      refreshTriedBeforeRequest = true;

      const ok = await refreshAccessToken();
      if (ok && _accessToken) {
        finalHeaders["access_token"] = _accessToken;
      } else {
        // refresh не вышел — идем без access → сервер даст 401
        clearAccessToken();
      }
    }
  }

  let res;
  try {
    res = await fetch(url, {
      method,
      headers: finalHeaders,
      body: bodyToSend,
      credentials: "include",
    });
  } catch (e) {
    const msg =
      e?.name === "TypeError"
        ? "Запрос заблокирован (CORS) или сервер недоступен"
        : "Ошибка сети при запросе к API";

    const err = new Error(`${msg}: ${url}`);
    err.cause = e;
    err.status = 0;
    throw err;
  }

  // если сервер прислал новый access — обновим
  saveAccessFromResponseHeaders(res.headers);

  const data = await readBody(res);

  // ----- 401 retry once -----
  // Если мы уже пытались refresh ДО запроса — второй раз не дергаем.
  if (
    res.status === 401 &&
    withAuth &&
    !_retried &&
    !refreshTriedBeforeRequest &&
    !isRefreshRequest
  ) {
    const ok = await refreshAccessToken();
    if (ok) {
      return apiFetch(path, { method, headers, body, withAuth, _retried: true });
    }
    clearAccessToken();
  }

  if (!res.ok) {
    const err = new Error(data?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return { ok: true, status: res.status, data, headers: res.headers };
}
