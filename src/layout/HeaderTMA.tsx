import React, { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom';

type HeaderWebProps = {
  menuButton: ReactNode;
  title?: string;
  username?: string;
  //menuRef: React.Ref<HTMLDivElement>;
}

const HeaderTMA: React.FC<HeaderWebProps> = ({ title = "НРИ", username = "user", menuButton }) => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center w-full'>
      <div className={`w-full h-(--tg-viewport-safe-area-inset-top)`}></div> {/* style={{height: `var(--tg-viewport-safe-area-inset-top)`}}></div> */}
      <div className={`px-4 text-xl h-(--tg-viewport-content-safe-area-inset-top) content-center text-gray-400 font-bold w-full text-center`}> {/* style={{height: `var(--tg-viewport-content-safe-area-inset-top)`}}> */}
        {username}
      </div>
      <div className={`flex justify-between items-center content-center w-full h-12 gap-4`}>
        {/* {couldReturnToPreviousPage && <button className='cursor-pointer' onClick={returnToPreviousPage}>
          {`<<`}
        </button>} */}
        <p className="text-lg font-bold flex-1 min-w-0" onClick={() => navigate("/")}>
          {title}
        </p>
        <div className="relative shrink-0">
          {menuButton}
        </div>
      </div>
    </div>

    // {isMenuOpen &&
    //   <div className="absolute
    //                   max-sm:right-[5%] max-sm:w-[90%] max-sm:text-lg max-sm:text-center max-sm:rounded-md max-sm:shadow-lg max-sm:border max-sm:border-gray-700
    //                   sm:right-14 sm:w-[260px] sm:rounded-md sm:shadow-lg sm:border sm:border-gray-700 
    //                   focus:ring-blue-200 focus:border-blue-500 bg-gray-800 z-100"
    //     style={{ top: `calc((var(--tg-viewport-safe-area-inset-top) + var(--tg-viewport-content-safe-area-inset-top) + (var(--spacing) * 12)) * 0.95)` }}>
    //     <BurgerMenu
    //       items={[...burgerMenuItems, { name: `\xa0\xa0\xa0\xa0\xa0\xa0Выйти`, callable: logout } as BurgerMenuItemCallable]}
    //       setClose={closeBurgerMenu} />
    //   </div>}
  )
}

export default HeaderTMA
