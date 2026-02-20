import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LoginInfo, PlayerFullInfo } from '../types/request';
import { type RootState } from '../store';
import { api } from '../utils/api';
import { getCurrentGameRecords } from './CurrentGameSlice';

export type PlayerData = {
  info: PlayerFullInfo | null;
  token: string;
};

const initialState : PlayerData = {
  info: null,
  token: ""
};

export const loginTG = createAsyncThunk(
  'getPlayerInfo',
  async (params: { rawData: string }, appThunk) => {
    const response = await api.post<LoginInfo>(`/login/tg`, "", { initDataRaw: params.rawData });

    if (response.data) {
      appThunk.dispatch(setPlayerInfo(response.data.player));
      appThunk.dispatch(setAuthorizationToken(response.data.authorization));

      appThunk.dispatch(getCurrentGameRecords({ auth: response.data.authorization }));
    } else if (response.error) {
      throw response.error;
    }
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

// Create slice
const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayerInfo: (state, action: PayloadAction<PlayerFullInfo | null>) => {
      state.info = action.payload;
    },
    setAuthorizationToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
});

export const selectPlayer = (state: RootState): PlayerData | null  => state.player;

// Export actions
export const {
  setPlayerInfo,
  setAuthorizationToken
} = playerSlice.actions;

// Export selectors
export const selectPlayerInfo = (state: RootState) => state.player.info;
export const selectAuthorization = (state: RootState) => state.player.token;

// Export reducer
export default playerSlice;