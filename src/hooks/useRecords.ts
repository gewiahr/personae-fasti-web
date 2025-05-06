import { useState, useCallback, useEffect } from 'react';
import { useApi } from './useApi';
import { useAuth } from './useAuth';
import { api } from '../utils/api'; // Import direct API caller
import { GameRecords, NewRecord } from '../types/request';

export const useRecords = () => {
  const { accessKey, player, game } = useAuth();
  const [ records, setRecords ] = useState<GameRecords['records']>([]);
  const [ sessions, setSessions ] = useState<GameRecords['sessions']>([]);
  const [ players, setPlayers ] = useState<GameRecords['players']>([]);
  const [ currentGame, setCurrentGame ] = useState<GameRecords['currentGame']>();
  
  // Get initial records
  const { 
    data: initialData,
    loading,
    error,
    refetch: fetchRecords 
  } = useApi.get<GameRecords>('/records', accessKey);

  // Handle API response
  useEffect(() => {
    if (initialData) {
      setRecords(initialData.records);
      setSessions(initialData.sessions);
      setPlayers(initialData.players);
      setCurrentGame(initialData.currentGame);
    }
  }, [initialData]);

  // Handle new record submission
  const handleNewRecord = useCallback(async (content: string, hidden: boolean = false) => {
    const newRecord: NewRecord = {
      text: content,
      playerID: player.id,
      gameID: game.id,
      hidden
    };

    try {
      // Use direct API call instead of hook
      const { data, error } = await api.post<GameRecords>(
        '/record',
        accessKey,
        newRecord
      );

      if (error) throw error;
      if (data) {
        setRecords(data.records);
        setSessions(data.sessions);
        setPlayers(data.players);
        setCurrentGame(data.currentGame);
      }
    } catch (err) {
      fetchRecords(); // Re-fetch original data on error
      throw err;
    }
  }, [accessKey, player.id, game.id, fetchRecords]);

  return {
    records,
    sessions,
    players,
    currentGame,
    loading,
    error,
    handleNewRecord,
    refresh: fetchRecords
  };
};