import Icon from "@/components/icons/Icon";
import { useNotifications } from "@/context/NotificationContext";
import { useApi } from "@/hooks/useApi";
import { selectCurrentGameSuggestions } from "@/reducers/CurrentGameSlice";
import { selectAuthorization } from "@/reducers/PlayerSlice";
import { useAppSelector } from "@/store";
import { simplerQuestFieldsMentions, simplerQuestTaskFieldsMentions, enrichQuestFieldsMentions, enrichQuestTaskFieldsMentions } from "@/types/mention";
import { type Quest, type QuestTask, type QuestPageData, NewQuestTask } from "@/types/quest";
import { convertSuggestionDataToRender } from "@/types/suggestion";
import { api } from "@/utils/api";
import ConfirmButton from "@lib/ConfirmButton";
import Divider from "@lib/Divider";
import { InputField } from "@lib/Inputs/InputField";
import { NumericInputInline } from "@lib/Inputs/NumericInputInline";
import { RichInput } from "@lib/Inputs/RichInput";
import { SelectInput } from "@lib/Inputs/SelectInput";
import LoadingLabel from "@lib/LoadingLabel";
import SubmitButton from "@lib/SubmitButton";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const QuestEditPage = () => {
  const { id } = useParams();
  const newQuest = !id;
  const navigate = useNavigate();

  const auth = useAppSelector(selectAuthorization);
  const suggestions = useAppSelector(selectCurrentGameSuggestions);

  const [quest, setQuest] = useState<Quest | null>(newQuest ? {} as Quest : null);
  const [tasks, setTasks] = useState<QuestTask[]>([]);

  const { data: questData, loading, error } = useApi.get<QuestPageData>(`/quest/${id}`, auth, [], newQuest);

  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!questData || !questData.quest) return;
    if (!suggestions) return;

    setQuest(simplerQuestFieldsMentions(questData.quest, suggestions));
    setTasks(simplerQuestTaskFieldsMentions(questData.tasks.sort((a, b) => a.id - b.id), suggestions));
  }, [questData, suggestions]);

  const handleFieldChange = (value: any, field?: string) => {
    if (!field) return;
    setQuest(prev => prev ? { ...prev, [field]: value } : null);
  };

  const addTask = () => {
    if (!quest) return;
    setTasks([...tasks, NewQuestTask(quest.id)]);
  };

  const deleteTask = (removeIndex: number) => {
    if (!quest) return;
    setTasks(prev => prev.filter((_, i) => i !== removeIndex));
  };

  const handleTasksChange = (value: any, field?: string, index?: number) => {
    if (!field || !tasks) return;
    setTasks(prev =>
      prev ? prev.map((task, i) =>
        i === index
          ? { ...task, [field]: value }
          : task
      ) : []
    );
  };

  const saveEdited = async (editedQuest: Quest | null, editedTasks: QuestTask[]) => {
    if (!quest || !suggestions) return;

    const enrichedQuest = enrichQuestFieldsMentions(editedQuest, convertSuggestionDataToRender(suggestions));
    const enrichedTasks = enrichQuestTaskFieldsMentions(editedTasks, convertSuggestionDataToRender(suggestions));

    const endpoint = '/quest';
    const method = newQuest ? api.post : api.put;
    const { data, error } = await method<Quest>(endpoint, auth, { quest: enrichedQuest, tasks: enrichedTasks });

    if (error) {
      addNotification(`Ошибка: ${error.message}`, 'error');
    } else if (!error) {
      navigate(data?.id ? `/quests/${data.id}` : '/quests');
    };
  };

  const handleResetQuest = async () => {
    if (quest == null) return

    const { error, status } = await api.patch(`/quest/${id}/reset`, auth, null);
    if (status === 200) {
      addNotification("Выполнение квеста отменено", 'success');
      //setTasks(data);
      navigate(0);
    } else {
      var errorMessage = error ? `Ошибка: ${error.message}` : `Неизвестная ошибка (код ${status})`
      addNotification(errorMessage, 'error');
    }
  };

  const deleteQuest = async () => {
    if (!quest) return;

    const { error } = await api.delete(`/quests/${quest.id}`, auth);

    if (error) {
      addNotification(error.message, 'error');
    } else {
      addNotification("Квест удалён", 'info');
      navigate('/quests');
    };
  };

  // if (!newQuest && !quest || !suggestions) {
  //   return <div>Loading...</div>;
  // };

  return (
    <div className='max-w-4xl mx-auto p-4'>
      {loading ? (
        <LoadingLabel />
      ) : !newQuest && (error || !quest) ? (
        <p>Данные недоступны</p>
      ) : (<div className='flex flex-col gap-4'>
        <InputField
          label='Название'
          value={quest?.name}
          entityEdit={{ fieldName: 'name', handleFieldChange }}
        />
        <InputField
          label='Действие'
          value={quest?.title}
          entityEdit={{ fieldName: 'title', handleFieldChange }}
        />
        <RichInput
          label='Описание'
          value={quest?.description}
          entityEdit={{ fieldName: 'description', handleFieldChange }}
          suggestionData={convertSuggestionDataToRender(suggestions)}
        />

        {quest!.finished && <ConfirmButton 
          className='w-full' 
          children={'Отменить завершение квеста'} 
          onClickConfirm={handleResetQuest}  
        />}

        <Divider />

        {tasks && <div className='flex flex-col gap-4'>
          <h2 className='text-2xl mb-2'>
            Задачи
          </h2>
          {tasks.map((task, i) => {
            return (
              <div key={`questpage_task-${task.id ?? 0}-${i}_edit`} className='flex flex-col items-left gap-2 mb-4'>
                <InputField label='Название задачи' className='text-md my-2 w-full' value={task.name} entityEdit={{ fieldName: 'name', arrayIndex: i, handleFieldChange: handleTasksChange }} />
                <RichInput label='Доп. информация' value={task.description} entityEdit={{ fieldName: 'description', arrayIndex: i, handleFieldChange: handleTasksChange }} suggestionData={convertSuggestionDataToRender(suggestions)} />
                <div className='flex justify-between gap-8'>
                  <SelectInput className='w-[40%]' options={[{ key: 0, value: "Выполнение" }, { key: 1, value: "Количество" }]} setKey={task.type} entityEdit={{ fieldName: 'type', arrayIndex: i, handleFieldChange: handleTasksChange }} />
                  <div className='flex gap-8'>
                    {task.type > 0 && <NumericInputInline 
                      value={task.capacity} 
                      entityEdit={{ fieldName: 'capacity', arrayIndex: i, handleFieldChange: handleTasksChange }} 
                    />}
                    <button className='pr-2' onClick={() => deleteTask(i)}>
                      <Icon
                        key={`icon_edit_${task.id}`}
                        name='trash'
                        className='icon-button-danger' />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <SubmitButton
            onClick={() => addTask()}
          >
            {"Добавить задачу"}
          </SubmitButton>
        </div>}

        <Divider className='my-2' />

        {quest?.id ? <div className='flex justify-between items-center'>
          <SubmitButton
            onClick={deleteQuest}
            className='w-[30%]'
            danger
          >
            {"Удалить"}
          </SubmitButton>

          <SubmitButton
            onClick={() => saveEdited(quest, tasks)}
            className='w-[65%]'
          >
            {"Сохранить"}
          </SubmitButton>
        </div> :
          <SubmitButton
            onClick={() => saveEdited(quest, tasks)}
          >
            {"Сохранить"}
          </SubmitButton>}
      </div>)}
    </div>
  );
};

export default QuestEditPage;