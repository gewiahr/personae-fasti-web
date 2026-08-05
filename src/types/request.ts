import type { Char, NPC, Location, CharBrief, NPCBrief } from "./entities";
import type { GameBrief, GameFull, GameInvites, Session } from "./game";
import type { PlayerBrief } from "./player";
import type { Record } from "./record";



/* =================== */

export type GameRecords = {
  records: Record[];
  sessions: Session[];
  players: PlayerBrief[];
  currentGame: GameBrief;
};

export type PlayerGamesInfo = {
  currentGame: GameFull;
  playerGames: GameBrief[];
  playerInvites: GameInvites[];
};

export type GamePage = {
  game: GameFull;
  // players: PlayerBrief[];
  // invites: PlayerBrief[];
}

export interface GameEntities {
  currentGame: GameBrief;
}

export interface GameChars extends GameEntities {
  chars: CharBrief[];
  players: PlayerBrief[];
};

export interface GameNPCs extends GameEntities {
  npcs: NPCBrief[];
};

export interface EntityPageData {
  records: Record[]
}

export interface CharPageData extends EntityPageData {
  char: Char;
};

export interface NPCPageData extends EntityPageData {
  npc: NPC;
};

export interface LocationPageData extends EntityPageData {
  Location: Location;
};

export type NewEntity = {
  name: string;
  description: string;
  playerID: number;
  gameID: number;
  created: string;
  hidden: boolean;
};