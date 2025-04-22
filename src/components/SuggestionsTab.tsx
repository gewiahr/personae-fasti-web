import { forwardRef, useEffect } from "react"
import { SuggestionData, SuggestionEntity, SuggestionTabPos } from "../types/suggestion";

type SuggestionTabProps = {
    tabPos: SuggestionTabPos,
    data?: SuggestionData,
    selectionIndex: number,
    insertMention: (entity: SuggestionEntity) => void,
}

export const SuggestionsTab = forwardRef<HTMLDivElement, SuggestionTabProps>(
    ({ tabPos, data, selectionIndex, insertMention }, ref) => {

        useEffect(() => {

        }, [selectionIndex])

        return (
            // <div ref={ref} className="absolute z-50 w-48 bg-gray-900 border border-gray-600 rounded-lg shadow-lg py-1" style={tabPos}>
            <>
                {data && <div 
                    className={`absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md overflow-y-auto max-h-60 w-48
                        ${data ? 'block' : 'hidden'}`}
                    style={{
                        width: '100%',
                        transform: 'translateY(0.25rem)' // Small offset from cursor
                    }}
                >
                    {data.entities.map((entity, index) => (
                        <button
                        key={entity.sid}
                        type="button"
                        className={`w-full text-left px-3 py-2 ${
                            index === selectionIndex ? 'bg-blue-700' : 'hover:bg-gray-800'
                        }`}
                        onClick={() => insertMention(entity)}
                        >
                        {entity.ref}
                        </button>
                    ))}
                </div>}
            </>          
        )
    }
);