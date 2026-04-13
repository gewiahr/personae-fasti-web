import { useEffect, useState } from 'react';
import { InputField } from '../components/lib/Inputs/InputField';
import { useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { api } from '../utils/api';
import type { Game } from '../types/game';
import { useAppDispatch, useAppSelector } from '../store';
import { selectAuthorization } from '../reducers/PlayerSlice';
import type { GameFullInfo, GamePage } from '../types/request';
import { LoadingPage } from './LoadingPage';
import SubmitButton from '../components/lib/SubmitButton';
import { ListInput, type ListInputItem } from '../components/lib/Inputs/ListInput';
import { useNotifications } from '../context/NotificationContext';
import FoldableCategory from '../components/lib/FoldableCategory';
import { ToggleSwitch } from '../components/lib/ToggleSwitch';
import { updateGameSettings } from '../reducers/CurrentGameSlice';

const GameCreateEditPage: React.FC = () => {
  const { id } = useParams();

  const newGame = !id;

  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuthorization);

  const { addNotification } = useNotifications();

  const [game, setGame] = useState<GameFullInfo>({} as GameFullInfo);
  const [loading, setLoading] = useState<boolean>(!newGame);
  const [error, setError] = useState<string>("");
  const { data: pageData, refetch: refetchPageData } = useApi.get<GamePage>(`/game/${id}`, auth, [], newGame);

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

    if (!newGame) dispatch(updateGameSettings({ auth, gameID: game.id, settings: game.settings }))
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

  return (
    <div className='max-w-4xl mx-auto p-4'>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          <div className='flex flex-col'>
            <InputField
              className="mb-4"
              label={`Название игры`}
              value={game.title}
              entityEdit={({ fieldName: 'title', handleFieldChange })}
              error={error || ""}
            />

            <ListInput
              label='Игроки'
              addButtonLabel='Добавить игрока'
              setOptions={pageData?.players.map((p) => { return { key: p.id, value: p.username } as ListInputItem })
                                           .concat(pageData?.invites.map((i) => { return { key: i.id, value: i.username, status: "приглашен(-а)" } as ListInputItem }))
                                           .sort((a, b) => a.key - b.key)}
              onAdd={(username) => handleInvite(username)}
              onAddLabel='Пригласить'
              onAddStatus='отправка...'
            />

            <FoldableCategory key="sessions_settings" title={`Сессии: ${game.sessions.length}`}>
              {/* <SubmitButton className='w-full mt-2' onClick={handleNewSession} >
                {"Начать новую сессию"}
              </SubmitButton> */}
              <div>

              </div>
            </FoldableCategory>

            {!newGame && <>
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
              disabled={game.title == ""}
              onClick={() => { if (game.title == "") return; saveEdited(game) }}              
            >
              {game.title == "" ? "Введите название игры" : game.id ? "Применить" : "Создать"}
            </SubmitButton>
          </div>
        </>
      )}
    </div>
  );
};

export default GameCreateEditPage;