// import { SuggestionData } from "../types/suggestion";

// type RichTextProps = {
//   text: string;
//   suggestionData?: SuggestionData;
// };

// const RichText = ({ text, suggestionData } : RichTextProps) => {
//   return (
//     <div>
//       {suggestionData ? 
//         <p className="text-m mt-4">{richText}</p>
//       : <p className="text-m mt-4">{text}</p>}
//     </div>
//   )
// }

// export default RichText

import React from 'react';
import { SuggestionData } from "../types/suggestion";

type RichTextProps = {
  text: string;
  suggestionData?: SuggestionData; // Made optional
};

const RichText = ({ text, suggestionData }: RichTextProps) => {
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
        <a 
          key={`${type}-${id}-${match.index}`}
          href={`/${type}/${id}`}
          className="mention-link text-blue-500 hover:underline"
          onClick={(e) => {
            e.preventDefault();
            // Optional: Add navigation logic here
            window.location.href = `/${type}/${id}`;
          }}
        >
          {mentionText}
        </a>
      );

      lastIndex = match.index + fullMatch.length;
    }

    // Push remaining text if any
    if (lastIndex < content.length) {
      elements.push(content.substring(lastIndex));
    }
    console.log(elements)
    return elements;
  };

  return (
    <div className="text-m mt-4">
      {suggestionData ? formMentionRichText(text) : text}
    </div>
  );
};

export default RichText;
