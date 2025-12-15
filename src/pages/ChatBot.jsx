// src/pages/ChatBot.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout as apiLogout } from '../services/auth';

// Анимированный логотип-пингвин
const PenguinAI = ({ className = "" }) => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className={`flex-shrink-0 drop-shadow-2xl ${className}`}>
    <circle cx="50" cy="50" r="50" fill="url(#sphereGradient)">
      <animate attributeName="r" values="50;48;50;52;50" dur="4s" repeatCount="indefinite"/>
    </circle>
    <g transform="rotate(0 50 50)">
      <circle cx="50" cy="50" r="45" fill="none" stroke="url(#ringGradient)" strokeWidth="2" strokeDasharray="4 4">
        <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="8s" repeatCount="indefinite"/>
      </circle>
    </g>
    <ellipse cx="50" cy="62" rx="24" ry="18" fill="#2D3748" stroke="#4A5568" strokeWidth="2"/>
    <ellipse cx="50" cy="56" rx="20" ry="14" fill="white"/>
    <circle cx="50" cy="35" r="16" fill="#2D3748" stroke="#4A5568" strokeWidth="2"/>
    <circle cx="50" cy="35" r="13" fill="white"/>
    <path d="M32 50 Q50 68 68 50 L68 72 Q50 78 32 72 Z" fill="url(#bellyGradient)"/>
    <g className="animate-pulse">
      <circle cx="43" cy="33" r="3.5" fill="#1A202C">
        <animate attributeName="r" values="3.5;4;3.5" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="57" cy="33" r="3.5" fill="#1A202C">
        <animate attributeName="r" values="3.5;4;3.5" dur="2s" repeatCount="indefinite" begin="0.5s"/>
      </circle>
      <circle cx="44" cy="32" r="1.2" fill="white"/>
      <circle cx="58" cy="32" r="1.2" fill="white"/>
    </g>
    <path d="M45 40L55 40L50 45Z" fill="url(#beakGradient)" filter="url(#beakGlow)"/>
    <ellipse cx="40" cy="72" rx="4" ry="2.5" fill="url(#feetGradient)"/>
    <ellipse cx="60" cy="72" rx="4" ry="2.5" fill="url(#feetGradient)"/>
    <g stroke="url(#neuralGradient)" strokeWidth="2.5" fill="none" opacity="0.9">
      <path d="M40 25C35 18 40 14 45 17" strokeLinecap="round">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite"/>
        <animate attributeName="stroke-width" values="2.5;3.5;2.5" dur="1.8s" repeatCount="indefinite"/>
      </path>
      <path d="M50 22C50 17 55 17 55 22" strokeLinecap="round">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite" begin="0.2s"/>
        <animate attributeName="stroke-width" values="2.5;3.5;2.5" dur="1.8s" repeatCount="indefinite" begin="0.2s"/>
      </path>
      <path d="M60 25C65 18 60 14 55 17" strokeLinecap="round">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.8s" repeatCount="indefinite" begin="0.4s"/>
        <animate attributeName="stroke-width" values="2.5;3.5;2.5" dur="1.8s" repeatCount="indefinite" begin="0.4s"/>
      </path>
    </g>
    <rect x="38" y="52" width="24" height="8" rx="3" fill="#1A202C" opacity="0.95"/>
    <g className="animate-pulse">
      <circle cx="42" cy="56" r="2" fill="#48BB78">
        <animate attributeName="fill" values="#48BB78;#68D391;#48BB78" dur="1.2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="50" cy="56" r="2" fill="#ED8936">
        <animate attributeName="fill" values="#ED8936;#F6AD55;#ED8936" dur="1.2s" repeatCount="indefinite" begin="0.4s"/>
      </circle>
      <circle cx="58" cy="56" r="2" fill="#4299E1">
        <animate attributeName="fill" values="#4299E1;#63B3ED;#4299E1" dur="1.2s" repeatCount="indefinite" begin="0.8s"/>
      </circle>
    </g>
    <rect x="62" y="55" width="1" height="3" fill="#FFFFFF">
      <animate attributeName="opacity" values="1;0;1" dur="0.8s" repeatCount="indefinite"/>
    </rect>
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
          <animate attributeName="r" values={`${1 + Math.random() * 1.5};${2 + Math.random() * 2};${1 + Math.random() * 1.5}`} dur={`${2 + Math.random() * 2}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur={`${3 + Math.random() * 2}s`} repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="rotate" from={`0 50 50`} to={`360 50 50`} dur={`${12 + Math.random() * 8}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </g>
    <g stroke="url(#waveGradient)" strokeWidth="2" fill="none" opacity="0.7">
      <circle cx="50" cy="50" r="40" strokeDasharray="5 5">
        <animate attributeName="r" values="40;43;40" dur="3s" repeatCount="indefinite"/>
        <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite"/>
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
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur"/>
        <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 0.5 0 0 0  0 0 0 0 0  0 0 0 1 0" result="glow"/>
        <feComposite in="SourceGraphic" in2="glow" operator="over"/>
      </filter>
    </defs>
  </svg>
);

const ChatBot = () => {
  const navigate = useNavigate();

  
  // ---------- STATE
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const initializeState = () => {
    const savedChats = localStorage.getItem('tuxbot-chats');
    const savedCurrentChat = localStorage.getItem('tuxbot-current-chat');
    return {
      chats: savedChats ? JSON.parse(savedChats) : [],
      currentChatId: savedCurrentChat ? JSON.parse(savedCurrentChat) : null,
    };
  };

  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState(initializeState().chats);
  const [currentChatId, setCurrentChatId] = useState(initializeState().currentChatId);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Qwen-2.5-1.5B-Instruct');
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const models = [
    'Qwen-2.5-1.5B-Instruct',
    'Llama-3-8B-Instruct'
  ];

  // ---------- PERSISTENCE
  useEffect(() => {
    localStorage.setItem('tuxbot-chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('tuxbot-current-chat', JSON.stringify(currentChatId));
  }, [currentChatId]);

  // ---------- LOAD MESSAGES ON CHAT SWITCH
  useEffect(() => {
    if (currentChatId) {
      const currentChat = chats.find(c => c.id === currentChatId);
      setMessages(currentChat?.messages || []);
    } else {
      setMessages([]);
    }
  }, [currentChatId, chats]);

  // ---------- TEXTAREA AUTO HEIGHT
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue, adjustTextareaHeight]);

  // ---------- SCROLL TO BOTTOM
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ---------- HELPERS
  const generateChatTitle = (message) => {
    const clean = message.replace(/[`*#]/g, '').trim();
    return clean.length <= 20 ? clean : clean.slice(0, 20) + '...';
  };

  const updateCurrentChatMessages = (newMessages) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === currentChatId
          ? { ...chat, messages: newMessages, lastUpdated: new Date().toISOString() }
          : chat
      )
    );
  };

  // Имитация ответа ИИ (пока нет реального wss)
  const simulateAIResponse = async (userText) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800 + Math.random() * 800));

    const linuxHints = {
      "pwd": "Покажет текущую директорию: `pwd`",
      "ls": "Список файлов: `ls` (базовый), детально: `ls -la`",
      "cd": "Переход по каталогам: `cd /path/to/dir`, назад: `cd -`",
      "apt": "Обновление пакетов Ubuntu: `sudo apt update && sudo apt upgrade`",
      "install": "Установка пакета (Debian/Ubuntu): `sudo apt install <pkg>`",
      "pacman": "Установка пакета (Arch/Manjaro): `sudo pacman -S <pkg>`",
      "chmod": "Смена прав: `chmod 755 файл`",
      "chown": "Смена владельца: `chown user:group файл`",
      "find": "Поиск: `find / -name \"имя\" 2>/dev/null`",
      "ping": "Проверка сети: `ping example.com`",
      "ps": "Процессы: `ps aux` или живой мониторинг: `top` / `htop`"
    };

    const lower = userText.toLowerCase();
    let reply = "Я помогу с командами Linux. Уточните: файлы, процессы, сеть, права или пакеты?";
    for (const [k, v] of Object.entries(linuxHints)) {
      if (lower.includes(k)) { reply = v; break; }
    }

    setIsLoading(false);
    return reply;
  };

  // ---------- ACTIONS
  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMsgs = [...messages, userMessage];
    setMessages(newMsgs);
    setInputValue('');

    let chatId = currentChatId;

    // Если это первое сообщение — создаём чат
    if (!currentChatId) {
      const newChat = {
        id: Date.now(),
        title: generateChatTitle(userMessage.text || 'Новый чат'),
        date: new Date().toLocaleDateString(),
        messages: [userMessage],
        lastUpdated: new Date().toISOString(),
        model: selectedModel
      };
      setChats(prev => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      chatId = newChat.id;
    } else {
      updateCurrentChatMessages(newMsgs);
    }

    const aiText = await simulateAIResponse(userMessage.text);
    const botMessage = {
      id: Date.now() + 1,
      role: 'assistant',
      text: aiText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      feedback: null
    };

    const final = [...newMsgs, botMessage];
    setMessages(final);

    // обновляем чат
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId ? { ...chat, messages: final, lastUpdated: new Date().toISOString() } : chat
      )
    );
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setInputValue('');
  };

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);
  };

  const requestDeleteChat = (chatId, e) => {
    e?.stopPropagation?.();
    setShowDeleteConfirm(chatId);
  };

  const handleConfirmDelete = () => {
    setChats(prev => prev.filter(c => c.id !== showDeleteConfirm));
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
      await apiLogout(); // POST /auth/logout (токены в заголовках), затем чистим локально
    } finally {
      localStorage.removeItem('tuxbot-chats');
      localStorage.removeItem('tuxbot-current-chat');
      navigate('/', { replace: true });
    }
  };
  const handleCancelLogout = () => setShowLogoutConfirm(false);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && inputValue.trim() && !isLoading) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFeedback = (messageId, feedbackType) => {
    const updated = messages.map(m => m.id === messageId ? { ...m, feedback: feedbackType } : m);
    setMessages(updated);
    if (currentChatId) {
      setChats(prev =>
        prev.map(chat =>
          chat.id === currentChatId ? { ...chat, messages: updated } : chat
        )
      );
    }
    // Имитация записи feedback в БД:
    console.log('message_feedbacks:', { messageId, feedback: feedbackType, model: selectedModel });
  };

  const handleRegenerate = async (messageId) => {
    const idx = messages.findIndex(m => m.id === messageId);
    if (idx > 0) {
      const userMsg = messages[idx - 1];
      if (userMsg.role === 'user') {
        const newMessages = messages.slice(0, idx);
        setMessages(newMessages);
        updateCurrentChatMessages(newMessages);

        const newAi = await simulateAIResponse(userMsg.text);
        const newBot = {
          id: Date.now(),
          role: 'assistant',
          text: newAi,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          feedback: null
        };

        const final = [...newMessages, newBot];
        setMessages(final);
        updateCurrentChatMessages(final);
      }
    }
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
        </div>

        {/* Список чатов */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {chats.length === 0 ? (
              <div className="text-center text-slate-500 py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">Нет сохраненных чатов</p>
                <p className="text-xs mt-2 text-slate-400">Начните новый диалог с TuxBot</p>
              </div>
            ) : (
              chats.map(chat => (
                <div
                  key={chat.id}
                  className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-300 group border-2 ${
                    currentChatId === chat.id
                      ? 'bg-blue-50/80 border-blue-200 shadow-md backdrop-blur-sm'
                      : 'bg-white/60 border-transparent hover:bg-white/80 hover:border-slate-200/60 backdrop-blur-sm'
                  }`}
                  onClick={() => handleSelectChat(chat.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 truncate mb-2">
                        {chat.title}
                      </div>
                      <div className="text-xs text-slate-500 flex justify-between items-center">
                        <span>{chat.date}</span>
                        <span className="bg-slate-100 px-2 py-1 rounded-full text-slate-600">
                          {chat.messages?.length || 0} сообщ.
                        </span>
                      </div>
                    </div>

                    {/* Удаление чата */}
                    <button
                      onClick={(e) => requestDeleteChat(chat.id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 ml-3 text-red-500 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-xl"
                      title="Удалить чат"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Выйти из аккаунта
          </button>
        </div>
      </div>

      {/* ПРАВАЯ ЧАСТЬ */}
      <div className="flex-1 flex flex-col">
        {/* Заголовок и выбор модели (для существующего чата) */}
        {currentChatId && (
          <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 px-8 py-6 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                  <PenguinAI className="w-full h-full" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">TuxBot AI Assistant</h1>
                  <p className="text-sm text-slate-600">Ваш помощник в мире Linux</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-600 font-medium">Модель:</span>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="border border-slate-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm shadow-sm hover:border-slate-400 transition-colors"
                >
                  {models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
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
            <p className="text-slate-600 mb-8">Чем сегодня я могу Вам помочь?</p>

            {/* Поле ввода */}
            <div className="w-full max-w-3xl bg-white/90 border border-slate-200 rounded-2xl p-4 shadow-lg">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Опишите задачу, например: «Как посмотреть размер файлов в текущей директории?»"
                className="w-full resize-none outline-none bg-transparent text-slate-800 placeholder-slate-400"
                rows={1}
              />
              {inputValue.trim() && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleSend}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-slate-700">Этот чат пуст — напишите свой первый вопрос.</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={msg.id}
                    onMouseEnter={() => setHoveredMessage(msg.id)}
                    onMouseLeave={() => setHoveredMessage(null)}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-3xl rounded-2xl px-4 py-3 shadow-sm border text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white border-blue-700'
                        : 'bg-white text-slate-800 border-slate-200'
                    }`}>
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                      <div className={`mt-2 text-[11px] ${msg.role === 'user' ? 'text-blue-100/90' : 'text-slate-400'}`}>{msg.timestamp}</div>

                      {/* Иконки лайк/дизлайк/регенерация для ответа бота */}
                      {msg.role === 'assistant' && (
                        <div className={`mt-2 flex items-center gap-2 transition-opacity ${hoveredMessage === msg.id ? 'opacity-100' : 'opacity-0'}`}>
                          <button
                            className={`px-2 py-1 rounded-lg border text-xs ${msg.feedback === 'like' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                            onClick={() => handleFeedback(msg.id, 'like')}
                            title="Полезно"
                          >
                            👍
                          </button>
                          <button
                            className={`px-2 py-1 rounded-lg border text-xs ${msg.feedback === 'dislike' ? 'bg-red-50 text-red-700 border-red-200' : 'text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                            onClick={() => handleFeedback(msg.id, 'dislike')}
                            title="Бесполезно"
                          >
                            👎
                          </button>
                          <button
                            className="px-2 py-1 rounded-lg border text-xs text-slate-500 border-slate-200 hover:bg-slate-50"
                            onClick={() => handleRegenerate(msg.id)}
                            title="Сгенерировать другой ответ"
                          >
                            🔁
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
                    <div className="text-xs text-slate-400">Нажмите Enter для отправки • Shift+Enter — новая строка</div>
                    <button
                      onClick={handleSend}
                      disabled={isLoading || !inputValue.trim()}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isLoading ? 'Генерация...' : 'Отправить'}
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
              <button onClick={handleCancelDelete} className="px-4 py-2 rounded-lg border">Нет</button>
              <button onClick={handleConfirmDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white">Да</button>
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
              <button onClick={handleCancelLogout} className="px-4 py-2 rounded-lg border">Нет</button>
              <button onClick={handleConfirmLogout} className="px-4 py-2 rounded-lg bg-slate-800 text-white">Да</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
