import { Char, NPC, Location } from "./entities";
import { Quest, QuestTask } from "./quest";

export type LoginInfo = {
  accesskey: string;
  player: PlayerInfo;
  currentGame: GameFullInfo;
};

export type TelegramLoginInfo = {
  accesskey: string;
  player: PlayerInfo;
  currentGame: GameFullInfo;
};

export type GameRecords = {
  records: Record[];
  sessions: Session[];
  players: PlayerInfo[];
  currentGame: GameInfo;
};

export type Record = {
  id: number;
  text: string;
  playerID: number;
  gameID: number;
  questID: number;
  quest: Quest;
  created: string;
  updated: string;
  hiddenBy: number;
};

export type NewRecord = {
  text: string;
  playerID: number;
  gameID: number;
  questID: number;
  hidden: boolean;
};

export type Session = {
  id: number;
  number: number;
  name: string;
  endTime: string;
};

export type PlayerInfo = {
  id: number;
  username: string;
};

export type PlayerSettings = {
  currentGame: GameFullInfo;
  playerGames: GameInfo[];
};

export type GameInfo = {
  id: number;
  title: string;
  gmID: number;
};

export type GameFullInfo = {
  id: number;
  title: string;
  gmID: number;

  settings: GameSettings;
};

export type GameSettings = {
  allowAllEditRecords: boolean;
}

export interface EntityInfo {
  id: number;
  name: string;
  title: string;

  gameID: number;
  hiddenBy: number;  
}

export interface CharInfo extends EntityInfo {
  playerID: number;
};

export interface NPCInfo extends EntityInfo {
  playerID: number;
};

export interface GameEntities {
  currentGame: GameInfo;
}

export interface GameChars extends GameEntities {
  chars: CharInfo[];
  players: PlayerInfo[];
};

export interface GameNPCs extends GameEntities {
  npcs: NPCInfo[];
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

export interface QuestInfo {
  id: number;
  name: string;
  title: string;
  description: string;

  gameID: number;
  successful: boolean;	
  hiddenBy: number; 
  finished: boolean;
}

export interface GameQuests {
  currentGame: GameInfo;
  quests: QuestInfo[];
}

export interface QuestPageData {
  quest: Quest;
  tasks: QuestTask[];
  records: Record[];
}

export type NewEntity = {
  name: string;
  description: string;
  playerID: number;
  gameID: number;
  created: string;
  hidden: boolean;
};