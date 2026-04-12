import { type ReactNode, useState } from 'react';
import { NotificationProvider } from '../context/NotificationContext';
import NotificationPopup from '../components/lib/NotificationPopup';
import Header from './Header';

export const Layout = ({ children }: { children: ReactNode }) => {
  const [isMenuOpen, switchMenuOpen] = useState(false);

  const closeBurgerMenu = () => switchMenuOpen(false);

  return (<>
    {isMenuOpen && (
      <div className="layout-overlay" onClick={closeBurgerMenu} />
    )}

    <div className="layout-main">
      <Header
        isMenuOpen={isMenuOpen}
        switchMenuOpen={() => switchMenuOpen(!isMenuOpen)}
        closeMenu={closeBurgerMenu}
      />

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