/** @format */

// store/features/forum/forumSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface ForumState {
	selectedSection: number | 'all';
}

const initialState: ForumState = {
	selectedSection: 'all',
};

const forumSlice = createSlice({
	name: 'forum',
	initialState,
	reducers: {
		setForumSection: (state, action: PayloadAction<number | 'all'>) => {
			state.selectedSection = action.payload;
		},
		resetForumState: () => initialState,
	},
});

export const {setForumSection, resetForumState} = forumSlice.actions;
export default forumSlice.reducer;
