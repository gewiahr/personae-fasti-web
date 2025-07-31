// components/RecordEdit.tsx
import { useEffect, useState } from 'react';
import { enrichMentionInput, simplifyMentionInput } from '../types/mention';
import { Modal } from './Modal';
import { RichInput } from "./RichInput";
import { SuggestionData } from '../types/suggestion';
import { GameInfo, PlayerInfo, Record } from "../types/request";
import { api } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { ToggleSwitch } from './ToggleSwitch';
import { useNotifications } from '../context/NotificationContext';
import { Quest } from '../types/quest';
import { SelectInput } from './SelectInput';

interface RecordEditProps {
  record: Record;
  currentPlayer: PlayerInfo;
  currentGame: GameInfo;
  onClose: () => void;
  fullSuggestionData?: SuggestionData;
}

export const RecordEdit = ({
  record,
  currentPlayer,
  currentGame,
  onClose,
  fullSuggestionData
}: RecordEditProps) => {
  const { accessKey } = useAuth();
  const [postHidden, setPostHidden] = useState<boolean>(record.hiddenBy !== 0);
  const [editedRecord, setEditedRecord] = useState<Record>(record);
  const [questInfo, setQuestInfo] = useState<Quest[]>([]);

  const { addNotification } = useNotifications();

  useEffect(() => {
    getQuests();
  }, []);

  const getQuests = async () => {
    const { data } = await api.get('/quests', accessKey);
    if (data) {
      setQuestInfo(data.quests);
    };
  };

  const onInputChange = (value: string) => {
    setEditedRecord({...editedRecord, text: value});
  };

  const handleSave = async () => {
    if (!editedRecord) {
      return;
    };

    const enrichedText = enrichMentionInput(editedRecord.text, fullSuggestionData?.entities || []);
    const { data, error } = await api.put(`/record`, accessKey, {...editedRecord, text: enrichedText});

    if (error) {
      addNotification(error.message, 'error');
    } else if (data) {
      onClose();
    };
  };

  const handleDelete = async () => {
    const { error } = await api.delete(`/record/${record.id}`, accessKey);

    if (error) {
      addNotification(error.message, 'error');
    } else {
      onClose();
      addNotification("Запись удалена", 'info');
    };
  };

  const handleQuestIDChange = async (value : number) => {
    setEditedRecord({...editedRecord, questID: value});
  };

  useEffect(() => {
    if (fullSuggestionData?.entities) {
      setEditedRecord({...editedRecord, text: simplifyMentionInput(record.text, fullSuggestionData.entities)});
    }
  }, [fullSuggestionData, editedRecord.text]);

  return (
    <Modal
      onClose={onClose}
      title="Редактирование записи"
    >
      {fullSuggestionData && <div className='py-4'>
        <RichInput 
          key={1000} 
          label="" 
          setValue={simplifyMentionInput(record.text, fullSuggestionData?.entities)} 
          entityEdit={{ handleFieldChange: onInputChange }} 
          fullSuggestionData={fullSuggestionData} />
      </div>}

      <h2 className='text-lg py-2'>Дополнительно</h2>

      {questInfo && questInfo.length > 0 && <div className='py-2'>
        <SelectInput 
          key={"recordedit_questselect"}
          options={questInfo.map((quest) => { return { key: quest.id, value: quest.name } })} 
          label='Связанное задание' 
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
        <button
          className="w-[30%] bg-red-600 hover:bg-red-700 text-white mt-2 py-2 px-4 rounded"
          onClick={handleDelete}
        >
          {"Удалить"}
        </button>

        <button
          className="w-[65%] bg-blue-600 hover:bg-blue-700 text-white mt-2 py-2 px-4 rounded"
          onClick={handleSave}
        >
          {"Сохранить"}
        </button>
      </div>

    </Modal>
  );
};

export default RecordEdit;