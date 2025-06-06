import { useEffect, useState } from 'react';
import { RichInput } from './RichInput';
import { SuggestionData } from '../types/suggestion';
import { enrichMentionInput } from '../types/mention';
import { ToggleSwitch } from './ToggleSwitch';
import { GameInfo, PlayerInfo } from '../types/request';
//import { ToggleSwitch } from './ToggleSwitch';

type RecordInputProps = {
  currentPlayer: PlayerInfo;
  currentGame: GameInfo;
  onSubmit: (content: string, hidden: boolean) => void;
  suggestionData?: SuggestionData | null;
};

export const RecordInput = ({ currentPlayer, currentGame, onSubmit, suggestionData = null }: RecordInputProps) => {
  const [input, setInput] = useState('');
  const [postHidden, setPostHidden] = useState(false);
  const [richInputKey, setRichInputKey] = useState(0); // Add key for reset
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    
  }, [suggestionData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || !suggestionData) return;
    
    setIsSubmitting(true);
    const enrichedText = enrichMentionInput(input, suggestionData?.entities)
    onSubmit(enrichedText, postHidden);
    setInput('');
    setRichInputKey(prev => prev + 1);
    setIsSubmitting(false);
  };

  const handleFieldChange = (value: string) => {
    setInput(value);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col space-y-2">
        {/*<label htmlFor="event-input" className="text-sm font-medium">
          New Game Event
        </label>*/}
        {/* <textarea
          id="event-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border border-gray-600 rounded-md p-3 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Опишите текущие события"
          rows={3}
        /> */}
        <RichInput 
          key={richInputKey} 
          label='' 
          setValue={input} 
          entityEdit={{ handleFieldChange }} 
          fullSuggestionData={suggestionData} 
        />
      </div>
      <div className="flex justify-between items-center mt-2"> 
        <button
          type="submit"
          disabled={isSubmitting || input.trim() === ''}
          className={`px-4 py-2 rounded-md text-white ${
            isSubmitting || input.trim() === ''
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Публикуется...' : 'Опубликовать'}
        </button>
        {currentPlayer.id == currentGame.gmID && <ToggleSwitch 
          key={100} 
          label='Скрыть пост' 
          labelPosition='left' 
          entityEdit={{ handleFieldChange : (value) => setPostHidden(value) }} 
          setValue={postHidden} 
        />}
      </div>
    </form>
  );
};