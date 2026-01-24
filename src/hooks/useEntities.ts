import { useCallback } from 'react';
import { useApi } from './useApi';
import { useAuth } from './useAuth';
import { api } from '../utils/api'; 
import type { NewEntity } from '../types/request';
import type { EntityMetaData } from '../types/entities';
import { useSettings } from './useSettings';

type UseRecordsProps = {
  entityName: string,
  entityNamePl: string,
}

const useEntitiesCore = <T>({ entityName, entityNamePl }: UseRecordsProps) => {
  const { authorization } = useAuth();
  const { player, game } = useSettings();
  //const [entities, setEntities] = useState();

  // Get initial records
  const {
    data,
    loading,
    error,
    refetch
  } = useApi.get<T>(`/${entityNamePl}`, authorization);

  // Handle API response
  // useEffect(() => {
  //   // if (data) {
  //   //   setEntities(data[entityNamePl]);
  //   // }
  // }, [data]);

  // Handle new entity submission
  const handleNewEntity = useCallback(async (name: string, description: string, hidden: boolean = false) => {
    if (!player || !game) return
    
    const newEntity: NewEntity = {
      name,
      description,
      playerID: player.id,
      gameID: game.id,
      created: new Date().toISOString(),
      hidden
    };

    try {
      // Use direct API call instead of hook
      const { /*data,*/ error } = await api.post<T>(
        `/${entityName}`,
        authorization,
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
  }, [authorization, player?.id, game?.id, refetch]);

  return {
    data,
    //entities,
    loading,
    error,
    handleNewEntity,
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