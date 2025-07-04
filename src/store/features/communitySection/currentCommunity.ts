// features/communitySection/currentCommunity.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CurrentDestinationState {
  selectedCountry: number | undefined;
  selectedCity: number | undefined;
  selectedCategory: string | undefined;
  verificationStatus: string | undefined;
}

const initialState: CurrentDestinationState = {
  selectedCountry: undefined,
  selectedCity: undefined,
  selectedCategory: undefined,
  verificationStatus: 'all', // Default to 'all'
};

const currentCommunitySlice = createSlice({
  name: 'currentCommunity',
  initialState,
  reducers: {
    setCurrentDestination: (
      state,
      action: PayloadAction<{
        selectedCountry?: number;
        selectedCity?: number;
        selectedCategory?: string;
        verificationStatus?: string; // Added verification status
      }>
    ) => {
      // Only update the fields that are provided
      if (action.payload.selectedCountry !== undefined) {
        state.selectedCountry = action.payload.selectedCountry;
      }
      if (action.payload.selectedCity !== undefined) {
        state.selectedCity = action.payload.selectedCity;
      }
      if (action.payload.selectedCategory !== undefined) {
        state.selectedCategory = action.payload.selectedCategory;
      }
      if (action.payload.verificationStatus !== undefined) {
        state.verificationStatus = action.payload.verificationStatus;
      }
    },
    resetDestination: (state) => {
      state.selectedCountry = undefined;
      state.selectedCity = undefined;
      state.selectedCategory = undefined;
      state.verificationStatus = 'all'; // Reset to 'all'
    },
    clearSelectedCity: (state) => {
      state.selectedCity = undefined;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = undefined;
    },
    clearVerificationFilter: (state) => {
      state.verificationStatus = 'all';
    },
  },
});

export const {
  setCurrentDestination,
  resetDestination,
  clearSelectedCity,
  clearSelectedCategory,
  clearVerificationFilter, // Export the new action
} = currentCommunitySlice.actions;

export default currentCommunitySlice.reducer;
