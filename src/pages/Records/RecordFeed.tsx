import { selectCurrentGame, loadCurrentGameRecords } from "@/reducers/CurrentGameSlice";
import { selectIsLoadingNew } from "@/reducers/LoadingSlice";
import { selectAuthorization, selectPlayerExt } from "@/reducers/PlayerSlice";
import { useAppDispatch, useAppSelector } from "@/store";
import { convertSuggestionDataToRender } from "@/types/suggestion";
import Divider from "@lib/Divider";
import LoadingLabel from "@lib/LoadingLabel";
import { useState, useEffect } from "react";
import type { Record } from '@/types/record'
import type { Session } from '@/types/game'
import RecordCard from "./RecordCard";
import RecordEdit from "./RecordEdit";

type RecordFeedProps = {
  records: Record[];
  editable?: boolean;
  showQuests?: boolean;
  showSessions?: boolean;
};

type RecordSession = {
  session: Session | null;
  records: Record[];
}

export const RecordFeed: React.FC<RecordFeedProps> = ({ records, editable = false, showQuests = false, showSessions = false }) => {
  const dispatch = useAppDispatch();
  const { game, settings, players, sessions, quests, suggestions } = useAppSelector(selectCurrentGame);
  // const sessions = useAppSelector(selectCurrentGameSessions);
  const auth = useAppSelector(selectAuthorization);
  const playerExt = useAppSelector(selectPlayerExt);
  const recordsLoading = useAppSelector(selectIsLoadingNew(loadCurrentGameRecords.typePrefix));

  const [ editing, setEditing ] = useState<Record | null>(null);
  const [ orderedRecords, setOrderedRecords ] = useState<RecordSession[]>([]);

  const onRecordEdit = (record : Record) => {
    setEditing(record);
  };

  const onModalClose = () => {
    setEditing(null);
    dispatch(loadCurrentGameRecords({auth}));
  };

  useEffect(() => {
    if (records && records.length > 0) {
      let or = orderRecords();
      setOrderedRecords(or);
    }; 
  }, [records, sessions]);

  // useEffect(() => {
  //   setGameInfo(playerSettingsData?.currentGame || null);
  // }, [playerSettingsData])

  const orderRecords = () => {
    if (!records || records.length === 0) {
      return [];
    };

    if (!sessions || sessions.length === 0 || !showSessions) {
      return [{ records: [...records].sort((a, b) => b.created.localeCompare(a.created)), session: null }] as RecordSession[]
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

  return (orderedRecords.length <= 0 ? //|| suggestions == null ? //(records.length === 0 || suggestionData == null ?
    recordsLoading ?
    // Loading Records
    <LoadingLabel /> :
    // No Records
    <div className='mt-8 text-center text-xl italic text-gray-400'>
      <p>Пока что нет ни одного события. Пора добавить несколько штрихов!</p>  
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
            <div key={`recordfeed_session-${sessionNumber ?? 'unsorted'}`} className="space-y-4">
              {/* Session header - only show if there are multiple sessions */}
              {group.session && (
                <div className='z-10 py-2'>
                  <Divider>
                    <span className="text-sm font-medium text-gray-400">
                      {isPrehistory ? (
                        'Предыстория'
                      ) : isCurrentSession ? (
                        <>
                          <span className="text-white">Текущая сессия</span>
                          {sessionNumber && ` #${sessionNumber}`}
                        </>
                      ) : (
                        `Сессия #${sessionNumber}`
                      )}
                      
                      {endTime && (
                        <span className="text-xs text-gray-500">
                          {/* {new Date(endTime).toLocaleDateString()} */}
                        </span>
                      )}
                    </span>
                  </Divider>
                  <div className='text-md record-feed-session-title'>
                    <p>{group.session?.name}</p>
                  </div>
                </div>
              )}

              {/* Records in session */}
              {group.records.map(record => (
                <RecordCard 
                  key={record.id}
                  record={record}
                  label={players.find(p => p.ext === record.playerExt)?.username}
                  accented={record.playerExt === playerExt}
                  editable={editable && ((record.playerExt === playerExt || game?.gmExt === playerExt) || (settings?.allowAllEditRecords))}
                  quest={showQuests ? quests.find((q) => q.ext === record.questExt) : undefined}
                  onEdit={onRecordEdit}
                />
              ))}
            </div>
          );
        })}
      </div>}

      {editing && playerExt && game && 
        <RecordEdit 
          key={`recordfeed_editmodal`} 
          record={editing}
          currentGame={game} 
          onClose={onModalClose} 
          suggestionData={convertSuggestionDataToRender(suggestions)}
        />
      }
    </>   
  );
};
