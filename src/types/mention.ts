import { SuggestionEntity } from "./suggestion";

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

export const enrichMentionInput = (textInput : string, suggestions : SuggestionEntity[]) => {
  const suggestionMap = new Map(
    suggestions.map(item => [item.name.toLowerCase(), item])
  );

  return textInput.replace(/@`([^`]+)`/g, (fullMatch, mentionName) => {
    const found = suggestionMap.get(mentionName.toLowerCase());
    return found ? `@${found.sid}\`${found.name}\`` : fullMatch;
  });
};