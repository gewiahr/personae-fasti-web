// pages/CharactersList.tsx
import { Link } from 'react-router-dom';
import { EntityCard } from './EntityCard';
import type { CharInfo } from '../types/request';
import { CharMetaData } from '../types/entities';
import { useEffect, useState } from 'react';
import { selectAuthorization } from '../reducers/PlayerSlice';
import { useAppSelector } from '../store';
import { selectCurrentGamePlayers } from '../reducers/CurrentGameSlice';
import type { ApiError } from '../types/api';
import { ErrorPage } from '../pages/ErrorPage';
import { api } from '../utils/api';
import LoadingLabel from './lib/LoadingLabel';

export const CharsList = () => {
  const auth = useAppSelector(selectAuthorization);
  const players = useAppSelector(selectCurrentGamePlayers);

  const [chars, setChars] = useState<CharInfo[]>([]);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCharInfo = async () => {
      const { data } = await api.get<{ chars: CharInfo[] }>("/chars", auth);
      if (error) {
        setError(error);
      } else if (data) {
        setChars(data.chars);
      }
      setLoading(false);
    };

    fetchCharInfo();
  }, []);

  //if (loading) return <LoadingPage />

  if (error) return <ErrorPage error={error} entityMeta={CharMetaData} />

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Герои</h1>
        <Link
          to="/char/new"
          className="flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Добавить
        </Link>
      </div>
    
      {chars.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chars.map((char) => (
          <EntityCard
            key={char.id}
            entity={char}
            metaData={CharMetaData}
            labelText={players.find((player) => (player.id === char.playerID))?.username || ""}
          />
        ))}
      </div> : 
      loading ? <LoadingLabel /> :
      <div className='mt-8 text-center text-xl italic'>
        <p>Пока что в этой кампании нет ни одного героя. Присоединяйтесь!</p>
      </div>}
    </div>
  );
};