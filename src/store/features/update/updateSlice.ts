import { createSlice } from "@reduxjs/toolkit";

interface updateState {
  updated: number;
}

const initialState: updateState = {
  updated: 0,
};

const updateState = createSlice({
  name: "updateState",
  initialState,
  reducers: {
    setUpdateState: (state) => {
      state.updated = state.updated + 1;
    },
  },
});

export const { setUpdateState } = updateState.actions;

export default updateState.reducer;
