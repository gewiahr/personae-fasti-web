import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { GameInfo, GameRecords, NewRecord, PlayerInfo, Record, Session } from '../types/request';
import { type RootState } from '../store';
import { api } from '../utils/api';

export type CurrentGameData = {
  game: GameInfo | null;
  records: Record[];
  sessions: Session[];
  players: PlayerInfo[];
};

const initialState : CurrentGameData = {
  game: null,
  records: [],
  sessions: [],
  players: []
};

export const getCurrentGameRecords = createAsyncThunk(
  'getCurrentGameRecords',
  async (params: { auth: string }, appThunk) => {
    const response = await api.get<GameRecords>('/records', params.auth);

    appThunk.dispatch(setCurrentGame(response.data?.currentGame || null));
    appThunk.dispatch(setCurrentGameRecords(response.data?.records || []));
    appThunk.dispatch(setCurrentGameSessions(response.data?.sessions || []));
    appThunk.dispatch(setCurrentGamePlayers(response.data?.players || []));
  }
);

export const postNewRecord = createAsyncThunk(
  'postNewRecord',
  async (params: { auth: string, playerID: number, gameID: number, content: string, hidden: boolean, questID: number }, { dispatch, getState }) => {       
    const game = selectCurrentGameInfo(getState() as RootState);
    if (!game) return;

    const newRecord: NewRecord = {
      text: params.content,
      playerID: params.playerID,
      gameID: game.id,
      questID: params.questID,
      hidden: params.hidden
    };
    
    try {
      const { data, error } = await api.post<GameRecords>('/record', params.auth, newRecord);

      if (error) throw error;
      if (data) {
        dispatch(setCurrentGame(data?.currentGame || null));
        dispatch(setCurrentGameRecords(data?.records || []));
        dispatch(setCurrentGameSessions(data?.sessions || []));
        dispatch(setCurrentGamePlayers(data?.players || []));
      }
    } catch (err) {     
      throw err;
    };
  }
);

// Create slice
const currentGameSlice = createSlice({
  name: 'currentGame',
  initialState,
  reducers: {
    setCurrentGame: (state, action: PayloadAction<GameInfo | null>) => {
      state.game = action.payload;
    },
    setCurrentGameRecords: (state, action: PayloadAction<Record[]>) => {
      state.records = action.payload;
    },
    setCurrentGameSessions: (state, action: PayloadAction<Session[]>) => {
      state.sessions = action.payload;
    },
    setCurrentGamePlayers: (state, action: PayloadAction<PlayerInfo[]>) => {
      state.players = action.payload;
    },
  },
});

export const selectGame = (state: RootState): GameInfo | null  => state.currentGame.game;

// Export actions
export const {
  setCurrentGame,
  setCurrentGameRecords,
  setCurrentGameSessions,
  setCurrentGamePlayers,
} = currentGameSlice.actions;

// Export selectors
export const selectCurrentGame = (state: RootState) => state.currentGame;
export const selectCurrentGameInfo = (state: RootState) => state.currentGame.game;
export const selectCurrentGameGM = (state: RootState) => state.currentGame.players.find((el) => el.id === state.currentGame.game?.gmID);
export const selectCurrentGamePlayers = (state: RootState) => state.currentGame.players || [];
export const selectCurrentGameRecords = (state: RootState) => state.currentGame.records || [];
export const selectCurrentGameSessions = (state: RootState) => state.currentGame.sessions || [];

// Export reducer
export default currentGameSlice;