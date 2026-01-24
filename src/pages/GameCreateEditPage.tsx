import { useEffect, useState } from 'react';
import { InputField } from '../components/lib/InputField';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { api } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
//import { useSettings } from '../hooks/useSettings';
import type { Game } from '../types/game';

const GameCreateEditPage : React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authorization } = useAuth();

  const newGame = !id;
  
  const [game, setGame] = useState<Game>({ name: "" } as Game);
  const { data: pageData } = useApi.get<Game>(`/game/${id}`, authorization, [], newGame);

  useEffect(() => {
    if (pageData) {
      setGame(pageData);
    };
  }, [pageData]);

  const handleFieldChange = (value: string, field?: string) => {
    if (!field) return
    setGame(prev => prev ? { ...prev, [field]: value } : { name: "" } as Game);
  };

  const saveEdited = async (editedGame: Game) => {
    if (!editedGame) return;
    if (editedGame.name == "") {
      return 
    }
    const method = newGame ? api.post : api.put;
    const { data, error } = await method<Game>("/game", authorization, game);
    if (!error) {
      navigate(data?.id ? `/` : `/settings`);
    }
  };

  if (!newGame && !game) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <div className='flex flex-col'>
        <InputField 
          className="mb-4" 
          label={`Название игры`} 
          setValue={game.name} 
          entityEdit={({ fieldName: 'name', handleFieldChange })}
        />

        <button
          className={`${
            game.name == "" ? 
            `bg-gray-600 cursor-not-allowed`:
            `bg-blue-600 hover:bg-blue-700 cursor-pointer`
          } text-white mt-6 py-2 px-4 rounded `}
          onClick={() => { if (game.name == "") return; saveEdited(game || {} as Game) }}
        >
          {game.name == "" ? "Введите название игры" : game.id ? "Применить" : "Создать"}
        </button>
      </div>
    </div>
  );
};

export default GameCreateEditPage;