import React, { useCallback, useState, useRef, KeyboardEvent, useEffect } from "react"
import { SuggestionsTab } from "./SuggestionsTab";
import { /*extractMentions, Mention,*/ MentionContext } from "../types/mention";
import { SuggestionData, SuggestionEntity } from "../types/suggestion";
import { EntityEdit, formSuggestionRef } from "../types/entities";

interface RichInputProps {
  label: string;
  setValue?: string;
  entityEdit?: EntityEdit;
  fullSuggestionData: SuggestionData;
};

export const RichInput = ({ label, setValue = "", entityEdit, fullSuggestionData } : RichInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState(setValue);
    //const [mentions, setMentions] = useState<Mention[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestionData, setSuggestionData] = useState<SuggestionData>(fullSuggestionData);
    const [suggestionTabPos, setSuggestionTabPos] = useState({ top: 0, left: 0});
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fullSuggestionData.entities.forEach((suggestion) => {
            formSuggestionRef(suggestion);        
        });
    }, [])

    useEffect(() => {
      entityEdit?.handleFieldChange(entityEdit?.fieldName || "", inputValue);
    }, [inputValue])

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        const cursorPos = e.target.selectionStart;

        setInputValue(newValue);
        //entityEdit?.handleOnChange(entityEdit?.fieldName || "", newValue);

        const context = getMentionContext(newValue, cursorPos);
        
        if (!context) {
            setShowSuggestions(false);
            setSelectedSuggestionIndex(0);
            return;
        };

        const currentSuggestions = getFilteredSuggestions(context);
        if (currentSuggestions && currentSuggestions.length) {
            setSuggestionDataFromContext(currentSuggestions);
        } else {
            setShowSuggestions(false);
            setSelectedSuggestionIndex(0);
        };

    }, []);

    const getFilteredSuggestions = (context: MentionContext) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        return fullSuggestionData.entities.filter(entity => 
            entity.name.toLowerCase().includes(context.query.toLowerCase())
        );
    }

    const setSuggestionDataFromContext = useCallback((
        currentSuggestions: SuggestionEntity[],
    ) => {
        if (selectedSuggestionIndex >= currentSuggestions.length) {
            setSelectedSuggestionIndex(Math.max(0, currentSuggestions.length - 1));           
        };

        setSuggestionData({entities : currentSuggestions});

        setShowSuggestions(true);
    }, [fullSuggestionData.entities]);

    const getMentionContext = useCallback((text: string, cursorPos: number) : MentionContext | null => {
        const textBeforeCursor = text.substring(0, cursorPos);
        const lastIndex = textBeforeCursor.lastIndexOf('@');
        
        if (lastIndex === -1) return null;

        const query = text.substring(lastIndex + 1, cursorPos);
        if (query.includes(" ") || query.includes('\n') || query.includes('\r')) return null;

        return { position: lastIndex, query };

    }, []);

    // Keyboard navigation for suggestions
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!showSuggestions) return;
    
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setSelectedSuggestionIndex(prev => Math.min(prev + 1, suggestionData.entities.length - 1));
            break;
          case 'ArrowUp':
            e.preventDefault();
            setSelectedSuggestionIndex(prev => Math.max(prev - 1, 0));
            break;
          case 'Enter':
            e.preventDefault();
            if (selectedSuggestionIndex === suggestionData.entities.length) {
              // ++ handleCreateNewEntity();
            } else {
              const selected = suggestionData.entities[selectedSuggestionIndex];
              selected && insertMention(selected);
            }
            break;
          case 'Escape':
            e.preventDefault();
            setShowSuggestions(false);
            break;
        }
    }, [showSuggestions, suggestionData.entities, selectedSuggestionIndex]);

    const insertMention = useCallback((entity: SuggestionEntity) => {
        const text = inputValue;
        const cursorPos = textareaRef.current?.selectionStart || 0;
        const context = getMentionContext(text, cursorPos);
        
        if (!context) return;

        const newText = 
            text.slice(0, context.position) + 
            "@`" + entity.name + "`" +
            text.slice(context.position + context.query.length + 1) + " ";

        
        setInputValue(newText);
        //handleOnChange(fieldName, newText);
        //entityEdit?.handleOnChange(entityEdit?.fieldName || "", newText);
        setShowSuggestions(false);

        // Focus and position cursor
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.selectionStart = context.position + entity.name.length + 4;
                textareaRef.current.selectionEnd = context.position + entity.name.length + 4;
            }
        }, 0);

        //console.log(mentions);

    }, [inputValue]);

    // const collectMentions = () => {
    //     setMentions(extractMentions(inputValue, suggestionData));
    //     console.log(mentions);
    // }

    return (
        <div className="relative w-full">
            <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                //className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                className={`w-full min-h-[100px] px-4 py-3 border rounded-lg
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
                    '-top-2.5 text-xs' : 
                    'top-3.5 text-gray-500'}
                    peer-focus:-top-2.5 peer-focus:text-xs ${isFocused || !!inputValue ? "bg-[#242424]" : ""}

                `}
                >
                {label}
            </label>

            {showSuggestions &&
                <SuggestionsTab 
                    tabPos={suggestionTabPos} 
                    data={suggestionData} 
                    selectionIndex={selectedSuggestionIndex} 
                    ref={suggestionsRef}
                    insertMention={insertMention}
                />
            }

            {/*<button onClick={collectMentions}>1234</button>*/}
        </div>
    );
}