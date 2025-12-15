// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

// Улучшенный цветной пингвин с крутыми эффектами
const PenguinAI = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" className="flex-shrink-0 drop-shadow-2xl">
    {/* Анимированный градиентный фон */}
    <circle cx="50" cy="50" r="50" fill="url(#sphereGradient)">
      <animate attributeName="r" values="50;48;50;52;50" dur="4s" repeatCount="indefinite"/>
    </circle>
    
    {/* Вращающиеся кольца */}
    <g transform="rotate(0 50 50)">
      <circle cx="50" cy="50" r="45" fill="none" stroke="url(#ringGradient)" strokeWidth="2" strokeDasharray="4 4">
        <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="8s" repeatCount="indefinite"/>
      </circle>
    </g>
    
    {/* Тело пингвина */}
    <ellipse cx="50" cy="62" rx="24" ry="18" fill="#2D3748" stroke="#4A5568" strokeWidth="2"/>
    <ellipse cx="50" cy="56" rx="20" ry="14" fill="white"/>
    
    {/* Голова */}
    <circle cx="50" cy="35" r="16" fill="#2D3748" stroke="#4A5568" strokeWidth="2"/>
    <circle cx="50" cy="35" r="13" fill="white"/>
    
    {/* Белый живот с градиентом */}
    <path d="M32 50 Q50 68 68 50 L68 72 Q50 78 32 72 Z" fill="url(#bellyGradient)"/>
    
    {/* Глаза с анимацией */}
    <g className="animate-pulse">
      <circle cx="43" cy="33" r="3.5" fill="#1A202C">
        <animate attributeName="r" values="3.5;4;3.5" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="57" cy="33" r="3.5" fill="#1A202C">
        <animate attributeName="r" values="3.5;4;3.5" dur="2s" repeatCount="indefinite" begin="0.5s"/>
      </circle>
      
      {/* Блики в глазах */}
      <circle cx="44" cy="32" r="1.2" fill="white"/>
      <circle cx="58" cy="32" r="1.2" fill="white"/>
    </g>
    
    {/* Оранжевый клюв с свечением */}
    <path d="M45 40L55 40L50 45Z" fill="url(#beakGradient)" filter="url(#beakGlow)"/>
    
    {/* Оранжевые лапы с текстурой */}
    <ellipse cx="40" cy="72" rx="4" ry="2.5" fill="url(#feetGradient)"/>
    <ellipse cx="60" cy="72" rx="4" ry="2.5" fill="url(#feetGradient)"/>
    
    {/* Стильные акценты - пульсирующие нейросети */}
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
    
    {/* Терминал с анимированным кодом */}
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
    
    {/* Мигающий курсор */}
    <rect x="62" y="55" width="1" height="3" fill="#FFFFFF">
      <animate attributeName="opacity" values="1;0;1" dur="0.8s" repeatCount="indefinite"/>
    </rect>
    
    {/* Парящие квантовые частицы */}
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
    
    {/* Энергетические волны */}
    <g stroke="url(#waveGradient)" strokeWidth="2" fill="none" opacity="0.7">
      <circle cx="50" cy="50" r="40" strokeDasharray="5 5">
        <animate attributeName="r" values="40;43;40" dur="3s" repeatCount="indefinite"/>
        <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite"/>
      </circle>
    </g>

    {/* Градиенты и фильтры */}
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

export default function Header() {
  return (
    <header className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white shadow-2xl border-b border-blue-500/30 backdrop-blur-lg overflow-hidden">
      {/* Анимированные частицы фона */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background: `radial-gradient(circle, ${
                ['#4299E1', '#9F7AEA', '#48BB78', '#ED8936'][Math.floor(Math.random() * 4)]
              } 0%, transparent 70%)`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      {/* Плавающие градиентные сферы */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-600/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute -bottom-24 left-1/4 w-40 h-40 bg-cyan-500/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>

      <nav className="container mx-auto px-6 py-4 relative z-10">
        <div className="flex justify-between items-center">
          {/* Логотип с ультра-эффектами */}
          <Link 
            to="/" 
            className="flex items-center space-x-4 group transition-all duration-500 hover:scale-105"
          >
            <div className="relative">
              {/* Внешнее свечение */}
              <div className="absolute -inset-4 bg-blue-500/30 rounded-full blur-xl group-hover:bg-purple-500/40 transition-all duration-500"></div>
              {/* Вращающееся кольцо */}
              <div className="absolute -inset-3 border-2 border-blue-400/30 rounded-full animate-spin-slow">
                <div className="absolute -inset-1 bg-blue-400/20 rounded-full blur-sm"></div>
              </div>
              <PenguinAI />
            </div>
          </Link>
          
          {/* Навигация с крутыми эффектами */}
          <div className="flex items-center space-x-8">
            {/* Кнопка Главная с эффектом неоновой подсветки */}
            <Link 
              to="/" 
              className="relative font-bold text-blue-100 hover:text-white transition-all duration-500 group/nav px-6 py-3 rounded-2xl hover:bg-white/5 border border-blue-500/30 hover:border-cyan-400/50 backdrop-blur-sm"
            >
              <span className="relative z-10 flex items-center space-x-3">
                <span className="text-cyan-300 group-hover/nav:scale-110 transition-transform duration-300">⌂</span>
                <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">Главная</span>
              </span>
              
              {/* Неоновая подсветка */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 scale-0 group-hover/nav:scale-100 transition-transform duration-500"></div>
              
              {/* Сканирующая линия */}
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 group-hover/nav:w-full group-hover/nav:left-0 transition-all duration-500 shadow-lg shadow-cyan-400/50"></div>
              
              {/* Микро-частицы при наведении */}
              <div className="absolute -inset-1 rounded-2xl bg-cyan-400/10 blur-md opacity-0 group-hover/nav:opacity-100 transition-opacity duration-500"></div>
            </Link>
            
            {/* Кнопка Войти с эффектом электрических разрядов */}
            <Link 
              to="/auth/login" 
              className="relative font-bold text-green-100 hover:text-green-300 transition-all duration-500 group/nav px-6 py-3 rounded-2xl hover:bg-white/5 border border-green-500/30 hover:border-green-400/50 backdrop-blur-sm"
            >
              <span className="relative z-10 flex items-center space-x-3">
                <span className="text-green-300 group-hover/nav:scale-110 transition-transform duration-300">⚡</span>
                <span className="bg-gradient-to-r from-green-200 to-emerald-200 bg-clip-text text-transparent">Войти</span>
              </span>
              
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 scale-0 group-hover/nav:scale-100 transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover/nav:w-full group-hover/nav:left-0 transition-all duration-500 shadow-lg shadow-green-400/50"></div>
              <div className="absolute -inset-1 rounded-2xl bg-green-400/10 blur-md opacity-0 group-hover/nav:opacity-100 transition-opacity duration-500"></div>
              
              {/* Электрические искры */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-0.5 h-3 bg-green-400 rounded-full opacity-0 group-hover/nav:opacity-70"
                    style={{
                      left: `${20 + i * 60}%`,
                      top: '-10%',
                      animation: `spark ${0.6 + i * 0.2}s ease-out ${i * 0.3}s`
                    }}
                  />
                ))}
              </div>
            </Link>
            
            {/* Основная кнопка с эффектом плазмы */}
            <Link 
              to="/auth/register" 
              className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 text-white font-extrabold px-8 py-4 rounded-2xl shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-105 group/btn overflow-hidden border border-cyan-400/30 hover:border-cyan-300/50"
            >
              <span className="relative z-10 flex items-center space-x-3">
                <span className="group-hover/btn:scale-110 transition-transform duration-300">🚀</span>
                <span className="text-shadow">Регистрация</span>
              </span>
              
              {/* Плазменная волна */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"></div>
              
              {/* Плазменное свечение */}
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-cyan-400/30 via-purple-400/30 to-pink-400/30 blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover/btn:opacity-100"></div>
              
              {/* Взрыв частиц */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-8 bg-white rounded-full opacity-0 group-hover/btn:opacity-80"
                    style={{
                      left: `${15 + i * 25}%`,
                      top: '-20%',
                      transform: 'rotate(45deg)',
                      animation: `particleExplosion ${0.8 + i * 0.2}s ease-out ${i * 0.2}s`
                    }}
                  />
                ))}
              </div>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Анимированная градиентная граница */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500">
        <div className="h-full w-24 bg-white rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
      </div>

      <style>{`
        @keyframes spark {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(300%) translateX(${Math.random() > 0.5 ? '100%' : '-100%'}); opacity: 0; }
        }
        @keyframes particleExplosion {
          0% { transform: rotate(45deg) translateY(0) translateX(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: rotate(45deg) translateY(500%) translateX(${Math.random() > 0.5 ? '500%' : '-500%'}); opacity: 0; }
        }
        .animate-spin-slow { animation: spin 6s linear infinite; }
        .text-shadow { text-shadow: 0 2px 10px rgba(0,0,0,0.3); }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
}