// pages/RecordPage.tsx
import { useEffect, useState } from 'react';
import { RecordFeed } from '../components/RecordFeed';
import { RecordInput } from '../components/RecordInput';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { useRecords } from '../hooks/useRecords';
import type { SuggestionData } from '../types/suggestion';
import type { Quest } from '../types/quest';
import { api } from '../utils/api';
import { useAppDispatch, useAppSelector } from '../store';
import { getCurrentGameRecords, selectCurrentGame, selectCurrentGamePlayers, selectCurrentGameRecords, selectCurrentGameSessions } from '../reducers/CurrentGameSlice';

export const RecordPage = () => {
  const {
    //records,
    //sessions,
    //players,
    //currentGame,
    loading,
    error,
    handleNewRecord,
    refresh
  } = useRecords();
  const { authorization } = useAuth();
  const [questInfo, setQuestInfo] = useState<Quest[]>([]);
  
  const { data: suggestionData, loading: suggestionLoading } = useApi.get<SuggestionData>(`/suggestions`, authorization);

  const dispatch = useAppDispatch();
  const currentGame = useAppSelector(selectCurrentGame);
  const currentGameRecords = useAppSelector(selectCurrentGameRecords);
  const currentGameSessions = useAppSelector(selectCurrentGameSessions);
  const currentGamePlayers = useAppSelector(selectCurrentGamePlayers);
  
  //const { addNotification } = useNotifications();

  useEffect(() => {
    const getQuests = async () => {
      const { data } = await api.get('/quests', authorization);
      if (data) {
        setQuestInfo(data.quests);
      };
    };

    getQuests();
    dispatch(getCurrentGameRecords({authorization}));
  }, []);

  if (loading && currentGameRecords.length === 0) {
    return <div className="text-center py-8">Загрузка событий...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Ошибка загрузки данных: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {currentGame &&
        <>
          <RecordInput key={"recordpage_recordinput_" + Number(suggestionLoading)} onSubmit={handleNewRecord} suggestionData={suggestionData} questInfo={questInfo} />
          <RecordFeed key={"recordpage_recordfeed_" + Number(suggestionLoading)} records={currentGameRecords} sessions={currentGameSessions} players={currentGamePlayers} suggestionData={suggestionData} editable={true} onEdit={() => refresh()} />
        </>
      }
    </div>
  );
};