export interface EntityEdit {
  fieldName?: string;
  handleFieldChange: (field: string, value: string) => void;
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

export interface Char extends Entity {
  title: string;
  playerID: number;
};

export interface NPC extends Entity {
  title: string;
};

export interface Location extends Entity {
  pid: number;
};