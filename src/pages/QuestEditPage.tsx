import { RichInput } from '../components/RichInput'
import { SuggestionData } from '../types/suggestion';
import { useEffect, useState } from 'react';
import { InputField } from '../components/InputField';
import { useNavigate, useParams } from 'react-router-dom';
import { QuestPageData } from '../types/request';
import { useApi } from '../hooks/useApi';
import { api } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { NewQuestTask, Quest, QuestTask } from '../types/quest';
import { useNotifications } from '../context/NotificationContext';
import { SelectInput } from '../components/SelectInput';
import { NumericInputInline } from '../components/NumericInputInline';
import { enrichQuestFieldsMentions, enrichQuestTaskFieldsMentions } from '../types/mention';
import Icon from '../components/icons/Icon';


const QuestEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessKey } = useAuth();
  const { addNotification } = useNotifications();

  // Derived state
  const newQuest = !id;
  
  // Simplified state
  const [quest, setQuest] = useState<Quest | null>(newQuest ? {} as Quest : null);
  const [tasks, setTasks] = useState<QuestTask[]>([]);
  
  // API calls
  const { data: apiData } = useApi.get<QuestPageData>(`/quest/${id}`, accessKey, [], newQuest);
  const { data: suggestionData } = useApi.get<SuggestionData>(`/suggestions`, accessKey);

  // Sync data to state
  useEffect(() => {
    if (apiData?.quest && apiData?.tasks && suggestionData) {
      setQuest(apiData.quest);
      setTasks(apiData.tasks.sort((a, b) => a.id - b.id));
    };
  }, [apiData, suggestionData]);

  const handleFieldChange = (value: any, field?: string) => {
    if (!field) return
    setQuest(prev => prev ? { ...prev, [field]: value } : null);
  };

  const addTask = () => {
    if (!quest) return
    setTasks([...tasks, NewQuestTask(quest.id)]);
  };

  const deleteTask = (removeIndex : number) => {
    if (!quest) return
    setTasks(prev => prev.filter((_, i) => i !== removeIndex));
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

  const saveEdited = async (editedQuest : Quest | null, editedTasks : QuestTask[]) => {
    if (!quest || !suggestionData) return;

    const enrichedQuest = enrichQuestFieldsMentions(editedQuest, suggestionData);
    const enrichedTasks = enrichQuestTaskFieldsMentions(editedTasks, suggestionData);
    
    const endpoint = '/quest';
    const method = newQuest ? api.post : api.put;
    //console.log(suggestionData)
    const { data, error } = await method<Quest>(endpoint, accessKey, {quest: enrichedQuest, tasks: enrichedTasks});

    if (error) {
      addNotification(`Ошибка: ${error.message}`, 'error'); 
    } else if (!error) {
      navigate(data?.id ? `/quest/${data.id}` : '/quests');
    };
  };

  if (!newQuest && !quest || !suggestionData) {
    return <div>Loading...</div>;
  };

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <div className='flex flex-col'>
        <InputField 
          className="mb-4" 
          label='Название'
          setValue={quest?.name} 
          entityEdit={{ fieldName: 'name', handleFieldChange }}
        />
        <InputField 
          className="mb-4" 
          label='Действие'
          setValue={quest?.title} 
          entityEdit={{ fieldName: 'title', handleFieldChange }}
        />
        <RichInput 
          label='Описание' 
          setValue={quest?.description} 
          entityEdit={{ fieldName: 'description', handleFieldChange }} 
          fullSuggestionData={suggestionData}
        />

        {tasks && <div className='flex flex-col mt-8'>
          <div className="flex-1 border-t border-gray-700 mb-4"/>
          <h2 className='text-2xl mb-4'>
            Задачи
          </h2>
          {tasks.map((task, i) => {
              return (
                <div className='flex flex-col items-left mb-4'>
                  <InputField label='Название задачи' className='text-md my-2 w-full' setValue={task.name} entityEdit={{ fieldName: 'name', arrayIndex: i, handleFieldChange: handleTasksChange}}/>
                  <RichInput label='Доп. информация' setValue={task.description} entityEdit={{ fieldName: 'description', arrayIndex: i, handleFieldChange: handleTasksChange}} fullSuggestionData={suggestionData}/>
                  <div className='flex justify-between gap-8'>
                    <SelectInput className='w-[40%]' options={[ {key: 0, value: "Выполнение"}, {key: 1, value: "Количество"} ]} setKey={task.type} entityEdit={{ fieldName: 'type', arrayIndex: i, handleFieldChange: handleTasksChange}} />               
                    <div className='flex gap-8'>
                      {task.type > 0 && 
                        <NumericInputInline setValue={task.capacity} entityEdit={{ fieldName: 'capacity', arrayIndex: i, handleFieldChange: handleTasksChange}} />
                      }
                      <button className='pr-2' onClick={() => deleteTask(i)}>
                        <Icon 
                          key={`icon_edit_${task.id}`} 
                          name='trash'
                          className='text-red-500 hover:fill-current hover:text-gray-400 cursor-pointer'/>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white my-2 py-2 px-4 rounded"
            onClick={() => addTask()}
          >
            {"Добавить задачу"}
          </button>
        </div>}

        <div className="flex-1 border-t border-gray-700 my-2"/>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white mt-2 py-2 px-4 rounded"
          onClick={() => saveEdited(quest, tasks)}
        >
          {quest?.id ? "Сохранить" : "Создать"}
        </button>
      </div>
    </div>  
  );
};

export default QuestEditPage;