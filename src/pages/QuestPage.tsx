import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useEffect, useState } from 'react';
import RichText from '../components/lib/RichText/RichText';
import { RecordFeed } from '../components/RecordFeed';
import { QuestTaskType, type Quest, type QuestTask } from '../types/quest';
import Icon from '../components/icons/Icon';
import { ToggleSwitch } from '../components/lib/ToggleSwitch';
import { NumericInputInline } from '../components/lib/Inputs/NumericInputInline';
import { useNotifications } from '../context/NotificationContext';
import { api } from '../utils/api';
import { useAppSelector } from '../store';
import { selectAuthorization } from '../reducers/PlayerSlice';
import LoadingLabel from '../components/lib/LoadingLabel';
import SubmitButton from '../components/lib/SubmitButton';
import Divider from '../components/lib/Divider';

type QuestPageProp = {

}

export const QuestPage: React.FC<QuestPageProp> = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const newQuest = id ? false : true;

  const [quest, setQuest] = useState<Quest | null>(newQuest ? {} as Quest : null);
  const [tasks, setTasks] = useState<QuestTask[]>([]);
  const [isEditingTasks, setEditingTasks] = useState<boolean>(false);

  const auth = useAppSelector(selectAuthorization);
  const { data, loading, error } = useApi.get(`/quest/${id}`, auth, [], newQuest);

  const { addNotification } = useNotifications();

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
  };

  const saveTasks = async () => {
    if (quest == null) return

    const { data, error, status } = await api.patch(`/quest/tasks`, auth, {"questID":quest.id, "tasks": tasks});
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
        <LoadingLabel />
      ) : error || !quest ? (
        <p>Данные недоступны</p>
      ) : (
        <>
          <div className='flex justify-between'>
            <div className='items-center'>
              <h1 className="text-2xl font-bold">{quest.name}</h1>
              <h3 className="text-m text-(--color-text-gray) mb-4">{quest.title}</h3>
            </div>
            <div className={`mb-6 w-[30%]`}>
              <SubmitButton
                onClick={openEditing}
                className='flex justify-center items-center w-full'
              >
                {"Изменить"} 
              </SubmitButton>
            </div>
          </div>
          <RichText key={`questpage_richtext-${id ?? "newquest"}`} text={quest.description || ""} uid={`questpage-${id ?? "newquest"}`}/>

          {tasks && tasks.length > 0 && <div className='flex flex-col mt-8'>
            <Divider />
            <div className='flex justify-between content-center my-4'>
              <h2 className='text-2xl'>
                Задачи
              </h2>    
              <button className='' onClick={() => editTasks()}>
                <Icon 
                  key={`icon_edit_tasks`} 
                  name={isEditingTasks ? 'submit' : 'edit'}
                  className='icon-button-accented'/>
              </button>
            </div>
            {tasks.sort((a, b) => a.id - b.id).map((task, i) => {
              return (
                <div key={`questpage_task-${task.id}`} className='my-2'>
                  <div className='flex justify-between gap-8 content-center'>
                    <p className='text-md '>{task.name}</p>
                    <div className='content-center min-w-fit'>
                      {isEditingTasks ? 
                        /* is editing */
                        task.type == QuestTaskType.Decimal ? 
                        <NumericInputInline value={task.current} entityEdit={{ fieldName: 'current', arrayIndex: i, handleFieldChange: handleTasksChange}} /> : 
                        <ToggleSwitch label='Выполнено' key={`task_completion_${task.id}`} setValue={task.current > 0 ? true : false} entityEdit={{ fieldName: 'current', arrayIndex: i, handleFieldChange: handleToggleTasksChange }}/> : 
                        /* preview mode */
                        <p className={`text-md ${task.finished ? 'text-(--color-text-accent)' : 'text-(--color-text-gray)'}`}>
                          {task.type == QuestTaskType.Decimal ? `${task.current} / ${task.capacity}` : task.current > 0 ? `Выполнено` : `-`}
                        </p>
                      }
                    </div>
                  </div> 
                  <RichText key={`questpage_task-${task.id}_description`} text={task.description} uid={`questpage_task-${task.id ?? "newtask"}_description`} fullWidth={true} className='text-sm italic text-gray-500' />   
                </div>
              )
            })}
          </div>}

          {/* ++ Change to universal feed ++ */}
          {data && data.records.length > 0 && <div className=''>
            <h2 className='text-right text-xl text-bold pt-8 pb-2'>Упоминания</h2>
            <RecordFeed key={`questpage_recordfeed`} records={data.records} />
          </div>}
        </>)
      }
    </div>
  );
};

export default QuestPage;