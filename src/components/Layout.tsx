// components/Layout.tsx
import { ReactNode } from 'react';
import { BurgerMenu } from './BurgerMenu';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LoginInfo } from '../types/request';
import { useNavigate } from 'react-router-dom';

export const Layout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [ storedValue ] = useLocalStorage<LoginInfo | null>('playerInfo', null);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header with burger menu */}
      <header className="bg-gray-800 p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 
          className="text-xl font-bold"
          onClick={() => navigate("/")}>
            { storedValue?.currentGame?.title || "НРИ" }
        </h1>
        <BurgerMenu />
      </header>

      {/* Main content area */}
      <main className="container mx-auto p-4">
        {children}
      </main>

      {/* Optional footer */}
      <footer className="bg-gray-800 p-4 text-center text-sm text-gray-400">
        {`© ${new Date().getFullYear()} gewiahr (Tomasz Mozhny)`}
      </footer>
    </div>
  );
};