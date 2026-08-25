import React, { useCallback, useState, useRef, useEffect } from "react"
import { SuggestionsTab } from "../../SuggestionsTab";
import type { MentionContext } from "../../../types/mention";
import type { SuggestionEntityRender } from "../../../types/suggestion";
import type { TextInputProps } from "./InputProps";
import FloatingLabel from "./FloatingLabel";
import { getEntityMetaData } from "../../../types/entities";

type RichInputProps = TextInputProps & {
  suggestionData: SuggestionEntityRender[];
};

// ============================================================================
// Serialized format: @sid`name`  — sid is stable, name is freely renameable
// after insertion without losing the link back to the entity.
// ============================================================================

const MENTION_REGEX = /@([\w:-]*)`([^`]+)`/g;

function createMentionSpan(sid: string, name: string, type: string): HTMLSpanElement {
  const span = document.createElement("span");
  const metaData = getEntityMetaData(type);
  span.className = `mention-chip ${metaData?.MentionColor.ChipClass ?? ""}`.trim();
  span.contentEditable = "false"; // atomic by default — see edit-mode handling below
  span.dataset.sid = sid;
  span.dataset.type = type;
  span.dataset.icon = metaData?.Icon ?? "";
  span.textContent = name;
  return span;
}

function isMentionSpan(node: Node): node is HTMLSpanElement {
  return node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).classList.contains("mention-chip");
}

function resolveOffset(spec: "start" | "end" | number, len: number): number {
  if (spec === "start") return 0;
  if (spec === "end") return len;
  return Math.max(0, Math.min(spec, len));
}

function serializeContent(root: HTMLElement): string {
  let result = "";
  root.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      result += node.textContent ?? "";
    } else if (isMentionSpan(node)) {
      const sid = node.dataset.sid ?? "";
      // Mid-edit, the real text lives in the chip's <input> child, not
      // textContent (which is cleared while editing) — read from there.
      const input = node.querySelector("input") as HTMLInputElement | null;
      const name = input ? input.value : (node.textContent ?? "");
      result += `@${sid}\`${name}\``;
    } else {
      result += node.textContent ?? "";
    }
  });
  return result;
}

function deserializeContent(text: string, suggestions: SuggestionEntityRender[]): DocumentFragment {
  const frag = document.createDocumentFragment();
  const suggestionMap = new Map(suggestions.map((e) => [e.name.toLowerCase(), e]));
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  MENTION_REGEX.lastIndex = 0;
  while ((match = MENTION_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
    }

    const sid = match[1];
    const name = match[2];
    let type = "";
    let resolvedSid = sid;

    if (sid) {
      type = sid.split(":")[0];
    } else {
      const found = suggestionMap.get(name.toLowerCase());
      if (found) {
        resolvedSid = found.sid;
        type = found.type;
      }
    }

    frag.appendChild(createMentionSpan(resolvedSid, name, type));
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    frag.appendChild(document.createTextNode(text.slice(lastIndex)));
  }
  // Guarantee a trailing text node so the caret always has somewhere plain
  // to land, even when the value ends with a mention.
  if (frag.lastChild && isMentionSpan(frag.lastChild)) {
    frag.appendChild(document.createTextNode(""));
  }
  return frag;
}

// ============================================================================

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
  const measurerRef = useRef<HTMLSpanElement | null>(null);
  const initializedRef = useRef(false);

  const editingChipRef = useRef<HTMLElement | null>(null);   // chip currently swapped to an <input>
  const pendingRemoveChipRef = useRef<HTMLElement | null>(null); // chip in "press again to delete" state

  // ---- mount / teardown ----------------------------------------------------

  useEffect(() => {
    if (initializedRef.current || !editorRef.current) return;
    initializedRef.current = true;
    editorRef.current.appendChild(deserializeContent(value, suggestionData));
  }, [value, suggestionData]);

  useEffect(() => {
    return () => {
      measurerRef.current?.remove();
      measurerRef.current = null;
    };
  }, []);

  const getMeasurer = useCallback(() => {
    if (!measurerRef.current) {
      const el = document.createElement("span");
      el.style.position = "absolute";
      el.style.top = "-9999px";
      el.style.left = "-9999px";
      el.style.visibility = "hidden";
      el.style.whiteSpace = "pre";
      document.body.appendChild(el);
      measurerRef.current = el;
    }
    return measurerRef.current;
  }, []);

  // ---- core helpers ---------------------------------------------------------

  const emitChange = useCallback(() => {
    if (!editorRef.current) return;
    const serialized = serializeContent(editorRef.current);
    setHasContent(editorRef.current.textContent !== "" || editorRef.current.querySelector(".mention-chip") !== null);
    entityEdit?.handleFieldChange(serialized, entityEdit?.fieldName || "", entityEdit.arrayIndex);
  }, [entityEdit]);

  // Skips chips mid-edit — their textContent is transiently "" because the
  // name lives in a child <input>, not because they're actually empty.
  const cleanupEmptyMentions = useCallback(() => {
    const root = editorRef.current;
    if (!root) return;
    root.querySelectorAll(".mention-chip").forEach((el) => {
      if (el.querySelector("input")) return;
      if ((el.textContent ?? "").length === 0) el.remove();
    });
  }, []);

  const getMentionContext = useCallback((): { context: MentionContext; textNode: Text } | null => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);
    const node = range.startContainer;

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
    setSuggestionTabPos({ top: rect.bottom - editorRect.top, left: rect.left - editorRect.left });
  }, []);

  const placeCaretAdjacent = useCallback((chip: HTMLElement, before: boolean) => {
    //console.log(chip)
    const range = document.createRange();
    const sel = window.getSelection();
    if (before) range.setStartBefore(chip); else range.setStartAfter(chip);
    range.collapse(true);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }, []);

  // Cleans up the leftover styled-but-unstamped <span> browsers sometimes
  // leave behind when a selection spanning a chip is deleted-and-typed-over
  // in one go (select-all + type). Unwraps it back to plain text.
  const stripLeftoverMentionStyling = useCallback(() => {
    const root = editorRef.current;
    if (!root) return;

    const sel = window.getSelection();
    const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    const caretNode = range?.startContainer ?? null;
    const caretOffset = range?.startOffset ?? 0;

    root.querySelectorAll("span:not(.mention-chip)").forEach((el) => {
      const style = (el as HTMLElement).style;
      const isLeftover = (style.color || style.backgroundColor) && !(el as HTMLElement).dataset.sid;
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

  // ---- typing / suggestions --------------------------------------------------

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
  }, [stripLeftoverMentionStyling, cleanupEmptyMentions, getMentionContext, suggestionData, selectedSuggestionIndex, updateSuggestionTabPos, emitChange]);

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

    const mentionSpan = createMentionSpan(entity.sid, entity.name, entity.type);
    //const spaceNode = document.createTextNode("\u00A0"); // caret escape hatch after insertion
    const afterNode = document.createTextNode(afterText);

    parent.insertBefore(document.createTextNode(beforeText), textNode);
    parent.insertBefore(mentionSpan, textNode);
    //parent.insertBefore(spaceNode, textNode);
    parent.insertBefore(afterNode, textNode);
    parent.removeChild(textNode);

    const newRange = document.createRange();
    /////
    //newRange.setStart(spaceNode, spaceNode.textContent!.length);
    newRange.setStartAfter(mentionSpan);
    /////
    newRange.collapse(true);
    selection?.removeAllRanges();
    selection?.addRange(newRange);

    setSuggestionDataShown([]);
    setSelectedSuggestionIndex(0);
    emitChange();
  }, [getMentionContext, emitChange]);

  const handleSuggestionNavKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
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
      case 'Enter': {
        e.preventDefault();
        const selected = suggestionDataShown[selectedSuggestionIndex];
        selected && insertMention(selected);
        break;
      }
      case 'Escape':
        e.preventDefault();
        setSuggestionDataShown([]);
        break;
    }
  }, [suggestionDataShown, selectedSuggestionIndex, insertMention]);

  // ---- pending-removal: Backspace/Delete "press again" flow -----------------

  const cancelPendingRemoval = useCallback((repositionCaretAfter: boolean) => {
    const chip = pendingRemoveChipRef.current;
    if (!chip) return;
    chip.classList.remove("mention-chip-pending-remove");
    pendingRemoveChipRef.current = null;
    if (repositionCaretAfter) placeCaretAdjacent(chip, false);
  }, [placeCaretAdjacent]);

  const markPendingRemoval = useCallback((chip: HTMLElement) => {
    chip.classList.add("mention-chip-pending-remove");
    pendingRemoveChipRef.current = chip;
  }, []);

  // ---- chip inline rename: caret-passable editing ----------------------------

  const commitAndCloseEditor = useCallback((
    chip: HTMLElement,
    opts: { commit: boolean; exitTo: "before" | "after" | null }
  ) => {
    const input = chip.querySelector("input") as HTMLInputElement | null;
    if (!input) return;
    if (chip.dataset.closing === "1") return; // reentrancy guard — input.remove() fires a sync blur
    chip.dataset.closing = "1";

    const originalName = chip.dataset.originalName ?? "";
    const value = input.value;
    input.remove();
    delete chip.dataset.originalName;
    delete chip.dataset.closing;

    const finalName = opts.commit ? (value.trim() || originalName) : originalName;
    chip.textContent = finalName;
    chip.classList.remove("mention-chip-editing");

    if (editingChipRef.current === chip) editingChipRef.current = null;

    if (opts.exitTo) {
      // Set the range before focusing — focusing first can reset selection
      // on a contentEditable in some browsers.
      placeCaretAdjacent(chip, opts.exitTo === "before");
      editorRef.current?.focus({ preventScroll: true });
    }

    if (opts.commit && finalName !== originalName) emitChange();
  }, [placeCaretAdjacent, emitChange]);

  const openChipEditor = useCallback((chip: HTMLElement, offsetSpec: "start" | "end" | number) => {
    if (editingChipRef.current === chip) {
      const input = chip.querySelector("input") as HTMLInputElement | null;
      if (input) {
        const off = resolveOffset(offsetSpec, input.value.length);
        input.focus();
        input.setSelectionRange(off, off);
      }
      return;
    }
    if (editingChipRef.current) {
      commitAndCloseEditor(editingChipRef.current, { commit: true, exitTo: null });
    }

    const originalName = chip.textContent ?? "";
    chip.dataset.originalName = originalName;

    const input = document.createElement("input");
    input.type = "text";
    input.value = originalName;
    input.className = "mention-chip-rename-input";
    input.style.font = "inherit";
    input.style.color = "inherit";
    input.style.background = "transparent";
    input.style.border = "none";
    input.style.outline = "none";
    input.style.padding = "0";

    chip.textContent = ""; // icon is a CSS ::before pseudo-element, unaffected
    chip.appendChild(input); // must attach before measuring below
    editingChipRef.current = chip;
    chip.classList.add("mention-chip-editing");

    const resizeInputToContent = () => {
      const measurer = getMeasurer();
      measurer.style.font = getComputedStyle(input).font;
      measurer.textContent = input.value || " ";
      input.style.width = `${measurer.offsetWidth + 4}px`;
    };
    resizeInputToContent();
    input.addEventListener("input", resizeInputToContent);

    // Stop these bubbling to the outer contentEditable's own handlers —
    // a bubbled 'input' would run cleanupEmptyMentions mid-edit and delete
    // this chip, since its textContent reads "" while editing.
    input.addEventListener("input", (ev) => ev.stopPropagation());
    input.addEventListener("click", (ev) => ev.stopPropagation());
    input.addEventListener("dblclick", (ev) => ev.stopPropagation());

    input.addEventListener("blur", () => {
      commitAndCloseEditor(chip, { commit: true, exitTo: null });
    });

    input.addEventListener("keydown", (ev) => {
      ev.stopPropagation();
      const pos = input.selectionStart ?? 0;
      const end = input.selectionEnd ?? 0;
      const atStart = pos === 0 && end === 0;
      const atEnd = pos === input.value.length && end === input.value.length;

      if (ev.key === "Enter") {
        ev.preventDefault();
        commitAndCloseEditor(chip, { commit: true, exitTo: "after" });
      } else if (ev.key === "Escape") {
        ev.preventDefault();
        commitAndCloseEditor(chip, { commit: false, exitTo: "before" });
      } else if ((ev.key === "ArrowLeft" || ev.key === "ArrowUp") && atStart) {
        ev.preventDefault();
        commitAndCloseEditor(chip, { commit: true, exitTo: "before" });
      } else if ((ev.key === "ArrowRight" || ev.key === "ArrowDown") && atEnd) {
        ev.preventDefault();
        commitAndCloseEditor(chip, { commit: true, exitTo: "after" });
      }
      // any other key: native input behavior handles it
    });

    const offset = resolveOffset(offsetSpec, originalName.length);
    input.focus();
    input.setSelectionRange(offset, offset);
  }, [commitAndCloseEditor, getMeasurer]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const root = editorRef.current;
      if (!root) return;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || !sel.isCollapsed) return;

      const anchorNode = sel.anchorNode;
      if (!anchorNode || !root.contains(anchorNode)) return;
      if (anchorNode.nodeType !== Node.TEXT_NODE) return;

      const parent = anchorNode.parentElement;
      if (!parent || !isMentionSpan(parent)) return;

      // Already mid-edit — its text lives in the <input>, not this text
      // node — so don't fight whatever the input's own selection is doing.
      if (editingChipRef.current === parent || parent.querySelector("input")) return;

      // Caret landed inside a "resting" chip's display text — a known
      // cross-browser slip past our pre-check. Convert it into a real
      // edit session at that position instead of leaving it stranded.
      openChipEditor(parent, sel.anchorOffset);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [openChipEditor]);

  const getAdjacentChip = useCallback((direction: "left" | "right"): HTMLElement | null => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !sel.isCollapsed) return null;
    const { startContainer, startOffset } = sel.getRangeAt(0);

    let node: Node | null = null;

    if (startContainer.nodeType === Node.TEXT_NODE) {
      const len = startContainer.textContent?.length ?? 0;
      if (direction === "left") {
        node = startOffset === 0 ? startContainer.previousSibling : null;
      } else {
        node = startOffset === len ? startContainer.nextSibling : null;
      }
    } else {
      // Element container — startOffset is a real child index here.
      node = direction === "left"
        ? startContainer.childNodes[startOffset - 1] ?? null
        : startContainer.childNodes[startOffset] ?? null;
    }

    return node && isMentionSpan(node) ? node : null;
  }, []);

  // ---- editor-level click / keydown ------------------------------------------

  const handleEditorClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (pendingRemoveChipRef.current) {
      e.preventDefault();
      e.stopPropagation();
      cancelPendingRemoval(true);
      return;
    }

    const chip = (e.target as HTMLElement).closest(".mention-chip") as HTMLElement | null;
    if (chip && !chip.querySelector("input")) {
      e.preventDefault();
      // Exact character-offset placement into a non-editable span isn't
      // reliable cross-browser — approximate with nearest-half.
      const rect = chip.getBoundingClientRect();
      const clickedLeftHalf = e.clientX < rect.left + rect.width / 2;
      openChipEditor(chip, clickedLeftHalf ? "start" : "end");
    }
  }, [cancelPendingRemoval, openChipEditor]);

  const handleEditorKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (suggestionDataShown.length > 0) {
      handleSuggestionNavKeyDown(e);
      return;
    }

    // If a stale dropdown is still open while we're about to act on a chip,
    // close it — it's no longer relevant to what's being typed/navigated.
    if (suggestionDataShown.length > 0) {
      setSuggestionDataShown([]);
      setSelectedSuggestionIndex(0);
    }

    if (e.key === "Backspace" || e.key === "Delete") {
      if (e.repeat) {
        e.preventDefault();
        return;
      }
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) return;

      const range = selection.getRangeAt(0);
      const { startContainer, startOffset } = range;

      let target: Node | null = null;
      if (e.key === "Backspace") {
        target = startContainer.nodeType === Node.TEXT_NODE && startOffset === 0
          ? startContainer.previousSibling
          : startContainer.childNodes[startOffset - 1] ?? null;
      } else {
        target = startContainer.nodeType === Node.TEXT_NODE && startOffset === (startContainer.textContent?.length ?? 0)
          ? startContainer.nextSibling
          : startContainer.childNodes[startOffset] ?? null;
      }

      console.log(target)

      if (target && isMentionSpan(target)) {
        e.preventDefault();
        const chip = target as HTMLElement;
        if (pendingRemoveChipRef.current === chip) {
          pendingRemoveChipRef.current = null;
          chip.remove();
          emitChange();
        } else {
          if (pendingRemoveChipRef.current) cancelPendingRemoval(false);
          markPendingRemoval(chip);
        }
        return;
      }

      if (pendingRemoveChipRef.current) cancelPendingRemoval(false);
      return;
    }

    if (pendingRemoveChipRef.current) {
      e.preventDefault();
      cancelPendingRemoval(true);
      return;
    }

    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const adjacent = getAdjacentChip(e.key === "ArrowLeft" ? "left" : "right");
      //console.log(adjacent)
      if (adjacent) {
        e.preventDefault();
        openChipEditor(adjacent, e.key === "ArrowLeft" ? "end" : "start");
      }
    }
  }, [suggestionDataShown, handleSuggestionNavKeyDown, cancelPendingRemoval, markPendingRemoval, emitChange, getAdjacentChip, openChipEditor]);

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
        onBlur={() => { setIsFocused(false); cancelPendingRemoval(false); }}
        className="rich-input-textarea peer rich-input-textarea-border scroll-thin"
      />

      <FloatingLabel label={label} labelBGColor={labelBGColor} placeholder={isFocused || hasContent} />

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
