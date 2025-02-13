import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { DrawStatus, DrawType } from "./DrawType";

interface DrawState {
  command: DrawType;
  status: DrawStatus;
  geometryIds: string[];
}

const initialState: DrawState = {
  command: undefined,
  status: undefined,
  geometryIds: [],
};

const drawSlice = createSlice({
  name: "draw",
  initialState,
  reducers: {
    setDraw: (state, action: PayloadAction<DrawState>) => {
      const { command, status } = action.payload;

      state.command = command;
      state.status = status;
    },

    setDrawType: (state, action: PayloadAction<DrawType>) => {
      console.log(action);

      state.command = action.payload;
    },
    setDrawStatus: (state, action: PayloadAction<DrawStatus>) => {
      console.log(action);

      state.status = action.payload;
    },

    addGeometryIds: (state, action: PayloadAction<string[]>) => {
      state.geometryIds.push(...action.payload);

      state.command = undefined;
      state.status = undefined;
    },
  },
});

export const { setDraw, setDrawType, setDrawStatus, addGeometryIds } =
  drawSlice.actions;

export default drawSlice.reducer;
