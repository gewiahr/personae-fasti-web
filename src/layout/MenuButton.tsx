import React from 'react';

type MenuButtonProps = {
  isMenuOpen: boolean;
  buttonClick: () => void;
};

const MenuButton: React.FC<MenuButtonProps> = ({ isMenuOpen, buttonClick }) => {
  return (
    <button
      onClick={buttonClick}
      className="p-2 cursor-pointer focus:outline-none"
    >
      <div className={`w-6 h-0.5 bg-white my-1.5 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
      <div className={`w-6 h-0.5 bg-white my-1.5 transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
      <div className={`w-6 h-0.5 bg-white my-1.5 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
    </button>
  )
};

export default MenuButton;
