import { PlayerInfo, Record, Session } from '../types/request';
import { useAuth } from '../hooks/useAuth';
import { SuggestionData } from '../types/suggestion';
import RecordCard from './RecordCard';
import { useEffect, useState } from 'react';
import RecordEdit from './RecordEdit';
//import { groupRecordsBySession } from '../types/utils';

type RecordFeedProps = {
  records: Record[];
  players: PlayerInfo[];
  sessions?: Session[];
  suggestionData?: SuggestionData | null;
  editable?: boolean;
  showQuests?: boolean;
  onEdit?: () => void;
};

type RecordSession = {
  session: Session | null;
  records: Record[];
}

export const RecordFeed = ({ records, players, sessions, suggestionData = null, editable = false, showQuests = true, onEdit = () => {} }: RecordFeedProps) => {
  const { player, game } = useAuth();
  const [ editing, setEditing ] = useState<Record | null>(null);
  const [ orderedRecords, setOrderedRecords ] = useState<RecordSession[] | null>();

  const onRecordEdit = (record : Record) => {
    setEditing(record);
  };

  const onModalClose = () => {
    setEditing(null);
    onEdit();
  };

  useEffect(() => {
    if (records) {
      let or = orderRecords();
      setOrderedRecords(or);
    }; 
  }, [records, sessions]);

  const orderRecords = () => {
    if (!sessions || sessions.length === 0) {
      return [{ records: records.sort((a, b) => b.created.localeCompare(a.created)), session: null }] as RecordSession[]
    };

    // Sort sessions by endTime (ascending), with current session (null endTime) last
    const sortedSessions = [...sessions].sort((a, b) => {
      if (!a.endTime && !b.endTime) return 0;
      if (!a.endTime) return 1; // Current session should be last
      if (!b.endTime) return -1;
      return a.endTime.localeCompare(b.endTime);
    });

    // Group records by session
    const sessionGroups = sortedSessions.map<RecordSession>((session, index) => {
      const sessionRecords = records.filter(record => {
        const recordDate = new Date(record.created);
        
        // Current session (no endTime) - gets all records after last endTime
        if (!session.endTime) {
          const previousSessionEnd = index > 0 ? new Date(sortedSessions[index-1].endTime!) : null;
          return !previousSessionEnd || recordDate > previousSessionEnd;
        }
        
        // First session - gets all records up to its endTime
        if (index === 0) {
          return recordDate <= new Date(session.endTime);
        }
        
        // Middle sessions - get records between previous session's endTime and this session's endTime
        const previousSessionEnd = new Date(sortedSessions[index-1].endTime!);
        return recordDate > previousSessionEnd && recordDate <= new Date(session.endTime);
      });

      return {
        session: session,
        records: sessionRecords.sort((a, b) => b.created.localeCompare(a.created))
      };
    });

    return sessionGroups.reverse();
  }

  return (!orderedRecords || suggestionData == null ? //(records.length === 0 || suggestionData == null ?
    // No Records
    <div className="text-center py-8 text-gray-400">
      Пока что нет ни одного события. Пора добавить несколько штрихов!
    </div> :
    // Some Records
    <>
      {<div className="space-y-8">
        {orderedRecords.map((group) => {
          const endTime = group.session?.endTime;
          const isZeroDate = endTime === "0001-01-01T00:00:00Z";
          const isCurrentSession = !endTime || isZeroDate;
          const sessionNumber = group.session?.number;
          const isPrehistory = Number(sessionNumber) < 1;

          return (
            <div key={`session-${sessionNumber ?? 'unsorted'}`} className="space-y-4">
              {/* Session header - only show if there are multiple sessions */}
              {group.session && (
                <div className='z-10 py-2'>
                  <div className="flex items-center gap-4 sticky top-0 bg-gray-900/80 backdrop-blur-sm">
                    <div className="flex-1 border-t border-gray-700"/>
                    <span className="text-sm font-medium text-gray-400">
                      {isCurrentSession ? (
                        <>
                          <span className="text-white">Текущая сессия</span>
                          {sessionNumber && ` #${sessionNumber}`}
                        </>
                      ) : isPrehistory ? (
                        'Предыстория'
                      ) : (
                        `Сессия #${sessionNumber}`
                      )}
                      
                      {endTime && (
                        <span className="text-xs text-gray-500">
                          {/* {new Date(endTime).toLocaleDateString()} */}
                        </span>
                      )}
                    </span>
                    <div className="flex-1 border-t border-gray-700"/>
                  </div>
                  <div className='text-m font-medium text-center text-balance text-blue-500'>
                    <p>{group.session?.name}</p>
                  </div>
                </div>
              )}

              {/* Records in session */}
              {group.records.map(record => (
                <RecordCard 
                  key={record.id}
                  record={record}
                  label={players.find(p => p.id === record.playerID)?.username}
                  accented={record.playerID === player.id}
                  editable={editable && (record.playerID == player.id || game.gmID == player.id)}
                  showQuest={showQuests}
                  onEdit={onRecordEdit}
                />
              ))}
            </div>
          );
        })}
      </div>}

      {editing && 
        <RecordEdit 
          key={990} 
          record={editing}
          currentPlayer={player}
          currentGame={game} 
          onClose={onModalClose} 
          fullSuggestionData={suggestionData}
        />
      }
    </>   
  );
};