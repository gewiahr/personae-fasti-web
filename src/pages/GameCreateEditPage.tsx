import { useEffect, useRef, useState } from 'react';
import { InputField } from '../components/lib/Inputs/InputField';
import { useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { api } from '../utils/api';
import type { Game } from '../types/game';
import { useAppDispatch, useAppSelector } from '../store';
import { selectAuthorization, selectPlayerInfo } from '../reducers/PlayerSlice';
import type { GameFullInfo, GamePage, PlayerInfo, SessionEdit } from '../types/request';
import { LoadingPage } from './LoadingPage';
import SubmitButton from '../components/lib/SubmitButton';
import { ListInput, type ListInputItem } from '../components/lib/Inputs/ListInput';
import { useNotifications } from '../context/NotificationContext';
import FoldableCategory from '../components/lib/FoldableCategory';
import { ToggleSwitch } from '../components/lib/ToggleSwitch';
import { editSession, removeLastSession, revokeInvite, startNewSession, updateGameSettings } from '../reducers/CurrentGameSlice';
import Icon from '../components/icons/Icon';
import dayjs from 'dayjs';
import ConfirmButton from '../components/lib/ConfirmButton';
import { LuCheck, LuUndo2 } from 'react-icons/lu';

const GameCreateEditPage: React.FC = () => {
  const { id } = useParams();

  const newGame = !id;

  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuthorization);
  const player = useAppSelector(selectPlayerInfo);

  const { addNotification } = useNotifications();

  const [game, setGame] = useState<GameFullInfo>({title: ''} as GameFullInfo);
  const [loading, setLoading] = useState<boolean>(!newGame);
  const [error, setError] = useState<string>("");
  const { data: pageData, refetch: refetchPageData, error: pageError } = useApi.get<GamePage>(`/game/${id}`, auth, [], newGame);

  const [sessionEditItem, setSessionEditItem] = useState<SessionEdit | null>(null);

  const sessionEditNameRef = useRef<HTMLInputElement>(null);
  const sessionEditDateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pageData) {
      setGame(pageData.game);
      setLoading(false);
    };
  }, [pageData]);

  useEffect(() => {
    if (!newGame && !sessionEditDateRef.current) sessionEditNameRef.current?.focus();
    if (newGame) sessionEditNameRef.current?.focus();
  }, [sessionEditItem]);

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
    const { data, error } = await method<Game>("/game", auth, game);
    if (error) {
      setError(error.message);
      setLoading(false);
      return
    } else {
      window.location.href = newGame && data ? `/game/${data.id}` : `/settings`; //id ? `/settings` : `/`; //navigate(data?.id ? `/settings` : `/`);}
    }

    if (game) dispatch(updateGameSettings({ auth, gameID: game.id, settings: game.settings }))
      // .catch((e) => addNotification(e.message, 'error'))
      // .then(() =>  addNotification("Настройки сохранены", 'success'));
    
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

  const handleNewSession = () => {
    dispatch(startNewSession({ auth }))
      .unwrap()
      .then(() => {
        addNotification('Началась новая сессия', 'success');
        refetchPageData();
      }).catch((e: any) => {
        addNotification(e.message, 'error');
      });
  };

  const handleDeleteSession = () => {
    dispatch(removeLastSession({ auth }))
      .unwrap()
      .then(() => {
        addNotification('Последняя сессия удалена', 'info');
        refetchPageData();
      }).catch((e: any) => {
        addNotification(e.message, 'error');
      }); 
  };

  const handleEditSession = async (sessionIndex: number) => {
    if (sessionEditItem === null) return false;

    const sessionStartTime = new Date(sessionEditItem.startTime).valueOf();
    const sessionEndTime = new Date(game.sessions[sessionIndex]?.endTime).valueOf();

    if (sessionStartTime < new Date(game.sessions[sessionIndex+2]?.endTime).valueOf()) {
      addNotification(`Сессия не может начинаться раньше предыдущей (не раньше ${new Date(game.sessions[sessionIndex+2]?.endTime).toLocaleString()})`, 'warning');
      return false;
    } else if (sessionEndTime != 0 && sessionStartTime > sessionEndTime) {
      addNotification(`Сессия не может начинаться позже следующей (не позже ${new Date(game.sessions[sessionIndex]?.endTime).toLocaleString()}})`, 'warning');
      return false;
    }

    var sessionStartTimeString;
    try {
      sessionStartTimeString = dayjs(sessionEditItem.startTime).utc().toISOString()
    } catch (e: any) {
      addNotification('Неверная дата', 'error');
      return false; 
    }

    try {
      await dispatch(editSession({ auth, sessionUpdate: { ...sessionEditItem, startTime: sessionStartTimeString } })).unwrap()
    } catch (e: any) {
      addNotification(e.message, 'error');
      return false;
    }

    addNotification('Сессия изменена', 'success');
    refetchPageData();
    return true;
  };

  const handleOnDeleteFromPlayersList = async (player: PlayerInfo, invite: boolean = false) => {
    if (invite) {
      dispatch(revokeInvite({ auth, username: player.username }))
        .unwrap()
        .then(() => {
          addNotification('Приглашение отозвано', 'success');
          refetchPageData();
        }).catch((e: any) => {
          addNotification(e.message, 'error');
        });
    }
  };

  // const toLocaleStringDate = (date?: string, short: boolean) => {
  //   const dateOptions = short ? { day: '2-digit', month: '2-digit', year: '2-digit' } : { day: '2-digit', month: '2-digit', year: 'numeric',  } 
  //   return new Date(date || "").toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: '2-digit',  })
  // }

  const toDateTimeLocal = (isoString?: string) => {
    if (!isoString) return '';
    return dayjs.utc(isoString).local().format('YYYY-MM-DDTHH:mm');
  };

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

            {!newGame && <ListInput
              label='Игроки'
              addButtonLabel='Добавить игрока'
              setOptions={pageData?.players.map((p) => { return { key: p.id, value: p.username, onDelete: p.id === player?.id ? undefined : () => handleOnDeleteFromPlayersList(p) } as ListInputItem })
                                           .concat(pageData?.invites.map((i) => { return { key: i.id, value: i.username, status: "приглашен(-а)", onDelete: () => handleOnDeleteFromPlayersList(i, true) } as ListInputItem }))
                                           .sort((a, b) => a.key - b.key)}
              onAdd={(username) => handleInvite(username)}
              onAddLabel='Пригласить'
              onAddStatus='отправка...'
            />}

            {game && !newGame && <>
              <FoldableCategory key="sessions_settings" title={`Сессии: ${game.sessions.filter((s) => s.number > 0).length}`}>
                <div className='flex gap-2'>
                  <ConfirmButton className='w-full mb-6' children={"Новая сессия"} onClickConfirm={() => handleNewSession()} />
                  {/* <SubmitButton className='w-full mb-6' onClick={() => {}} >
                    {"Новая сессия"}
                  </SubmitButton> */}
                  <ConfirmButton className='w-full mb-6' children={"Удалить"} onClickConfirm={() => handleDeleteSession()} />
                  {/* <SubmitButton className='w-full mb-6' onClick={() => {}} danger >
                    {"Удалить"}
                  </SubmitButton> */}
                </div>
                {game.sessions.length <= 0 ? <div className='flex flex-col gap-4 justify-center items-center text-center'>
                  <p className='italic'>В игре пока нет ни одной сессии</p>
                </div> : <div className='flex flex-col gap-4'>
                  {game.sessions.sort((a, b) => b.number - a.number).map((session, i) => <>
                    {session.number == Number(sessionEditItem?.number) ? <div className='flex flex-col gap-2'>
                        <InputField 
                          key={`gamecreateeditpage_sessionedit_inputfield_name`}
                          inputRef={sessionEditNameRef}
                          value={sessionEditItem?.name} 
                          entityEdit={{ handleFieldChange: (value) => setSessionEditItem({...sessionEditItem!, name: value}) }} 
                          label={session.number > 0 ? `Сессия ${session.number}` : `Предыстория`} 
                        />
                        <div className='flex gap-2 justify-between items-center'>
                          {/* <DateTimePicker /> */}
                          {i !== game.sessions.length - 1 ? <InputField 
                            key={`gamecreateeditpage_sessionedit_inputfield_startdate`}
                            htmlType='datetime-local'
                            inputRef={sessionEditDateRef}
                            label='Начало сессии'
                            error={sessionEditItem?.error}
                            value={sessionEditItem?.startTime} 
                            entityEdit={{ handleFieldChange: (value) => setSessionEditItem({...sessionEditItem!, startTime: value }) }} // dayjs(value).utc().toISOString()
                          /> : <></>}
                          <div className='flex gap-4'>
                            <LuCheck className='icon-button-accented' size={24} onClick={async () => { if (await handleEditSession(i)) { setSessionEditItem(null) } else setSessionEditItem({...sessionEditItem!, error: 'Неверная дата' }) }} />
                            <LuUndo2 className='icon-button-accented' size={24} onClick={() => setSessionEditItem(null)} />                   
                            {/* <Icon name='submit' size={24} />
                            <Icon name='arrowUp' size={24} onClick={() => setSessionEditItem(null)} /> */}
                          </div>                       
                        </div>
                      </div> : <div className='flex flex-1 gap-6 justify-between items-center'>
                      <div className='flex gap-2 items-center'>
                        <p className={`w-4 ${session.number <= 0 ? '' : ''}`}>{session.number > 0 ? session.number : ''}</p>
                        <p className={`${session.name == "" ? 'italic text-(--color-text-gray)' : '' }`}>{session.name == "" ? session.number > 0 ? `Сессия #${session.number}` : `Предыстория` : session.name}</p>
                      </div> 
                      <div className='flex gap-6'>
                        <p>{game.sessions[i+1]?.endTime != null ? dayjs.utc(game.sessions[i+1].endTime).local().format('DD.MM.YY') : ''}</p>
                        <Icon name='edit' className='icon-button-accented' onClick={() => { setSessionEditItem({...session, startTime: toDateTimeLocal(game.sessions[i+1]?.endTime) }) }} />
                      </div>
                    </div>}
                  </>)}  
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