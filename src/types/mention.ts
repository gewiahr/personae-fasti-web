import { Char, CharMetaData } from "./entities";
import { SuggestionData, SuggestionEntity } from "./suggestion";

export type MentionContext = {
  position: number;
  query: string;
}

export type Mention = {
  title: string
  entityType: string
  entityID: number
  entitySID: string
};

export const enrichCharFieldsMentions = (editedChar: Char, suggestions: SuggestionData): Char => {
  // Enrich fields with rich input
  CharMetaData.RichInputFields.forEach((field) => {
    if (editedChar?.[field as keyof typeof editedChar]) {
      editedChar = {
        ...editedChar,
        [field]: enrichMentionInput(`${editedChar?.[field as keyof typeof editedChar]}`, suggestions?.entities || [])
      };
    };
  });

  return editedChar;
}

export const enrichMentionInput = (textInput: string, suggestions: SuggestionEntity[]) => {
  const suggestionMap = new Map(
    suggestions.map(item => [item.name.toLowerCase(), item])
  );

  return textInput.replace(/@`([^`]+)`/g, (fullMatch, mentionName) => {
    const found = suggestionMap.get(mentionName.toLowerCase());
    return found ? `@${found.sid}\`${found.name}\`` : fullMatch;
  });
};

export const simplerCharFieldsMentions = (char: Char, suggestions: SuggestionData): Char => {
  let newChar: Char = char
  // Simplify fields with rich input
  CharMetaData.RichInputFields.forEach((field) => {
    if (newChar?.[field as keyof typeof newChar]) {
      newChar = {
        ...newChar,
        [field]: simplifyMentionInput(`${newChar?.[field as keyof typeof newChar]}`, suggestions?.entities || [])
      };
    };
  });

  return newChar;
}

export const simplifyMentionInput = (textInput: string, suggestions: SuggestionEntity[]) => {
  const suggestionMap = new Map(
    suggestions.map(item => [item.sid, item])
  );

  return textInput.replace(/@(\w+:\w+)`[^`]+`/g, (fullMatch, mentionSID) => {
    const found = suggestionMap.get(mentionSID);
    return found ? `@\`${found.name}\`` : fullMatch;
  });
};

// const mentionRegex = /@\w+:\w+`([^`]+)`/g;
// return textInput.replace(mentionRegex, '@`$1`');