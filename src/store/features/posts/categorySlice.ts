// store/slices/categorySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CategorySelection {
  topicId: number;
  subtopicId: number | 'all';
}

interface CategoryState {
  selectedCategories: Record<number, number | 'all'>;
  globalCategory: CategorySelection | null;
}

const initialState: CategoryState = {
  selectedCategories: {}, // Per topic selections
  globalCategory: null, // For global category selection if needed
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setTopicCategory: (
      state,
      action: PayloadAction<{ topicId: number; subtopicId: number | 'all' }>
    ) => {
      const { topicId, subtopicId } = action.payload;
      state.selectedCategories[topicId] = subtopicId;
    },
    setGlobalCategory: (
      state,
      action: PayloadAction<CategorySelection | null>
    ) => {
      state.globalCategory = action.payload;
    },
    resetCategories: (state) => {
      state.selectedCategories = {};
      state.globalCategory = null;
    },
  },
});

export const { setTopicCategory, setGlobalCategory, resetCategories } = categorySlice.actions;
export default categorySlice.reducer;