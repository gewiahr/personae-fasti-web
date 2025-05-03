import { useEffect, useState } from 'react';
import { SelectInput } from '../components/SelectInput';
import { useAuth } from '../hooks/useAuth'
import { GameInfo, LoginInfo, PlayerSettings } from '../types/request';
import { useApi } from '../hooks/useApi';
import { api } from '../utils/api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { accessKey, player } = useAuth();
  const [ loginInfo, setLoginInfo ] = useLocalStorage<LoginInfo | null>('playerInfo', null);
  const { data : settingsData } = useApi.get<PlayerSettings>("/player/settings", accessKey);
  const [ playerGames, setPlayerGames ] = useState<GameInfo[]>([]);
  const [ currentGame, setCurrentGame ] = useState<GameInfo>(); 

  useEffect(() => {
    if (settingsData) {
      setPlayerGames(settingsData.playerGames);
      setCurrentGame(settingsData.currentGame);
    }
  }, [settingsData]);

  const handleChangeCurrentGame = async (value : string) => {
    const { data, error } = await api.put<GameInfo>("/player/game", accessKey, { gameID: Number(value) });
    if (error) {
      console.log(error);
      return;
    } else if (data) {
      console.log(data);
      setCurrentGame(data);
      setLoginInfo({ ...loginInfo!, currentGame: data });
      navigate(0);
    }  
  };

  return (
    <div className='flex flex-col gap-y-6'>
      <h2 className='text-xl'>{player.username}</h2>
      <div>
        {currentGame && playerGames && 
          <SelectInput 
            key={playerGames.length} 
            options={playerGames?.
              filter((game) => game.id != currentGame.id).
              map((game) => { return { key: game.id, value: game.title } }) || []} 
            label='Текущая игра' 
            value={currentGame?.title} 
            entityEdit={{ handleFieldChange: handleChangeCurrentGame }} 
          />
        }
      </div>
    </div>
  )
}

export default SettingsPage;
