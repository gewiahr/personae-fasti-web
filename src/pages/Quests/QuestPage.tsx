import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Icon from '@/components/icons/Icon';
import { useNotifications } from '@/context/NotificationContext';
import { useApi } from '@/hooks/useApi';
import { selectAuthorization } from '@/reducers/PlayerSlice';
import { useAppSelector } from '@/store';
import { QuestTaskType, type Quest, type QuestTask } from '@/types/quest';
import { api } from '@/utils/api';
import Divider from '@lib/Divider';
import { NumericInputInline } from '@lib/Inputs/NumericInputInline';
import LoadingLabel from '@lib/LoadingLabel';
import RichText from '@lib/RichText/RichText';
import SubmitButton from '@lib/SubmitButton';
import { ToggleSwitch } from '@lib/ToggleSwitch';
import { RecordFeed } from '@/pages/Records/RecordFeed';

export const QuestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const newQuest = id ? false : true;

  const [quest, setQuest] = useState<Quest | null>(newQuest ? {} as Quest : null);
  const [tasks, setTasks] = useState<QuestTask[]>([]);
  const [isEditingTasks, setEditingTasks] = useState<boolean>(false);
  const [finishQuest, setFinishQuest] = useState<boolean>(false);

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
    navigate(`/quests/${id}/edit`);
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

  const handleCompleteQuest = async (successful: boolean) => {
    if (quest == null) return

    const { error, status } = await api.patch(`/quest/${id}/${successful ? 'complete' : 'fail'}`, auth, null);
    if (status === 200) {
      addNotification("Квест завершён", 'success');
      //setTasks(data);
      navigate(0);
    } else {
      var errorMessage = error ? `Ошибка: ${error.message}` : `Неизвестная ошибка (код ${status})`
      addNotification(errorMessage, 'error');
    }
  }

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
        <div className='flex flex-col gap-4'>
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

          {quest.finished ? <div className='w-full text-center text-xl'>
            {quest.successful ? <h4 className='text-(--color-text-accent)'>Завершён успешно</h4> : <h4 className='text-(--color-text-danger)'>Квест провален</h4>}
          </div> : <div className='w-full'>
            {!finishQuest ? 
              <SubmitButton className='w-full' children={'Завершить'} onClick={() => setFinishQuest(true)} /> :
              <div className='flex gap-4'>
                <SubmitButton className='flex-1' children={"Выполнено"} onClick={() => handleCompleteQuest(true)} />
                <SubmitButton className='flex-1' children={"Провалено"} onClick={() => handleCompleteQuest(false)} danger />
              </div>}
          </div>}

          <Divider />

          {tasks && tasks.length > 0 && <div className='flex flex-col gap-4'> 
            {!quest.finished && <div className='flex justify-between content-center'>
              <h2 className='text-2xl'>
                Задачи
              </h2>    
              <button className='' onClick={() => editTasks()}>
                <Icon 
                  key={`icon_edit_tasks`} 
                  name={isEditingTasks ? 'submit' : 'edit'}
                  className='icon-button-accented'/>
              </button>
            </div>}
            {tasks.sort((a, b) => a.id - b.id).map((task, i) => {
              return (
                <div key={`questpage_task-${task.id}`} className=''>
                  <div className='flex justify-between gap-8 content-center'>
                    <p className='text-md'>{task.name}</p>
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
            <h2 className='text-right text-xl text-bold pt-4 pb-2'>Упоминания</h2>
            <RecordFeed key={`questpage_recordfeed`} records={data.records} />
          </div>}
        </div>)
      }
    </div>
  );
};

export default QuestPage;