import { Char, CharMetaData, Entity, EntityCreateUpdate, EntityMetaData } from "./entities";
import { QuestMetaData, QuestTaskMetaData } from "./quest";
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

export const enrichEntityFieldsMentions = <T extends EntityCreateUpdate>(editedEntity: T, metaData: EntityMetaData, suggestions: SuggestionData): T => {
  // Enrich fields with rich input
  metaData.RichInputFields.forEach((field) => {
    if (editedEntity?.[field as keyof typeof editedEntity]) {
      editedEntity = {
        ...editedEntity,
        [field]: enrichMentionInput(`${editedEntity?.[field as keyof typeof editedEntity]}`, suggestions?.entities || [])
      };
    };
  });

  return editedEntity;
}

export const enrichQuestFieldsMentions = <Quest>(editedQuest: Quest, suggestions: SuggestionData): Quest => {
  // Enrich fields with rich input
  QuestMetaData.RichInputFields.forEach((field) => {
    if (editedQuest?.[field as keyof typeof editedQuest]) {
      editedQuest = {
        ...editedQuest,
        [field]: enrichMentionInput(`${editedQuest?.[field as keyof typeof editedQuest]}`, suggestions?.entities || [])
      };
    };
  });

  return editedQuest;
}

export const enrichQuestTaskFieldsMentions = <QuestTask>(editedTasks: QuestTask[], suggestions: SuggestionData): QuestTask[] => {
  let newTasks: QuestTask[] = editedTasks;
  
  QuestTaskMetaData.RichInputFields.forEach((field) => {
    newTasks.forEach((task, i) => {
      if (task[field as keyof QuestTask]) {
        newTasks[i] = {
          ...task,
          [field]: enrichMentionInput(`${task[field as keyof QuestTask]}`, suggestions?.entities || [])
        };
      };
    });   
  });

  return newTasks;
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


export const simplerEntityFieldsMentions = <T extends Entity>(entity: T, metaData: EntityMetaData, suggestions: SuggestionData): T => {
  let newEntity: T = entity
  
  metaData.RichInputFields.forEach((field) => {
    if (newEntity?.[field as keyof typeof newEntity]) {
      newEntity = {
        ...newEntity,
        [field]: simplifyMentionInput(`${newEntity?.[field as keyof typeof newEntity]}`, suggestions?.entities || [])
      };
    };
  });

  return newEntity;
}

export const simplerQuestFieldsMentions = <Quest>(quest: Quest, suggestions: SuggestionData): Quest => {
  let newQuest: Quest = quest;
  
  QuestMetaData.RichInputFields.forEach((field) => {
    if (newQuest?.[field as keyof typeof newQuest]) {
      newQuest = {
        ...newQuest,
        [field]: simplifyMentionInput(`${newQuest?.[field as keyof typeof newQuest]}`, suggestions?.entities || [])
      };
    };
  });

  return newQuest;
}

export const simplerQuestTaskFieldsMentions = <QuestTask>(tasks: QuestTask[], suggestions: SuggestionData): QuestTask[] => {
  let newTasks: QuestTask[] = tasks;
  
  QuestTaskMetaData.RichInputFields.forEach((field) => {
    newTasks.forEach((task, i) => {
      if (task[field as keyof QuestTask]) {
        newTasks[i] = {
          ...task,
          [field]: simplifyMentionInput(`${task[field as keyof QuestTask]}`, suggestions?.entities || [])
        };
      };
    })  
  });

  return newTasks;
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