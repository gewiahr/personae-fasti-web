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
    players,
    loading,
    error,
    handleNewRecord
  } = useRecords();
  const { accessKey }  = useAuth();
  const { data: suggestionData, loading: suggestionLoading } = useApi.get<SuggestionData>(`/suggestions`, accessKey);

  if (loading && records.length === 0) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading events: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <RecordInput key={Number(suggestionLoading)} onSubmit={handleNewRecord} suggestionData={suggestionData} />
      <RecordFeed records={records} players={players} suggestionData={suggestionData} />
    </div>
  );
};