import React, { useState, useEffect } from 'react';
import { apiCreateBooking } from '../api';

interface Trainer {
  id: number;
  name: string;
}

interface BookingFormProps {
  trainer: Trainer;
  onClose: () => void;
  userId: string | null;
}

const GAME_CHARACTERS: Record<string, string[]> = {
  'Dota 2': ['Pudge', 'Invoker', 'Juggernaut', 'Crystal Maiden', 'Phantom Assassin', 'Rubick'],
  'Wild Rift': ['Ahri', 'Yasuo', 'Lux', 'Jinx', 'Garen', 'Lee Sin', 'Akali'],
  'Mobile Legends': ['Layla', 'Miya', 'Zilong', 'Alucard', 'Fanny', 'Gusion']
};

const TIME_SLOTS = [
  '10:00 - 11:00', '11:30 - 12:30', '14:00 - 15:00',
  '15:30 - 16:30', '17:00 - 18:00', '19:00 - 20:00',
  '20:30 - 21:30'
];

export const BookingForm: React.FC<BookingFormProps> = ({ trainer, onClose, userId }) => {
  const [duration, setDuration] = useState<'30' | '60'>('60');
  const [game, setGame] = useState('Wild Rift');
  const [character, setCharacter] = useState('');
  const [level, setLevel] = useState(5);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCharacter(GAME_CHARACTERS[game][0]);
  }, [game]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert('Сначала войдите в аккаунт, чтобы записаться.');
      return;
    }

    try {
      setIsSubmitting(true);
      await apiCreateBooking({
        userId,
        trainerId: trainer.id,
        trainerName: trainer.name,
        game,
        character,
        durationMinutes: Number(duration),
        level,
        timeSlot: selectedSlot,
      });

      alert(`Заявка отправлена. Тренер: ${trainer.name}, слот: ${selectedSlot}`);
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось создать запись';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="glass-card w-full max-w-2xl rounded-[2.5rem] p-8 md:p-12 relative border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.2)] overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="font-orbitron text-3xl font-black mb-2 text-white glow-text uppercase tracking-tighter">
          Запись на занятие
        </h2>
        <p className="text-purple-400 font-bold text-sm uppercase tracking-widest mb-8">
          Тренер: {trainer.name}
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Длительность</label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: '30', label: '30 минут' },
                { id: '60', label: '1 час' }
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDuration(d.id as '30' | '60')}
                  className={`py-4 rounded-xl border font-bold transition-all ${
                    duration === d.id
                    ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Выбор игры</label>
              <select
                value={game}
                onChange={(e) => setGame(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer"
              >
                {Object.keys(GAME_CHARACTERS).map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Персонаж</label>
              <select
                value={character}
                onChange={(e) => setCharacter(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer"
              >
                {GAME_CHARACTERS[game].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Ваш текущий уровень</label>
              <span className="text-2xl font-orbitron font-black text-purple-400">{level} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Доступное время (сегодня)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-3 px-2 rounded-lg border text-xs font-bold transition-all ${
                    selectedSlot === slot
                    ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedSlot || isSubmitting}
            className="w-full py-6 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-2xl text-white font-orbitron font-bold tracking-[0.3em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Отправка...' : 'Подтвердить запись'}
          </button>
        </form>
      </div>
    </div>
  );
};
