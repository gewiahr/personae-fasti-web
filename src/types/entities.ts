import type { SuggestionEntity, SuggestionEntityRender } from "./suggestion";

  /* Request */

export interface EntityBrief {
  ext: string;
  name: string;
  title: string;

  gameExt: string;
  hidden: boolean;  
};

export interface CharBrief extends EntityBrief {
  playerExt: string;
};

export interface NPCBrief extends EntityBrief {

};

export interface LocationBrief extends EntityBrief {
};

  /* Edit */


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
  ext: string;
  name: string;
  title: string;
  description: string;
  gameExt: string;
  hidden: boolean;
};

export interface EntityCreateUpdate {
  ext: string;
  name: string;
  title: string;
  description: string;
  gameExt: string;
  hidden: boolean;  
}

export type EntityType = 'char' | 'npc' | 'location';

export type EntityMetaData = {
  EntityName: string;
  EntityNamePl: string;
  EntityNameAcc: string;
  EntityNameGender: 'm' | 'f' | 'n';
  EntityType: EntityType;
  EntityTypePl: string;
  Icon: string;
  MentionColor: {
    TextClass: string;
    ChipClass: string;
  };
  Fields: EntityFieldMetaData[];
}

export type EntityFieldMetaData = {
  FieldName: string;
  FieldLabel: string;
  Type: 'label' | 'richText';
  EditType: 'input' | 'markdownInput' | null;
}

export const formSuggestionRef = (suggestion: SuggestionEntity) => {
  const metaData = getEntityMetaData(suggestion.type);
  const suggestionRef = metaData ? `${metaData.Icon} ${suggestion.name}` : suggestion.name;

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
  MentionColor: {
    TextClass: "text-blue-500",
    ChipClass: "mention-chip-char",
  },
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
      EditType: 'markdownInput',
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
  MentionColor: {
    TextClass: "text-yellow-500",
    ChipClass: "mention-chip-npc",
  },
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
      EditType: 'markdownInput',
    }
  ]
};

export interface Location extends Entity {
  parentExt: string;
};

export interface LocationCreateUpdate extends EntityCreateUpdate {
  parentExt: string;
}

export const LocationMetaData: EntityMetaData = {
  EntityName: "Место",
  EntityNamePl: "Места",
  EntityNameAcc: "Места",
  EntityNameGender: 'n',
  EntityType: 'location',
  EntityTypePl: 'locations',
  Icon: "🏔️",
  MentionColor: {
    TextClass: "text-green-500",
    ChipClass: "mention-chip-location",
  },
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
      EditType: 'markdownInput',
    }
  ]
};

export type EntityMetaDataType = keyof typeof entityConfig;

export interface EntityMetaDataTypeMap {
  chars: { page: Char, brief: CharBrief, edit: CharCreateUpdate, suggestion: 'char' };
  npcs: { page: NPC, brief: NPCBrief, edit: NPCCreateUpdate, suggestion: 'npc' };
  locations: { page: Location, brief: LocationBrief, edit: LocationCreateUpdate, suggestion: 'location' };
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

const entityMetaDataByType: Record<EntityType, EntityMetaData> = {
  char: CharMetaData,
  npc: NPCMetaData,
  location: LocationMetaData,
};

export const getEntityMetaData = (type: string): EntityMetaData | undefined =>
  entityMetaDataByType[type as EntityType];
