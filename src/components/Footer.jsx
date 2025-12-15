import React from 'react';
export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-10 border-t border-blue-400/30 shadow-2xl">
      <div className="container mx-auto px-6">
        {/* Контактная информация */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex flex-wrap justify-center gap-8">
            {/* Телефон */}
            <a href="tel:+79999999999" className="flex items-center space-x-3 group transition-all duration-300 hover:scale-110">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center group-hover:bg-green-500/30 transition-all duration-300">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-cyan-200 text-sm">Телефон</p>
                <p className="text-white font-semibold group-hover:text-green-300 transition-colors duration-300">+7 (999) 999-99-99</p>
              </div>
            </a>

            {/* Email */}
            <a href="mailto:support@tuxbot.com" className="flex items-center space-x-3 group transition-all duration-300 hover:scale-110">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-all duration-300">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-cyan-200 text-sm">Email</p>
                <p className="text-white font-semibold group-hover:text-blue-300 transition-colors duration-300">support@tuxbot.com</p>
              </div>
            </a>

            {/* Telegram */}
            <a href="https://t.me/tuxbot_support" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 group transition-all duration-300 hover:scale-110">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center group-hover:bg-cyan-500/30 transition-all duration-300">
                <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="text-cyan-200 text-sm">Telegram</p>
                <p className="text-white font-semibold group-hover:text-cyan-300 transition-colors duration-300">@tuxbot_support</p>
              </div>
            </a>

            {/* GitHub */}
            <a href="https://github.com/tuxbot" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 group transition-all duration-300 hover:scale-110">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:bg-purple-500/30 transition-all duration-300">
                <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="text-cyan-200 text-sm">GitHub</p>
                <p className="text-white font-semibold group-hover:text-purple-300 transition-colors duration-300">tuxbot</p>
              </div>
            </a>
          </div>
        </div>

        {/* Копирайт и права */}
        <div className="pt-8 border-t border-blue-500/30 text-center relative">
          {/* Декоративные элементы */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
          
          <p className="text-cyan-200 font-medium mb-3 text-lg">
            © 2025 TuxBot - AI помощник для терминала Linux. Все права защищены.
          </p>
          
          <div className="flex justify-center items-center space-x-6 mt-4 mb-4">
            <div className="flex items-center space-x-2 group cursor-default">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🐧</span>
              <span className="text-cyan-200 group-hover:text-white transition-colors duration-300">GNU/Linux</span>
            </div>
            
            <div className="flex items-center space-x-2 group cursor-default">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">⚡</span>
              <span className="text-cyan-200 group-hover:text-white transition-colors duration-300">Быстрые ответы</span>
            </div>
            
            <div className="flex items-center space-x-2 group cursor-default">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🔒</span>
              <span className="text-cyan-200 group-hover:text-white transition-colors duration-300">Безопасность</span>
            </div>
          </div>

          <div className="mt-4">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}