import { useEffect, useState } from 'react';
import { SelectInput } from '../components/SelectInput';
import { useAuth } from '../hooks/useAuth'
import { GameInfo, GameFullInfo } from '../types/request';
import { api } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import FoldableCategory from '../components/FoldableCategory';
import { ToggleSwitch } from '../components/ToggleSwitch';
import "../styles/components.css";
import { useSettings } from '../hooks/useSettings';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { accessKey } = useAuth();
  const { game, setGame, player, updateGame } = useSettings();
  //const { data : settingsData } = useApi.get<PlayerSettings>("/player/settings", accessKey);
  const [ playerGames ] = useState<GameInfo[]>([]);
  const [ editedCurrentGame, setEditedCurrentGame ] = useState<GameFullInfo | null>(game);

  const { addNotification } = useNotifications();

  useEffect(() => {
    updateGame();
    console.log("game update!")
  }, []);

  useEffect(() => {
    setEditedCurrentGame(game);
    console.log("game updated and setting!")
  })

  const handleChangeCurrentGame = async (value : string) => {
    const { data, error } = await api.put<GameFullInfo>("/player/game", accessKey, { gameID: Number(value) });
    if (error) {
      addNotification(error.message, 'error')
      return;
    } else if (data) {
      setGame(data);
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
  };

  const handleChangeGameOption = (value : any, field : string) => {
    if (!editedCurrentGame) return
    if (!(field in editedCurrentGame?.settings)) return
    
    var newGameSettings = {...editedCurrentGame.settings}
    newGameSettings[field as keyof typeof editedCurrentGame.settings] = value
    console.log(newGameSettings);
    setEditedCurrentGame({...editedCurrentGame, settings: newGameSettings} as GameFullInfo);  
  };

  const handleSaveGameSettings = async () => {
    if (!editedCurrentGame) return
    console.log(editedCurrentGame);
    const { data, error } = await api.put<GameFullInfo>("/game/settings", accessKey, { ...editedCurrentGame.settings, gameID: editedCurrentGame.id });
    if (error) {
      addNotification(error.message, 'error');
      return;
    } else if (data) {
      addNotification("Настройки сохранены", 'success');
      setGame(data)
      // await setCurrentGame(data);
      // await setLoginInfo({ ...loginInfo!, currentGame: data });
    }  
  };

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <div className='flex flex-col gap-y-6'>
        <h2 className='text-xl'>{player?.username}</h2>

        <div>
          {game && <>
              {playerGames.length > 1 ? <SelectInput 
                key={playerGames.length} 
                options={playerGames?.
                  filter((pg) => pg.id != game.id).
                  map((pg) => { return { key: pg.id, value: pg.title } }) || []} 
                label='Текущая игра'
                bgColor='bg-gray-900' 
                setValue={game.title} 
                entityEdit={{ handleFieldChange: handleChangeCurrentGame }} 
              /> : 
              <>
                <p className='text-sm'>Текущая игра:</p>
                <h2 className='text-xl'>{game.title}</h2>
              </>}
          </>}
        </div>

        {game?.gmID === player?.id && <FoldableCategory key="sessions_settings" title='Сессии' children={
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2 py-2 px-4 rounded"
            onClick={handleNewSession}
          >
            {"Начать новую сессию"}
          </button>}
        />}

        {game && game.settings && game.gmID === player?.id && <>
          <ToggleSwitch 
            key={"gamesettings_alloweditrecord"} 
            label='Разрешить редактировать записи всем игрокам'
            labelPosition='right'
            setValue={game.settings.allowAllEditRecords}
            entityEdit={{ handleFieldChange : (value) => handleChangeGameOption(value, 'allowAllEditRecords') }}
          />
          <button className='w-full btn mt-4' onClick={handleSaveGameSettings}>
            Сохранить
          </button>
        </>}
      </div>
    </div>
  )
};

export default SettingsPage;
