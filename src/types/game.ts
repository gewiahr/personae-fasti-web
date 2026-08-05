import type { PlayerBrief } from "./player";

  /* Request */

export type GameFull = {
  ext: string;
  title: string;
  gmExt: string;

  settings: GameSettings;
  sessions: Session[];
  players: PlayerBrief[];
  invites: PlayerBrief[]
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

export type GameInvites = {
  playerExt: string;
  gameExt: string;
  gameTitle: string;
  inviteCode: string;
};

  /* Edit */

export type Game = {
  ext: number;
  name: string;
  gmExt: number;
};

export type GameCreateUpdate = {
  ext: number;
  name: string;
  gmExt: number;
};