import { QuestCard } from './QuestCard';
import { useAppDispatch, useAppSelector } from '../store';
import { selectAuthorization } from '../reducers/PlayerSlice';
import { loadCurrentGameQuests, selectCurrentGameQuests } from '../reducers/CurrentGameSlice';
import { useEffect } from 'react';
import { selectIsLoadingNew } from '../reducers/LoadingSlice';
import LoadingLabel from './lib/LoadingLabel';
import LinkButton from './lib/LinkButton';

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
        <LinkButton to="/quest/new" >
          Добавить
        </LinkButton>
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