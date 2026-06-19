import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Dictionary } from "../types/utils.ts";
import type { RootState } from "../store.ts";

export enum LoadingStatus {
  idle,
  loading,
  success,
  error,
}

type LoadingData = {
  loadings: Dictionary<LoadingStatus>
  list: string[]
}

const initialState: LoadingData = {
  loadings: {},
  list: []
}

const LoadingsSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    changeRequestStatus: (state: LoadingData, action: PayloadAction<{
      name: string,
      status: LoadingStatus,
      id?: string
    }>) => {
      const { name, status, id } = action.payload

      const key = !!id ? name + id : name;
      state.loadings[key] = status;
    },
    addLoading: (state, action: PayloadAction<string>) => {
      state.list.push(action.payload)
    },
    removeLoading: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(el => el !== action.payload)
    },
  },
})

export const selectIsLoading = (name?: string) => (state: RootState) => !name ? false : state.loading.loadings[name] === LoadingStatus.loading
export const selectIsLoadingStatus = (name?: string) => (state: RootState) => !name ? LoadingStatus.idle : state.loading.loadings[name] ? LoadingStatus.loading : LoadingStatus.idle
export const selectIsLoadingWithId = (name: string) => (id?: string) => (state: RootState) => state.loading.loadings[name + id] === LoadingStatus.loading

export const selectIsLoadingNew = (name?: string) => (state: RootState) => name ? state.loading.list.includes(name) : false

export const selectLoadingList = (state: RootState) => state.loading.list

export const {
  changeRequestStatus,
  addLoading,
  removeLoading
} = LoadingsSlice.actions

export default LoadingsSlice;