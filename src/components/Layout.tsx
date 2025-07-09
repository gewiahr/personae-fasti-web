// components/Layout.tsx
import { ReactNode, useState } from 'react';
import { BurgerMenu } from './BurgerMenu';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LoginInfo } from '../types/request';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { NotificationProvider } from '../context/NotificationContext';
import NotificationPopup from './NotificationPopup';

export const Layout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { player } = useAuth();
  const [ storedValue ] = useLocalStorage<LoginInfo | null>('playerInfo', null);
  const [ isMenuOpen, setIsMenuOpen ] = useState(false);

  const closeBurgerMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      {/* Header with burger menu */}
      <header className="bg-gray-800 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className='grid grid-cols-2 divide-x-2 items-center' onClick={() => navigate("/")}>
          <p 
            className="px-4 text-xl font-bold">
              { storedValue?.currentGame?.title || "НРИ" }
          </p>
          <p 
            className="px-4 text-lg text-gray-400 font-bold">
              { `${player.username}` }
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 focus:outline-none"
          >
            <div className={`w-6 h-0.5 bg-white my-1.5 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-white my-1.5 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-white my-1.5 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </button>
        </div>
      </header>

      <BurgerMenu isOpen={isMenuOpen} setClose={closeBurgerMenu}/>

      {/* Main content area */}
      {/* <main className="container mx-auto p-4"> */}
      <main className={`flex-grow p-4 ${isMenuOpen ? 'blur-xs' : 'blur-none'} transition-all duration-200`}> 
        <NotificationProvider>
          {children}
          <NotificationPopup />
        </NotificationProvider>      
        
      </main>

      {/* Optional footer */}
      <footer className="bg-gray-800 p-4 text-center text-sm text-gray-400">
        {`© ${new Date().getFullYear()} gewiahr (Tomasz Mozhny)`}
      </footer>
    </div>
  );
};