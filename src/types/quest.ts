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
  hiddenBy: number;
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
  hiddenBy: number;
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
    hiddenBy: 0,
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