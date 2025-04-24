import { useCallback } from 'react';
import { useApi } from './useApi';
import { useAuth } from './useAuth';
import { api } from '../utils/api'; 
import { NewEntity } from '../types/request';
import { EntityMetaData } from '../types/entities';

type UseRecordsProps = {
  entityName: string,
  entityNamePl: string,
}

const useEntitiesCore = <T>({ entityName, entityNamePl }: UseRecordsProps) => {
  const { accessKey, player, game } = useAuth();
  //const [entities, setEntities] = useState();

  // Get initial records
  const {
    data,
    loading,
    error,
    refetch
  } = useApi.get<T>(`/${entityNamePl}`, accessKey);

  // Handle API response
  // useEffect(() => {
  //   // if (data) {
  //   //   setEntities(data[entityNamePl]);
  //   // }
  // }, [data]);

  // Handle new entity submission
  const handleNewRecord = useCallback(async (name: string, description: string) => {
    const newEntity: NewEntity = {
      name,
      description,
      playerID: player.id,
      gameID: game.id,
      created: new Date().toISOString(),
    };

    try {
      // Use direct API call instead of hook
      const { /*data,*/ error } = await api.post<T>(
        `/${entityName}`,
        accessKey,
        newEntity
      );

      if (error) throw error;
      // if (data) {
      //   setEntities(data.);
      // }
    } catch (err) {
      refetch(); // Re-fetch original data on error
      throw err;
    }
  }, [accessKey, player.id, game.id, refetch]);

  return {
    data,
    //entities,
    loading,
    error,
    handleNewRecord,
    refresh: refetch
  };
};


export const useEntities = {
  fetch: (
    entityMeta : EntityMetaData
  ) => useEntitiesCore({ entityName: entityMeta.EntityType, entityNamePl: entityMeta.EntityTypePl }),
  
  chars: <Character>(
    // entityName: string,
    // entityNamePl: string = `${entityName}s`,
  ) => useEntitiesCore<Character>({ entityName: "char", entityNamePl: "chars" }),
}