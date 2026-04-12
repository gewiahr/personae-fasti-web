import { useEffect, useState } from 'react';
import { InputField } from '../components/lib/Inputs/InputField';
import { useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { api } from '../utils/api';
import type { Game } from '../types/game';
import { useAppSelector } from '../store';
import { selectAuthorization } from '../reducers/PlayerSlice';
import type { GamePage } from '../types/request';
import { LoadingPage } from './LoadingPage';
import SubmitButton from '../components/lib/SubmitButton';
import { ListInput, type ListInputItem } from '../components/lib/Inputs/ListInput';
import { useNotifications } from '../context/NotificationContext';

const GameCreateEditPage: React.FC = () => {
  const { id } = useParams();

  const newGame = !id;

  const auth = useAppSelector(selectAuthorization);

  const { addNotification } = useNotifications();

  const [game, setGame] = useState<Game>({ name: "" } as Game);
  const [loading, setLoading] = useState<boolean>(!newGame);
  const [error, setError] = useState<string>("");
  const { data: pageData, refetch: refetchPageData } = useApi.get<GamePage>(`/game/${id}`, auth, [], newGame);

  useEffect(() => {
    if (pageData) {
      setGame({
        id: pageData.game.id,
        gmID: pageData.game.gmID,
        name: pageData.game.title,
      });
      setLoading(false);
    };
  }, [pageData]);

  const handleFieldChange = (value: string, field?: string) => {
    if (!field) return
    setGame(prev => prev ? { ...prev, [field]: value } : { name: "" } as Game);
    setError("");
  };

  const saveEdited = async (editedGame: Game) => {
    if (!editedGame || editedGame.name == "") return;
    //if (editedGame.name == "") return;

    setLoading(true);

    const method = newGame ? api.post : api.put;
    const { error } = await method<Game>("/game", auth, game);
    if (!error) window.location.href = `/settings`; //id ? `/settings` : `/`; //navigate(data?.id ? `/settings` : `/`);
    else setError(error.message);
    
    setLoading(false);
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
              value={game.name}
              entityEdit={({ fieldName: 'name', handleFieldChange })}
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

            <SubmitButton 
              className='mt-6'
              disabled={game.name == ""}
              onClick={() => { if (game.name == "") return; saveEdited(game || {} as Game) }}              
            >
              {game.name == "" ? "Введите название игры" : game.id ? "Применить" : "Создать"}
            </SubmitButton>
          </div>
        </>
      )}
    </div>
  );
};

export default GameCreateEditPage;