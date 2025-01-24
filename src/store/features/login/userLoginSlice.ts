// features/userSignup/userSignupSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  avatar: string;
  bio: string;
  email: string;
  fullname: string;
  username: string;
}

interface UserLoginState {
  loggedIn: boolean;
  user: User | null;
  accessToken: string;
}

const initialState: UserLoginState = {
  loggedIn: false,
  user: null,
  accessToken: "",
};

const userLoginSlice = createSlice({
  name: "userLogin",
  initialState,
  reducers: {
    setUserLoginData: (state, action: PayloadAction<UserLoginState>) => {
      state.loggedIn = action.payload.accessToken ? true : false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    clearUserLoginData: (state) => {
      state.loggedIn = false;
      state.user = null;
      state.accessToken = "";
    },
  },
});

export const {
  setUserLoginData,
  clearUserLoginData,
} = userLoginSlice.actions;

export default userLoginSlice.reducer;
