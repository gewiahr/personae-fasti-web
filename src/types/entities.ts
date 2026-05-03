import type { SuggestionEntity, SuggestionEntityRender } from "./suggestion";

export interface EntityEdit {
  fieldName?: string;
  arrayIndex?: number;
  handleFieldChange: (value: any, field?: string, index?: number) => void;
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
  hiddenBy: number;
};

export interface EntityCreateUpdate {
  id: number;
  name: string;
  title: string;
  description: string;
  gameID: number;
  hidden: boolean;  
}

export type EntityMetaData = {
  EntityName: string;
  EntityNamePl: string;
  EntityNameAcc: string;
  EntityNameGender: 'm' | 'f' | 'n';
  EntityType: string;
  EntityTypePl: string;
  Icon: string;
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
  var suggestionRef = '';
  switch (suggestion.type) {
    case 'char':
      suggestionRef = `${CharMetaData.Icon} ${suggestion.name}`;
      break;
    case 'npc':
      suggestionRef = `${NPCMetaData.Icon} ${suggestion.name}`;
      break;
    case 'location':
      suggestionRef = `${LocationMetaData.Icon} ${suggestion.name}`;
      break;
  }

  return { ...suggestion, ref: suggestionRef } as SuggestionEntityRender
}

export interface Char extends Entity {
  playerID: number;
};

export interface CharCreateUpdate extends EntityCreateUpdate {

}

export const CharMetaData: EntityMetaData = {
  EntityName: "Герой",
  EntityNamePl: "Герои",
  EntityNameAcc: "Героя",
  EntityNameGender: 'm',
  EntityType: 'char',
  EntityTypePl: 'chars',
  Icon: "🎭",
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

};

export interface NPCCreateUpdate extends EntityCreateUpdate {
  
}

export const NPCMetaData: EntityMetaData = {
  EntityName: "Персонаж",
  EntityNamePl: "Персонажи",
  EntityNameAcc: "Персонажа",
  EntityNameGender: 'm',
  EntityType: 'npc',
  EntityTypePl: 'npcs',
  Icon: "🎎",
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

export interface LocationCreateUpdate extends EntityCreateUpdate {
  pid: number;
}

export const LocationMetaData: EntityMetaData = {
  EntityName: "Место",
  EntityNamePl: "Места",
  EntityNameAcc: "Места",
  EntityNameGender: 'n',
  EntityType: 'location',
  EntityTypePl: 'locations',
  Icon: "🏔️",
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
      FieldLabel: 'Заглавие',
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

export type EntityType = 'char' | 'npc' | 'location';

export type EntityMetaDataType = keyof typeof entityConfig;

export interface EntityMetaDataTypeMap {
  chars: { page: Char, edit: CharCreateUpdate, suggestion: 'char' };
  npcs: { page: NPC, edit: NPCCreateUpdate, suggestion: 'npc' };
  locations: { page: Location, edit: LocationCreateUpdate, suggestion: 'location' };
};

export const entityConfig = {
  chars: CharMetaData,
  npcs: NPCMetaData,
  locations: LocationMetaData,
};

export const entityToMetaData = {
  char: { metaData: 'chars' as EntityMetaDataType },
  npc: { metaData: 'npcs' as EntityMetaDataType },
  location: { metaData: 'locations' as EntityMetaDataType },
}