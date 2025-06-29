// pages/RecordPage.tsx
import { RecordFeed } from '../components/RecordFeed';
import { RecordInput } from '../components/RecordInput';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { useRecords } from '../hooks/useRecords';
import { SuggestionData } from '../types/suggestion';

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
  const { accessKey, player }  = useAuth();
  const { data: suggestionData, loading: suggestionLoading } = useApi.get<SuggestionData>(`/suggestions`, accessKey);

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
          <RecordInput key={"recordpage_recordinput_" + Number(suggestionLoading)} onSubmit={handleNewRecord} suggestionData={suggestionData} currentPlayer={player} currentGame={currentGame} />
          <RecordFeed key={"recordpage_recordfeed_" + Number(suggestionLoading)} records={records} sessions={sessions} players={players} suggestionData={suggestionData} editable={true} onEdit={() => refresh()} />
        </>
      }
    </div>
  );
};