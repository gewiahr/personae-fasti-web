// components/EventInput.tsx
import { useState } from 'react';

type RecordInputProps = {
  onSubmit: (content: string) => void;
};

export const RecordInput = ({ onSubmit }: RecordInputProps) => {
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;
    
    setIsSubmitting(true);
    onSubmit(input);
    setInput('');
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col space-y-2">
        {/*<label htmlFor="event-input" className="text-sm font-medium">
          New Game Event
        </label>*/}
        <textarea
          id="event-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border border-gray-600 rounded-md p-3 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Опишите текущие события"
          rows={3}
        />
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