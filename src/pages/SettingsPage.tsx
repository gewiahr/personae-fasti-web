import { useEffect, useState } from 'react';
import { SelectInput } from '../components/SelectInput';
import { useAuth } from '../hooks/useAuth'
import { GameInfo, LoginInfo, PlayerSettings } from '../types/request';
import { useApi } from '../hooks/useApi';
import { api } from '../utils/api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import FoldableCategory from '../components/FoldableCategory';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { accessKey, player, game } = useAuth();
  const [ loginInfo, setLoginInfo ] = useLocalStorage<LoginInfo | null>('playerInfo', null);
  const { data : settingsData } = useApi.get<PlayerSettings>("/player/settings", accessKey);
  const [ playerGames, setPlayerGames ] = useState<GameInfo[]>([]);
  const [ currentGame, setCurrentGame ] = useState<GameInfo>(); 

  const { addNotification } = useNotifications();

  useEffect(() => {
    if (settingsData) {
      setPlayerGames(settingsData.playerGames);
      setCurrentGame(settingsData.currentGame);
    }
  }, [settingsData]);

  const handleChangeCurrentGame = async (value : string) => {
    const { data, error } = await api.put<GameInfo>("/player/game", accessKey, { gameID: Number(value) });
    if (error) {
      addNotification(error.message, 'error')
      return;
    } else if (data) {
      setCurrentGame(data);
      setLoginInfo({ ...loginInfo!, currentGame: data });
      navigate(0);
    }  
  };

  const handleNewSession = async () => { 
    const { error, status } = await api.post<GameInfo>("/game/session/new", accessKey, null);
    if (error) {
      addNotification(error.message, 'error');
      return;
    } 

    if (status === 201) {
      addNotification('Началась новая сессия', 'success');
    }   
  }

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <div className='flex flex-col gap-y-6'>

        <h2 className='text-xl'>{player.username}</h2>

        <div>
          {currentGame && 
            <>
              {playerGames.length > 1 ? 
              <SelectInput 
                key={playerGames.length} 
                options={playerGames?.
                  filter((game) => game.id != currentGame.id).
                  map((game) => { return { key: game.id, value: game.title } }) || []} 
                label='Текущая игра' 
                value={currentGame.title} 
                entityEdit={{ handleFieldChange: handleChangeCurrentGame }} 
              /> : 
              <>
                <p className='text-sm'>Текущая игра:</p>
                <h2 className='text-xl'>{currentGame.title}</h2>
              </>}
            </>
          }
        </div>

        {game.gmID === player.id &&
          <FoldableCategory key="sessions_settings" title='Сессии' children={
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2 py-2 px-4 rounded"
              onClick={handleNewSession}
            >
              {"Начать новую сессию"}
            </button>}
          />
        }
      </div>
    </div>
  )
}

export default SettingsPage;
