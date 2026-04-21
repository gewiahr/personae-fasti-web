import { useEffect, useState } from 'react';
import { InputField } from '../components/lib/Inputs/InputField';
import { useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { api } from '../utils/api';
import type { Game } from '../types/game';
import { useAppDispatch, useAppSelector } from '../store';
import { selectAuthorization, selectPlayerInfo } from '../reducers/PlayerSlice';
import type { GameFullInfo, GamePage, PlayerInfo } from '../types/request';
import { LoadingPage } from './LoadingPage';
import SubmitButton from '../components/lib/SubmitButton';
import { ListInput, type ListInputItem } from '../components/lib/Inputs/ListInput';
import { useNotifications } from '../context/NotificationContext';
import FoldableCategory from '../components/lib/FoldableCategory';
import { ToggleSwitch } from '../components/lib/ToggleSwitch';
import { updateGameSettings } from '../reducers/CurrentGameSlice';
import Icon from '../components/icons/Icon';

const GameCreateEditPage: React.FC = () => {
  const { id } = useParams();

  const newGame = !id;

  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuthorization);
  const player = useAppSelector(selectPlayerInfo);

  const { addNotification } = useNotifications();

  const [game, setGame] = useState<GameFullInfo>();
  const [loading, setLoading] = useState<boolean>(!newGame);
  const [error, setError] = useState<string>("");
  const { data: pageData, refetch: refetchPageData, error: pageError } = useApi.get<GamePage>(`/game/${id}`, auth, [], newGame);

  useEffect(() => {
    if (pageData) {
      console.log(pageData)
      setGame(pageData.game);
      setLoading(false);
    };
  }, [pageData]);

  const handleFieldChange = (value: string, field?: string) => {
    if (!field) return
    setGame(prev => prev ? { ...prev, [field]: value } : { title: "" } as GameFullInfo);
    setError("");
  };

  const saveEdited = async (editedGame: GameFullInfo) => {
    if (!editedGame || editedGame.title == "") return;

    // ** Join in one endpoint call ** //
    setLoading(true);
    
    const method = newGame ? api.post : api.put;
    const { error } = await method<Game>("/game", auth, game);
    if (!error) window.location.href = `/settings`; //id ? `/settings` : `/`; //navigate(data?.id ? `/settings` : `/`);
    else setError(error.message);

    if (game) dispatch(updateGameSettings({ auth, gameID: game.id, settings: game.settings }))
      .catch((e) => addNotification(e.message, 'error'))
      .then(() =>  addNotification("Настройки сохранены", 'success'));
    
    setLoading(false);
    // ** Join in one endpoint call ** //
  };

  const handleInvite = async (username: string) => {
    const { error } = await api.post(`/game/invite/${username}`, auth, null);  
    if (error) {
      addNotification(error.message, 'error');      
      return "ошибка";
    };

    refetchPageData();
    return "приглашен(a)"; 
  };

  const handleOnDeleteFromPlayersList = async (player: PlayerInfo, invite: boolean = false) => {
    
  }

  return (
    <div className='max-w-4xl mx-auto p-4'>
      {loading ? (
        <LoadingPage />
      ) : !newGame && (pageError || !game) ? (
        <p>Данные недоступны</p>
      ) : (
        <>
          <div className='flex flex-col'>
            <InputField
              className="mb-4"
              label={`Название игры`}
              value={game?.title}
              entityEdit={({ fieldName: 'title', handleFieldChange })}
              error={error || ""}
            />

            <ListInput
              label='Игроки'
              addButtonLabel='Добавить игрока'
              setOptions={pageData?.players.map((p) => { return { key: p.id, value: p.username, onDelete: p.id === player?.id ? undefined : () => handleOnDeleteFromPlayersList(p) } as ListInputItem })
                                           .concat(pageData?.invites.map((i) => { return { key: i.id, value: i.username, status: "приглашен(-а)", onDelete: () => handleOnDeleteFromPlayersList(i, true) } as ListInputItem }))
                                           .sort((a, b) => a.key - b.key)}
              onAdd={(username) => handleInvite(username)}
              onAddLabel='Пригласить'
              onAddStatus='отправка...'
            />

            {game && <>
              <FoldableCategory key="sessions_settings" title={`Сессии: ${game.sessions.length}`}>
                <div className='flex gap-2'>
                  <SubmitButton className='w-full mb-6' onClick={() => {}} >
                    {"Новая сессия"}
                  </SubmitButton>
                  <SubmitButton className='w-full mb-6' onClick={() => {}} danger >
                    {"Удалить"}
                  </SubmitButton>
                </div>
                {game.sessions.length <= 0 ? <div className='flex flex-col gap-4 justify-center items-center text-center'>
                  <p className='italic'>В игре пока нет ни одной сессии</p>
                </div> : <div className='flex flex-col gap-4'>
                  {game.sessions.sort((a, b) => b.number - a.number).map((session, i) => <div className='flex flex-1 gap-6 justify-between items-center'>
                    <div className='flex gap-2 items-center'>
                      <p className='w-4'>{session.number}</p>
                      <p className={`${session.name == "" ? 'italic text-(--color-text-gray)' : '' }`}>{session.name == "" ? `Сессия #${session.number}` : session.name}</p>
                    </div> 
                    <div className='flex gap-6'>
                      <p>{game.sessions[i+1]?.endTime != null ? new Date(game.sessions[i+1].endTime).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: '2-digit' }) : ''}</p>
                      <Icon name='edit' className='icon-button-accented' onClick={() => {}} />
                      {/* <Icon name='trash' className='icon-button-danger' onClick={() => {}} /> */}
                    </div>
                  </div>)}  
                </div>}
                <div>

                </div>
              </FoldableCategory>

              <ToggleSwitch
                key={"gamesettings_alloweditrecord"}
                label='Разрешить редактировать записи всем игрокам'
                labelPosition='right'
                setValue={game.settings.allowAllEditRecords}
                entityEdit={{ handleFieldChange: (value) => setGame({ ...game, settings: { ...game.settings, allowAllEditRecords: value as boolean } }) }}
              />
            </>}

            <SubmitButton 
              className='mt-6'
              disabled={game?.title == ""}
              onClick={() => { if (!game || game?.title == "") return; saveEdited(game) }}              
            >
              {game?.title == "" ? "Введите название игры" : game?.id ? "Применить" : "Создать"}
            </SubmitButton>
          </div>
        </>
      )}
    </div>
  );
};

export default GameCreateEditPage;