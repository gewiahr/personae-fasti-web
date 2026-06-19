
  /* Request */

export type LoginInfo = {
  authorization: string;
  player: PlayerFull;
};

export type PlayerFull = {
  ext: string;
  username: string;
  gameExt?: string;
  settings: PlayerSettings;
};

export type PlayerSettings = {
  couldChangeUsername: boolean;
  //colorTheme: 'blue' | 'green'
};

export type PlayerBrief = {
  ext: string;
  username: string;
};