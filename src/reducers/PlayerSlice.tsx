import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PlayerGamesInfo } from '@/types/request';
import type { GameBrief } from '@/types/game'; 
import type { LoginInfo, PlayerFull, PlayerSettings } from '@/types/player';
import { type RootState } from '@/store';
import { api } from '@/utils/api';
import { loadCurrentGame, setCurrentGame } from './CurrentGameSlice';

type UITheme = {
  color: 'blue' | 'mint' | 'olive' | 'tomato' | 'purple';
  pattern: 'none' | 'space' | 'fantasy';
};

export type PlayerData = {
  ext: string;
  username: string;
  settings: PlayerSettings | null;
  loading: boolean;
  token: string;
  games: GameBrief[];
  invites: GameBrief[];
  theme: UITheme;
};

const initialState: PlayerData = {
  ext: '',
  username: '',
  settings: null,
  loading: true,
  token: window.localStorage.getItem('auth') || '',
  games: [],
  invites: [],
  theme: {
    color: 'blue',
    pattern: 'none',
  }
};

export const loginToken = createAsyncThunk(
  'loginToken',
  async (params: { token: string }, appThunk) => {
    try {
      const { data, error } = await api.get<LoginInfo>(`/login`, params.token);
      if (error) throw error;
      if (data) {
        appThunk.dispatch(setPlayerInfo(data.player));
        appThunk.dispatch(setAuthorizationToken(data.authorization));
        window.localStorage.setItem('auth', data.authorization);

        if (data.player.gameExt) appThunk.dispatch(loadCurrentGame({ auth: data.authorization }));
      }
    } catch (e: any) {
      throw e;
    } finally {
      appThunk.dispatch(setPlayerLoading(false));
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
        appThunk.dispatch(setAuthorizationToken(data.authorization));
        window.localStorage.setItem('auth', data.authorization);

        if (data.player.gameExt) appThunk.dispatch(loadCurrentGame({ auth: data.authorization }));
      }
    } catch (e: any) {
      throw e;
    } finally {
      appThunk.dispatch(setPlayerLoading(false));
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
        appThunk.dispatch(setAuthorizationToken(data.authorization));
        window.localStorage.setItem('auth', data.authorization);

        if (data.player.gameExt) appThunk.dispatch(loadCurrentGame({ auth: data.authorization }));
      }
    } catch (e: any) {
      throw e;
    } finally {
      appThunk.dispatch(setPlayerLoading(false));
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
        appThunk.dispatch(setAuthorizationToken(data.authorization));
        window.localStorage.setItem('auth', data.authorization);

        if (data.player) appThunk.dispatch(loadCurrentGame({ auth: data.authorization }));
      }
    } catch (e: any) {
      throw e;
    } finally {
      appThunk.dispatch(setPlayerLoading(false));
    }
  }
);

// export const setPlayerLoading = createAsyncThunk(
//   'setPlayerLoading',
//   async (loading: boolean, appThunk) => {
//     appThunk.dispatch(setPlayerLoading(loading));
//   }
// );

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
    setPlayerInfo: (state, action: PayloadAction<PlayerFull | null>) => {
      if (action.payload) {
        state.ext = action.payload.ext;
        state.username = action.payload.username;
        state.settings = action.payload.settings;
      } else {
        state.ext = '';
        state.username = '';
        state.settings = null;
      }
    },
    setAuthorizationToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setPlayerLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPlayerGames: (state, action: PayloadAction<GameBrief[]>) => {
      state.games = action.payload;
    },
    setPlayerInvites: (state, action: PayloadAction<GameBrief[]>) => {
      state.invites = action.payload;
    },
    resetPlayer: () => initialState
  },
});

export const {
  setPlayerInfo,
  setAuthorizationToken,
  setPlayerLoading,
  setPlayerGames,
  setPlayerInvites,
  resetPlayer
} = PlayerSlice.actions;

export const selectPlayer = (state: RootState): PlayerData | null => state.player;
export const selectPlayerLoading = (state: RootState) => state.player.loading;
export const selectPlayerExt = (state: RootState): string => state.player.ext;
export const selectPlayerUsername = (state: RootState): string => state.player.username;
export const selectPlayerSettings = (state: RootState): PlayerSettings | null => state.player.settings;
export const selectPlayerGames = (state: RootState): GameBrief[] => state.player.games;
export const selectPlayerInvites = (state: RootState): GameBrief[] => state.player.invites;
export const selectAuthorization = (state: RootState): string => state.player.token;
export const selectPlayerTheme = (state: RootState): UITheme => state.player.theme;

export default PlayerSlice;