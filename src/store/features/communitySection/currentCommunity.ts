// features/communitySection/currentCommunity.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CurrentDestinationState {
  selectedCountry: number | undefined;
  selectedCity: number | undefined;
  selectedCategory: string | undefined; // Changed to string
}

const initialState: CurrentDestinationState = {
  selectedCountry: undefined,
  selectedCity: undefined,
  selectedCategory: undefined, // Still undefined, but now string type
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
        selectedCategory?: string; // Changed to string
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
    },
    resetDestination: (state) => {
      state.selectedCountry = undefined;
      state.selectedCity = undefined;
      state.selectedCategory = undefined;
    },
    clearSelectedCity: (state) => {
      state.selectedCity = undefined;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = undefined;
    },
  },
});

export const {
  setCurrentDestination,
  resetDestination,
  clearSelectedCity,
  clearSelectedCategory,
} = currentCommunitySlice.actions;

export default currentCommunitySlice.reducer;
