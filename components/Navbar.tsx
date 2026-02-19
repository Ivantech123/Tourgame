
import React from 'react';
import { User } from '../App';

interface NavbarProps {
  onHomeClick: () => void;
  onProfileClick: () => void;
  onLoginClick: () => void;
  user: User | null;
}

export const Navbar: React.FC<NavbarProps> = ({ onHomeClick, onProfileClick, onLoginClick, user }) => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-slate-950/70 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center space-x-2 cursor-pointer group" onClick={onHomeClick}>
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:scale-110 transition-transform">
          <span className="text-white font-bold text-sm">TG</span>
        </div>
        <span className="hidden sm:block text-xl font-orbitron font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-slate-400">
          TOURGAME
        </span>
      </div>
      
      <div className="hidden lg:flex items-center space-x-10 text-xs font-bold tracking-[0.2em] uppercase text-slate-300">
        <button onClick={onHomeClick} className="hover:text-purple-400 transition-colors uppercase">Главная</button>
        <a href="#" className="hover:text-purple-400 transition-colors">Турниры</a>
        <a href="#" className="hover:text-purple-400 transition-colors">Тренинги</a>
        <a href="#" className="hover:text-purple-400 transition-colors">Сообщество</a>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <div className="flex items-center space-x-4 bg-white/5 p-1 pr-4 rounded-full border border-white/10 hover:border-purple-500/30 transition-all">
            <div 
              onClick={onProfileClick}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500 cursor-pointer hover:scale-105 transition-transform"
            >
              <img src={user.avatar} alt={user.nickname} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{user.nickname}</span>
              <span className="text-sm font-orbitron font-bold text-purple-400">{user.balance.toLocaleString()} ₽</span>
            </div>
          </div>
        ) : (
          <button 
            onClick={onLoginClick}
            className="px-6 py-2 rounded-full border border-purple-500/30 hover:border-purple-500 bg-purple-500/10 hover:bg-purple-500/20 transition-all text-xs font-bold uppercase tracking-widest"
          >
            Войти
          </button>
        )}
      </div>
    </nav>
  );
};
