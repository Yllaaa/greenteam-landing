/** @format */

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface openBar {
	isOpen: boolean;
}

const initialState: openBar = {
	isOpen: false,
};

const openBarSlice = createSlice({
	name: 'openBar',
	initialState,
	reducers: {
		setOpenBar: (state, action: PayloadAction<boolean>) => {
			state.isOpen = action.payload;
		},
	},
});

export const {setOpenBar} = openBarSlice.actions;

export default openBarSlice.reducer;
