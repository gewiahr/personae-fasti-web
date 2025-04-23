import { SuggestionEntity } from "./suggestion";

export interface EntityEdit {
  fieldName?: string;
  handleFieldChange: (value: string, field?: string) => void;
}

export type GameEvent = {
  id: string;
  content: string;
  timestamp: string;
  author: string;
};

export interface Entity {
  id: number;
  name: string;
  description: string;
  gameID: number;
};

type EntityMetaData = {
  SuggestionTypeStatus: string;
  RichInputFields: string[];
}

export const formSuggestionRef = (suggestion: SuggestionEntity) => {
  // Transfer to game settings on backend
  switch (suggestion.type) {
    case 'char':
      suggestion.ref = `${CharMetaData.SuggestionTypeStatus} ${suggestion.name}`;
      break;
    case 'npc':
      suggestion.ref = `🎎 ${suggestion.name}`;
      break;
    case 'location':
      suggestion.ref = `🏔️ ${suggestion.name}`;
      break;
  }
}

export interface Char extends Entity {
  title: string;
  playerID: number;
};

export const CharMetaData: EntityMetaData = {
  SuggestionTypeStatus: "🎭",
  RichInputFields: ["description"]
}

export interface NPC extends Entity {
  title: string;
};

export interface Location extends Entity {
  pid: number;
};