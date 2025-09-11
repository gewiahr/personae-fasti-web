import React from 'react';
import Hyperlink from './Hyperlink';
//import { SuggestionData } from "../types/suggestion";

type RichTextProps = {
  text: string;
  fullWidth?: boolean;
  className?: string;
  //suggestionData?: SuggestionData; // Made optional
};

const RichText = ({ text, fullWidth = false, className='' }: RichTextProps) => {
  const formMentionRichText = (content: string): React.ReactNode[] => {
    const mentionRegex = /@(\w+):(\w+)`([^`]+)`/g;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      // Push preceding text if any
      if (match.index > lastIndex) {
        elements.push(content.substring(lastIndex, match.index));
      }

      const [fullMatch, type, id, mentionText] = match;
  
      // Push the link component
      elements.push(
        <Hyperlink id={id} type={type} mentionText={mentionText}/>
      );

      lastIndex = match.index + fullMatch.length;
    }

    // Push remaining text if any
    if (lastIndex < content.length) {
      elements.push(content.substring(lastIndex));
    }
    return elements;
  };

  return (
    <>
      {/* suggestionData ? formMentionRichText(text) : text */}
      <div className={`text-m ${fullWidth ? 'text-justify' : ''} ${className} whitespace-pre-line`}>
        {formMentionRichText(text)}
      </div>     
    </>
  );
};

export default RichText;
