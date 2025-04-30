import React from 'react';
//import { SuggestionData } from "../types/suggestion";

type RichTextProps = {
  text: string;
  //suggestionData?: SuggestionData; // Made optional
};

const RichText = ({ text }: RichTextProps) => {
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

      // ** temporaty color picker ** //
      console.log(type)
      var typeColor = "blue";
      switch (type) {
        case "char":
          typeColor = "blue";
          break;
        case "npc":
          typeColor = "yellow";
          break;
        case "location":
          typeColor = "green";
          break;
      }
      
      // Push the link component
      elements.push(
        <a 
          key={`${type}-${id}-${match.index}`}
          href={`/${type}/${id}`}
          //className="text-blue-500 text-sans mention-link hover:underline"
          //className={`bg-${typeColor}-800 rounded px-1 py-0.5`}
          className={`text-${typeColor}-500 text-sans mention-link hover:underline`}
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
    // <div className="mt-4 text-m">
    //   {suggestionData ? formMentionRichText(text) : text}
    // </div>
    <>
      {/* suggestionData ? formMentionRichText(text) : text */}
      {formMentionRichText(text)}
    </>
  );
};

export default RichText;
