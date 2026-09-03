import { useEffect, useState } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { selectCurrentGameQuests, loadCurrentGameQuests, editRecord, deleteRecord } from '@/reducers/CurrentGameSlice';
import { selectAuthorization, selectPlayerExt } from '@/reducers/PlayerSlice';
import { useAppDispatch, useAppSelector } from '@/store';
import type { GameBrief } from '@/types/game';
import type { SuggestionEntityRender } from '@/types/suggestion';
import { SelectInput } from '@lib/Inputs/SelectInput';
import SubmitButton from '@lib/SubmitButton';
import { ToggleSwitch } from '@lib/ToggleSwitch';
import { type Record } from '@/types/record'
import { MarkdownInput } from '@lib/Inputs/MarkdownInput';


interface RecordEditProps {
  record: Record;
  currentGame: GameBrief;
  onClose: () => void;
  suggestionData: SuggestionEntityRender[];
}

export const RecordEdit = ({
  record,
  currentGame,
  onClose,
  suggestionData
}: RecordEditProps) => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuthorization);
  const playerExt = useAppSelector(selectPlayerExt);
  const quests = useAppSelector(selectCurrentGameQuests);

  const [postHidden, setPostHidden] = useState<boolean>(record.hidden);
  const [editedRecord, setEditedRecord] = useState<Record>(record);

  const { addNotification } = useNotifications();
  
  const notUpdated = record.created === record.updated

  useEffect(() => {
    dispatch(loadCurrentGameQuests({ auth }))
  }, [auth, dispatch]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  const onInputChange = (value: string) => {
    setEditedRecord({ ...editedRecord, text: value });
  };

  const handleSave = () => {
    if (!editedRecord) return;

    dispatch(editRecord({
      auth,
      record: { ...editedRecord, hidden: postHidden }
    }))
      .unwrap()
      .then(() => {
        onClose();
        addNotification('Запись сохранена', 'success');
      })
      .catch((error: unknown) => {
        const message = error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : 'Ошибка при сохранении';
        addNotification(message, 'error');
      });
  };

  const handleDelete = () => {
    if (!editedRecord) return;

    dispatch(deleteRecord({
      auth,
      recordExt: record.ext
    }))
      .unwrap()
      .then(() => {
        onClose();
        addNotification('Запись удалена', 'info');
      })
      .catch((error: unknown) => {
        const message = error && typeof error === 'object' && 'message' in error
          ? String(error.message)
          : 'Ошибка при удалении';
        addNotification(message, 'error');
      });
  };

  const handleQuestExtChange = (value: string) => {
    setEditedRecord({ ...editedRecord, questExt: value });
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-bold text-lg">Редактирование записи</h3>
        <button
          type="button"
          aria-label="Закрыть редактирование"
          className="text-2xl leading-none transition-colors hover:text-gray-600"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      <div className='py-4'>
        <MarkdownInput
          key={1000}
          label=""
          value={record.text}
          entityEdit={{ handleFieldChange: onInputChange }}
          suggestionData={suggestionData} />
      </div>

      {(quests && quests.length > 0 || playerExt == currentGame.gmExt) && <h2 className='text-lg py-2'>Дополнительно</h2>}

      {quests && quests.length > 0 && <div className='py-2'>
        <SelectInput
          key={"recordedit_questselect"}
          options={quests.map((quest) => { return { key: quest.ext, value: quest.name } })}
          label='Связанный квест'
          setKey={editedRecord.questExt}
          entityEdit={{ handleFieldChange: handleQuestExtChange }}
          nullable={true}
        />
      </div>}

      {playerExt == currentGame.gmExt && <div className='py-2'>
        <ToggleSwitch
          key={"recordedit_hiddenswitch"}
          label="Скрыть пост"
          labelPosition='right'
          setValue={postHidden}
          entityEdit={{ handleFieldChange: (value) => setPostHidden(value) }}
        />
      </div>}
      
      <div className='flex flex-col pt-4'>
        <span className='datestamp-label self-end select-none'>Создано: {new Date(record.created).toLocaleDateString()}</span>
        {!notUpdated && <span className='datestamp-label self-end select-none'>Обновлено: {new Date(record.updated).toLocaleDateString()}</span>}
      </div>

      <div className='flex justify-between items-center mt-4'>
        <SubmitButton 
          onClick={handleDelete}
          danger={true}
          className="w-[30%]"
        >
          {"Удалить"}
        </SubmitButton>

        <SubmitButton 
          onClick={handleSave} 
          className="w-[65%]"
        >
          {"Сохранить"}  
        </SubmitButton>
      </div>

    </div>
  );
};

export default RecordEdit;
