// features/userSignup/userSignupSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  edit: false,
};
const groupEdit = createSlice({
  name: "currentGroup",
  initialState,
  reducers: {
    setGroupEdit: (state, action) => {
      state.edit = action.payload;
    },
  },
});

export const { setGroupEdit } = groupEdit.actions;

export default groupEdit.reducer;
