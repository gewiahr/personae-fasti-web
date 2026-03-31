import { type ReactNode, useState } from 'react';
import { BurgerMenu } from '../components/lib/BurgerMenu/BurgerMenu';
import { useAuth } from '../hooks/useAuth';
import { NotificationProvider } from '../context/NotificationContext';
import NotificationPopup from '../components/lib/NotificationPopup';
import { burgerMenuItems } from '../assets/BurgerMenuContent';
import { BurgerMenuItemCallable } from '../components/lib/BurgerMenu/BurgerMenuItems';
import { miniApp } from '@tma.js/sdk-react';
import HeaderWeb from './HeaderWeb';
import HeaderTMA from './HeaderTMA';
import MenuButton from './MenuButton';
import { useAppSelector } from '../store';
import { selectPlayerInfo } from '../reducers/PlayerSlice';
import { selectCurrentGameInfo } from '../reducers/CurrentGameSlice';

export const Layout = ({ children }: { children: ReactNode }) => {
  const { logout } = useAuth();

  const player = useAppSelector(selectPlayerInfo);
  const currentGame = useAppSelector(selectCurrentGameInfo);

  const [isMenuOpen, switchMenuOpen] = useState(false);

  const TMA = miniApp.ready.isAvailable();

  const closeBurgerMenu = () => switchMenuOpen(false);

  return (<>
    <div className="layout-main">
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/80 z-40" onClick={closeBurgerMenu} />
      )}

      <header className='layout-header'>
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

      <main className={`grow p-2 ${isMenuOpen ? 'pointer-events-none select-none' : ''} transition-all duration-200`}>
        <NotificationProvider>
          {children}
          <NotificationPopup />
        </NotificationProvider>
      </main>

      <footer className="layout-footer">
        <a href='https://github.com/gewiahr'>{`© ${new Date().getFullYear()} gewiahr (Tomasz Mozhny)`}</a>
      </footer>
    </div>
  </>);
};