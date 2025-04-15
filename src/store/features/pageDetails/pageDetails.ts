// features/userSignup/userSignupSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Page {
  id: string;
  name: string;
  description: string;
  slug: string;
  websiteUrl: string;
  why: string;
  what: string;
  how: string;
  avatar: string | null;
  cover: string | null;
  category: string;
  createdAt: string;
  followersCount: number;
  isFollowing: boolean;
  topic: {
    id: number;
    name: string;
  };
  isAdmin: boolean;
}

const initialState: Page = {
  id: "",
  name: "",
  description: "",
  slug: "",
  websiteUrl: "",
  why: "",
  what: "",
  how: "",
  avatar: "",
  cover: "",
  category: "",
  createdAt: "",
  followersCount: 0,
  isFollowing: false,
  topic: {
    id: 0,
    name: "",
  },
  isAdmin: false,
};
const pageDetails = createSlice({
  name: "currentPage",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<Page>) => {
      return action.payload;
    },
  },
});

export const { setCurrentPage } = pageDetails.actions;

export default pageDetails.reducer;
