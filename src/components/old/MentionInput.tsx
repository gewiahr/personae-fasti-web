import React, { useState, useRef, useCallback, KeyboardEvent } from 'react';
import { MentionableEntity, MentionOld } from './Mentions';

type MentionInputProps = {
  value: string;
  onChange: (text: string, mentions: MentionOld[]) => void;
  existingEntities: MentionableEntity[];
  onCreateEntity: (name: string, type: 'character' | 'place') => Promise<MentionableEntity>;
  onMentionClick?: (mention: MentionOld) => void;
};

export const MentionInput: React.FC<MentionInputProps> = ({
  value,
  onChange,
  existingEntities,
  onCreateEntity,
  onMentionClick,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [mentions, setMentions] = useState<MentionOld[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<MentionableEntity[]>([]);
  const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 });
  const [currentMentionType, setCurrentMentionType] = useState<'character' | 'place'>('character');
  const [currentQuery, setCurrentQuery] = useState('');
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const getMentionContext = useCallback((text: string, cursorPos: number) => {
    const textBeforeCursor = text.substring(0, cursorPos);
    const triggers = [
      { symbol: '@', type: 'character' as const },
      { symbol: '#', type: 'place' as const },
    ];

    for (const trigger of triggers) {
      const lastIndex = textBeforeCursor.lastIndexOf(trigger.symbol);
      if (lastIndex !== -1) {
        const query = text.substring(lastIndex + 1, cursorPos).trim();
        return { trigger: trigger.symbol, type: trigger.type, position: lastIndex, query };
      }
    }
    return null;
  }, []);

  const showMentionSuggestions = useCallback((
    position: number,
    type: 'character' | 'place',
    query: string
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const filtered = existingEntities.filter(entity => 
      entity.type === type && entity.name.toLowerCase().includes(query.toLowerCase())
    );
    
    setSuggestions(filtered);
    setCurrentMentionType(type);
    setCurrentQuery(query);

    const textareaRect = textarea.getBoundingClientRect();
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const linesBefore = textarea.value.substring(0, position).split('\n').length - 1;
    
    setSuggestionPosition({
      top: textareaRect.top + (linesBefore * lineHeight) + lineHeight,
      left: textareaRect.left + 10
    });
    setShowSuggestions(true);
  }, [existingEntities]);

  const handleCreateNewEntity = useCallback(async () => {
    if (!currentQuery) return;
    
    try {
      const newEntity = await onCreateEntity(currentQuery, currentMentionType);
      insertMention(newEntity);
    } catch (error) {
      console.error('Failed to create entity:', error);
    }
  }, [currentQuery, currentMentionType, onCreateEntity]);

  // Keyboard navigation for suggestions
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => Math.min(prev + 1, suggestions.length));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex === suggestions.length) {
          handleCreateNewEntity();
        } else {
          const selected = suggestions[selectedSuggestionIndex];
          selected && insertMention(selected);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        break;
    }
  }, [showSuggestions, suggestions, selectedSuggestionIndex]);

  // Handle text changes and mention deletion
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;

    // Check if we're deleting part of a mention
    const deletedMention = mentions.find(m => 
      cursorPos && cursorPos > m.start && cursorPos <= m.end
    );

    if (deletedMention) {
      // Remove the mention
      const newMentions = mentions.filter(m => m.id !== deletedMention.id);
      const newText = newValue.slice(0, deletedMention.start) + newValue.slice(deletedMention.end);
      
      setInputValue(newText);
      setMentions(newMentions);
      onChange(newText, newMentions);
      return;
    }

    setInputValue(newValue);
    const context = getMentionContext(newValue, cursorPos);
    
    if (context) {
      showMentionSuggestions(context.position, context.type, context.query);
    } else {
      setShowSuggestions(false);
    }
  }, [mentions, onChange]);

  // Improved mention insertion with position adjustment
  const insertMention = useCallback((entity: MentionableEntity) => {
    const text = inputValue;
    const cursorPos = textareaRef.current?.selectionStart || 0;
    console.log(text, cursorPos)
    const context = getMentionContext(text, cursorPos);
    
    if (!context) return;

    const newText = 
      text.slice(0, context.position) + 
      entity.name + 
      text.slice(context.position + context.query.length + 1);

    const newMention: MentionOld = {
      id: `mention-${Date.now()}`,
      entityId: entity.id,
      display: entity.name,
      type: entity.type,
      start: context.position,
      end: context.position + entity.name.length,
    };

    // Adjust existing mentions positions
    const adjustedMentions = mentions.map(m => ({
      ...m,
      start: m.start >= context.position ? m.start + entity.name.length - context.query.length - 1 : m.start,
      end: m.end >= context.position ? m.end + entity.name.length - context.query.length - 1 : m.end,
    }));

    const newMentions = [...adjustedMentions, newMention];
    
    setInputValue(newText);
    setMentions(newMentions);
    onChange(newText, newMentions);
    setShowSuggestions(false);

    // Focus and position cursor
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = newMention.end;
        textareaRef.current.selectionEnd = newMention.end;
      }
    }, 0);
  }, [inputValue, mentions, onChange]);

  // Tailwind 4 styling for mentions
  const mentionClasses = {
    character: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    place: 'bg-green-100 text-green-800 hover:bg-green-200',
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
        placeholder="Type @ for characters or # for places..."
      />

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1"
          style={suggestionPosition}
        >
          {suggestions.map((entity, index) => (
            <button
              key={entity.id}
              type="button"
              className={`w-full text-left px-3 py-2 ${
                index === selectedSuggestionIndex ? 'bg-blue-50' : 'hover:bg-gray-100'
              }`}
              onClick={() => insertMention(entity)}
            >
              {entity.name}
            </button>
          ))}
          <button
            type="button"
            className={`w-full text-left px-3 py-2 ${
              selectedSuggestionIndex === suggestions.length ? 'bg-blue-50' : 'hover:bg-blue-50'
            } text-blue-600 border-t border-gray-100`}
            onClick={handleCreateNewEntity}
          >
            + Create "{currentQuery}"
          </button>
        </div>
      )}

      <div className="preview mt-2 p-3 border rounded-lg bg-gray-50">
        {inputValue.split('').map((char, i) => {
          const mention = mentions.find(m => m.start === i);
          if (mention) {
            return (
              <span
                key={mention.id}
                className={`inline-block px-1 mx-0.5 rounded cursor-pointer ${mentionClasses[mention.type]}`}
                onClick={() => onMentionClick?.(mention)}
              >
                {mention.display}
              </span>
            );
          }
          return <span key={i}>{char}</span>;
        })}
      </div>
    </div>
  );
};