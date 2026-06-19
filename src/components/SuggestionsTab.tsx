import { forwardRef, useEffect, useRef } from "react"
import type { SuggestionEntityRender, SuggestionTabPos } from "../types/suggestion";

type SuggestionTabProps = {
  tabPos: SuggestionTabPos,
  entities?: SuggestionEntityRender[],
  selectionIndex: number,
  insertMention: (entity: SuggestionEntityRender) => void,
}

export const SuggestionsTab = forwardRef<HTMLDivElement, SuggestionTabProps>(({ entities, selectionIndex, insertMention }, ref) => {

  const innerRef = useRef<HTMLDivElement | null>(null);
  const setRefs = (element: HTMLDivElement | null) => {
    innerRef.current = element;
    if (typeof ref === "function") ref(element);
    else if (ref) ref.current = element;
  };

  useEffect(() => {
    if (!innerRef.current || !entities || entities.length === 0) return;
    const selectedChild = innerRef.current.children[selectionIndex] as HTMLElement | undefined;
    if (selectedChild) {
      selectedChild.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectionIndex, entities]);

  if (!entities || entities.length <= 0) return <></>

  return (
    <div
      ref={setRefs}
      className={`absolute z-50 scroll-thin bg-gray-800 border border-gray-700 shadow-lg rounded-md overflow-y-auto max-h-60 w-48
                      ${entities.length > 0 ? 'block' : 'hidden'}`}
      style={{
        width: '100%',
        transform: 'translateY(-0.25rem)'
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
    </div>
  )
});