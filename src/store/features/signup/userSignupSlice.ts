// features/userSignup/userSignupSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  username: string;
}

interface UserSignupState {
  message: string;
  user: User | null;
  accessToken: string;
}

const initialState: UserSignupState = {
  message: '',
  user: null,
  accessToken: '',
};

const userSignupSlice = createSlice({
  name: 'userSignup',
  initialState,
  reducers: {
    setUserSignupData: (state, action: PayloadAction<UserSignupState>) => {
      state.message = action.payload.message;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    clearUserSignupData: (state) => {
      state.message = '';
      state.user = null;
      state.accessToken = '';
    },
  },
});

export const { setUserSignupData, clearUserSignupData } = userSignupSlice.actions;

export default userSignupSlice.reducer;
