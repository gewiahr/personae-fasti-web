import { forwardRef, useEffect } from "react"
import type { SuggestionEntityRender, SuggestionTabPos } from "../types/suggestion";

type SuggestionTabProps = {
  tabPos: SuggestionTabPos,
  entities?: SuggestionEntityRender[],
  selectionIndex: number,
  insertMention: (entity: SuggestionEntityRender) => void,
}

export const SuggestionsTab = forwardRef<HTMLDivElement, SuggestionTabProps>(({ entities, selectionIndex, insertMention }) => {

  useEffect(() => {

  }, [selectionIndex])

  if (!entities) return <></>

  return (
    // <div ref={ref} className="absolute z-50 w-48 bg-gray-900 border border-gray-600 rounded-lg shadow-lg py-1" style={tabPos}>
    <>
      {entities.length > 0 && <div
        className={`absolute z-50 bg-gray-800 border border-gray-700 shadow-lg rounded-md overflow-y-auto max-h-60 w-48
                        ${entities.length > 0 ? 'block' : 'hidden'}`}
        style={{
          width: '100%',
          transform: 'translateY(0.25rem)' // Small offset from cursor
        }}
      >
        {entities.map((entity, index) => (
          <button
            key={entity.sid}
            type="button"
            className={`w-full text-left px-3 py-2 ${index === selectionIndex ? 'bg-blue-700' : 'hover:bg-gray-800'
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