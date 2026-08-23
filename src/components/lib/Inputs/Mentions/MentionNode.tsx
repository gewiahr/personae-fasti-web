import { DecoratorNode, type NodeKey, type LexicalNode } from "lexical";
import * as React from "react";
import { MentionComponent } from "./MentionComponent.tsx";

export type SerializedMentionNode = {
  sid: string;
  mentionName: string;
  entityType: string;
  type: "mention";
  version: 1;
};

export class MentionNode extends DecoratorNode<React.ReactElement> {
  __sid: string;
  __name: string;
  __entityType: string;

  static getType(): string {
    return "mention";
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__sid, node.__name, node.__entityType, node.__key);
  }

  constructor(sid: string, name: string, entityType: string, key?: NodeKey) {
    super(key);
    this.__sid = sid;
    this.__name = name;
    this.__entityType = entityType;
  }

  createDOM(): HTMLElement {
    // Lexical owns this wrapper element; all real styling/rendering lives
    // in MentionComponent via decorate() below.
    const span = document.createElement("span");
    span.style.display = "inline-block";
    return span;
  }

  updateDOM(): false {
    return false; // decorate() re-renders through React instead
  }

  decorate(): React.ReactElement {
    return (
      <MentionComponent
        nodeKey={this.getKey()}
        sid={this.__sid}
        name={this.__name}
        entityType={this.__entityType}
      />
    );
  }

  isInline(): true {
    return true;
  }

  setName(name: string): void {
    this.getWritable().__name = name;
  }

  getName(): string { return this.__name; }
  getSid(): string { return this.__sid; }
  getEntityType(): string { return this.__entityType; }

  static importJSON(serialized: SerializedMentionNode): MentionNode {
    return $createMentionNode(serialized.sid, serialized.mentionName, serialized.entityType);
  }

  exportJSON(): SerializedMentionNode {
    return {
      sid: this.__sid,
      mentionName: this.__name,
      entityType: this.__entityType,
      type: "mention",
      version: 1,
    };
  }
}

export function $createMentionNode(sid: string, name: string, entityType: string): MentionNode {
  return new MentionNode(sid, name, entityType);
}

export function $isMentionNode(node: LexicalNode | null | undefined): node is MentionNode {
  return node instanceof MentionNode;
}

// Keys of mentions that should auto-enter edit mode the moment their
// component mounts — set by insertion, consumed once by MentionComponent.
export const pendingAutoEditKeys = new Set<string>();