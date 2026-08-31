import { type ReactNode, useState } from 'react';
import Header from './Header';
import Footer from './Footer';

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
        {children}
      </main>

      <Footer />
    </div>
  </>);
};