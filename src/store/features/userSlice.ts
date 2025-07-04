// "use client";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the User state type
interface UserState {
  id: string | null;
  name: string;
  email: string;
  isLoggedIn: boolean;
}

// Define the initial state
const initialState: UserState = {
  id: null,
  name: '',
  email: '',
  isLoggedIn: false,
};

// Create the slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ id: string; name: string; email: string }>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.id = null;
      state.name = '';
      state.email = '';
      state.isLoggedIn = false;
    },
    updateUser: (state, action: PayloadAction<{ name?: string; email?: string }>) => {
      if (action.payload.name) {
        state.name = action.payload.name;
      }
      if (action.payload.email) {
        state.email = action.payload.email;
      }
    },
  },
});

// Export actions and reducer
export const { login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
