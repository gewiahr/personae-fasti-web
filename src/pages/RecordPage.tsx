// pages/RecordPage.tsx
import { useEffect, useState } from 'react';
import { RecordFeed } from '../components/RecordFeed';
import { RecordInput } from '../components/RecordInput';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { useRecords } from '../hooks/useRecords';
import { SuggestionData } from '../types/suggestion';
import { Quest } from '../types/quest';
import { api } from '../utils/api';

export const RecordPage = () => {
  const {
    records,
    sessions,
    players,
    currentGame,
    loading,
    error,
    handleNewRecord,
    refresh
  } = useRecords();
  const { accessKey, player } = useAuth();
  const [questInfo, setQuestInfo] = useState<Quest[]>([]);
  
  const { data: suggestionData, loading: suggestionLoading } = useApi.get<SuggestionData>(`/suggestions`, accessKey);
  
  //const { addNotification } = useNotifications();

  useEffect(() => {
    const getQuests = async () => {
      const { data } = await api.get('/quests', accessKey);
      if (data) {
        setQuestInfo(data.quests);
      };
    };

    getQuests();
  }, []);

  if (loading && records.length === 0) {
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
          <RecordInput key={"recordpage_recordinput_" + Number(suggestionLoading)} onSubmit={handleNewRecord} suggestionData={suggestionData} currentPlayer={player} currentGame={currentGame} questInfo={questInfo} />
          <RecordFeed key={"recordpage_recordfeed_" + Number(suggestionLoading)} records={records} sessions={sessions} players={players} suggestionData={suggestionData} editable={true} onEdit={() => refresh()} />
        </>
      }
    </div>
  );
};