import { useEffect, useState } from 'react';
import { SelectInput } from '../components/lib/Inputs/SelectInput';
import type { GameFullInfo, GameInfo } from '../types/request';
import { api } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import FoldableCategory from '../components/lib/FoldableCategory';
import { ToggleSwitch } from '../components/lib/ToggleSwitch';
//import "../styles/components.css";
import { useAppDispatch, useAppSelector } from '../store';
import { loadPlayerGames, selectAuthorization, selectPlayerGames, selectPlayerInfo, selectPlayerInvites } from '../reducers/PlayerSlice';
import { changeCurrentGame, selectCurrentGame, startNewSession } from '../reducers/CurrentGameSlice';
import SubmitButton from '../components/lib/SubmitButton';
import CopyText from '../components/lib/CopyText';
import Icon from '../components/icons/Icon';
//import { SelectItems } from '../components/lib/SelectItems';

const SettingsPage = () => {
  const navigate = useNavigate();
  //const { authorization } = useAuth();
  //const { data : settingsData } = useApi.get<PlayerSettings>("/player/settings", authorization);
  //const [ playerGames ] = useState<GameInfo[]>([]);


  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuthorization);
  const player = useAppSelector(selectPlayerInfo);
  const playerGames = useAppSelector(selectPlayerGames);
  const playerInvites = useAppSelector(selectPlayerInvites);
  const { game } = useAppSelector(selectCurrentGame);

  const [editedCurrentGame, setEditedCurrentGame] = useState<GameFullInfo | null>(game);

  const { addNotification } = useNotifications();

  useEffect(() => {
    dispatch(loadPlayerGames({ auth }));
  }, []);

  useEffect(() => {
    setEditedCurrentGame(game);
  })

  const handleChangeCurrentGame = (value: string) => {
    dispatch(changeCurrentGame({ auth, gameID: Number(value) }))
      .unwrap()
      .catch((e: any) => {
        addNotification(e.message, 'error');
      });
  };

  const handleNewSession = () => {
    dispatch(startNewSession({ auth }))
      .unwrap()
      .then(() => {
        addNotification('Началась новая сессия', 'success');
      }).catch((e: any) => {
        addNotification(e.message, 'error');
      });
  };

  const handleChangeGameOption = (value: any, field: string) => {
    if (!editedCurrentGame) return
    if (!(field in editedCurrentGame?.settings)) return

    var newGameSettings = { ...editedCurrentGame.settings }
    newGameSettings[field as keyof typeof editedCurrentGame.settings] = value
    setEditedCurrentGame({ ...editedCurrentGame, settings: newGameSettings } as GameFullInfo);
  };

  const handleSaveGameSettings = async () => {
    if (!editedCurrentGame) return
    const { data, error } = await api.put<GameFullInfo>("/game/settings", auth, { ...editedCurrentGame.settings, gameID: editedCurrentGame.id });
    if (error) {
      addNotification(error.message, 'error');
      return;
    } else if (data) {
      addNotification("Настройки сохранены", 'success');
      //setGame(data)
      // await setCurrentGame(data);
      // await setLoginInfo({ ...loginInfo!, currentGame: data });
    }
  };

  const handleInviteAccept = async (invite: GameInfo) => {
    const { error, status } = await api.post(`/player/invite/accept/${invite.id}`, auth, null);
    if (error) {
      addNotification(`Ошибка: ${error.message}`, 'error');
      return;
    } else if (status === 200) {
      addNotification(`Вы приняли приглашение на игру "${invite.title}"`, 'success');
      dispatch(loadPlayerGames({ auth }));
    };   
  };

  const handleInviteRefuse = async (invite: GameInfo) => {
    const { error, status } = await api.post(`/player/invite/refuse/${invite.id}`, auth, null);
    if (error) {
      addNotification(`Ошибка: ${error.message}`, 'error');
      return;
    } else if (status === 200) {
      addNotification(`Вы отклонили приглашение на игру "${invite.title}"`, 'warning');
      dispatch(loadPlayerGames({ auth }));
    };   
  };

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <div className='flex flex-col gap-y-6'>
        {/* <h2 className='text-xl'>{player?.username}</h2> */}

        <FoldableCategory key="game_invites" title={`Приглашений: ${playerInvites.length}`}>
          {playerInvites.length <= 0 ? <div className='flex flex-col gap-4 justify-center items-center text-center'>
            <p className='italic'>Вы не приглашены ни в одну игру. Поделитесь своим именем пользователя чтобы мастер игры мог вас пригласить</p>
            <CopyText text={player!.username} />
          </div> : <div className='flex flex-col gap-6'>
            {playerInvites.map((invite) => <div className='flex flex-1 gap-6 justify-between items-center'>
              <p>{invite.title}</p>
              <div className='flex gap-6'>
                <Icon name='submit' className='icon-button-accented' onClick={() => handleInviteAccept(invite)} />
                <Icon name='trash' className='icon-button-danger' onClick={() => handleInviteRefuse(invite)} />
              </div>
            </div>)}  
          </div>}
        </FoldableCategory>

        <div>
          <p className='text-sm'>Текущая игра:</p>
          <div className='grid grid-cols-4 gap-8 justify-between items-center'>
            {game && <div className='col-span-3'>
              {playerGames && playerGames.length > 0 ? <SelectInput
                key={playerGames.length}
                options={playerGames?.
                  filter((pg) => pg.id != game.id).
                  map((pg) => { return { key: pg.id, value: pg.title } }) || []}
                //label='Текущая игра'
                labelBGColor='bg-gray-900'
                value={game.title}
                entityEdit={{ handleFieldChange: handleChangeCurrentGame }}

              /> :
              <h2 className='text-xl'>{game.title}</h2>}
            </div>}
            <div className='flex gap-2 justify-end'>
              <SubmitButton key={`settingspage_submitbutton_editgame`} onClick={() => navigate(`/game/${game ? game.id : 0}`)}>
                Ред.
              </SubmitButton>
              <SubmitButton key={`settingspage_submitbutton_newgame`} onClick={() => navigate("/game/new")}>
                +
              </SubmitButton>
            </div>
          </div>
        </div>

        {game?.gmID === player?.id && <FoldableCategory key="sessions_settings" title='Сессии'>
          <SubmitButton className='w-full mt-2' onClick={handleNewSession} >
            {"Начать новую сессию"}
          </SubmitButton>
        </FoldableCategory>}

        {game && game.settings && game.gmID === player?.id && <>
          <ToggleSwitch
            key={"gamesettings_alloweditrecord"}
            label='Разрешить редактировать записи всем игрокам'
            labelPosition='right'
            setValue={game.settings.allowAllEditRecords}
            entityEdit={{ handleFieldChange: (value) => handleChangeGameOption(value, 'allowAllEditRecords') }}
          />
          <SubmitButton
            key={`settingspage_submitbutton_save`}
            className='w-full mt-2' 
            onClick={handleSaveGameSettings}
          >
            Сохранить
          </SubmitButton>
        </>}

        {/* <SelectItems
          items={[
            { key: 1, value: 'red', content: <div className="w-16 h-8 bg-red-500 border-2 border-white rounded" /> },
            { key: 2, value: 'blue', content: <div className="w-16 h-8 bg-blue-500 border-2 border-white rounded" /> },
            { key: 3, value: 'green', content: <div className="w-16 h-8 bg-green-500 border-2 border-white rounded" /> },
          ]}
          borderWidth={4}
          animationDuration={200}
        /> */}
      </div>
    </div>
  )
};

export default SettingsPage;
