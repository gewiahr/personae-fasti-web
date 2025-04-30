// components/RecordEdit.tsx
import { useEffect, useState } from 'react';
import { enrichMentionInput, simplifyMentionInput } from '../types/mention';
import { Modal } from './Modal';
import { RichInput } from "./RichInput";
import { SuggestionData } from '../types/suggestion';
import { Record } from "../types/request";
import { api } from '../utils/api';
import { useAuth } from '../hooks/useAuth';

interface RecordEditProps {
  record: Record;
  onClose: () => void;
  fullSuggestionData?: SuggestionData;
}

export const RecordEdit = ({
  record,
  onClose,
  fullSuggestionData
}: RecordEditProps) => {
  const { accessKey } = useAuth();
  const [editedText, setEditedText] = useState<string>();

  const onInputChange = (value : string) => {
    setEditedText(value);
  };

  const handleSave = async () => {
    if (!editedText) {
      return
    }
    const enrichedText = enrichMentionInput(editedText, fullSuggestionData?.entities || []);
    const { data, error } = await api.put(`/record`, accessKey, { id: record.id, text: enrichedText });
    
    if (error) {
      console.log(error);
    } else if (data) {
      onClose();
    }
  };

  useEffect(() => {
    if (fullSuggestionData?.entities) {
      setEditedText(simplifyMentionInput(record.text, fullSuggestionData.entities));
    }
  }, [fullSuggestionData, record.text]);

  return (
    <Modal 
      onClose={onClose}
      title="Редактирование записи"
    >
      {fullSuggestionData && <div className='pt-4'>
          <RichInput key={1000} label="" setValue={simplifyMentionInput(record.text, fullSuggestionData?.entities)} entityEdit={{ handleFieldChange: onInputChange }} fullSuggestionData={fullSuggestionData} />
        </div>}
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2 py-2 px-4 rounded"
          onClick={handleSave}
        >
          {"Сохранить"}
        </button>
    </Modal>
  );
};

export default RecordEdit;