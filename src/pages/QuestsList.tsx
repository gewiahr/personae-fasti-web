// pages/CharactersList.tsx
import { Link } from 'react-router-dom';
import { GameQuests } from '../types/request';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { QuestCard } from '../components/QuestCard';

export const QuestsList = () => {
  const { accessKey } = useAuth();
  const { data } = useApi.get<GameQuests>(`/quests`, accessKey);

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

      {data && data.quests.length > 0 ?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.quests.map((char) => (
          <QuestCard
            key={char.id}
            quest={char}
            labelText={char.finished ? "Завершено" : "В процессе"}
          />
        ))}
      </div> :
      <p>Создайте первые квесты и отправьтесь навстречу приключениям!</p>}  
    </div>
  );
};