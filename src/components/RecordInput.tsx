import { useEffect, useState } from 'react';
import { RichInput } from './RichInput';
import { SuggestionData } from '../types/suggestion';
import { enrichMentionInput } from '../types/mention';
import { ToggleSwitch } from './ToggleSwitch';
import { GameInfo, PlayerInfo } from '../types/request';
import { SelectInput } from './SelectInput';
import { Quest } from '../types/quest';
import Icon from './icons/Icon';

type RecordInputProps = {
  currentPlayer: PlayerInfo;
  currentGame: GameInfo;
  onSubmit: (content: string, hidden: boolean, questID: number) => void;
  suggestionData?: SuggestionData | null;
  questInfo?: Quest[];
};

export const RecordInput = ({ currentPlayer, currentGame, onSubmit, suggestionData = null, questInfo = [] }: RecordInputProps) => {
  const [input, setInput] = useState<string>('');
  const [questID, setQuestID] = useState<number>(0);
  
  const [postHidden, setPostHidden] = useState<boolean>(false);
  const [richInputKey, setRichInputKey] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [postSettingsOpen, setPostSettingsOpen] = useState<boolean>(false);

  useEffect(() => {
    
  }, [suggestionData]);

  const handleSubmit = () => {
    if (input.trim() === '' || !suggestionData) return;
    setIsSubmitting(true);
    const enrichedText = enrichMentionInput(input, suggestionData?.entities)
    onSubmit(enrichedText, postHidden, questID);
    setInput('');
    setRichInputKey(prev => prev + 1);
    setIsSubmitting(false);
  };

  const handleFieldChange = (value: string) => {
    setInput(value);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col space-y-2">
        <RichInput 
          key={richInputKey} 
          label='Что нового?' 
          setValue={input} 
          entityEdit={{ handleFieldChange }} 
          fullSuggestionData={suggestionData} 
        />
      </div>
      {postSettingsOpen && <div className='flex justify-between gap-6 items-center my-2'>
        {questInfo && questInfo.length > 0 && <SelectInput 
          key={"recordinput_questselect"}
          className='w-[100%]'
          options={questInfo.map((quest) => { return { key: quest.id, value: quest.name } })} 
          label='Связанный квест' 
          setKey={questID} 
          entityEdit={{ handleFieldChange: (value) => {setQuestID(value)} }} 
          nullable={true}
        />}
        {currentPlayer.id == currentGame.gmID && <ToggleSwitch 
          key={"recordinput_hiddenswitch"} 
          label='Скрыть пост' 
          labelPosition='left' 
          className='w-[250px]'
          entityEdit={{ handleFieldChange : (value) => setPostHidden(value) }} 
          setValue={postHidden} 
        />}
      </div>}
      <div className="flex justify-between items-center mt-2">    
        <button
          className={`px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700`}
          onClick={() => setPostSettingsOpen(!postSettingsOpen)}
        >
          <Icon name={`${postSettingsOpen ? 'arrowUp' : 'arrowDown'}`} />
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || input.trim() === ''}
          className={`px-4 py-2 rounded-md text-white ${
            isSubmitting || input.trim() === ''
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Публикуется...' : 'Опубликовать'}
        </button>
      </div>
      
    </div>
  );
};