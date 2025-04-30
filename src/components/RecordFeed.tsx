// components/EventFeed.tsx
import { PlayerInfo, Record } from '../types/request';
import { useAuth } from '../hooks/useAuth';
import { SuggestionData } from '../types/suggestion';
import RecordCard from './RecordCard';
import { useState } from 'react';
import RecordEdit from './RecordEdit';

type RecordFeedProps = {
  records: Record[];
  players: PlayerInfo[];
  suggestionData?: SuggestionData | null;
  editable?: boolean;
  onEdit?: () => void;
};

export const RecordFeed = ({ records, players, suggestionData = null, editable = false, onEdit = () => {} }: RecordFeedProps) => {
  const { player } = useAuth();
  const [ editing, setEditing ] = useState<Record | null>(null);

  const onRecordEdit = (record : Record) => {
    setEditing(record);
  };

  const onModalClose = () => {
    setEditing(null);
    onEdit();
  };

  return (records.length === 0 || suggestionData == null ?
    // No Records
    <div className="text-center py-8 text-gray-400">
      Пока что нет ни одного события. Пора добавить несколько штрихов!
    </div> :
    // Some Records
    <>
      <div className="space-y-4">
        {records.sort((a, b) => b.id - a.id)
                .map((record) => (
                  <RecordCard 
                    key={1000 + record.id}
                    record={record} 
                    label={players.find((p) => p.id === record.playerID)?.username}
                    accented={record.playerID === player.id} 
                    editable={editable && record.playerID == player.id}
                    onEdit={onRecordEdit}/>
        ))}
      </div>
      {editing && 
        <RecordEdit key={990} record={editing} onClose={onModalClose} fullSuggestionData={suggestionData}/>
      }
    </>   
  );
};