// pages/CharactersList.tsx
import { Link } from 'react-router-dom';
import { EntityCard } from '../components/EntityCard';
import { useEntities } from '../hooks/useEntities';
import { EntityMetaData } from '../types/entities';
import { useEffect, useState } from 'react';
import { EntityInfo } from '../types/request';
//import { useRecords } from '../hooks/useRecords';

interface EntitiesListProp {
  metaData: EntityMetaData;
}

interface EntityApiResponse<T> {
  [key: string]: T[] | undefined;
}

export const EntitiesList = ({ metaData } : EntitiesListProp) => {
  const { data } = useEntities.fetch(metaData);
  const [entities, setEntities] = useState<EntityInfo[]>();
  //const { players } = useRecords();

  useEffect(() => {
    if (data && typeof data === 'object' && data !== null) { // metaData.EntityTypePl in data) {
      const response = data as EntityApiResponse<EntityInfo>;
      const entitySet = response[metaData.EntityTypePl]; 
      setEntities(Array.isArray(entitySet) ? entitySet : []);  
    }
  }, [data]); 

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{metaData.EntityNamePl}</h1>
        <Link
          to={`/${metaData.EntityType}/new`}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Добавить
        </Link>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entities && entities.map((entity) => (
          <EntityCard
            key={entity.id}
            entity={entity}
            metaData={metaData}
            // Player Labels
            // playerName={data?.players.find((player) => (player.id === char.playerID))?.username || ""}
            //labelText={players.find((player) => (player.id === entity.playerID))?.username || ""}
          />
        ))}
      </div>
    </div>
  );
};