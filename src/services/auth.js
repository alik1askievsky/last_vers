// src/services/auth.js
import {
  apiFetch,
  saveAccessFromResponseHeaders,
  clearAccessToken,
  getAccessToken,
  getAccessExpiresAt,
} from "./api";

// Нормализуем payload для логина: email или username (без пустых строк)
function buildLoginPayload(login, password) {
  const l = String(login ?? "").trim();
  const p = String(password ?? "");

  const isEmail = l.includes("@");
  return isEmail ? { email: l, password: p } : { username: l, password: p };
}

/**
 * POST /users
 * Создаёт пользователя. Токенов тут НЕТ.
 * ВАЖНО: отправляем ВСЕ поля (включая username).
 */
export async function registerUser({ name, surname, username, email, password }) {
  const payload = {
    name: String(name ?? "").trim(),
    surname: String(surname ?? "").trim(),
    username: String(username ?? "").trim(), // <-- всегда отправляем
    email: String(email ?? "").trim(),
    password: String(password ?? ""),
  };

  try {
    const res = await apiFetch("/users", {
      method: "POST",
      body: payload,
      withAuth: false,
    });

    // токены НЕ читаем и НЕ сохраняем после /users
    return res.data;
  } catch (err) {
    const status = err?.status;
    const message =
      err?.data?.message ||
      (status === 409
        ? "Пользователь с таким email/username уже существует."
        : status === 400
        ? "Некорректные данные регистрации."
        : "Не удалось зарегистрироваться.");

    const e = new Error(message);
    e.status = status;
    throw e;
  }
}

/**
 * POST /auth/login
 * После логина приходят токены:
 * - access_token в заголовках
 * - refresh_token в HttpOnly cookie
 */
export async function login({ login, password }) {
  const payload = buildLoginPayload(login, password);

  try {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: payload,
      withAuth: false,
    });

    // сохраняем access из заголовков
    saveAccessFromResponseHeaders(res.headers);

    const access = getAccessToken();
    if (!access) {
      const err = new Error("Сервер не вернул access_token после входа.");
      err.status = 500;
      throw err;
    }

    return {
      access_token: access,
      access_expires_at: getAccessExpiresAt(),
    };
  } catch (err) {
    const status = err?.status;
    const message =
      err?.data?.message ||
      (status === 401
        ? "Неверный логин или пароль."
        : status === 400
        ? "Некорректные данные для входа."
        : "Не удалось выполнить вход.");

    const e = new Error(message);
    e.status = status;
    throw e;
  }
}

/**
 * POST /auth/logout
 */
export async function logout() {
  try {
    const access = getAccessToken();

    await apiFetch("/auth/logout", {
      method: "POST",
      withAuth: false,
      headers: access ? { access_token: access } : {},
    });
  } catch (e) {
    console.warn("logout error:", e);
  } finally {
    clearAccessToken();
  }
}
