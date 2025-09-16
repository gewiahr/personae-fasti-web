// components/Layout.tsx
import { ReactNode, useRef, useState } from 'react';
import { BurgerMenu } from './BurgerMenu';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LoginInfo } from '../types/request';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { NotificationProvider } from '../context/NotificationContext';
import NotificationPopup from './NotificationPopup';
import { burgerMenuItems } from '../assets/BurgerMenuContent';
import { BurgerMenuItemCallable } from './BurgerMenuItems';

export const Layout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { player, logout } = useAuth();
  const [ storedValue ] = useLocalStorage<LoginInfo | null>('playerInfo', null);
  const [ isMenuOpen, setIsMenuOpen ] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeBurgerMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      {isMenuOpen && (
        <div className="inset-0 z-40"/>
      )}

      {/* Header with burger menu */}
      <header className='sticky top-0 z-50'>
        <div className="bg-gray-800 p-4 flex justify-between items-center ">
          <div className='grid grid-cols-2 divide-x-2 items-center cursor-pointer' onClick={() => navigate("/")}>
            <p 
              className="px-4 text-xl font-bold">
                { storedValue?.currentGame?.title || "НРИ" }
            </p>
            <p 
              className="px-4 text-lg text-gray-400 font-bold">
                { `${player.username}` }
            </p>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 focus:outline-none"
            >
              <div className={`w-6 h-0.5 bg-white my-1.5 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-white my-1.5 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-white my-1.5 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </button>
          </div>
        </div>
        
        {isMenuOpen && 
        <div className="absolute 
                        max-sm:right-[5%] max-sm:top-20 max-sm:w-[90%] max-sm:text-lg max-sm:text-center max-sm:rounded-md max-sm:shadow-lg max-sm:border max-sm:border-gray-700
                        sm:right-14 sm:top-14 sm:w-[260px] sm:rounded-md sm:shadow-lg sm:border sm:border-gray-700 
                        focus:ring-blue-200 focus:border-blue-500 bg-gray-800 z-100">
          <BurgerMenu 
            items={[...burgerMenuItems, { name: `\xa0\xa0\xa0\xa0\xa0\xa0Выйти`, callable: logout } as BurgerMenuItemCallable]} 
            setClose={closeBurgerMenu}/>
        </div>}         
      </header>

      {/* Main content area */}
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