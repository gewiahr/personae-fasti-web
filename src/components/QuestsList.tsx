import { Link } from 'react-router-dom';
import { QuestCard } from './QuestCard';
import { useAppDispatch, useAppSelector } from '../store';
import { selectAuthorization } from '../reducers/PlayerSlice';
import { loadCurrentGameQuests, selectCurrentGameQuests } from '../reducers/CurrentGameSlice';
import { useEffect } from 'react';
import { selectIsLoadingNew } from '../reducers/LoadingSlice';
import LoadingLabel from './lib/LoadingLabel';

export const QuestsList = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuthorization);
  const quests = useAppSelector(selectCurrentGameQuests);
  const questLoading = useAppSelector(selectIsLoadingNew(loadCurrentGameQuests.typePrefix));

  useEffect(() => {
    dispatch(loadCurrentGameQuests({ auth }));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Квесты</h1>
        <Link
          to="/quest/new"
          className="flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Добавить
        </Link>
      </div>

      {quests.length > 0 ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quests.map((char) => (
          <QuestCard
            key={char.id}
            quest={char}
            labelText={char.finished ? "Завершено" : "В процессе"}
          />
        ))}
      </div> :
      questLoading ? <LoadingLabel /> :
      <div className='mt-8 text-center text-xl italic'>
        <p>Создайте первые квесты и отправьтесь навстречу приключениям!</p>
      </div>}
    </div>
  );
};