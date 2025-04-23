import { useEffect, useState } from 'react';
import { RichInput } from './RichInput';
import { SuggestionData } from '../types/suggestion';
import { enrichMentionInput } from '../types/mention';

type RecordInputProps = {
  onSubmit: (content: string) => void;
  suggestionData?: SuggestionData | null;
};

export const RecordInput = ({ onSubmit, suggestionData = null }: RecordInputProps) => {
  const [input, setInput] = useState('');
  const [richInputKey, setRichInputKey] = useState(0); // Add key for reset
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    
  }, [suggestionData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || !suggestionData) return;
    
    setIsSubmitting(true);
    const enrichedText = enrichMentionInput(input, suggestionData?.entities)
    onSubmit(enrichedText);
    setInput('');
    setRichInputKey(prev => prev + 1);
    setIsSubmitting(false);
  };

  const handleFieldChange = (value: string) => {
    console.log(value);
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
        <RichInput key={richInputKey} label='' setValue={input} entityEdit={{ handleFieldChange }} fullSuggestionData={suggestionData} />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || input.trim() === ''}
        className={`mt-2 px-4 py-2 rounded-md text-white ${
          isSubmitting || input.trim() === ''
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isSubmitting ? 'Публикуется...' : 'Опубликовать'}
      </button>
    </form>
  );
};