import { useEffect, useState } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { selectCurrentGameQuests, loadCurrentGameQuests, editRecord, deleteRecord } from '@/reducers/CurrentGameSlice';
import { selectAuthorization } from '@/reducers/PlayerSlice';
import { useAppDispatch, useAppSelector } from '@/store';
import { enrichMentionInput, simplifyMentionInput } from '@/types/mention';
import type { PlayerInfo, GameInfo } from '@/types/request';
import type { SuggestionEntityRender } from '@/types/suggestion';
import { RichInput } from '@lib/Inputs/RichInput';
import { SelectInput } from '@lib/Inputs/SelectInput';
import { Modal } from '@lib/Modal';
import SubmitButton from '@lib/SubmitButton';
import { ToggleSwitch } from '@lib/ToggleSwitch';
import { type Record } from '@/types/request'


interface RecordEditProps {
  record: Record;
  currentPlayer: PlayerInfo;
  currentGame: GameInfo;
  onClose: () => void;
  suggestionData: SuggestionEntityRender[];
}

export const RecordEdit = ({
  record,
  currentPlayer,
  currentGame,
  onClose,
  suggestionData
}: RecordEditProps) => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuthorization);
  const quests = useAppSelector(selectCurrentGameQuests);

  const [postHidden, setPostHidden] = useState<boolean>(record.hiddenBy !== 0);
  const [editedRecord, setEditedRecord] = useState<Record>(record);

  const { addNotification } = useNotifications();

  useEffect(() => {
    dispatch(loadCurrentGameQuests({ auth }))
  }, []);

  const onInputChange = (value: string) => {
    setEditedRecord({ ...editedRecord, text: value });
  };

  const handleSave = () => {
    if (!editedRecord) return;

    const enrichedText = enrichMentionInput(editedRecord.text, suggestionData);

    dispatch(editRecord({
      auth,
      record: { ...editedRecord, text: enrichedText }
    }))
      .unwrap()
      .then(() => {
        onClose();
        addNotification('Запись сохранена', 'success');
      })
      .catch((e: any) => {
        addNotification(e?.message || 'Ошибка при сохранении', 'error');
      });
  };

  const handleDelete = () => {
    if (!editedRecord) return;

    dispatch(deleteRecord({
      auth,
      recordID: record.id
    }))
      .unwrap()
      .then(() => {
        onClose();
        addNotification('Запись удалена', 'info');
      })
      .catch((e: any) => {
        addNotification(e?.message || 'Ошибка при удалении', 'error');
      });
  };

  const handleQuestIDChange = async (value: number) => {
    setEditedRecord({ ...editedRecord, questID: value });
  };

  useEffect(() => {
    if (suggestionData) {
      setEditedRecord({ ...editedRecord, text: simplifyMentionInput(editedRecord.text, suggestionData) });
    }
  }, [suggestionData, editedRecord.text]);

  return (
    <Modal
      onClose={onClose}
      title="Редактирование записи"
    >
      {suggestionData && <div className='py-4'>
        <RichInput
          key={1000}
          label=""
          value={simplifyMentionInput(record.text, suggestionData)}
          entityEdit={{ handleFieldChange: onInputChange }}
          suggestionData={suggestionData} />
      </div>}

      <h2 className='text-lg py-2'>Дополнительно</h2>

      {quests && quests.length > 0 && <div className='py-2'>
        <SelectInput
          key={"recordedit_questselect"}
          options={quests.map((quest) => { return { key: quest.id, value: quest.name } })}
          label='Связанный квест'
          setKey={editedRecord.questID}
          entityEdit={{ handleFieldChange: handleQuestIDChange }}
          nullable={true}
        />
      </div>}

      {currentPlayer.id == currentGame.gmID &&
        <div className='py-2'>
          <ToggleSwitch
            key={"recordedit_hiddenswitch"}
            label="Скрыть пост"
            labelPosition='right'
            setValue={postHidden}
            entityEdit={{ handleFieldChange: (value) => setPostHidden(value) }}
          />
        </div>
      }

      <div className='flex justify-between items-center'>
        <SubmitButton 
          onClick={handleDelete}
          danger={true}
          className="w-[30%] mt-2"
        >
          {"Удалить"}
        </SubmitButton>

        <SubmitButton 
          onClick={handleSave} 
          className="w-[65%] mt-2"
        >
          {"Сохранить"}  
        </SubmitButton>
      </div>

    </Modal>
  );
};

export default RecordEdit;