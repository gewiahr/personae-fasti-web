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
  title: string;
  description: string;
  gameID: number;
};

export type EntityMetaData = {
  EntityName: string;
  EntityNamePl: string;
  EntityType: string;
  EntityTypePl: string;
  SuggestionTypeStatus: string;
  RichInputFields: string[];
  Fields: EntityFieldMetaData[];
}

export type EntityFieldMetaData = {
  FieldName: string;
  FieldLabel: string;
  Type: 'label' | 'richText';
  EditType: 'input' | 'richInput' | null;
}

export const formSuggestionRef = (suggestion: SuggestionEntity) => {
  // Transfer to game settings on backend
  switch (suggestion.type) {
    case 'char':
      suggestion.ref = `${CharMetaData.SuggestionTypeStatus} ${suggestion.name}`;
      break;
    case 'npc':
      suggestion.ref = `${NPCMetaData.SuggestionTypeStatus} ${suggestion.name}`;
      break;
    case 'location':
      suggestion.ref = `${LocationMetaData.SuggestionTypeStatus} ${suggestion.name}`;
      break;
  }
}

export interface Char extends Entity {
  title: string;
  playerID: number;
};

export const CharMetaData: EntityMetaData = {
  EntityName: "Герой",
  EntityNamePl: "Герои",
  EntityType: 'char',
  EntityTypePl: 'chars',
  SuggestionTypeStatus: "🎭",
  RichInputFields: ["description"],
  Fields: [
    {
      FieldName: 'name',
      FieldLabel: 'Имя',
      Type: 'label',
      EditType: 'input',
    },
    {
      FieldName: 'title',
      FieldLabel: 'Титул',
      Type: 'label',
      EditType: 'input',
    },
    {
      FieldName: 'description',
      FieldLabel: 'Описание',
      Type: 'richText',
      EditType: 'richInput',
    }
  ]
};

export interface NPC extends Entity {
  title: string;
};

export const NPCMetaData: EntityMetaData = {
  EntityName: "Персонаж",
  EntityNamePl: "Персонажи",
  EntityType: 'npc',
  EntityTypePl: 'npcs',
  SuggestionTypeStatus: "🎎",
  RichInputFields: ["description"],
  Fields: [
    {
      FieldName: 'name',
      FieldLabel: 'Имя',
      Type: 'label',
      EditType: 'input',
    },
    {
      FieldName: 'title',
      FieldLabel: 'Титул',
      Type: 'label',
      EditType: 'input',
    },
    {
      FieldName: 'description',
      FieldLabel: 'Описание',
      Type: 'richText',
      EditType: 'richInput',
    }
  ]
};

export interface Location extends Entity {
  pid: number;
};

export const LocationMetaData: EntityMetaData = {
  EntityName: "Место",
  EntityNamePl: "Места",
  EntityType: 'location',
  EntityTypePl: 'locations',
  SuggestionTypeStatus: "🏔️",
  RichInputFields: ["description"],
  Fields: [
    {
      FieldName: 'name',
      FieldLabel: 'Название',
      Type: 'label',
      EditType: 'input',
    },
    {
      FieldName: 'title',
      FieldLabel: 'Заглавие ',
      Type: 'label',
      EditType: 'input',
    },
    {
      FieldName: 'description',
      FieldLabel: 'Описание',
      Type: 'richText',
      EditType: 'richInput',
    }
  ]
};