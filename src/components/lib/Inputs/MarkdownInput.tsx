
import { useEffect, useRef, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import {
  BOLD_ITALIC_STAR, BOLD_ITALIC_UNDERSCORE, BOLD_STAR, BOLD_UNDERSCORE, ITALIC_STAR, ITALIC_UNDERSCORE,
} from "@lexical/markdown";
import type { SuggestionEntityRender } from "@/types/suggestion";
import { deserializeToEditorState, serializeEditorState } from "@/utils/serializer";
import { MentionNode } from "./Mentions/MentionNode";
import { MentionsPlugin } from "./Mentions/MentionPlugin.tsx";
import type { MentionMenuState } from "./Mentions/MentionPlugin";

import { FOCUS_COMMAND, BLUR_COMMAND, COMMAND_PRIORITY_LOW, $getRoot } from "lexical";
import { mergeRegister } from "@lexical/utils";
import FloatingLabel from "./FloatingLabel";
import { SuggestionsTab } from "@/components/SuggestionsTab";

function FocusTrackingPlugin({ onFocusChange }: { onFocusChange: (focused: boolean) => void }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => mergeRegister(
    editor.registerCommand(FOCUS_COMMAND, () => { onFocusChange(true); return false; }, COMMAND_PRIORITY_LOW),
    editor.registerCommand(BLUR_COMMAND, () => { onFocusChange(false); return false; }, COMMAND_PRIORITY_LOW),
  ), [editor, onFocusChange]);
  return null;
}

const MARKDOWN_TRANSFORMERS = [
  BOLD_ITALIC_STAR, BOLD_ITALIC_UNDERSCORE, BOLD_STAR, BOLD_UNDERSCORE, ITALIC_STAR, ITALIC_UNDERSCORE,
];

function InitPlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    editor.update(() => deserializeToEditorState(value));
  }, [editor, value]);
  return null;
}

export function MarkdownInput({
  label, labelBGColor = 'bg-(--color-bg-primary)', 
  value = "", 
  entityEdit, 
  suggestionData,
}: {
  label?: string;
  labelBGColor?: string;
  value?: string;
  entityEdit?: { handleFieldChange: (v: string, field: string, idx?: number) => void; fieldName?: string; arrayIndex?: number };
  suggestionData: SuggestionEntityRender[];
}) {
  const initialConfig = {
    namespace: "MarkdownInput",
    nodes: [MentionNode], // no Heading/List/Link/Code nodes registered — that IS the markdown restriction
    theme: { text: { bold: "rich-input-bold", italic: "rich-input-italic" } },
    onError(error: Error) { throw error; },
  };

  const [isFocused, setIsFocused] = useState(false);
  const [hasContent, setHasContent] = useState(value !== "");

  const [menuState, setMenuState] = useState<MentionMenuState>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative w-full">
        <RichTextPlugin
          contentEditable={<ContentEditable className="rich-input-textarea peer rich-input-textarea-border scroll-thin" />}
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <MarkdownShortcutPlugin transformers={MARKDOWN_TRANSFORMERS} />
        <MentionsPlugin suggestionData={suggestionData} onStateChange={setMenuState} />
        <InitPlugin value={value} />
        <FocusTrackingPlugin onFocusChange={setIsFocused} />
        <OnChangePlugin 
          onChange={(editorState) => editorState.read(() => {
            const root = $getRoot();
            const anyContent = root.getChildren().some((p: any) => p.getChildrenSize?.() > 0);
            setHasContent(anyContent);
            entityEdit?.handleFieldChange(serializeEditorState(), entityEdit?.fieldName || "", entityEdit?.arrayIndex);
          })}
        />

        <FloatingLabel label={label} labelBGColor={labelBGColor} placeholder={isFocused || hasContent} />

        {menuState &&
          <SuggestionsTab
            tabPos={{ top: 0, left: 0 }} // unused by SuggestionsTab currently — matches its existing behavior
            entities={menuState.entities}
            selectionIndex={menuState.selectionIndex}
            ref={suggestionsRef}
            insertMention={menuState.insertMention}
          />
        }
      </div>
    </LexicalComposer>
  );
}