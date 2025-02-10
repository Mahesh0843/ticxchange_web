import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connections",
  initialState: {
    connections: [],
    loading: false,
    error: null
  },
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    addConnections: (state, action) => {
      state.connections = action.payload;
      state.loading = false;
    },
    removeConnection: (state, action) => {
      state.connections = state.connections.filter(
        (connection) => connection._id !== action.payload
      );
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const { 
  setLoading, 
  addConnections, 
  removeConnection, 
  setError 
} = connectionSlice.actions;

export default connectionSlice.reducer;