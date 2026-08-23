export type Record = {
  id: number;
  text: string;
  playerExt: string;
  gameExt: string;
  questExt: string;
  created: string;
  updated: string;
  hidden: boolean;
};

export type NewRecord = {
  text: string;
  questExt: string;
  hidden: boolean;
};

export type EditRecord = {
  id: number;
  text: string;
  questExt: string;
  hidden: boolean;
};
