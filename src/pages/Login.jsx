// src/pages/Login.jsx
import { useState, useCallback, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function isNetworkLikeError(err) {
  const msg = String(err?.message || "");
  return (
    err?.status === 0 ||
    /failed to fetch|networkerror|cors|fetch/i.test(msg)
  );
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const [formData, setFormData] = useState({ login: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success"); // "success" | "error"

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // чистим ошибку поля + общий баннер
    setErrors((prev) => {
      if (!prev[name] && !prev._root) return prev;
      return { ...prev, [name]: "", _root: "" };
    });
    if (message) setMessage("");
  }, [message]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    const login = formData.login.trim();

    if (!login) newErrors.login = "Введите email или имя пользователя";
    if (!formData.password) newErrors.password = "Введите пароль";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      if (isLoading) return;
      if (!validateForm()) return;

      setIsLoading(true);
      setMessage("");
      setMessageType("success");
      setErrors({});

      try {
        await signIn({
          login: formData.login.trim(),
          password: formData.password,
        });

        setMessageType("success");
        setMessage("Успешный вход! Перенаправление...");

        const to = location?.state?.from?.pathname || "/auth/chatbot";
        navigate(to, { replace: true });
      } catch (err) {
        let msg = err?.message || "Не удалось выполнить вход.";

        // если похоже на сеть/CORS — даём более понятный текст
        if (isNetworkLikeError(err)) {
          msg =
            "Не удалось подключиться к серверу (CORS/сервер недоступен). Проверь, что запущен mock-server и VITE_API_BASE_URL=http://localhost:8080.";
        }

        setMessageType("error");
        setMessage(msg);

        // для UX: креды — подсветим логин; сеть — только баннер
        setErrors((prev) => ({
          ...prev,
          login: isNetworkLikeError(err) ? "" : msg,
          password: "",
          _root: msg,
        }));
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, validateForm, signIn, formData, navigate, location]
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((p) => !p);
  }, []);

  const PasswordVisibilityIcon = useMemo(
    () =>
      showPassword ? (
        <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
          />
        </svg>
      ) : (
        <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
    [showPassword]
  );

  const LoadingSpinner = useMemo(
    () => (
      <div className="flex items-center justify-center">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Вход...
      </div>
    ),
    []
  );

  const inputBaseClasses =
    "relative block w-full px-4 py-3 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200";
  const inputErrorClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";
  const inputNormalClasses = "border-gray-300";

  const InputField = useCallback(
    ({ id, name, type, placeholder, value, onChange, error, ...props }) => (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-white mb-2">
          {placeholder}
        </label>
        <input
          id={id}
          name={name}
          type={type}
          required
          value={value}
          onChange={onChange}
          className={`${inputBaseClasses} ${error ? inputErrorClasses : inputNormalClasses}`}
          placeholder={`Введите ${placeholder.toLowerCase()}`}
          {...props}
        />
        {error && (
          <div className="mt-2 flex items-center">
            <svg className="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-300 font-medium">{error}</p>
          </div>
        )}
      </div>
    ),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">Вход в систему</h2>
          <p className="mt-2 text-sm text-gray-300">Введите email/имя пользователя и пароль</p>
        </div>

        {message && (
          <div
            className={`px-4 py-3 rounded-lg border ${
              messageType === "success"
                ? "bg-green-500/20 border-green-500/50 text-green-300"
                : "bg-red-500/20 border-red-500/50 text-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <InputField
              id="login"
              name="login"
              type="text"
              placeholder="Email или имя пользователя"
              value={formData.login}
              onChange={handleChange}
              error={errors.login}
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              maxLength={256}
            />

            <div className="relative">
              <InputField
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Пароль"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                autoComplete="current-password"
                maxLength={256}
              />
              <button
                type="button"
                className="absolute right-3 top-[42px] text-gray-600"
                onClick={togglePasswordVisibility}
                aria-label="Показать/скрыть пароль"
              >
                {PasswordVisibilityIcon}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-70"
          >
            {isLoading ? LoadingSpinner : "Войти"}
          </button>

          <div className="text-sm text-center text-gray-300">
            Нет аккаунта?{" "}
            <Link to="/auth/register" className="text-blue-400 hover:text-blue-300 font-semibold">
              Зарегистрироваться
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
