import type { Record } from "./record";

  /* Request */
  
export interface QuestBrief {
  ext: string;
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
  ext: string;
  name: string;
  title: string;
  description: string;
  gameExt: string;
  successful: boolean;
  hidden: boolean;
  finished: boolean;
};

export const QuestMetaData = {
  RichInputFields: ["description"]
}

export interface QuestTask {
  id: number;
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

export const NewQuestTask = () : QuestTask => ({
    id: 0,
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
