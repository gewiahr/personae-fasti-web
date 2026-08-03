import { useEffect, useRef, useState } from 'react';
import { LuCheck, LuUndo2 } from 'react-icons/lu';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Icon from '@/components/icons/Icon';
import { useNotifications } from '@/context/NotificationContext';
import { useApi } from '@/hooks/useApi';
import { updateGameSettings, startNewSession, removeLastSession, editSession, revokeInvite } from '@/reducers/CurrentGameSlice';
import { selectAuthorization, selectPlayerExt } from '@/reducers/PlayerSlice';
import { useAppDispatch, useAppSelector } from '@/store';
import type { Game, GameFull, SessionEdit } from '@/types/game';
import type { PlayerBrief } from '@/types/player';
import { api } from '@/utils/api';
import ConfirmButton from '@lib/ConfirmButton';
import FoldableCategory from '@lib/FoldableCategory';
import { InputField } from '@lib/Inputs/InputField';
import { ListInput, type ListInputItem } from '@lib/Inputs/ListInput';
import SubmitButton from '@lib/SubmitButton';
import { ToggleSwitch } from '@lib/ToggleSwitch';
import { LoadingPage } from '../LoadingPage';

const GameCreateEditPage: React.FC = () => {
  const { ext } = useParams();
  const newGame = !ext;

  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuthorization);
  const playerExt = useAppSelector(selectPlayerExt);

  const { addNotification } = useNotifications();

  const [game, setGame] = useState<GameFull>({title: ''} as GameFull);
  const [loading, setLoading] = useState<boolean>(!newGame);
  const [error, setError] = useState<string>("");
  const { data: pageData, refetch: refetchPageData, error: pageError } = useApi.get<GameFull>(`/game/${ext}`, auth, [], newGame);

  const [sessionEditItem, setSessionEditItem] = useState<SessionEdit | null>(null);

  const sessionEditNameRef = useRef<HTMLInputElement>(null);
  const sessionEditDateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pageData) {
      setGame(pageData);
      setLoading(false);
    };
  }, [pageData]);

  useEffect(() => {
    if (!newGame && !sessionEditDateRef.current) sessionEditNameRef.current?.focus();
    if (newGame) sessionEditNameRef.current?.focus();
  }, [sessionEditItem]);

  const handleFieldChange = (value: string, field?: string) => {
    if (!field) return
    setGame(prev => prev ? { ...prev, [field]: value } : { title: "" } as GameFull);
    setError("");
  };

  const saveEdited = async (editedGame: GameFull) => {
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
      window.location.href = newGame && data ? `/game/${data.ext}` : `/settings`; //id ? `/settings` : `/`; //navigate(data?.id ? `/settings` : `/`);}
    }

    if (game) dispatch(updateGameSettings({ auth, gameExt: game.ext, settings: game.settings }))
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

    var sessionStartTimeString = "";
    // TODO: make prehistory sessions with meaningful time
    if (sessionEditItem.number > 0) {
      try {
        sessionStartTimeString = dayjs(sessionEditItem.startTime).utc().toISOString()
      } catch (e: any) {
        addNotification('Неверная дата', 'error');
        return false; 
      }
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

  const handleOnDeleteFromPlayersList = async (player: PlayerBrief, invite: boolean = false) => {
    if (invite) {
      try {
        await dispatch(revokeInvite({ auth, username: player.username })).unwrap()
        addNotification('Приглашение отозвано', 'success');
        refetchPageData();
        return true
      } catch (e: any) {
        addNotification(e.message, 'error');
        return false
      }
    }

    return false
  };

  // const toLocaleStringDate = (date?: string, short: boolean) => {
  //   const dateOptions = short ? { day: '2-digit', month: '2-digit', year: '2-digit' } : { day: '2-digit', month: '2-digit', year: 'numeric',  } 
  //   return new Date(date || "").toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: '2-digit',  })
  // }

  const toDateTimeLocal = (isoString?: string) => {
    if (!isoString) return '';
    return dayjs.utc(isoString).local().format('YYYY-MM-DDTHH:mm');
  };

  console.log(game)

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
              setOptions={game.players.map((p) => { return { key: p.ext, value: p.username, onDelete: p.ext === playerExt ? undefined : async () => await handleOnDeleteFromPlayersList(p) } as ListInputItem })
                                           .concat(game.invites.map((i) => { return { key: i.ext, value: i.username, status: "приглашен(-а)", onDelete: async () => await handleOnDeleteFromPlayersList(i, true) } as ListInputItem }))
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
                  {game.sessions.sort((a, b) => b.number - a.number).map((session, i) => <div key={`gamecreateeditpage_sessionslist_session${session.number}`}>
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
                            entityEdit={{ handleFieldChange: (value) => setSessionEditItem({...sessionEditItem!, startTime: value, error: undefined }) }} // dayjs(value).utc().toISOString()
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
                  </div>)}  
                </div>}
                <div>

                </div>
              </FoldableCategory>

              <ToggleSwitch
                key={"gamesettings_alloweditrecord"}
                label='Разрешить редактировать записи других игроков'
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
              {game.title == "" ? "Введите название игры" : game.ext ? "Применить" : "Создать"}
            </SubmitButton>
          </div>
        </>
      )}
    </div>
  );
};

export default GameCreateEditPage;