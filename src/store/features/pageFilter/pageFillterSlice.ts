// features/pageFilter/pageFilterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Topic {
  id: number;
  name: string;
}

type PageItem = {
  id: string;
  name: string;
  slug: string;
  why: string;
  what: string;
  how: string;
  avatar: string | null;
  cover: string | null;
  category: string;
  followersCount: number;
  topic: Topic;
  isOwner: boolean;
};

interface PageFilterState {
  allPages: PageItem[];
  selectedTopicId: number | null;
  filteredPages: PageItem[];
  currentPage: number;
  hasMore: boolean;
  isLoading: boolean;
  isPaginationLoading: boolean;
  error: string | null;
}

const initialState: PageFilterState = {
  allPages: [],
  selectedTopicId: null,
  filteredPages: [],
  currentPage: 1,
  hasMore: true,
  isLoading: false,
  isPaginationLoading: false,
  error: null,
};

const pageFilterSlice = createSlice({
  name: 'pageFilter',
  initialState,
  reducers: {
    setPages: (
      state,
      action: PayloadAction<{ pages: PageItem[]; replace: boolean }>
    ) => {
      if (action.payload.replace) {
        state.allPages = action.payload.pages;
      } else {
        state.allPages = [...state.allPages, ...action.payload.pages];
      }
      state.filteredPages = state.allPages;
    },
    setSelectedTopic: (state, action: PayloadAction<number | null>) => {
      state.selectedTopicId = action.payload;
      if (action.payload !== null) {
        state.filteredPages = state.allPages.filter(
          (page) => page.topic.id === action.payload
        );
      } else {
        state.filteredPages = state.allPages;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setPaginationLoading: (state, action: PayloadAction<boolean>) => {
      state.isPaginationLoading = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    resetFilter: (state) => {
      state.selectedTopicId = null;
      state.filteredPages = state.allPages;
      state.currentPage = 1;
      state.hasMore = true;
    },
  },
});

export const {
  setPages,
  setSelectedTopic,
  setLoading,
  setPaginationLoading,
  setHasMore,
  setCurrentPage,
  resetFilter,
} = pageFilterSlice.actions;

export default pageFilterSlice.reducer;
