import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { GameInfo, LoginInfo, PlayerFullInfo, PlayerGamesInfo } from '../types/request';
import { type RootState } from '../store';
import { api } from '../utils/api';
import { loadCurrentGameRecords, setCurrentGame } from './CurrentGameSlice';

type UITheme = 'blue' | 'mint' | 'olive' | 'tomato';

export type PlayerData = {
  loading: boolean;
  info: PlayerFullInfo | null;
  token: string;
  games: GameInfo[];
  invites: GameInfo[];
  theme: UITheme;
};

const initialState: PlayerData = {
  loading: true,
  info: null,
  token: window.localStorage.getItem('auth') || '',
  games: [],
  invites: [],
  theme: 'blue'
};

export const loginToken = createAsyncThunk(
  'loginToken',
  async (params: { token: string }, appThunk) => {
    try {
      const { data, error } = await api.get<LoginInfo>(`/login`, params.token);

      if (error) throw error;
      if (data) {
        appThunk.dispatch(setPlayerInfo(data.player));
        appThunk.dispatch(setCurrentGame(data.currentGame));

        appThunk.dispatch(setAuthorizationToken(data.authorization));
        window.localStorage.setItem('auth', data.authorization);

        if (data.currentGame) appThunk.dispatch(loadCurrentGameRecords({ auth: data.authorization }));
      }
    } catch (e: any) {
      throw e;
    } finally {
      appThunk.dispatch(setPlayerInfoLoading(false));
    }
  }
);

export const loginWeb = createAsyncThunk(
  'loginWeb',
  async (params: { username: string, password: string }, appThunk) => {
    try {
      const { data, error } = await api.post<LoginInfo>(`/login`, "", { username: params.username, loginData: params.password, loginSource: "Web" });

      if (error) throw error;
      if (data) {
        appThunk.dispatch(setPlayerInfo(data.player));
        appThunk.dispatch(setCurrentGame(data.currentGame));

        appThunk.dispatch(setAuthorizationToken(data.authorization));
        window.localStorage.setItem('auth', data.authorization);

        if (data.currentGame) appThunk.dispatch(loadCurrentGameRecords({ auth: data.authorization }));
      }
    } catch (e: any) {
      throw e;
    } finally {
      appThunk.dispatch(setPlayerInfoLoading(false));
    }
  }
);

export const loginTG = createAsyncThunk(
  'loginTG',
  async (params: { rawData: string }, appThunk) => {
    try {
      const { data, error } = await api.post<LoginInfo>(`/login/tg`, "", { initDataRaw: params.rawData });
      if (error) throw error;
      if (data) {
        appThunk.dispatch(setPlayerInfo(data.player));
        appThunk.dispatch(setCurrentGame(data.currentGame));

        appThunk.dispatch(setAuthorizationToken(data.authorization));
        window.localStorage.setItem('auth', data.authorization);

        appThunk.dispatch(loadCurrentGameRecords({ auth: data.authorization }));
      }
    } catch (e: any) {
      throw e;
    } finally {
      appThunk.dispatch(setPlayerInfoLoading(false));
    }
  }
);

export const signup = createAsyncThunk(
  'signup',
  async (params: { username: string, password: string, email: string }, appThunk) => {
    try {
      const { data, error } = await api.post<LoginInfo>("/signup", "", params);
      if (error) throw error;
      if (data) {
        appThunk.dispatch(setPlayerInfo(data.player));
        appThunk.dispatch(setCurrentGame(data.currentGame));

        appThunk.dispatch(setAuthorizationToken(data.authorization));
        window.localStorage.setItem('auth', data.authorization);

        if (data.currentGame) appThunk.dispatch(loadCurrentGameRecords({ auth: data.authorization }));
      }
    } catch (e: any) {
      throw e;
    } finally {
      appThunk.dispatch(setPlayerInfoLoading(false));
    }
  }
);

export const setPlayerLoading = createAsyncThunk(
  'setPlayerInfoLoading',
  async (loading: boolean, appThunk) => {
    appThunk.dispatch(setPlayerInfoLoading(loading));
  }
);

export const loadPlayerGames = createAsyncThunk(
  'loadPlayerGames',
  async (params: { auth: string }, appThunk) => {
    try {
      const { data, error } = await api.get<PlayerGamesInfo>("/player/settings", params.auth);
      if (error) throw error;
      appThunk.dispatch(setPlayerGames(data?.playerGames || []));
      appThunk.dispatch(setPlayerInvites(data?.playerInvites || []));
      appThunk.dispatch(setCurrentGame(data?.currentGame || null));
    } catch (e: any) {
      throw e;
    } finally {

    }
  }
);

const PlayerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayerInfo: (state, action: PayloadAction<PlayerFullInfo | null>) => {
      state.info = action.payload;
    },
    setAuthorizationToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setPlayerInfoLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPlayerGames: (state, action: PayloadAction<GameInfo[]>) => {
      state.games = action.payload;
    },
    setPlayerInvites: (state, action: PayloadAction<GameInfo[]>) => {
      state.invites = action.payload;
    },
    resetPlayer: () => initialState
  },
});

export const {
  setPlayerInfo,
  setAuthorizationToken,
  setPlayerInfoLoading,
  setPlayerGames,
  setPlayerInvites,
  resetPlayer
} = PlayerSlice.actions;

export const selectPlayer = (state: RootState): PlayerData | null => state.player;
export const selectPlayerInfoLoading = (state: RootState) => state.player.loading;
export const selectPlayerInfo = (state: RootState): PlayerFullInfo | null => state.player.info;
export const selectPlayerGames = (state: RootState): GameInfo[] => state.player.games;
export const selectPlayerInvites = (state: RootState): GameInfo[] => state.player.invites;
export const selectAuthorization = (state: RootState): string => state.player.token;
export const selectPlayerTheme = (state: RootState): UITheme => state.player.theme;

export default PlayerSlice;