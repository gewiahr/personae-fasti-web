export type Record = {
  ext: string;
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
  ext: string;
  text: string;
  questExt: string;
  hidden: boolean;
};
