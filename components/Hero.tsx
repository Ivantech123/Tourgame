
import React from 'react';

interface HeroProps {
  onPlayClick: () => void;
  isLoggedIn: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onPlayClick, isLoggedIn }) => {
  return (
    <section className="relative pt-40 pb-16 md:pt-56 md:pb-24 px-6 flex flex-col items-center text-center overflow-hidden">
      {/* Animated Glow behind title */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/20 blur-[180px] pointer-events-none rounded-[100%]"></div>
      
      <h1 className="font-orbitron text-7xl md:text-9xl font-black tracking-tighter mb-8 glow-text">
        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-purple-100 to-purple-400">
          TOURGAME
        </span>
      </h1>
      
      {!isLoggedIn && (
        <div className="relative group mt-4">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-violet-600 rounded-xl blur-lg opacity-40 group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>
          <button 
            onClick={onPlayClick}
            className="relative px-16 py-6 bg-slate-950 rounded-xl text-2xl font-orbitron font-bold tracking-[0.3em] text-white group-hover:text-purple-300 transition-all duration-300 border border-purple-500/20"
          >
            PLAY
          </button>
        </div>
      )}

      <p className="mt-14 text-slate-400 max-w-3xl text-lg font-light leading-relaxed tracking-wide">
        Ваш путь к профессиональному киберспорту. <span className="text-purple-400 font-medium">Тренируйся</span>, побеждай в <span className="text-fuchsia-400 font-medium">турнирах</span> и доминируй в <span className="text-violet-400 font-medium">дуэлях</span> на самой современной платформе для геймеров.
      </p>
    </section>
  );
};
