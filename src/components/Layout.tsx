// components/Layout.tsx
import { ReactNode } from 'react';
import { BurgerMenu } from './BurgerMenu';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LoginInfo } from '../types/request';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Layout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const { player } = useAuth();
  const [ storedValue ] = useLocalStorage<LoginInfo | null>('playerInfo', null);

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
        <BurgerMenu />
      </header>

      {/* Main content area */}
      {/* <main className="container mx-auto p-4"> */}
      <main className="flex-grow p-4">       
        {children}
      </main>

      {/* Optional footer */}
      <footer className="bg-gray-800 p-4 text-center text-sm text-gray-400">
        {`© ${new Date().getFullYear()} gewiahr (Tomasz Mozhny)`}
      </footer>
    </div>
  );
};