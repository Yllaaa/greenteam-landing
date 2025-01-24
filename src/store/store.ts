import { configureStore } from "@reduxjs/toolkit";
import userSignupSlice from "./features/signup/userSignupSlice";
import userLoginSlice from "./features/login/userLoginSlice";

export const store = () => {
  return configureStore({
    reducer: {
      signup: userSignupSlice,
      login: userLoginSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof store>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
