import type { Record } from "./record";

  /* Request */
  
export interface QuestBrief {
  id: number;
  name: string;
  title: string;
  description: string;

  gameExt: string;
  successful: boolean;	
  hidden: boolean; 
  finished: boolean;
}

export interface QuestPageData {
  quest: Quest;
  tasks: QuestTask[];
  records: Record[];
}

  /* Edit */ 

export interface Quest {
  id: number;
  name: string;
  title: string;
  description: string;
  parentID: number;
	childID: number;
	headID: number;
  gameID: number;
  successful: boolean;
  hidden: boolean;
  finished: boolean;
};

export const QuestMetaData = {
  RichInputFields: ["description"]
}

export interface QuestTask {
  id: number;
  questID: number;
  name: string;
  description: string;
  type: number;
  capacity: number;
  current: number;
  hidden: boolean;
  finished: boolean;
}

export const QuestTaskMetaData = {
  RichInputFields: ["description"]
}

export const NewQuestTask = (questID: number) : QuestTask => ({
    id: 0,
    questID,
    name: '',
    description: '',
    type: 0,
    capacity: 0,
    current: 0,
    hidden: false,
    finished: false
});

export interface QuestCreateUpdate {
  quest: Quest;
  tasks: QuestTask[]; 
}

export enum QuestTaskType {
  Binary = 0,
  Decimal
}