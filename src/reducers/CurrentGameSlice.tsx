import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { GameFullInfo, GameInfo, GameQuests, GameRecords, NewRecord, PlayerInfo, QuestInfo, Record, Session } from '../types/request';
import { type RootState } from '../store';
import { api } from '../utils/api';
import type { SuggestionData } from '../types/suggestion';
import { addLoading, removeLoading } from './LoadingSlice';

export type CurrentGameData = {
  game: GameFullInfo | null;
  records: Record[];
  sessions: Session[];
  players: PlayerInfo[];
  quests: QuestInfo[];
  suggestions: SuggestionData;
};

const initialState: CurrentGameData = {
  game: null,
  records: [],
  sessions: [],
  players: [],
  quests: [],
  suggestions: { entities: [] }
};

export const changeCurrentGame = createAsyncThunk(
  'changeCurrentGame',
  async (params: { auth: string, gameID: number }, appThunk) => {
    try {
      const { data, error } = await api.put<GameFullInfo>("/player/game", params.auth, { gameID: Number(params.gameID) });
      if (error) throw error
      appThunk.dispatch(setCurrentGame(data || null));
    } catch (e) {
      throw e
    }
  }
);

export const startNewSession = createAsyncThunk(
  'startNewSession',
  async (params: { auth: string }, _) => {
    try {
      const { error } = await api.post<GameInfo>("/game/session/new", params.auth, null);
      if (error) throw error
    } catch (e) {
      throw e
    }
  }
);

export const loadCurrentGameRecords = createAsyncThunk(
  'loadCurrentGameRecords',
  async (params: { auth: string }, appThunk) => {
    appThunk.dispatch(addLoading(loadCurrentGameRecords.typePrefix));
    try {
      const response = await api.get<GameRecords>('/records', params.auth);
      //appThunk.dispatch(setCurrentGame(response.data?.currentGame || null));
      appThunk.dispatch(setCurrentGameRecords(response.data?.records === null ? [] : response.data?.records || []));
      appThunk.dispatch(setCurrentGameSessions(response.data?.sessions === null ? [] : response.data?.sessions || []));
      appThunk.dispatch(setCurrentGamePlayers(response.data?.players || []));
    } catch (e) {

    } finally {
      appThunk.dispatch(removeLoading(loadCurrentGameRecords.typePrefix));
    }
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
        //dispatch(setCurrentGame(data?.currentGame || null));
        dispatch(setCurrentGameRecords(data?.records || []));
        dispatch(setCurrentGameSessions(data?.sessions || []));
        dispatch(setCurrentGamePlayers(data?.players || []));
      }
    } catch (err) {
      throw err;
    };
  }
);

export const editRecord = createAsyncThunk(
  'editRecord',
  async (params: { auth: string, record: Record }, { dispatch, getState }) => {
    const game = selectCurrentGameInfo(getState() as RootState);
    if (!game) return;

    try {
      const { data, error } = await api.put<GameRecords>('/record', params.auth, params.record);

      if (error) throw error;
      if (data) {
        //dispatch(setCurrentGame(data?.currentGame || null));
        dispatch(setCurrentGameRecords(data?.records || []));
        dispatch(setCurrentGameSessions(data?.sessions || []));
        dispatch(setCurrentGamePlayers(data?.players || []));
      }
    } catch (err) {
      throw err;
    };
  }
);

export const deleteRecord = createAsyncThunk(
  'deleteRecord',
  async (params: { auth: string, recordID: number }, { getState }) => {
    const game = selectCurrentGameInfo(getState() as RootState);
    if (!game) return;

    try {
      const { error } = await api.delete<GameRecords>(`/record/${params.recordID}`, params.auth);
      if (error) throw error;
    } catch (err) {
      throw err;
    };
  }
);

export const loadCurrentGameQuests = createAsyncThunk(
  'loadCurrentGameQuests',
  async (params: { auth: string }, appThunk) => {
    appThunk.dispatch(addLoading(loadCurrentGameQuests.typePrefix));
    try {
      const response = await api.get<GameQuests>('/quests', params.auth);
      appThunk.dispatch(setCurrentGameQuests(response.data?.quests || []));
    } catch (e) {

    } finally {
      appThunk.dispatch(removeLoading(loadCurrentGameQuests.typePrefix));
    }
  }
);

export const loadCurrentGameSuggestions = createAsyncThunk(
  'loadCurrentGameSuggestions',
  async (params: { auth: string }, appThunk) => {
    const response = await api.get<SuggestionData>('/suggestions', params.auth);
    appThunk.dispatch(setCurrentGameSuggestions(response.data || { entities: [] } as SuggestionData));
  }
);

const currentGameSlice = createSlice({
  name: 'currentGame',
  initialState,
  reducers: {
    setCurrentGame: (state, action: PayloadAction<GameFullInfo | null>) => {
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
    setCurrentGameQuests: (state, action: PayloadAction<QuestInfo[]>) => {
      state.quests = action.payload;
    },
    setCurrentGameSuggestions: (state, action: PayloadAction<SuggestionData>) => {
      state.suggestions = action.payload;
    },
  },
});

export const selectGame = (state: RootState): GameInfo | null => state.currentGame.game;

export const {
  setCurrentGame,
  setCurrentGameRecords,
  setCurrentGameSessions,
  setCurrentGamePlayers,
  setCurrentGameQuests,
  setCurrentGameSuggestions
} = currentGameSlice.actions;

export const selectCurrentGame = (state: RootState) => state.currentGame;
export const selectCurrentGameInfo = (state: RootState) => state.currentGame.game;
export const selectCurrentGameGM = (state: RootState) => state.currentGame.players.find((el) => el.id === state.currentGame.game?.gmID);
export const selectCurrentGamePlayers = (state: RootState) => state.currentGame.players || [];
export const selectCurrentGameRecords = (state: RootState) => state.currentGame.records || [];
export const selectCurrentGameSessions = (state: RootState) => state.currentGame.sessions || [];
export const selectCurrentGameQuests = (state: RootState) => state.currentGame.quests || [];
export const selectCurrentGameSuggestions = (state: RootState) => state.currentGame.suggestions;

export default currentGameSlice;