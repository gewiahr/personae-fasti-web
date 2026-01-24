import { type ReactNode, useState } from 'react';
import { BurgerMenu } from '../components/lib/BurgerMenu';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { GameFullInfo } from '../types/request';
import { useAuth } from '../hooks/useAuth';
import { NotificationProvider } from '../context/NotificationContext';
import NotificationPopup from '../components/lib/NotificationPopup';
import { burgerMenuItems } from '../assets/BurgerMenuContent';
import { BurgerMenuItemCallable } from '../components/lib/BurgerMenuItems';
import { miniApp } from '@tma.js/sdk-react';
import { useSettings } from '../hooks/useSettings';
import HeaderWeb from './HeaderWeb';
import HeaderTMA from './HeaderTMA';
import MenuButton from './MenuButton';

export const Layout = ({ children }: { children: ReactNode }) => {
  //const navigate = useNavigate();
  const { logout } = useAuth();
  const { player } = useSettings();
  const [currentGame] = useLocalStorage<GameFullInfo | null>('currentGame', null);
  const [isMenuOpen, switchMenuOpen] = useState(false);

  const TMA = miniApp.ready.isAvailable();

  const closeBurgerMenu = () => {
    switchMenuOpen(false);
  };

  // const couldReturnToPreviousPage = window.location.pathname.split("/").length > 2;

  // const returnToPreviousPage = () => {
  //   var arrayPath = window.location.pathname.split("/");
  //   arrayPath.pop();
  //   navigate(arrayPath.join("/") + "s");
  // };

  return (<>
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      {isMenuOpen && (
        <div className="inset-0 z-40" />
      )}

      <header className='sticky top-0 z-50 bg-gray-800 p-4'>
        {TMA ?
          <HeaderTMA
            menuButton={<MenuButton isMenuOpen={isMenuOpen} buttonClick={() => switchMenuOpen(!isMenuOpen)} />}
            title={currentGame?.title}
            username={player?.username}
          /> :
          <HeaderWeb
            menuButton={<MenuButton isMenuOpen={isMenuOpen} buttonClick={() => switchMenuOpen(!isMenuOpen)} />}
            title={currentGame?.title}
            username={player?.username}
          />
        }

        {isMenuOpen &&
          <div className="absolute 
                        max-sm:right-[5%] max-sm:top-20 max-sm:w-[90%] max-sm:text-lg max-sm:text-center max-sm:rounded-md max-sm:shadow-lg max-sm:border max-sm:border-gray-700
                        sm:right-14 sm:top-14 sm:w-65 sm:rounded-md sm:shadow-lg sm:border sm:border-gray-700 
                        focus:ring-blue-200 focus:border-blue-500 bg-gray-800 z-100">
            <BurgerMenu
              items={[...burgerMenuItems, { name: `\xa0\xa0\xa0\xa0\xa0\xa0Выйти`, callable: logout } as BurgerMenuItemCallable]}
              setClose={closeBurgerMenu} />
          </div>}
      </header>

      <main className={`grow p-4 ${isMenuOpen ? 'blur-xs' : 'blur-none'} transition-all duration-200`}>
        <NotificationProvider>
          {children}
          <NotificationPopup />
        </NotificationProvider>
      </main>

      <footer className="bg-gray-800 p-4 text-center text-sm text-gray-400">
        <a href='https://github.com/gewiahr'>{`© ${new Date().getFullYear()} gewiahr (Tomasz Mozhny)`}</a>
      </footer>
    </div>
  </>);
};