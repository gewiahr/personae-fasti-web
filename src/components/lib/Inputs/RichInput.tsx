import React, { useCallback, useState, useRef, type KeyboardEvent, useEffect } from "react"
import { SuggestionsTab } from "../../SuggestionsTab";
import type { MentionContext } from "../../../types/mention";
import type { SuggestionEntityRender } from "../../../types/suggestion";
import type { TextInputProps } from "./InputProps";

type RichInputProps = TextInputProps & {
  suggestionData: SuggestionEntityRender[];
};

export const RichInput: React.FC<RichInputProps> = ({ label, value = "", entityEdit, suggestionData }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  //const [suggestionData, setSuggestionData] = useState<SuggestionEntityRender[]>([]);
  //const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionDataShown, setSuggestionDataShown] = useState<SuggestionEntityRender[]>([]);
  const [suggestionTabPos] = useState({ top: 0, left: 0 });
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  //console.log('fullSuggestionData from Redux:', fullSuggestionData);

  useEffect(() => {
    // if (fullSuggestionData.entities.length <= 0) return;
    // var suggestionRender = fullSuggestionData.entities.filter((suggestion) => !suggestion.hidden).map((suggestion) => formSuggestionRef(suggestion));
    // console.log(suggestionRender)
    // setSuggestionData(suggestionRender);
    // //setSuggestionDataShown(suggestionRender);
  }, []);

  useEffect(() => {
    entityEdit?.handleFieldChange(inputValue, entityEdit?.fieldName || "", entityEdit.arrayIndex);
  }, [inputValue]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;

    //console.log(newValue)
    setInputValue(newValue);

    const context = getMentionContext(newValue, cursorPos);

    if (!context) {
      setSuggestionDataShown([]);
      //setShowSuggestions(false);
      setSelectedSuggestionIndex(0);
      return;
    };

    const currentSuggestions = getFilteredSuggestions(context);
    if (currentSuggestions && currentSuggestions.length > 0) {
      setSuggestionDataFromContext(currentSuggestions);
    } else {
      setSuggestionDataShown([]);
      //setShowSuggestions(false);
      setSelectedSuggestionIndex(0);
    };

  }, []);

  const getFilteredSuggestions = useCallback((context: MentionContext) => {
    const textarea = textareaRef.current;
    if (!textarea) return [];
    return suggestionData.filter(entity =>
      !entity.hidden && entity.name.toLowerCase().includes(context.query.toLowerCase())
    );
  }, [suggestionData]);

  // const getFilteredSuggestions = (context: MentionContext) => {
  //   const textarea = textareaRef.current;
  //   if (!textarea) return;
  //   return suggestionData.filter(entity =>
  //     !entity.hidden && entity.name.toLowerCase().includes(context.query.toLowerCase())
  //   );
  // }

  const setSuggestionDataFromContext = useCallback((
    currentSuggestions: SuggestionEntityRender[],
  ) => {
    if (selectedSuggestionIndex >= currentSuggestions.length) {
      setSelectedSuggestionIndex(Math.max(0, currentSuggestions.length - 1));
    };

    setSuggestionDataShown(currentSuggestions);

    //setShowSuggestions(true);
  }, [suggestionData]);

  const getMentionContext = useCallback((text: string, cursorPos: number): MentionContext | null => {
    const textBeforeCursor = text.substring(0, cursorPos);
    const lastIndex = textBeforeCursor.lastIndexOf('@');

    if (lastIndex === -1) return null;

    const query = text.substring(lastIndex + 1, cursorPos);
    if (query.includes(" ") || query.includes('\n') || query.includes('\r')) return null;

    return { position: lastIndex, query };

  }, []);

  // Keyboard navigation for suggestions
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (suggestionDataShown.length <= 0 || !suggestionData) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => Math.min(prev + 1, suggestionDataShown.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex === suggestionDataShown.length) {
        } else {
          const selected = suggestionDataShown[selectedSuggestionIndex];
          selected && insertMention(selected);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setSuggestionDataShown([]);
        //setShowSuggestions(false);
        break;
    }
  }, [suggestionDataShown, suggestionData, suggestionDataShown, selectedSuggestionIndex]);

  const insertMention = useCallback((entity: SuggestionEntityRender) => {
    const text = inputValue;
    const cursorPos = textareaRef.current?.selectionStart || 0;
    const context = getMentionContext(text, cursorPos);

    if (!context) return;

    const newText =
      text.slice(0, context.position) +
      "@`" + entity.name + "`" +
      text.slice(context.position + context.query.length + 1);

    setInputValue(newText);
    setSuggestionDataShown([]);
    //setShowSuggestions(false);

    // Focus and position cursor
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = context.position + entity.name.length + 4;
        textareaRef.current.selectionEnd = context.position + entity.name.length + 4;
      }
    }, 0);
  }, [inputValue]);

  return (
    <div className="relative w-full">
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full min-h-25 max-h-[40vh] field-sizing-content px-4 py-3 border rounded-lg
                    focus:outline-none focus:ring-2
                    peer
                    'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
                    bg-transparent`}
      />
      <label
        className={`
                    absolute left-4 px-1
                    transition-all duration-200 ease-in-out
                    pointer-events-none
                    ${isFocused || !!inputValue ?
            '-top-2 text-xs' :
            'top-3.5 text-gray-500'}
                    peer-focus:-top-2 peer-focus:text-xs ${isFocused || !!inputValue ? "bg-gray-900" : ""}

                `}
      >
        {label}
      </label>

      {suggestionDataShown.length > 0 &&
        <SuggestionsTab
          tabPos={suggestionTabPos}
          entities={suggestionDataShown}
          selectionIndex={selectedSuggestionIndex}
          ref={suggestionsRef}
          insertMention={insertMention}
        />
      }
    </div>
  );
}