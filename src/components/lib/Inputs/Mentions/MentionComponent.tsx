
import { useCallback, useEffect, useRef, useState } from "react";
import {
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isElementNode,
  $isNodeSelection,
  $isRangeSelection,
  $isTextNode,
  BLUR_COMMAND,
  CLICK_COMMAND,
  COMMAND_PRIORITY_HIGH,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  KEY_DOWN_COMMAND,
  KEY_ENTER_COMMAND,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import { getEntityMetaData } from "@/types/entities";
import { $isMentionNode, pendingAutoEditKeys } from "./MentionNode";

let measureCanvas: HTMLCanvasElement | null = null;
function measureTextWidth(text: string, font: string): number {
  if (!measureCanvas) measureCanvas = document.createElement("canvas");
  const ctx = measureCanvas.getContext("2d")!;
  ctx.font = font;
  return ctx.measureText(text || " ").width;
}

const MENTION_INPUT_MAX_WIDTH = 160;

export function MentionComponent({
  nodeKey, name, entityType,
}: { nodeKey: string; sid: string; name: string; entityType: string }) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelected] = useLexicalNodeSelection(nodeKey);
  const [isEditing, setIsEditing] = useState(false);
  const [isPendingDelete, setIsPendingDelete] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);
  const ignoreBlurRef = useRef(false);
  const metaData = getEntityMetaData(entityType);

  useEffect(() => setDraftName(name), [name]);

  useEffect(() => { 
    if (isEditing) { 
      inputRef.current?.focus(); inputRef.current?.select(); 
    } 
  }, [isEditing]);

  useEffect(() => {
  if (!isEditing || !inputRef.current) return;
    inputRef.current.focus();
    const len = inputRef.current.value.length;
    inputRef.current.setSelectionRange(len, len);
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing || !inputRef.current) return;
    const font = getComputedStyle(inputRef.current).font;
    inputRef.current.style.width = `${measureTextWidth(draftName, font) + 4}px`;
  }, [draftName, isEditing]);

  useEffect(() => {
  if (pendingAutoEditKeys.has(nodeKey)) {
    pendingAutoEditKeys.delete(nodeKey);
    setIsEditing(true);
  }
}, [nodeKey]);

  useEffect(() => {
    if (!isEditing || !inputRef.current) return;
    const rootEl = editor.getRootElement();
    const maxWidth = rootEl ? rootEl.clientWidth * 0.85 : MENTION_INPUT_MAX_WIDTH;
    const font = getComputedStyle(inputRef.current).font;
    const measured = measureTextWidth(draftName, font) + 4;
    inputRef.current.style.width = `${Math.min(measured, maxWidth)}px`;
  }, [draftName, isEditing, editor]);

  const focusEditorAtEnd = useCallback(() => {
    editor.update(() => $getRoot().selectEnd());
    requestAnimationFrame(() => {
      ignoreBlurRef.current = false;
      editor.getRootElement()?.focus();
    });
  }, [editor]);

  const commitRename = useCallback((value: string, moveCaretToEnd = false) => {
    const finalName = value.trim() || name;
    setIsEditing(false);

    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isMentionNode(node) && finalName !== name) node.setName(finalName);
      if (moveCaretToEnd) $getRoot().selectEnd();
    });

    if (moveCaretToEnd) {
      requestAnimationFrame(() => {
        ignoreBlurRef.current = false;
        editor.getRootElement()?.focus();
      });
    }
  }, [editor, nodeKey, name]);

  const cancelRename = useCallback(() => {
    setDraftName(name);
    setIsEditing(false);
    focusEditorAtEnd();
  }, [focusEditorAtEnd, name]);

  const isDeletionTarget = useCallback((backward: boolean) => {
    const selection = $getSelection();
    if ($isNodeSelection(selection)) return selection.has(nodeKey);
    if (!$isRangeSelection(selection) || !selection.isCollapsed()) return false;

    const anchor = selection.anchor;
    const anchorNode = anchor.getNode();
    let target = null;

    if ($isTextNode(anchorNode)) {
      const atBoundary = backward
        ? anchor.offset === 0
        : anchor.offset === anchorNode.getTextContentSize();
      if (atBoundary) {
        target = backward ? anchorNode.getPreviousSibling() : anchorNode.getNextSibling();
      }
    } else if ($isElementNode(anchorNode)) {
      target = anchorNode.getChildAtIndex(backward ? anchor.offset - 1 : anchor.offset);
    }

    return target?.getKey() === nodeKey;
  }, [nodeKey]);

  const exitDeleteMode = useCallback((moveCaretAfter: boolean) => {
    setIsPendingDelete(false);
    if (!moveCaretAfter) return;

    const node = $getNodeByKey(nodeKey);
    if ($isMentionNode(node)) node.selectNext(0, 0);
  }, [nodeKey]);

  const handleDeleteKey = useCallback((event: KeyboardEvent, backward: boolean) => {
    const targetsMention = isDeletionTarget(backward);
    if (event.repeat) {
      if (isPendingDelete || targetsMention) event.preventDefault();
      return isPendingDelete || targetsMention;
    }

    if (isPendingDelete) {
      event.preventDefault();
      setIsPendingDelete(false);
      const node = $getNodeByKey(nodeKey);
      if ($isMentionNode(node)) node.remove();
      return true;
    }

    if (!targetsMention) {
      return false;
    }

    event.preventDefault();
    setIsPendingDelete(true);
    return true;
  }, [isDeletionTarget, isPendingDelete, nodeKey]);

  useEffect(() => mergeRegister(
    editor.registerCommand(
      CLICK_COMMAND,
      (event: MouseEvent) => {
        if (isPendingDelete) {
          event.preventDefault();
          exitDeleteMode(true);
          return true;
        }

        const target = event.target as HTMLElement;
        if (target.closest(`[data-mention-key="${nodeKey}"]`)) {
          clearSelected();
          setSelected(true);
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_HIGH
    ),
    editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event) => {
        if (!isPendingDelete || event.key === "Backspace" || event.key === "Delete") return false;
        event.preventDefault();
        exitDeleteMode(true);
        return true;
      },
      COMMAND_PRIORITY_HIGH
    ),
    editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      (event) => handleDeleteKey(event, true),
      COMMAND_PRIORITY_HIGH
    ),
    editor.registerCommand(
      KEY_DELETE_COMMAND,
      (event) => handleDeleteKey(event, false),
      COMMAND_PRIORITY_HIGH
    ),
    editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        if (!isSelected) return false; // not ours — let it fall through normally
        event?.preventDefault();
        setIsEditing(true);
        return true;
      },
      COMMAND_PRIORITY_HIGH
    ),
    editor.registerCommand(
      BLUR_COMMAND,
      () => {
        if (isPendingDelete) exitDeleteMode(false);
        return false;
      },
      COMMAND_PRIORITY_HIGH
    )
  ), [
    clearSelected,
    editor,
    exitDeleteMode,
    handleDeleteKey,
    isPendingDelete,
    isSelected,
    nodeKey,
    setSelected,
  ]);

  return (
    <span
      data-mention-key={nodeKey}
      data-icon={metaData?.Icon ?? ""}
      className={`mention-chip ${metaData?.MentionColor.ChipClass ?? ""} ${isSelected ? "mention-chip-selected" : ""} ${isPendingDelete ? "mention-chip-pending-remove" : ""}`}
      onDoubleClick={(e) => { e.preventDefault(); setIsPendingDelete(false); setIsEditing(true); }}
      // onMouseEnter={...} / onMouseLeave={...} — hook your future hover-info popover in here
    >
      {isEditing ? (
        <input
          ref={inputRef}
          className="mention-chip-rename-input"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          onBlur={() => {
            if (ignoreBlurRef.current) {
              ignoreBlurRef.current = false;
              return;
            }
            commitRename(draftName);
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter") {
              e.preventDefault();
              ignoreBlurRef.current = true;
              commitRename(draftName, true);
            }
            if (e.key === "Escape") {
              e.preventDefault();
              ignoreBlurRef.current = true;
              cancelRename();
            }
          }}
          style={{ width: `${Math.max(draftName.length, 2)}ch` }}
        />
      ) : name}
    </span>
  );
}
