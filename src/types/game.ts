import type { PlayerBrief } from "./player";

  /* Request */

export type GameFull = {
  ext: string;
  title: string;
  gmExt: string;

  settings: GameSettings;
  sessions: Session[];
  players: PlayerBrief[];
};

export type GameSettings = {
  allowAllEditRecords: boolean;
};

export type GameBrief = {
  ext: string;
  title: string;
  gmExt: string;
};

export type Session = {
  //id: number;
  number: number;
  name: string;
  endTime: string;
};

export type SessionEdit = {
  number: number;
  name: string;
  startTime: string;
  error?: string;
};

  /* Edit */

export type Game = {
  id: number;
  name: string;
  gmID: number;
};

export type GameCreateUpdate = {
  id: number;
  name: string;
  gmID: number;
};