import { useEffect, useState } from 'react';
import { InputField } from '../components/lib/Inputs/InputField';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { api } from '../utils/api';
import type { Game } from '../types/game';
import { useAppSelector } from '../store';
import { selectAuthorization } from '../reducers/PlayerSlice';
import type { GamePage } from '../types/request';
import { LoadingPage } from './LoadingPage';

const GameCreateEditPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  //const { authorization } = useAuth();

  const newGame = !id;

  const auth = useAppSelector(selectAuthorization);

  const [game, setGame] = useState<Game>({ name: "" } as Game);
  const [loading, setLoading] = useState<boolean>(!newGame);
  const { data: pageData } = useApi.get<GamePage>(`/game/${id}`, auth, [], newGame);

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
  };

  const saveEdited = async (editedGame: Game) => {
    if (!editedGame || editedGame.name == "") return;
    //if (editedGame.name == "") return;

    setLoading(true);

    const method = newGame ? api.post : api.put;
    const { data, error } = await method<Game>("/game", auth, game);
    if (!error) navigate(data?.id ? `/settings` : `/`);

    setLoading(false);
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
            />

            <button
              className={`${game.name == "" ?
                `bg-gray-600 cursor-not-allowed` :
                `bg-blue-600 hover:bg-blue-700 cursor-pointer`
                } text-white mt-6 py-2 px-4 rounded `}
              onClick={() => { if (game.name == "") return; saveEdited(game || {} as Game) }}
            >
              {game.name == "" ? "Введите название игры" : game.id ? "Применить" : "Создать"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GameCreateEditPage;