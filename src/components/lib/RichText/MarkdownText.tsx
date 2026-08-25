import React from "react";
import type { EntityType } from "@/types/entities";
import type { SuggestionEntity } from "@/types/suggestion";
import { DISPLAY_TOKEN_REGEX, unescapeMarkdownText } from "@lib/markdownGrammar";
import MentionLink from "./MentionLink";

type MarkdownTextProps = {
  text: string;
  uid: string;
  suggestions: SuggestionEntity[];
  fullWidth?: boolean;
  className?: string;
};

const isEntityType = (type: string): type is EntityType => (
  type === "char" || type === "npc" || type === "location"
);

function renderMarkdownText(content: string, uid: string, suggestions: SuggestionEntity[]): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  DISPLAY_TOKEN_REGEX.lastIndex = 0;
  while ((match = DISPLAY_TOKEN_REGEX.exec(content)) !== null) {
    if (match.index > lastIndex) {
      elements.push(unescapeMarkdownText(content.slice(lastIndex, match.index)));
    }

    const [, boldItalicText, boldText, italicText, sid, mentionText] = match;

    if (boldItalicText !== undefined) {
      elements.push(<strong key={`${uid}-bi-${key++}`}><em>{unescapeMarkdownText(boldItalicText)}</em></strong>);
    } else if (boldText !== undefined) {
      elements.push(<strong key={`${uid}-b-${key++}`}>{unescapeMarkdownText(boldText)}</strong>);
    } else if (italicText !== undefined) {
      elements.push(<em key={`${uid}-i-${key++}`}>{unescapeMarkdownText(italicText)}</em>);
    } else if (sid !== undefined) {
      const suggestion = suggestions.find((item) => item.sid === sid && !item.secret);
      if (suggestion && isEntityType(suggestion.type)) {
        elements.push(
          <MentionLink key={`${uid}-mention-${key++}`} ext={suggestion.ext} type={suggestion.type} mentionText={mentionText} />
        );
      } else {
        elements.push(mentionText);
      }
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) elements.push(unescapeMarkdownText(content.slice(lastIndex)));
  return elements;
}

const MarkdownText = ({ text, uid, suggestions, fullWidth = false, className = "" }: MarkdownTextProps) => {
  return (
    <div className={`text-m ${fullWidth ? "text-justify" : ""} ${className} whitespace-pre-line`}>
      {renderMarkdownText(text, uid, suggestions)}
    </div>
  );
};

export default MarkdownText;
