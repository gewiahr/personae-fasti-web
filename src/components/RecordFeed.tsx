// components/EventFeed.tsx
import { PlayerInfo, Record } from '../types/request';
import { useAuth } from '../hooks/useAuth';
import { SuggestionData } from '../types/suggestion';
import RichText from './RichText';

type RecordFeedProps = {
  records: Record[];
  players: PlayerInfo[];
  suggestionData?: SuggestionData | null;
};

export const RecordFeed = ({ records, players, suggestionData = null }: RecordFeedProps) => {
  const { player } = useAuth();


  return (records.length === 0 || suggestionData == null ?
    // No Records
    <div className="text-center py-8 text-gray-400">
      Пока что нет ни одного события. Пора добавить несколько штрихов!
    </div> :
    // Some Records
    <div className="space-y-4">
      {records.sort((a, b) => b.id - a.id)
              .map((record) => (
        <div
          key={record.id}
          className={`p-4 rounded-lg border ${record.playerID === player.id
            ? 'border-blue-500 bg-gray-800'
            : 'border-gray-700 bg-gray-800'
            }`}
        >
          <div className="flex justify-between items-start">
            {/* <p className="text-white">{record.text}</p> */}
            <div>
              <RichText text={record.text} key={record.id} suggestionData={suggestionData}/>
            </div>          
            {/* <span
              className={`text-xs px-2 py-1 rounded ${record.playerID === player.id
                ? 'bg-blue-900 text-blue-200'
                : 'bg-gray-700 text-gray-300'
                }`}
            >
              {players.find((p) => p.id === record.playerID)?.username}
            </span> */}
          </div>
          {/* <div className="mt-2 text-xs text-gray-400">
            {new Date(record.created).toLocaleString()}
          </div> */}
          <div className="flex justify-between items-end text-xs text-gray-400">
          <span>Обновлено: {new Date().toLocaleDateString()}</span>
          <span
              className={`text-xs px-2 py-1 rounded ${record.playerID === player.id
                ? 'bg-blue-900 text-blue-200'
                : 'bg-gray-700 text-gray-300'
                }`}
            >
              {players.find((p) => p.id === record.playerID)?.username}
            </span>
        </div>
        </div>
      ))}
    </div>
  );
};