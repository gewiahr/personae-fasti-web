import React, { useCallback, useState, useRef, useEffect } from "react"
import { SuggestionsTab } from "../../SuggestionsTab";
import type { MentionContext } from "../../../types/mention";
import type { SuggestionEntityRender } from "../../../types/suggestion";
import type { TextInputProps } from "./InputProps";
import FloatingLabel from "./FloatingLabel";

type RichInputProps = TextInputProps & {
  suggestionData: SuggestionEntityRender[];
};

// ---- Serialization helpers -------------------------------------------------
// NOTE: assumes SuggestionEntityRender has an `id` field holding the ext ID.
// Rename entity.id below to match your actual field (e.g. entity.extId).

const MENTION_REGEX = /@([\w-]+)::(.*?)::/g;

function createMentionSpan(extId: string, name: string): HTMLSpanElement {
  const span = document.createElement("span");
  span.className = "mention-chip";
  span.dataset.extId = extId;
  // contentEditable is inherited from the root anyway; being explicit
  // avoids any browser inconsistencies around inline elements.
  //span.contentEditable = "false";
  span.textContent = name;
  return span;
}

function isMentionSpan(node: Node): node is HTMLSpanElement {
  return (
    node.nodeType === Node.ELEMENT_NODE &&
    (node as HTMLElement).classList.contains("mention-chip")
  );
}

function serializeContent(root: HTMLElement): string {
  let result = "";
  root.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      result += node.textContent ?? "";
    } else if (isMentionSpan(node)) {
      const extId = node.dataset.extId ?? "";
      const name = node.textContent ?? "";
      result += `@${extId}::${name}::`;
    } else {
      // Fallback for any stray element node (e.g. a <br> from Enter) —
      // just take its text so we never silently drop content.
      result += node.textContent ?? "";
    }
  });
  return result;
}

function deserializeContent(text: string): DocumentFragment {
  const frag = document.createDocumentFragment();
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  MENTION_REGEX.lastIndex = 0;
  while ((match = MENTION_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
    }
    frag.appendChild(createMentionSpan(match[1], match[2]));
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    frag.appendChild(document.createTextNode(text.slice(lastIndex)));
  }
  // Guarantee there's always at least one text node so the caret has
  // somewhere plain to land (e.g. value === "@id::name::" with nothing after).
  if (frag.lastChild && isMentionSpan(frag.lastChild)) {
    frag.appendChild(document.createTextNode(""));
  }
  return frag;
}

// -----------------------------------------------------------------------------

export const RichInput: React.FC<RichInputProps> = ({
  label,
  labelBGColor = 'bg-(--color-bg-primary)',
  value = "",
  entityEdit,
  suggestionData,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasContent, setHasContent] = useState(value !== "");

  const [suggestionDataShown, setSuggestionDataShown] = useState<SuggestionEntityRender[]>([]);
  const [suggestionTabPos, setSuggestionTabPos] = useState({ top: 0, left: 0 });
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

  const editorRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // Initial mount only — contentEditable is uncontrolled by design.
  // Re-rendering its innerHTML from React state on every keystroke would
  // fight the browser's own cursor position.
  useEffect(() => {
    if (initializedRef.current || !editorRef.current) return;
    initializedRef.current = true;
    editorRef.current.appendChild(deserializeContent(value));
  }, [value]);

  const emitChange = useCallback(() => {
    if (!editorRef.current) return;
    const serialized = serializeContent(editorRef.current);
    setHasContent(editorRef.current.textContent !== "" || editorRef.current.querySelector(".mention-chip") !== null);
    entityEdit?.handleFieldChange(serialized, entityEdit?.fieldName || "", entityEdit.arrayIndex);
  }, [entityEdit]);

  // Removes mentions the user has fully backspaced into emptiness so we
  // don't leave a dangling zero-content span with a stale ext id.
  const cleanupEmptyMentions = useCallback(() => {
    const root = editorRef.current;
    if (!root) return;
    root.querySelectorAll(".mention-chip").forEach((el) => {
      if ((el.textContent ?? "").length === 0) {
        el.remove();
      }
    });
  }, []);

  const getMentionContext = useCallback((): { context: MentionContext; textNode: Text } | null => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const node = range.startContainer;

    // Only trigger suggestions while typing plain text, not while editing
    // inside an existing mention's name.
    if (node.nodeType !== Node.TEXT_NODE) return null;
    if (node.parentElement && isMentionSpan(node.parentElement)) return null;

    const textNode = node as Text;
    const cursorPos = range.startOffset;
    const text = textNode.textContent ?? "";
    const before = text.slice(0, cursorPos);
    const atIndex = before.lastIndexOf("@");
    if (atIndex === -1) return null;

    const query = before.slice(atIndex + 1);
    if (query.includes(" ") || query.includes("\n")) return null;

    return { context: { position: atIndex, query }, textNode };
  }, []);

  const updateSuggestionTabPos = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0).cloneRange();
    const rect = range.getClientRects()[0] ?? range.getBoundingClientRect();
    const editorRect = editorRef.current?.getBoundingClientRect();
    if (!rect || !editorRect) return;
    setSuggestionTabPos({
      top: rect.bottom - editorRect.top,
      left: rect.left - editorRect.left,
    });
  }, []);

  const placeCaretAdjacent = useCallback((chip: HTMLElement, before: boolean) => {
    const range = document.createRange();
    const sel = window.getSelection();
    if (before) {
      range.setStartBefore(chip);
    } else {
      range.setStartAfter(chip);
    }
    range.collapse(true);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }, []);

  const stripLeftoverMentionStyling = useCallback(() => {
    const root = editorRef.current;
    if (!root) return;

    const sel = window.getSelection();
    const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    const caretNode = range?.startContainer ?? null;
    const caretOffset = range?.startOffset ?? 0;

    root.querySelectorAll("span:not(.mention-chip)").forEach((el) => {
      const style = (el as HTMLElement).style;
      const isLeftover = (style.color || style.backgroundColor) && !(el as HTMLElement).dataset.extId;
      if (!isLeftover) return;

      const caretWasInside = caretNode ? el.contains(caretNode) : false;
      const textNode = document.createTextNode(el.textContent ?? "");
      el.replaceWith(textNode);

      if (caretWasInside && sel) {
        const newRange = document.createRange();
        newRange.setStart(textNode, Math.min(caretOffset, textNode.length));
        newRange.collapse(true);
        sel.removeAllRanges();
        sel.addRange(newRange);
      }
    });
  }, []);

  const handleInput = useCallback(() => {
    stripLeftoverMentionStyling();
    cleanupEmptyMentions();

    const found = getMentionContext();
    if (!found) {
      setSuggestionDataShown([]);
      setSelectedSuggestionIndex(0);
      emitChange();
      return;
    }

    const filtered = suggestionData.filter(
      (entity) => !entity.secret && entity.name.toLowerCase().includes(found.context.query.toLowerCase())
    );

    if (filtered.length > 0) {
      if (selectedSuggestionIndex >= filtered.length) {
        setSelectedSuggestionIndex(Math.max(0, filtered.length - 1));
      }
      setSuggestionDataShown(filtered);
      updateSuggestionTabPos();
    } else {
      setSuggestionDataShown([]);
      setSelectedSuggestionIndex(0);
    }

    emitChange();
  }, [stripLeftoverMentionStyling, cleanupEmptyMentions, cleanupEmptyMentions, getMentionContext, suggestionData, selectedSuggestionIndex, updateSuggestionTabPos, emitChange]);

  const insertMention = useCallback((entity: SuggestionEntityRender) => {
    const found = getMentionContext();
    if (!found) return;

    const { textNode } = found;
    const parent = textNode.parentNode;
    if (!parent) return;

    const fullText = textNode.textContent ?? "";
    const selection = window.getSelection();
    const cursorPos = selection?.getRangeAt(0).startOffset ?? fullText.length;
    const atIndex = fullText.lastIndexOf("@", cursorPos - 1);
    if (atIndex === -1) return;

    const beforeText = fullText.slice(0, atIndex);
    const afterText = fullText.slice(cursorPos);

    // NOTE: adjust `entity.id` to whatever field actually holds the ext ID.
    const mentionSpan = createMentionSpan((entity as any).id ?? entity.name, entity.name);
    const spaceNode = document.createTextNode("\u00A0"); // caret escape hatch
    const afterNode = document.createTextNode(afterText);

    parent.insertBefore(document.createTextNode(beforeText), textNode);
    parent.insertBefore(mentionSpan, textNode);
    parent.insertBefore(spaceNode, textNode);
    parent.insertBefore(afterNode, textNode);
    parent.removeChild(textNode);

    const newRange = document.createRange();
    newRange.setStart(spaceNode, spaceNode.textContent!.length);
    newRange.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(newRange);

    setSuggestionDataShown([]);
    setSelectedSuggestionIndex(0);
    emitChange();
  }, [getMentionContext, emitChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (suggestionDataShown.length <= 0) return;

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
        const selected = suggestionDataShown[selectedSuggestionIndex];
        selected && insertMention(selected);
        break;
      case 'Escape':
        e.preventDefault();
        setSuggestionDataShown([]);
        break;
    }
  }, [suggestionDataShown, selectedSuggestionIndex, insertMention]);

  const handleEditorKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (suggestionDataShown.length > 0) {
      handleKeyDown(e); // existing suggestion-nav logic
      return;
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) return;

      const range = selection.getRangeAt(0);
      const { startContainer, startOffset } = range;

      // Caret directly after a chip (Backspace) or before one (Delete) — remove it whole.
      let target: Node | null = null;
      if (e.key === "Backspace") {
        target =
          startContainer.nodeType === Node.TEXT_NODE && startOffset === 0
            ? startContainer.previousSibling
            : startContainer.childNodes[startOffset - 1] ?? null;
      } else {
        target =
          startContainer.nodeType === Node.TEXT_NODE && startOffset === (startContainer.textContent?.length ?? 0)
            ? startContainer.nextSibling
            : startContainer.childNodes[startOffset] ?? null;
      }

      if (target && isMentionSpan(target)) {
        e.preventDefault();
        target.parentNode?.removeChild(target);
        emitChange();
      }
    }
  }, [suggestionDataShown, handleKeyDown, emitChange]);

  // --- new: selection state (plain ref + DOM class, not React state — this is
  // uncontrolled DOM territory like the rest of the editor) ---
  const selectedChipRef = useRef<HTMLElement | null>(null);

  const clearSelection = useCallback(() => {
    selectedChipRef.current?.classList.remove("mention-chip-selected");
    selectedChipRef.current = null;
  }, []);

  const selectChip = useCallback((chip: HTMLElement) => {
    clearSelection();
    chip.classList.add("mention-chip-selected");
    selectedChipRef.current = chip;
  }, [clearSelection]);

  // Click: select a chip, or clear selection if clicking plain text
  const handleEditorClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const chip = (e.target as HTMLElement).closest(".mention-chip") as HTMLElement | null;
    if (chip) {
      e.preventDefault();
      selectChip(chip);
    } else {
      clearSelection();
    }
  }, [selectChip, clearSelection]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const root = editorRef.current;
      if (!root) return;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;

      const anchorNode = sel.anchorNode;
      if (!anchorNode || !root.contains(anchorNode)) return;

      const anchorEl = anchorNode.nodeType === Node.ELEMENT_NODE
        ? (anchorNode as Element)
        : anchorNode.parentElement;
      const chip = anchorEl?.closest(".mention-chip") as HTMLElement | null;

      // Skip correction while actively renaming — the <input> lives inside
      // the chip and needs its own normal caret behavior.
      if (chip && !chip.querySelector("input")) {
        selectChip(chip);
        console.log(chip)
        //placeCaretAdjacent(chip, false); // kick caret out to just after
      } else {
        clearSelection();
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [selectChip, placeCaretAdjacent]);

  return (
    <div className="relative w-full">
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleEditorKeyDown}
        onClick={handleEditorClick}
        onFocus={() => setIsFocused(true)}
        onBlur={() => { setIsFocused(false); clearSelection(); }}
        className="rich-input-textarea peer rich-input-textarea-border scroll-thin"
      />

      <FloatingLabel
        label={label}
        labelBGColor={labelBGColor}
        placeholder={isFocused || hasContent}
      />

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