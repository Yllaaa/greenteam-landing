/* eslint-disable @typescript-eslint/no-explicit-any */
// features/userSignup/userSignupSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface currentCommunityState {
  currentCommunity: string | any;// any type for now
}

const initialState: currentCommunityState = {
  currentCommunity: "pages",
};

const currentCommunity = createSlice({
  name: "currentCommunity",
  initialState,
  reducers: {
    setCurrentCommunity: (
      state,
      action: PayloadAction<currentCommunityState>
    ) => {
      state.currentCommunity = action.payload;
    },
  },
});

export const { setCurrentCommunity } = currentCommunity.actions;

export default currentCommunity.reducer;
