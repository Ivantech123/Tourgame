
import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { TrainersGallery } from './components/TrainersGallery';
import { AuthModal } from './components/AuthModal';
import { ProfilePage } from './components/ProfilePage';
import { apiUpdateUser } from './api';

export interface User {
  email: string;
  nickname: string;
  balance: number;
  avatar: string;
  bio?: string;
  id: string;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'trainers' | 'profile'>('home');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleNavigateToTrainers = () => {
    setCurrentView('trainers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToProfile = () => {
    if (user) {
      setCurrentView('profile');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = (authUser: User) => {
    setUser(authUser);
    setIsAuthModalOpen(false);
  };

  const handleUpdateUser = async (updatedFields: Partial<User>) => {
    if (!user) return;
    try {
      const { user: savedUser } = await apiUpdateUser(user.id, updatedFields);
      setUser(savedUser);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось сохранить профиль';
      alert(message);
    }
  };

  const handlePlayClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative transition-colors duration-500">
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-900/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-violet-800/10 blur-[120px] rounded-full"></div>
      </div>

      <Navbar 
        onHomeClick={handleNavigateHome} 
        onProfileClick={handleNavigateToProfile}
        onLoginClick={() => setIsAuthModalOpen(true)}
        user={user}
      />
      
      <main className="flex-grow flex flex-col z-10 pt-20">
        {currentView === 'home' ? (
          <>
            <Hero onPlayClick={handlePlayClick} isLoggedIn={!!user} />
            <Features onTrainingClick={handleNavigateToTrainers} />
            <HeroCarousel />
          </>
        ) : currentView === 'trainers' ? (
          <TrainersGallery onBack={handleNavigateHome} userId={user?.id ?? null} />
        ) : (
          <ProfilePage user={user!} onUpdate={handleUpdateUser} onBack={handleNavigateHome} />
        )}
      </main>

      <footer className="py-12 text-center text-slate-500 border-t border-white/5 mt-auto z-10 bg-black/20">
        <p className="text-sm tracking-widest uppercase font-medium">© 2024 Tourgame. Вершина твоего мастерства.</p>
      </footer>

      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)} 
          onSuccess={handleAuthSuccess} 
        />
      )}
    </div>
  );
};

export default App;
