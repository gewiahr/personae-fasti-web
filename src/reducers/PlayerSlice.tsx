import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { GameInfo, LoginInfo, PlayerFullInfo, PlayerGamesInfo } from '../types/request';
import { type RootState } from '../store';
import { api } from '../utils/api';
import { loadCurrentGameRecords, setCurrentGame } from './CurrentGameSlice';

type UITheme = 'blue' | 'green' | 'olive' | 'tomato';

export type PlayerData = {
  loading: boolean;
  info: PlayerFullInfo | null;
  token: string;
  games: GameInfo[];
  theme: UITheme;
};

const initialState : PlayerData = {
  loading: true,
  info: null,
  token: window.localStorage.getItem('auth') || '',
  games: [],
  theme: 'tomato'
};

export const loginTG = createAsyncThunk(
  'loginTG',
  async (params: { rawData: string }, appThunk) => {    
    try {
      const response = await api.post<LoginInfo>(`/login/tg`, "", { initDataRaw: params.rawData });
      if (!response.data) throw response.error;
      appThunk.dispatch(setPlayerInfo(response.data.player));
      appThunk.dispatch(setAuthorizationToken(response.data.authorization));
      appThunk.dispatch(setCurrentGame(response.data.currentGame));

      appThunk.dispatch(loadCurrentGameRecords({ auth: response.data.authorization }));
    } catch (e: any) {
      throw e;
    } finally {
      appThunk.dispatch(setPlayerInfoLoading(false));
    }

    // const response = await api.post<LoginInfo>(`/login/tg`, "", { initDataRaw: params.rawData });
    // if (response.data) {
    //   appThunk.dispatch(setPlayerInfo(response.data.player));
    //   appThunk.dispatch(setAuthorizationToken(response.data.authorization));

    //   appThunk.dispatch(getCurrentGameRecords({ auth: response.data.authorization }));
    // } else if (response.error) {
    //   throw response.error;
    // }

    // appThunk.dispatch(setPlayerInfoLoading(false));
  }
);

export const setPlayerLoading = createAsyncThunk(
  'setPlayerInfoLoading',
  async (loading: boolean, appThunk) => {
    appThunk.dispatch(setPlayerInfoLoading(loading));
  }
);

// export const getPlayerInfo = createAsyncThunk(
//   'getPlayerInfo',
//   async (params: { rawData: string }, appThunk) => {
//     const response = await api.post<LoginInfo>(`/login/tg`, "", { initDataRaw: params.rawData });

//     if (response.data) {
//       appThunk.dispatch(setPlayerInfo(response.data.player));
//       appThunk.dispatch(setAuthorizationToken(response.data.authorization));
//     }
//   }
// );

export const loadPlayerGames = createAsyncThunk(
  'loadPlayerGames',
  async (params: { auth: string }, appThunk) => {    
    try {
      const { data, error } = await api.get<PlayerGamesInfo>("/player/settings", params.auth);
      if (error) throw error;
      appThunk.dispatch(setPlayerGames(data?.playerGames || []));
      appThunk.dispatch(setCurrentGame(data?.currentGame || null));
    } catch (e: any) {
      throw e;
    } finally {

    }
  }
);

// Create slice
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
    }
  },
});

// Export actions
export const {
  setPlayerInfo,
  setAuthorizationToken,
  setPlayerInfoLoading,
  setPlayerGames
} = PlayerSlice.actions;

// Export selectors
export const selectPlayer = (state: RootState): PlayerData | null  => state.player;
export const selectPlayerInfoLoading = (state: RootState) => state.player.loading;
export const selectPlayerInfo = (state: RootState): PlayerFullInfo | null => state.player.info;
export const selectPlayerGames = (state: RootState): GameInfo[] => state.player.games;
export const selectAuthorization = (state: RootState): string => state.player.token;
export const selectPlayerTheme = (state: RootState): UITheme => state.player.theme;

// Export reducer
export default PlayerSlice;