import { useEffect, useState } from 'react';
import { SelectInput } from '../components/lib/Inputs/SelectInput';
import { useAuth } from '../hooks/useAuth'
import type { GameInfo, GameFullInfo } from '../types/request';
import { api } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import FoldableCategory from '../components/lib/FoldableCategory';
import { ToggleSwitch } from '../components/lib/ToggleSwitch';
import "../styles/components.css";
import { useSettings } from '../hooks/useSettings';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { authorization } = useAuth();
  const { game, setGame, player, playerGames, updateSettings } = useSettings();
  //const { data : settingsData } = useApi.get<PlayerSettings>("/player/settings", authorization);
  //const [ playerGames ] = useState<GameInfo[]>([]);
  const [editedCurrentGame, setEditedCurrentGame] = useState<GameFullInfo | null>(game);

  const { addNotification } = useNotifications();

  useEffect(() => {
    updateSettings();
  }, []);

  useEffect(() => {
    setEditedCurrentGame(game);
  })

  const handleChangeCurrentGame = async (value: string) => {
    const { data, error } = await api.put<GameFullInfo>("/player/game", authorization, { gameID: Number(value) });
    if (error) {
      addNotification(error.message, 'error')
      return;
    } else if (data) {
      setGame(data);
      navigate(0);
    }
  };

  const handleNewSession = async () => {
    const { error, status } = await api.post<GameInfo>("/game/session/new", authorization, null);
    if (error) {
      addNotification(error.message, 'error');
      return;
    }

    if (status === 201) {
      addNotification('Началась новая сессия', 'success');
    }
  };

  const handleChangeGameOption = (value: any, field: string) => {
    if (!editedCurrentGame) return
    if (!(field in editedCurrentGame?.settings)) return

    var newGameSettings = { ...editedCurrentGame.settings }
    newGameSettings[field as keyof typeof editedCurrentGame.settings] = value
    console.log(newGameSettings);
    setEditedCurrentGame({ ...editedCurrentGame, settings: newGameSettings } as GameFullInfo);
  };

  const handleSaveGameSettings = async () => {
    if (!editedCurrentGame) return
    console.log(editedCurrentGame);
    const { data, error } = await api.put<GameFullInfo>("/game/settings", authorization, { ...editedCurrentGame.settings, gameID: editedCurrentGame.id });
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
          <p className='text-sm'>Текущая игра:</p>
          <div className='flex justify-between items-center'>
            {game && <div className=''>
              {playerGames && playerGames.length > 1 ? <SelectInput
                key={playerGames.length}
                options={playerGames?.
                  filter((pg) => pg.id != game.id).
                  map((pg) => { return { key: pg.id, value: pg.title } }) || []}
                label='Текущая игра'
                labelBGColor='bg-gray-900'
                value={game.title}
                entityEdit={{ handleFieldChange: handleChangeCurrentGame }}
              /> :
                <>
                  <h2 className='text-xl'>{game.title}</h2>
                </>}
            </div>}
            <div className='flex gap-2'>
              <button className='btn' onClick={() => navigate(`/game/${game ? game.id : 0 }`)}>
                Ред.
              </button>
              <button className='btn' onClick={() => navigate("/game/new")}>
                +
              </button>
            </div>
          </div>
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
            entityEdit={{ handleFieldChange: (value) => handleChangeGameOption(value, 'allowAllEditRecords') }}
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
