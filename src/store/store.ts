import { configureStore } from "@reduxjs/toolkit";
import userSignupSlice from "./features/signup/userSignupSlice";
import userLoginSlice from "./features/login/userLoginSlice";
import currentCommunity from "./features/communitySection/currentCommunity";
import updateState from "./features/update/updateSlice";
import pageDetails from "./features/pageDetails/pageDetails";
import groupState from "./features/groupState/groupState";
import groupEdit from "./features/groupState/editGroupSettings";
import pageFilterSlice from "./features/pageFilter/pageFillterSlice";
export const store = () => {
  return configureStore({
    reducer: {
      signup: userSignupSlice,
      login: userLoginSlice,
      currentCommunity: currentCommunity,
      updateState: updateState,
      pageState: pageDetails,
      groupState: groupState,
      groupEdit: groupEdit,
      pageFilter: pageFilterSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof store>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
