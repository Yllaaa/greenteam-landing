// features/userSignup/userSignupSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Topic {
  topicId: number;
  topicName: string;
}

// Member interface
interface Member {
  id: string;
  fullName: string;
  avatar: string | null;
}
interface Group {
  id: string;
  name: string;
  description: string;
  banner: string | null;
  topic: Topic;
  ownerId: string;
  ownerName: string;
  memberCount: number;
  isUserMember: boolean;
  recentMembers: Member[];
  isAdmin: boolean;
}

const initialState: Group = {
  id: "",
  name: "",
  description: "",
  banner: "",
  topic: {
    topicId: 0,
    topicName: "",
  },
  ownerId: "",
  ownerName: "",
  memberCount: 0,
  isUserMember: false,
  recentMembers: [],
  isAdmin: false,
};
const groupState = createSlice({
  name: "currentGroup",
  initialState,
  reducers: {
    setCurrentGroup: (state, action: PayloadAction<Group>) => {
      return action.payload;
    },
  },
});

export const { setCurrentGroup } = groupState.actions;

export default groupState.reducer;
