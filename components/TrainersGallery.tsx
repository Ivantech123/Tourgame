
import React, { useState } from 'react';
import { BookingForm } from './BookingForm';

interface Trainer {
  id: number;
  name: string;
  specialization: string;
  rating: number;
  reviews: number;
  price: string;
  avatar: string;
}

const TRAINERS_DATA: Trainer[] = [
  {
    id: 1,
    name: 'Алексей "Zilean" Волков',
    specialization: 'Middle Lane Expert',
    rating: 4.9,
    reviews: 142,
    price: '1 500 ₽/час',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Елена "Valkyrie" Ким',
    specialization: 'Support & Utility Mastery',
    rating: 5.0,
    reviews: 89,
    price: '2 000 ₽/час',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Дмитрий "Steel" Рогов',
    specialization: 'Jungle & Strategy',
    rating: 4.8,
    reviews: 215,
    price: '1 200 ₽/час',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: 4,
    name: 'Артур "Sniper" Морозов',
    specialization: 'ADC / Dragon Lane',
    rating: 4.7,
    reviews: 110,
    price: '1 800 ₽/час',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: 5,
    name: 'Мария "Frost" Белова',
    specialization: 'Solo Lane Specialist',
    rating: 4.9,
    reviews: 76,
    price: '1 600 ₽/час',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: 6,
    name: 'Игорь "Titan" Соколов',
    specialization: 'Tank & Macro Game',
    rating: 4.6,
    reviews: 54,
    price: '1 000 ₽/час',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&h=300&auto=format&fit=crop'
  }
];

interface TrainersGalleryProps {
  onBack: () => void;
  userId: string | null;
}

export const TrainersGallery: React.FC<TrainersGalleryProps> = ({ onBack, userId }) => {
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);

  return (
    <section className="px-6 md:px-12 py-12 animate-in fade-in duration-700 relative">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-10 flex items-center text-purple-400 hover:text-purple-300 transition-colors font-bold uppercase tracking-widest text-xs group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Вернуться назад
        </button>

        <div className="text-center mb-16">
          <h2 className="font-orbitron text-4xl md:text-5xl font-black mb-6 glow-text tracking-tighter">
            ЛУЧШИЕ НАСТАВНИКИ
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Выбери профессионала, который поможет тебе поднять ранг, освоить новые механики и стать легендой Wild Rift.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TRAINERS_DATA.map((trainer) => (
            <div key={trainer.id} className="glass-card p-6 rounded-[2rem] border-purple-500/10 hover:border-purple-500/40 transition-all duration-500 group">
              <div className="relative mb-6">
                <div className="w-full h-48 rounded-2xl overflow-hidden border border-white/5">
                  <img src={trainer.avatar} alt={trainer.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center">
                  <span className="text-amber-400 mr-1">★</span>
                  <span className="text-xs font-bold text-white">{trainer.rating}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-xl font-bold font-orbitron text-white group-hover:text-purple-300 transition-colors">
                  {trainer.name}
                </h4>
                <p className="text-purple-400 text-xs font-bold tracking-widest uppercase mt-1">
                  {trainer.specialization}
                </p>
              </div>

              <div className="flex items-center text-slate-400 text-sm mb-6 pb-6 border-b border-white/5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {trainer.reviews} отзывов
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Стоимость</p>
                  <p className="text-lg font-orbitron font-bold text-white">{trainer.price}</p>
                </div>
                <button 
                  onClick={() => setSelectedTrainer(trainer)}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                >
                  Записаться
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedTrainer && (
        <BookingForm 
          trainer={selectedTrainer} 
          userId={userId}
          onClose={() => setSelectedTrainer(null)} 
        />
      )}
    </section>
  );
};
