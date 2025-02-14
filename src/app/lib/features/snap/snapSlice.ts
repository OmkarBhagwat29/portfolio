import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SnapType } from "./SnapTypes";

export interface SnapState {
  active: boolean;
  point: boolean;
  end: boolean;
  mid: boolean;
  near: boolean;
  smart: boolean;
  ortho: boolean;
}

const initialState: SnapState = {
  active: false,
  point: false,
  end: false,
  mid: false,
  near: false,
  smart: false,
  ortho: false,
};

const snapSlice = createSlice({
  name: "snap",
  initialState,
  reducers: {
    setSnap: (state, action: PayloadAction<SnapType>) => {
      switch (action.payload) {
        case "active":
          state.active = !state.active;
          break;
        case "end":
          state.end = !state.end;
          break;
        case "point":
          state.point = !state.point;
          break;
        case "mid":
          state.mid = !state.mid;
          break;
        case "near":
          state.near = !state.near;
          break;
        case "smart":
          state.smart = !state.smart;
          break;
        case "ortho":
          state.ortho = !state.ortho;
          break;
        default:
          console.warn(`Unhandled SnapType: ${action.payload}`);
      }
    },
  },
});

export const { setSnap } = snapSlice.actions;

export default snapSlice.reducer;
