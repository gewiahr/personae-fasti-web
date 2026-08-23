import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { GameRecords } from '@/types/request';
import type { QuestBrief } from '@/types/quest';
import type { GameBrief, GameFull, GameSettings, Session, SessionEdit } from '@/types/game';
import type { EditRecord, NewRecord, Record } from '@/types/record';
import type { PlayerBrief } from '@/types/player';
import { type RootState } from '@/store';
import { api } from '@/utils/api';
import type { SuggestionData } from '@/types/suggestion';
import { addLoading, removeLoading } from './LoadingSlice';
import dayjs from 'dayjs';

export type CurrentGameData = {
  game: GameBrief | null;
  settings: GameSettings | null;
  loading: boolean;
  records: Record[];
  sessions: Session[];
  players: PlayerBrief[];
  quests: QuestBrief[];
  suggestions: SuggestionData;
};

const initialState: CurrentGameData = {
  game: null,
  settings: null,
  loading: true,
  records: [],
  sessions: [],
  players: [],
  quests: [],
  suggestions: { entities: [] }
};

export const loadCurrentGame = createAsyncThunk(
  'loadCurrentGame',
  async (params: { auth: string }, appThunk) => {
    try {
      const { data, error } = await api.get<GameFull>("/player/currentGame", params.auth);
      if (error) throw error
      appThunk.dispatch(setCurrentGame(data || null));
      appThunk.dispatch(setCurrentGameSettings(data?.settings || null));
      appThunk.dispatch(setCurrentGameSessions(data?.sessions || []));
      appThunk.dispatch(setCurrentGamePlayers(data?.players || []));

      appThunk.dispatch(loadCurrentGameQuests({ auth: params.auth }));
      appThunk.dispatch(loadCurrentGameSuggestions({ auth: params.auth }));
    } catch (e) {
      throw e
    } finally {
      appThunk.dispatch(setCurrentGameLoading(false));
    }
  }
);

export const changeCurrentGame = createAsyncThunk(
  'changeCurrentGame',
  async (params: { auth: string, gameExt: string }, appThunk) => {
    try {
      const { data, error } = await api.put<GameFull>(`/player/currentGame/${params.gameExt}`, params.auth, null);
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
      const { error } = await api.post<{sessions: Session[]}>("/game/session/new", params.auth, null);
      if (error) throw error
    } catch (e) {
      throw e
    }
  }
);

export const removeLastSession = createAsyncThunk(
  'removeLastSession',
  async (params: { auth: string }, _) => {
    try {
      const { error } = await api.delete<{sessions: Session[]}>("/game/session/remove", params.auth);
      if (error) throw error
    } catch (e) {
      throw e
    }
  }
);

export const editSession = createAsyncThunk(
  'editSession',
  async (params: { auth: string, sessionUpdate: SessionEdit }, _) => {
    try {
      const { error } = await api.patch<{sessions: Session[]}>("/game/session", params.auth, { name: params.sessionUpdate.name, number: params.sessionUpdate.number, startTime: dayjs(params.sessionUpdate.startTime).utc().toISOString() } as SessionEdit);
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
      const response = await api.get<{records: Record[]}>('/records', params.auth);
      //appThunk.dispatch(setCurrentGame(response.data?.currentGame || null));
      appThunk.dispatch(setCurrentGameRecords(response.data?.records || []));
      // appThunk.dispatch(setCurrentGameSessions(response.data?.sessions === null ? [] : response.data?.sessions || []));
      // appThunk.dispatch(setCurrentGamePlayers(response.data?.players || []));
    } catch (e) {

    } finally {
      appThunk.dispatch(removeLoading(loadCurrentGameRecords.typePrefix));
    }
  }
);

export const postNewRecord = createAsyncThunk(
  'postNewRecord',
  async (params: { auth: string, content: string, hidden: boolean, questExt: string }, { dispatch, getState }) => {
    const game = selectCurrentGameInfo(getState() as RootState);
    if (!game) return;

    const newRecord: NewRecord = {
      text: params.content,
      questExt: params.questExt,
      hidden: params.hidden
    };

    try {
      const { data, error } = await api.post<GameRecords>('/record', params.auth, newRecord);

      if (error) throw error;
      if (data) {
        dispatch(loadCurrentGameRecords({ auth: params.auth }));
        dispatch(loadCurrentGameQuests({ auth: params.auth }));
        dispatch(loadCurrentGameSuggestions({ auth: params.auth }));
        //dispatch(setCurrentGame(data?.currentGame || null));
        // dispatch(setCurrentGameRecords(data?.records || []));
        // dispatch(setCurrentGameSessions(data?.sessions || []));
        // dispatch(setCurrentGamePlayers(data?.players || []));
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
      const { data, error } = await api.put<GameRecords>('/record', params.auth, {
        id: params.record.id,
        text: params.record.text,
        questExt: params.record.questExt,
        hidden: params.record.hidden
      } as EditRecord);

      if (error) throw error;
      if (data) {
        dispatch(loadCurrentGameRecords({ auth: params.auth }));
        dispatch(loadCurrentGameQuests({ auth: params.auth }));
        dispatch(loadCurrentGameSuggestions({ auth: params.auth }));

        //dispatch(setCurrentGame(data?.currentGame || null));
        // dispatch(setCurrentGameRecords(data?.records || []));
        // dispatch(setCurrentGameSessions(data?.sessions || []));
        // dispatch(setCurrentGamePlayers(data?.players || []));
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
      const response = await api.get<{quests: QuestBrief[]}>('/quests', params.auth);
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

export const updateGameSettings = createAsyncThunk(
  'updateGameSettings',
  async (params: { auth: string, gameExt: string, settings: GameSettings }) => {
    try {
      const { error } = await api.put<GameFull>("/game/settings", params.auth, { gameExt: params.gameExt, allowAllEditRecords: params.settings.allowAllEditRecords });
      if (error) throw error;
    } catch (e) {
      throw e;
    }
  }
)

export const revokeInvite = createAsyncThunk(
  'revokeInvite',
  async (params: { auth: string, username: string }, _) => {
    try {
      const { error } = await api.delete(`/game/invite/${params.username}`, params.auth);
      if (error) throw error
    } catch (e) {
      throw e
    }
  }
);

// export const resetCurrentGame = createAsyncThunk(
//   'resetCurrentGame',
//   async (_, appThunk) => {
//     const state = appThunk.getState() as RootState;
//     state.currentGame = initialState;
//   }
// )

const currentGameSlice = createSlice({
  name: 'currentGame',
  initialState,
  reducers: {
    setCurrentGame: (state, action: PayloadAction<GameBrief | null>) => {
      state.game = action.payload;
    },
    setCurrentGameRecords: (state, action: PayloadAction<Record[]>) => {
      state.records = action.payload;
    },
    setCurrentGameSessions: (state, action: PayloadAction<Session[]>) => {
      state.sessions = action.payload;
    },
    setCurrentGameSettings: (state, action: PayloadAction<GameSettings | null>) => {
      state.settings = action.payload;
    },
    setCurrentGamePlayers: (state, action: PayloadAction<PlayerBrief[]>) => {
      state.players = action.payload;
    },
    setCurrentGameQuests: (state, action: PayloadAction<QuestBrief[]>) => {
      state.quests = action.payload;
    },
    setCurrentGameSuggestions: (state, action: PayloadAction<SuggestionData>) => {
      state.suggestions = action.payload;
    },
    setCurrentGameLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    resetCurrentGame: () => initialState
  },
});

export const selectGame = (state: RootState): GameBrief | null => state.currentGame.game;

export const {
  setCurrentGame,
  setCurrentGameRecords,
  setCurrentGameSessions,
  setCurrentGameSettings,
  setCurrentGamePlayers,
  setCurrentGameQuests,
  setCurrentGameSuggestions,
  setCurrentGameLoading,
  resetCurrentGame
} = currentGameSlice.actions;

export const selectCurrentGame = (state: RootState) => state.currentGame;
export const selectCurrentGameLoading = (state: RootState) => state.currentGame.loading;
export const selectCurrentGameInfo = (state: RootState) => state.currentGame.game;
export const selectCurrentGameGM = (state: RootState) => state.currentGame.players.find((el) => el.ext === state.currentGame.game?.gmExt || "");
export const selectCurrentGamePlayers = (state: RootState) => state.currentGame.players || [];
export const selectCurrentGameRecords = (state: RootState) => state.currentGame.records || [];
export const selectCurrentGameSessions = (state: RootState) => state.currentGame.sessions || [];
export const selectCurrentGameQuests = (state: RootState) => state.currentGame.quests || [];
export const selectCurrentGameSuggestions = (state: RootState) => state.currentGame.suggestions;

export default currentGameSlice;
