import { SuggestionData } from "./suggestion";

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

/**
 * Extracts all mentions from text and matches them with suggestions
 * @param textValue The text containing mentions (@`mention`)
 * @param suggestions Array of possible suggestions to match against
 * @returns Array of matched mentions
 */
export function extractMentions(textValue: string, suggestions: SuggestionData): Mention[] {
    // 1. Extract all mention strings from text
    const mentionRegex = /@`([^`]+)`/g;
    const mentionMatches = Array.from(textValue.matchAll(mentionRegex));
    
    // 2. Get unique mention names
    const mentionNames = [...new Set(
      mentionMatches.map(match => match[1].trim())
    )];
  
    // 3. Match with suggestions
    const matchedMentions: Mention[] = [];
    
    mentionNames.forEach(name => {
        const foundSuggestion = suggestions.entities.find(suggestion => 
            suggestion.name.toLowerCase() === name.toLowerCase()
        );
        
        if (foundSuggestion) {
            matchedMentions.push({
                entityID: foundSuggestion.id,
                entitySID: foundSuggestion.sid,
                entityType: foundSuggestion.type,
                title: foundSuggestion.name,
        });
        }
    });
  
    return matchedMentions;
  }