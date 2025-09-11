import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { SuggestionData } from '../types/suggestion';
import RichText from '../components/RichText';
import { RecordFeed } from '../components/RecordFeed';
import { useRecords } from '../hooks/useRecords';
import { Quest, QuestTask, QuestTaskType } from '../types/quest';
import Icon from '../components/icons/Icon';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { NumericInputInline } from '../components/NumericInputInline';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../utils/api';

interface QuestPageProp {
  //metaData: string;
}

export const QuestPage = ({  } : QuestPageProp) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const newQuest = id ? false : true;

  const [quest, setQuest] = useState<Quest | null>(newQuest ? {} as Quest : null);
  const [tasks, setTasks] = useState<QuestTask[]>([]);
  const [isEditingTasks, setEditingTasks] = useState<boolean>(false);

  const { accessKey } = useAuth();
  const { data, loading, error } = useApi.get(`/quest/${id}`, accessKey, [], newQuest);
  const { data: suggestionData } = useApi.get<SuggestionData>(`/suggestions`, accessKey);

  const { addNotification } = useNotifications();

  // ** change to valid player request ** //
  const { players } = useRecords();

  useEffect(() => {
    if (data) {
      setQuest(data.quest);
      setTasks(data.tasks);
    };
  }, [data]);

  const openEditing = () => {
    navigate(`/quest/${id}/edit`);
  };

  const editTasks = () => {
    if (isEditingTasks) saveTasks();
    setEditingTasks(!isEditingTasks);
    console.log(tasks);
  };

  const saveTasks = async () => {
    if (quest == null) return
    const { data, error, status } = await api.patch(`/quest/tasks`, accessKey, {"questID":quest.id, "tasks": tasks});
    if (status === 200) {
      addNotification("Задачи обновлены", 'success');
      setTasks(data);
    } else {
      var errorMessage = error ? `Ошибка: ${error.message}` : `Неизвестная ошибка (код ${status})`
      addNotification(errorMessage, 'error');
    }
  };

  const handleTasksChange = (value: any, field?: string, index?: number) => {
    if (!field || !tasks) return
    setTasks(prev => 
      prev ? prev.map((task, i) => 
        i === index 
          ? { ...task, [field]: value } 
          : task
      ) : []
    );
  };

  const handleToggleTasksChange = (value: any, field?: string, index?: number) => {
    console.log(value, field, index);
    if (!field || !tasks) return
    setTasks(prev => 
      prev ? prev.map((task, i) => 
        i === index 
          ? { ...task, [field]: value ? 1 : 0 } 
          : task
      ) : []
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {loading ? (
        <p>Данные загружаются...</p>
      ) : error || !quest ? (
        <p>Данные недоступны</p>
      ) : (
        <>
          <div className='flex justify-between'>
            <div className='items-center'>
              <h1 className="text-2xl font-bold">{quest.name}</h1>
              <h3 className="text-m text-gray-400 mb-4">{quest.title}</h3>
            </div>
            <div className={`mb-6 w-[30%] `}>
              <button
                className={`flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full`} //text-sm
                onClick={openEditing}
              >
                {"Изменить"}
              </button>
            </div>
          </div>
          <RichText text={quest.description || ""}/>

          {tasks && tasks.length > 0 && <div className='flex flex-col mt-8'>
            <div className="flex-1 border-t border-gray-700 mb-4"/>
            <div className='flex justify-between content-center mb-4'>
              <h2 className='text-2xl'>
                Задачи
              </h2>    
              <button className='' onClick={() => editTasks()}>
                <Icon 
                  key={`icon_edit_tasks`} 
                  name={isEditingTasks ? 'submit' : 'edit'}
                  className='text-blue-500 hover:fill-current hover:text-gray-400 cursor-pointer'/>
              </button>
            </div>
            {tasks.sort((a, b) => a.id - b.id).map((task, i) => {
              return (
                <div className='my-2'>
                  <div className='flex justify-between gap-8 content-center'>
                    <p className='text-md '>{task.name}</p>
                    <div className='content-center min-w-fit'>
                      {isEditingTasks ? 
                        /* is editing */
                        task.type == QuestTaskType.Decimal ? 
                        <NumericInputInline setValue={task.current} entityEdit={{ fieldName: 'current', arrayIndex: i, handleFieldChange: handleTasksChange}} /> : 
                        <ToggleSwitch label='Выполнено' key={`task_completion_${task.id}`} setValue={task.current > 0 ? true : false} entityEdit={{ fieldName: 'current', arrayIndex: i, handleFieldChange: handleToggleTasksChange }}/> : 
                        /* preview mode */
                        <p className={`text-md ${task.finished ? 'text-blue-500' : 'text-gray-500'}`}>
                          {task.type == QuestTaskType.Decimal ? `${task.current} / ${task.capacity}` : task.current > 0 ? `Выполнено` : `-`}
                        </p>
                      }
                    </div>
                  </div> 
                  <RichText key={`task_${task.id}_description`} text={task.description} fullWidth={true} className='text-sm italic text-gray-500' />   
                </div>
              )
            })}
          </div>}

          {/* ++ Change to universal feed ++ */}
          {data && data.records.length > 0 && <div className=''>
            <h2 className='text-right text-xl text-bold pt-8 pb-2'>Упоминания</h2>
            <RecordFeed key={1000} players={players} records={data.records} showQuests={false} suggestionData={suggestionData} />
          </div>}
        </>)
      }
    </div>
  );
};

export default QuestPage;