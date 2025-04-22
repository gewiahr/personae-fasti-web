import { Char } from "./entities";

export type LoginInfo = {
  accesskey: string;
  player: PlayerInfo;
  currentGame: GameInfo;
};

export type GameRecords = {
  records: Record[];
  players: PlayerInfo[];
  currentGame: GameInfo;
};

export type Record = {
  id: number;
  text: string;
  playerID: number;
  gameID: number;
  created: string;
  updated: string;
};

export type NewRecord = {
  text: string;
  playerID: number;
  gameID: number;
  created: string;
};

export type PlayerInfo = {
  id: number;
  username: string;
};

export type GameInfo = {
  id: number;
  title: string;
};

export type CharInfo = {
  id: number;
  name: string;
  title: string;

  playerID: number;
  gameID: number;
};

export type GameChars = {
  chars: CharInfo[];
  players: PlayerInfo[];
  currentGame: GameInfo;
};

export type CharPageData = {
  char: Char;
};

export type NewEntity = {
  name: string;
  description: string;
  playerID: number;
  gameID: number;
  created: string;
};