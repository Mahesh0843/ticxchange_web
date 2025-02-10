import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  query: '',
  loading: false,
  results: [],
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 12
  }
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setQuery: (state, action) => {
      state.query = action.payload;
      state.pagination.currentPage = 1; // Reset to first page on new query
    },
    setSearchResults: (state, action) => {
      state.results = action.payload.tickets;
      state.pagination = {
        ...action.payload.pagination,
        limit: state.pagination.limit // Maintain consistent limit
      };
      state.loading = false;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.results = [];
      state.pagination = initialState.pagination;
    },
    resetSearch: (state) => {
      return initialState;
    }
  }
});

export const { 
  setLoading, 
  setQuery, 
  setSearchResults, 
  setError, 
  resetSearch 
} = searchSlice.actions;

export default searchSlice.reducer;