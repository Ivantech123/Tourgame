
import React, { useState, useRef } from 'react';
import { User } from '../App';

interface ProfilePageProps {
  user: User;
  onUpdate: (fields: Partial<User>) => void | Promise<void>;
  onBack: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdate, onBack }) => {
  const [nickname, setNickname] = useState(user.nickname);
  const [bio, setBio] = useState(user.bio || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    await onUpdate({ nickname, bio, avatar });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Файл слишком большой. Максимальный размер 2МБ.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="px-6 md:px-12 py-12 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-10 flex items-center text-purple-400 hover:text-purple-300 transition-colors font-bold uppercase tracking-widest text-xs group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Вернуться на главную
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Avatar & Account */}
          <div className="space-y-8">
            <div className="glass-card p-8 rounded-[2rem] border-purple-500/20 text-center">
              <div className="relative inline-block mb-6 group">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div 
                  onClick={handleAvatarClick}
                  className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)] cursor-pointer relative"
                >
                  <img src={avatar} alt={user.nickname} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[8px] font-bold text-white uppercase tracking-tighter">Загрузить</span>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-orbitron font-black text-white mb-1">{user.nickname}</h2>
              <p className="text-slate-500 text-xs uppercase tracking-widest mb-6">{user.email}</p>
              
              <div className="bg-purple-600/10 border border-purple-500/20 rounded-2xl p-6">
                <p className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.2em] mb-2">Ваш баланс</p>
                <p className="text-3xl font-orbitron font-black text-white">{user.balance.toLocaleString()} ₽</p>
                <button className="w-full mt-4 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                  Пополнить счет
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Settings */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-10 rounded-[2rem] border-purple-500/10">
              <h3 className="text-xl font-orbitron font-bold text-white mb-8 border-b border-white/5 pb-4">Настройки профиля</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Имя пользователя (Никнейм)</label>
                  <input 
                    type="text" 
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">О себе (Био)</label>
                  <textarea 
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    placeholder="Расскажите о своих игровых достижениях..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Фотография профиля</label>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={handleAvatarClick}
                      className="flex-1 bg-slate-900 border border-white/10 rounded-xl p-4 text-white text-left hover:border-purple-500 transition-colors flex items-center justify-between"
                    >
                      <span className="text-sm text-slate-400">Нажмите, чтобы выбрать файл...</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </button>
                    {avatar.startsWith('data:') && (
                      <button 
                        onClick={() => setAvatar('https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200&h=200&auto=format&fit=crop')}
                        className="p-4 text-red-400 hover:text-red-300 transition-colors"
                        title="Сбросить"
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button 
                    onClick={handleSave}
                    className="px-10 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl text-white font-orbitron font-bold tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                  >
                    Сохранить изменения
                  </button>
                  {isSaved && <span className="text-green-400 text-xs font-bold animate-pulse">Сохранено!</span>}
                </div>
              </div>
            </div>

            <div className="glass-card p-10 rounded-[2.5rem] border-purple-500/10">
               <h3 className="text-xl font-orbitron font-bold text-white mb-6">Достижения</h3>
               <div className="flex flex-wrap gap-4 opacity-30 grayscale">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center w-24">
                    <span className="text-3xl mb-2">🥇</span>
                    <span className="text-[10px] font-bold text-center">Первая победа</span>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center w-24">
                    <span className="text-3xl mb-2">🔥</span>
                    <span className="text-[10px] font-bold text-center">Стрик 10</span>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center w-24">
                    <span className="text-3xl mb-2">💎</span>
                    <span className="text-[10px] font-bold text-center">Донатер</span>
                  </div>
               </div>
               <p className="text-slate-500 text-xs mt-6 italic">Здесь будут отображаться ваши награды за участие в турнирах и тренировках.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
