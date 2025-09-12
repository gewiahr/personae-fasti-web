// components/Layout.tsx
import { ReactNode, useRef, useState } from 'react';
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
  const menuRef = useRef<HTMLDivElement>(null);

  const closeBurgerMenu = () => {
    setIsMenuOpen(false);
  };

  // Handle clicks outside the burger menu
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
  //       closeBurgerMenu();
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [isMenuOpen]);

  // Disable scrolling when menu is open
  // useEffect(() => {
  //   if (isMenuOpen) {
  //     document.body.style.overflow = 'hidden';
  //   } else {
  //     document.body.style.overflow = '';
  //   }
  // }, [isMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      {isMenuOpen && (
        <div className="inset-0 z-40"/>
      )}

      {/* Header with burger menu */}
      <header >
        <div className="bg-gray-800 p-4 flex justify-between items-center sticky top-0 z-50">
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
        
        <BurgerMenu isOpen={isMenuOpen} setClose={closeBurgerMenu}/>
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