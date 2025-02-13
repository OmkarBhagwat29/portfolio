import { configureStore } from "@reduxjs/toolkit";
import drawReducer from "./features/draw/drawSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      draw: drawReducer,
    },
  });
};

//infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

//infer the 'RootState' & 'AppDispatch' types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
