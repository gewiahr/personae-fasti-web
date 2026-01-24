// pages/CharactersList.tsx
import { Link } from 'react-router-dom';
import { EntityCard } from './EntityCard';
import { useEntities } from '../hooks/useEntities';
import type { GameChars } from '../types/request';
import { CharMetaData } from '../types/entities';

export const CharsList = () => {
  const { data } = useEntities.chars<GameChars>();

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
    
      {data && data.chars.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.chars.map((char) => (
          <EntityCard
            key={char.id}
            entity={char}
            metaData={CharMetaData}
            labelText={data.players.find((player) => (player.id === char.playerID))?.username || ""}
          />
        ))}
      </div> : 
      <div className='mt-8 text-center text-xl italic'>
        <p>Пока что в этой кампании нет ни одного героя. Присоединяйтесь!</p>
      </div>}
    </div>
  );
};