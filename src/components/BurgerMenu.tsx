// components/BurgerMenu.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CharMetaData, LocationMetaData, NPCMetaData } from '../types/entities';
import { config } from '../utils/config';

export const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();

  const compendiumPath = config.compendiumBaseUrl

  const menuItems = [
    { name: 'События', path: '/' },
    { name: `${CharMetaData.Icon} Герои`, path: '/chars' },
    { name: `${NPCMetaData.Icon} Персонажи`, path: '/npcs' },
    { name: `${LocationMetaData.Icon} Локации`, path: '/locations' },
    { name: 'Настройки', path: '/settings' },
    // Add more categories as needed
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 focus:outline-none"
      >
        <div className={`w-6 h-0.5 bg-white my-1.5 transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
        <div className={`w-6 h-0.5 bg-white my-1.5 transition-all ${isOpen ? 'opacity-0' : ''}`}></div>
        <div className={`w-6 h-0.5 bg-white my-1.5 transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
      </button>

      {/* {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block px-4 py-2 text-white hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={logout}
            className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
          >
            Выйти
          </button>
        </div>
      )} */}

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block px-4 py-2 text-white hover:bg-gray-700"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={() => window.location.href=`${compendiumPath}`}
            className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
          >
            📜 Правила
          </button>
          <button
            onClick={() => window.location.href=`${compendiumPath}/things`}
            className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
          >
            🔨 Предметы
          </button>
          <button
            onClick={logout}
            className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  );
};