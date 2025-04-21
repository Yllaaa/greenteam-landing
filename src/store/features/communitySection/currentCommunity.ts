// features/communitySection/currentCommunity.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrentDestinationState {
  selectedCountry: number | undefined;
  selectedCity: number | undefined;
}

const initialState: CurrentDestinationState = {
  selectedCountry: undefined,
  selectedCity: undefined,
};

const currentCommunitySlice = createSlice({
  name: "currentCommunity",
  initialState,
  reducers: {
    setCurrentDestination: (
      state,
      action: PayloadAction<{
        selectedCountry?: number;
        selectedCity?: number;
      }>
    ) => {
      // Only update the fields that are provided
      if (action.payload.selectedCountry !== undefined) {
        state.selectedCountry = action.payload.selectedCountry;
      }
      if (action.payload.selectedCity !== undefined) {
        state.selectedCity = action.payload.selectedCity;
      }
    },
    resetDestination: (state) => {
      state.selectedCountry = undefined;
      state.selectedCity = undefined;
    },
    clearSelectedCity: (state) => {
      state.selectedCity = undefined;
    }
  },
});

export const { 
  setCurrentDestination, 
  resetDestination,
  clearSelectedCity 
} = currentCommunitySlice.actions;

export default currentCommunitySlice.reducer;