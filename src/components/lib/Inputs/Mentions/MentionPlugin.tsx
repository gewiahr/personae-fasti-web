
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  LexicalTypeaheadMenuPlugin, MenuOption, useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, TextNode } from "lexical";
import { $createMentionNode, pendingAutoEditKeys } from "./MentionNode";
import type { SuggestionEntityRender } from "@/types/suggestion";

class MentionOption extends MenuOption {
  entity: SuggestionEntityRender;
  constructor(entity: SuggestionEntityRender) { super(entity.sid); this.entity = entity; }
}

export type MentionMenuState = {
  entities: SuggestionEntityRender[];
  selectionIndex: number;
  insertMention: (entity: SuggestionEntityRender) => void;
} | null;

// Renders nothing itself — just reports the current menu state up via
// onStateChange so RichInput can render the real SuggestionsTab in its
// original spot, unchanged.
function MenuStateSync({
  options, selectedIndex, selectOptionAndCleanUp, onStateChange,
}: {
  options: MentionOption[];
  selectedIndex: number | null;
  selectOptionAndCleanUp: (option: MentionOption) => void;
  onStateChange: (state: MentionMenuState) => void;
}) {
  useEffect(() => {
    if (options.length === 0) {
      onStateChange(null);
      return;
    }
    onStateChange({
      entities: options.map((o) => o.entity),
      selectionIndex: selectedIndex ?? 0,
      insertMention: (entity) => {
        const match = options.find((o) => o.entity.sid === entity.sid);
        if (match) selectOptionAndCleanUp(match);
      },
    });

    // Component unmounts when LexicalTypeaheadMenuPlugin closes the menu
    // (e.g. right after a selection) — without this, the last pushed
    // state stays stuck in the parent forever since nothing else clears it.
    return () => onStateChange(null);
  }, [options, selectedIndex, selectOptionAndCleanUp, onStateChange]);

  return null;
}

export function MentionsPlugin({
  suggestionData, onStateChange,
}: {
  suggestionData: SuggestionEntityRender[];
  onStateChange: (state: MentionMenuState) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);
  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch("@", { minLength: 0 });

  const options = useMemo(() => {
    if (queryString === null) return [];
    return suggestionData
      .filter((e) => !e.secret && e.name.toLowerCase().includes(queryString.toLowerCase()))
      .slice(0, 8)
      .map((e) => new MentionOption(e));
  }, [queryString, suggestionData]);

  const onSelectOption = useCallback(
    (option: MentionOption, nodeToRemove: TextNode | null, closeMenu: () => void) => {
      editor.update(() => {
        nodeToRemove?.remove();
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const mentionNode = $createMentionNode(option.entity.sid, option.entity.name, option.entity.type);
          selection.insertNodes([mentionNode]);
          pendingAutoEditKeys.add(mentionNode.getKey());
        }
      });
      closeMenu();
    },
    [editor]
  );

  return (
    <LexicalTypeaheadMenuPlugin<MentionOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(_anchorRef, { selectedIndex, selectOptionAndCleanUp }) => (
        <MenuStateSync
          options={options}
          selectedIndex={selectedIndex}
          selectOptionAndCleanUp={selectOptionAndCleanUp}
          onStateChange={onStateChange}
        />
      )}
    />
  );
}