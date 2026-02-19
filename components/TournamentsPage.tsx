import React, { useState } from "react";
import { apiRegisterTournament } from "../clientApi";

interface TournamentsPageProps {
  onBack: () => void;
  userId: string | null;
  onRequireAuth: () => void;
}

const TOURNAMENTS = [
  {
    code: "WR_WEEKEND_CUP",
    title: "Weekend Wild Rift Cup",
    prize: "20 000 ₽",
    date: "Суббота, 19:00",
    fee: "Бесплатно",
  },
  {
    code: "MLBB_PRO_AM",
    title: "MLBB Pro-Am 5x5",
    prize: "35 000 ₽",
    date: "Воскресенье, 18:00",
    fee: "500 ₽",
  },
  {
    code: "DOTA_RISING_STARS",
    title: "Dota Rising Stars",
    prize: "50 000 ₽",
    date: "Пятница, 20:30",
    fee: "1 000 ₽",
  },
];

export const TournamentsPage: React.FC<TournamentsPageProps> = ({ onBack, userId, onRequireAuth }) => {
  const [loadingCode, setLoadingCode] = useState<string | null>(null);

  const handleRegister = async (code: string, title: string) => {
    if (!userId) {
      onRequireAuth();
      return;
    }

    try {
      setLoadingCode(code);
      await apiRegisterTournament({
        userId,
        tournamentCode: code,
        tournamentTitle: title,
      });
      alert(`Вы успешно записаны на турнир: ${title}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ошибка записи на турнир";
      alert(message);
    } finally {
      setLoadingCode(null);
    }
  };

  return (
    <section className="px-6 md:px-12 py-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="mb-10 flex items-center text-purple-400 hover:text-purple-300 transition-colors font-bold uppercase tracking-widest text-xs group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          На главную
        </button>

        <div className="text-center mb-14">
          <h2 className="font-orbitron text-4xl md:text-5xl font-black mb-4 glow-text tracking-tighter">Турниры</h2>
          <p className="text-slate-400">Запишись на ближайший турнир и соревнуйся за призовой фонд.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {TOURNAMENTS.map((t) => (
            <article key={t.code} className="glass-card p-8 rounded-[2rem] border-purple-500/20">
              <h3 className="text-2xl font-orbitron font-bold text-white mb-5">{t.title}</h3>
              <div className="space-y-3 text-slate-300 mb-8">
                <p className="text-sm">Призовой фонд: <span className="text-purple-300 font-bold">{t.prize}</span></p>
                <p className="text-sm">Старт: <span className="font-bold">{t.date}</span></p>
                <p className="text-sm">Взнос: <span className="font-bold">{t.fee}</span></p>
              </div>
              <button
                onClick={() => handleRegister(t.code, t.title)}
                disabled={loadingCode === t.code}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl text-white font-orbitron font-bold tracking-[0.2em] uppercase disabled:opacity-60"
              >
                {loadingCode === t.code ? "Запись..." : "Записаться"}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

