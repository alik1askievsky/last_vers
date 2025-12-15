// src/pages/Register.jsx
import React, { useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth(); // <-- ВАЖНО

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [passwordStrength, setPasswordStrength] = useState("");

  const checkPasswordStrength = useCallback((password) => {
    if (!password) return "";
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    if (score <= 2) return "weak";
    if (score <= 4) return "medium";
    return "strong";
  }, []);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      let v = value;

      if (name === "username" && v.length > 32) v = v.slice(0, 32);
      if ((name === "password" || name === "confirmPassword") && v.length > 256) v = v.slice(0, 256);
      if ((name === "name" || name === "surname") && v.length > 50) v = v.slice(0, 50);

      setFormData((prev) => ({ ...prev, [name]: v }));

      if (name === "password") setPasswordStrength(checkPasswordStrength(v));

      if (errors[name] || errors._root) {
        setErrors((prev) => ({ ...prev, [name]: "", _root: "" }));
      }
    },
    [errors, checkPasswordStrength]
  );

  const validateForm = useCallback(() => {
    const newErrors = {};

    const name = formData.name.trim();
    if (!name) newErrors.name = "Имя обязательно";
    else if (name.length < 2) newErrors.name = "Имя должно содержать минимум 2 символа";
    else if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(name)) newErrors.name = "Имя может содержать только буквы, пробелы и дефисы";

    const surname = formData.surname.trim();
    if (!surname) newErrors.surname = "Фамилия обязательна";
    else if (surname.length < 2) newErrors.surname = "Фамилия должна содержать минимум 2 символа";
    else if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(surname)) newErrors.surname = "Фамилия может содержать только буквы, пробелы и дефисы";

    const username = formData.username.trim();
    if (!username) newErrors.username = "Имя пользователя обязательно";
    else if (username.length < 3) newErrors.username = "Имя пользователя минимум 3 символа";
    else if (username.length > 32) newErrors.username = "Имя пользователя до 32 символов";
    else if (!/^[a-zA-Z0-9_]+$/.test(username))
      newErrors.username = "Имя пользователя может содержать только буквы, цифры и нижнее подчеркивание";

    const email = formData.email.trim();
    if (!email) newErrors.email = "Email обязателен";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Некорректный формат email";

    const password = formData.password;
    if (!password) newErrors.password = "Пароль обязателен";
    else if (password.length < 6) newErrors.password = "Пароль минимум 6 символов";
    else if (password.length > 256) newErrors.password = "Пароль не должен превышать 256 символов";
    else if (passwordStrength === "weak")
      newErrors.password = "Пароль слишком слабый. Добавьте заглавные/строчные буквы, цифры и спецсимволы";

    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Пароли не совпадают";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, passwordStrength]);

  const handleRegister = useCallback(
    async (e) => {
      e.preventDefault();
      if (isLoading) return;
      if (!validateForm()) return;

      setIsLoading(true);
      setErrors({});
      setMessage("");
      setMessageType("success");

      try {
        // 1) регистрация
        await signUp({
          name: formData.name.trim(),
          surname: formData.surname.trim(),
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
        });

        setMessageType("success");
        setMessage("Регистрация успешна! Выполняем вход...");

        // 2) автологин (именно тут должны сохраниться токены)
        const loginValue = formData.email.trim() || formData.username.trim();
        await signIn({ login: loginValue, password: formData.password });

        setMessageType("success");
        setMessage("Вход выполнен! Перенаправление...");

        // 3) переход в чат
        navigate("/auth/chatbot", { replace: true });
      } catch (err) {
        const msg =
          err?.status === 0
            ? "Не удалось подключиться к серверу (CORS/сервер недоступен). Проверь VITE_API_BASE_URL и что mock-server запущен."
            : err?.message || "Ошибка регистрации/входа";

        setMessageType("error");
        setMessage(msg);
        setErrors((prev) => ({ ...prev, _root: msg }));
      } finally {
        setIsLoading(false);
      }
    },
    [formData, validateForm, isLoading, navigate, signUp, signIn]
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((v) => !v);
  }, []);

  const PasswordStrengthIndicator = useMemo(() => {
    if (!formData.password) return null;

    const strengthConfig = {
      weak: { color: "bg-red-500", text: "Слабый", description: "Добавьте заглавные, цифры и спецсимволы" },
      medium: { color: "bg-yellow-500", text: "Средний", description: "Можно усилить" },
      strong: { color: "bg-green-500", text: "Сильный", description: "Отличный пароль!" },
    };

    const cfg = strengthConfig[passwordStrength];
    if (!cfg) return null;

    return (
      <div className="mt-3 p-3 bg-white/20 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">Сложность пароля:</span>
          <span
            className={`text-sm font-bold ${
              passwordStrength === "weak"
                ? "text-red-400"
                : passwordStrength === "medium"
                ? "text-yellow-400"
                : "text-green-400"
            }`}
          >
            {cfg.text}
          </span>
        </div>
        <div className="w-full bg-gray-400/30 rounded-full h-2 mb-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${cfg.color}`}
            style={{
              width: passwordStrength === "weak" ? "33%" : passwordStrength === "medium" ? "66%" : "100%",
            }}
          />
        </div>
        <p className="text-xs text-blue-200 mb-1">{cfg.description}</p>
        <p className="text-xs font-medium text-white">Длина: {formData.password.length}/256</p>
      </div>
    );
  }, [formData.password, passwordStrength]);

  const FieldLengthIndicator = useCallback(({ currentLength, maxLength }) => {
    if (!currentLength) return null;
    const percentage = (currentLength / maxLength) * 100;
    const isNearLimit = percentage > 80;
    return (
      <div className="mt-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-blue-200 font-medium">Длина</span>
          <span className={`text-xs font-bold ${isNearLimit ? "text-orange-300" : "text-white"}`}>
            {currentLength}/{maxLength}
          </span>
        </div>
        <div className="w-full bg-gray-400/30 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${isNearLimit ? "bg-orange-400" : "bg-blue-400"}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
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

  const inputBaseClasses =
    "relative block w-full px-4 py-3 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200";
  const inputErrorClasses = "border-red-500 focus:ring-red-500 focus:border-red-500";
  const inputNormalClasses = "border-gray-300";

  const InputField = useCallback(
    ({ id, name, type, placeholder, value, onChange, error, maxLength, ...props }) => (
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
          maxLength={maxLength}
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

        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">Создать аккаунт</h2>
          <p className="mt-2 text-sm text-gray-300">Заполните форму для регистрации</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField id="name" name="name" type="text" placeholder="Имя" value={formData.name} onChange={handleChange} error={errors.name} maxLength={50} />
              <InputField id="surname" name="surname" type="text" placeholder="Фамилия" value={formData.surname} onChange={handleChange} error={errors.surname} maxLength={50} />
            </div>

            <InputField id="username" name="username" type="text" placeholder="Имя пользователя" value={formData.username} onChange={handleChange} error={errors.username} maxLength={32} />
            <FieldLengthIndicator currentLength={formData.username?.length} maxLength={32} />

            <InputField id="email" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} error={errors.email} />

            <div className="relative">
              <InputField
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Пароль"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
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
              {PasswordStrengthIndicator}
            </div>

            <InputField
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Подтверждение пароля"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              maxLength={256}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:opacity-70"
          >
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </button>

          <div className="text-sm text-center text-gray-300">
            Уже есть аккаунт?{" "}
            <Link to="/auth/login" className="text-blue-400 hover:text-blue-300 font-semibold">
              Войти
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
