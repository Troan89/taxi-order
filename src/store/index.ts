import {AnyAction, combineReducers, configureStore, ThunkDispatch} from '@reduxjs/toolkit';
import {orderReducer} from './OrderSlice';
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

const rootReducer =combineReducers({
    order: orderReducer
})

export type AppRootState = ReturnType<typeof rootReducer>

export const store = configureStore({
    reducer: rootReducer
})

type AppThunkDispatch = ThunkDispatch<AppRootState, any, AnyAction>
export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppRootState> = useSelector

export default store;
