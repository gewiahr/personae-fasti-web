// components/BurgerMenu.tsx
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { CharMetaData, LocationMetaData, NPCMetaData } from '../types/entities';
import { config } from '../utils/config';

interface BurgerMunuProps {
  isOpen: boolean,
  setClose: () => void
}

export const BurgerMenu = ({ isOpen, setClose } : BurgerMunuProps) => {
  
  const { logout } = useAuth();

  const compendiumPath = config.compendiumBaseUrl

  const menuItems = [
    { name: "\xa0\xa0\xa0\xa0\xa0\xa0События", path: '/', internal: true },
    { name: `${CharMetaData.Icon} Герои`, path: '/chars', internal: true },
    { name: `${NPCMetaData.Icon} Персонажи`, path: '/npcs', internal: true },
    { name: `${LocationMetaData.Icon} Локации`, path: '/locations', internal: true },
    { name: `📜 Квесты`, path: '/quests', internal: true },
    { name: '\xa0\xa0\xa0\xa0\xa0\xa0Настройки', path: '/settings', internal: true },
    { name: `📚 Правила`, path: `${compendiumPath}/`, internal: false },
    { name: `🔨 Предметы`, path: `${compendiumPath}/things`, internal: false },
  ];

  return (
    <div>
      {isOpen && (
        <div className="absolute 
                        max-sm:right-[5%] max-sm:top-20 max-sm:w-[90%] max-sm:text-lg max-sm:text-center max-sm:rounded-md max-sm:shadow-lg max-sm:border max-sm:border-gray-700
                        sm:right-14 sm:top-14 sm:w-[260px] sm:rounded-md sm:shadow-lg sm:border sm:border-gray-700 
                        focus:ring-blue-200 focus:border-blue-500 bg-gray-800 z-100">
          {menuItems.map((item) => (item.internal ?
            <Link
              key={item.path}
              to={item.path}
              className="block px-4 max-sm:py-4 sm:py-2 text-white hover:bg-gray-700 rounded-md"
              onClick={setClose}
            >
              <div className='flex items-center justify-between'>
                <p className='text-left'>{item.name}</p>
                {/* <Icon name='arrowDown' className=''/> */}
              </div>
            </Link> :
            <button
              onClick={() => window.location.href=`${item.path}`}
              className="block cursor-pointer w-full px-4 max-sm:py-4 sm:py-2 text-white text-left hover:bg-gray-700 rounded-md"
            >
              <div className='flex items-center justify-between'>
                <p className='text-left'>{item.name}</p>
              </div>
            </button>
          ))}
          <button
            onClick={logout}
            className="block cursor-pointer w-full px-4 max-sm:py-4 sm:py-2 text-white text-left hover:bg-gray-700 rounded-md"
          >
            <div className='flex items-center justify-between px-2'>
              <p className='text-left'>{'\xa0\xa0\xa0\xa0\xa0\xa0Выйти'}</p>
            </div>         
          </button>
        </div>
      )}
    </div> 
  );
};