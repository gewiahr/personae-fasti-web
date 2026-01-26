import { combineSlices, configureStore, createAsyncThunk } from "@reduxjs/toolkit";
import CurrentGameSlice from "./reducers/CurrentGameSlice";
import { useDispatch, useSelector } from "react-redux";

const rootReducer = combineSlices(
  CurrentGameSlice
)

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({ serializableCheck: false }),
})

export default store;

// export type AppStore = typeof store;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const createAppAsyncThunk = createAsyncThunk.withTypes<{ state: RootState, dispatch: AppDispatch }>()

