import { useEffect } from 'react';
import { RecordFeed } from '../components/RecordFeed';
import { RecordInput } from '../components/RecordInput';
import { useAppDispatch, useAppSelector } from '../store';
import { loadCurrentGameQuests, loadCurrentGameRecords, loadCurrentGameSuggestions, selectCurrentGame } from '../reducers/CurrentGameSlice';
import { selectAuthorization } from '../reducers/PlayerSlice';

export const RecordPage = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuthorization);
  const { game, records } = useAppSelector(selectCurrentGame);

  useEffect(() => {
    dispatch(loadCurrentGameRecords({ auth }));
    dispatch(loadCurrentGameQuests({ auth }));
    dispatch(loadCurrentGameSuggestions({ auth }));
  }, []);

  // if (loading && currentGameRecords.length === 0) {
  //   return <div className="text-center py-8">Загрузка событий...</div>;
  // }

  // if (error) {
  //   return (
  //     <div className="text-center py-8 text-red-500">
  //       Ошибка загрузки данных: {error.message}
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {game && <>
        <RecordInput />
        <RecordFeed 
          records={records} 
          editable
          showQuests
          showSessions 
        />
      </>}
    </div>
  );
};