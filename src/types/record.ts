export type Record = {
  id: number;
  text: string;
  playerExt: string;
  gameExt: string;
  questID: number;
  created: string;
  updated: string;
  hidden: boolean;
};

export type NewRecord = {
  text: string;
  questID: number;
  hidden: boolean;
};

export type EditRecord = {
  id: number;
  text: string;
  questID: number;
  hidden: boolean;
};