import type { SuggestionEntity } from "./suggestion";

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
  // Transfer to game settings on backend
  switch (suggestion.type) {
    case 'char':
      suggestion.ref = `${CharMetaData.Icon} ${suggestion.name}`;
      break;
    case 'npc':
      suggestion.ref = `${NPCMetaData.Icon} ${suggestion.name}`;
      break;
    case 'location':
      suggestion.ref = `${LocationMetaData.Icon} ${suggestion.name}`;
      break;
  }
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