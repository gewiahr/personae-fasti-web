import type { GameBrief, GameFull, GameInvites, Session } from "./game";
import type { PlayerBrief } from "./player";
import type { Record } from "./record";

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
