import { miniApp } from "@tma.js/sdk-react";
import { BurgerMenu } from "../components/lib/BurgerMenu/BurgerMenu";
import { resetCurrentGame, selectCurrentGameInfo } from "../reducers/CurrentGameSlice";
import { resetPlayer, selectAuthorization, selectPlayerInfo } from "../reducers/PlayerSlice";
import { useAppDispatch, useAppSelector } from "../store";
import HeaderTMA from "./HeaderTMA";
import HeaderWeb from "./HeaderWeb";
import MenuButton from "./MenuButton";
import { burgerMenuItems } from "../assets/BurgerMenuContent";
import type { BurgerMenuItemCallable } from "../components/lib/BurgerMenu/BurgerMenuItems";

type HeaderProps = {
  isMenuOpen: boolean;
  switchMenuOpen: () => void;
  closeMenu: () => void;
};

const Header: React.FC<HeaderProps> = ({ isMenuOpen, switchMenuOpen, closeMenu }) => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuthorization);
  const player = useAppSelector(selectPlayerInfo);
  const currentGame = useAppSelector(selectCurrentGameInfo);

  const TMA = miniApp.ready.isAvailable();

  const logout = async () => {
    console.log(auth);
    dispatch(resetPlayer());
    dispatch(resetCurrentGame());

    localStorage.clear();
    window.location.href = '/';
  }

  return (<header className='layout-header'>
    {TMA ?
      <HeaderTMA
        menuButton={<MenuButton isMenuOpen={isMenuOpen} buttonClick={switchMenuOpen} />}
        title={currentGame?.title}
        username={player?.username}
      /> :
      <HeaderWeb
        menuButton={<MenuButton isMenuOpen={isMenuOpen} buttonClick={switchMenuOpen} />}
        title={currentGame?.title}
        username={player?.username}
      />
    }

    {isMenuOpen &&
      <div className="burger-menu-container">
        <BurgerMenu
          items={[...burgerMenuItems, { name: `\xa0\xa0\xa0\xa0\xa0\xa0Выйти`, callable: logout } as BurgerMenuItemCallable]}
          setClose={closeMenu} />
      </div>}
  </header>);
};

export default Header;