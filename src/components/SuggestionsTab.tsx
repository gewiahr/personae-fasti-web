import { forwardRef } from "react"
import { SuggestionData, SuggestionEntity, SuggestionTabPos } from "../types/suggestion";

type SuggestionTabProps = {
    tabPos: SuggestionTabPos,
    data: SuggestionData,
    selectionIndex: number,
    insertMention: (entity: SuggestionEntity) => void,
}

export const SuggestionsTab = forwardRef<HTMLDivElement, SuggestionTabProps>(
    ({ tabPos, data, selectionIndex, insertMention }, ref) => {

        return (
            <div ref={ref} className="absolute z-50 w-48 bg-gray-900 border border-gray-600 rounded-lg shadow-lg py-1" style={tabPos}>
                {data.entities.map((entity, index) => (
                    <button
                    key={entity.sid}
                    type="button"
                    className={`w-full text-left px-3 py-2 ${
                        index === selectionIndex ? 'bg-blue-700' : 'hover:bg-gray-800'
                    }`}
                    onClick={() => insertMention(entity)}
                    >
                    {entity.name}
                    </button>
                ))}
            </div>
        )
    }
);