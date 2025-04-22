// pages/RecordPage.tsx
import { RecordFeed } from '../components/RecordFeed';
import { RecordInput } from '../components/RecordInput';
import { useRecords } from '../hooks/useRecords';

export const RecordPage = () => {
  const {
    records,
    players,
    loading,
    error,
    handleNewRecord
  } = useRecords();

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
      <RecordInput onSubmit={handleNewRecord} />
      <RecordFeed records={records} players={players} />
    </div>
  );
};