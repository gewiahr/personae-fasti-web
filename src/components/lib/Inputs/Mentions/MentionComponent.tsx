
import { useCallback, useEffect, useRef, useState } from "react";
import { $getNodeByKey, CLICK_COMMAND, KEY_ENTER_COMMAND, COMMAND_PRIORITY_LOW, $isTextNode, $createTextNode } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import { $isMentionNode, pendingAutoEditKeys } from "./MentionNode";

const MENTION_META: Record<string, { icon: string; colorClass: string }> = {
  char: { icon: "🧑", colorClass: "mention-chip-char" },
  npc: { icon: "🗡️", colorClass: "mention-chip-npc" },
  location: { icon: "📍", colorClass: "mention-chip-location" },
};

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
  const [draftName, setDraftName] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);
  const meta = MENTION_META[entityType];

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

  const commitRename = useCallback((value: string, moveCaretAfter?: boolean) => {
    const finalName = value.trim() || name;
    setIsEditing(false);

    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (!$isMentionNode(node)) return;
      if (finalName !== name) node.setName(finalName);

      if (!moveCaretAfter) return;

      const next = node.getNextSibling();
      if ($isTextNode(next) && next.getTextContent().length > 0) {
        // Something real already follows — land one character into it.
        next.select(1, 1);
      } else if ($isTextNode(next)) {
        // An empty placeholder text node exists (e.g. the trailing landing
        // spot from deserialization) — give it the space itself.
        next.setTextContent(" ");
        next.select(1, 1);
      } else {
        // Truly nothing after the chip — insert a real space to land on.
        const spaceNode = $createTextNode(" ");
        node.insertAfter(spaceNode);
        spaceNode.select(1, 1);
      }
    });

    // The <input> is unmounting this same tick (isEditing just flipped to
    // false) — without this, focus has nowhere to go and the caret we just
    // positioned above won't visibly render anywhere.
    requestAnimationFrame(() => editor.getRootElement()?.focus());
  }, [editor, nodeKey, name]);

  useEffect(() => mergeRegister(
    editor.registerCommand(
      CLICK_COMMAND,
      (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.closest(`[data-mention-key="${nodeKey}"]`)) {
          clearSelected();
          setSelected(true);
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    )
  ), [editor, nodeKey, setSelected, clearSelected]);

  useEffect(() => mergeRegister(
    editor.registerCommand(
      CLICK_COMMAND,
      (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.closest(`[data-mention-key="${nodeKey}"]`)) {
          clearSelected();
          setSelected(true);
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    ),
    editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        if (!isSelected) return false; // not ours — let it fall through normally
        event?.preventDefault();
        setIsEditing(true);
        return true;
      },
      COMMAND_PRIORITY_LOW
    )
  ), [editor, nodeKey, setSelected, clearSelected, isSelected]);

  return (
    <span
      data-mention-key={nodeKey}
      data-icon={meta?.icon ?? ""}
      className={`mention-chip ${meta?.colorClass ?? ""} ${isSelected ? "mention-chip-selected" : ""}`}
      onDoubleClick={(e) => { e.preventDefault(); setIsEditing(true); }}
      // onMouseEnter={...} / onMouseLeave={...} — hook your future hover-info popover in here
    >
      {isEditing ? (
        <input
          ref={inputRef}
          className="mention-chip-rename-input"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          onBlur={() => commitRename(draftName)}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter") { e.preventDefault(); commitRename(draftName); }
            if (e.key === "Escape") { e.preventDefault(); setIsEditing(false); setDraftName(name); }
          }}
          style={{ width: `${Math.max(draftName.length, 2)}ch` }}
        />
      ) : name}
    </span>
  );
}