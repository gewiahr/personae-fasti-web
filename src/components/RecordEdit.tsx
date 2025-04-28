import { Record } from "../types/request";
import { useEffect, useState } from "react";
import "../styles/modals.css"
import { RichInput } from "./RichInput";
import { SuggestionData } from "../types/suggestion";
import { enrichMentionInput, simplifyMentionInput } from "../types/mention";
import { api } from "../utils/api";
import { useAuth } from "../hooks/useAuth";

interface RecordEditProps {
  record: Record;
  closeModal: () => void;
  fullSuggestionData?: SuggestionData;
};

const RecordEdit = ({ record, closeModal, fullSuggestionData }: RecordEditProps) => {
  const { accessKey } = useAuth();
  const [ editedText, setEditedText ] = useState<string>();

  const onInputChange = (value : string) => {
    setEditedText(value);
  };

  const onSaveEdited = async () => {
    if (!editedText) {
      return;
    }

    const enrichedText = enrichMentionInput(editedText, fullSuggestionData?.entities || []);
    const { data, error } = await api.put(`/record`, accessKey, { id: record.id, text: enrichedText });
    
    if (error) {
      console.log(error);
    } else if (data) {
      closeModal();
    }
  };

  useEffect(() => {
    if (fullSuggestionData?.entities) {
      setEditedText(simplifyMentionInput(record.text, fullSuggestionData.entities));
    }    
  }, []);

  // Close modal when clicking outside of it
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };

    window.addEventListener('keydown', handleEsc);

    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeModal]);

  return (
    <div className="modal-overlay fixed inset-0 bg-black/50 flex justify-center items-center z-50" onClick={closeModal}>
      <div className="p-4 rounded-lg border border-blue-500 bg-gray-800 p-5 rounded-lg relative max-w-2xl w-[90%] mx-4 animate-in fade-in zoom-in-95 duration-300 ease-out" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold">Редактирование записи</h3>
        {fullSuggestionData && <div className='pt-4'>
          <RichInput key={1000} label="" setValue={simplifyMentionInput(record.text, fullSuggestionData?.entities)} entityEdit={{ handleFieldChange: onInputChange }} fullSuggestionData={fullSuggestionData} />
        </div>}
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2 py-2 px-4 rounded"
          onClick={onSaveEdited}
        >
          {"Сохранить"}
        </button>
        <button onClick={closeModal} className="modal-close absolute right-4 top-1 text-2xl hover:text-gray-600 transition-colors duration-150">x</button>
      </div>
    </div>
  );
};

export default RecordEdit;