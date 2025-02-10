import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: {
    sentRequests: [],
    receivedRequests: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // For sent requests (as a buyer)
    addSentRequests: (state, action) => {
      state.sentRequests = action.payload;
      state.loading = false;
    },
    removeSentRequest: (state, action) => {
      state.sentRequests = state.sentRequests.filter(request => request._id !== action.payload);
    },

    // For received requests (as a seller)
    addReceivedRequests: (state, action) => {
      state.receivedRequests = action.payload;
      state.loading = false;
    },
    removeReceivedRequest: (state, action) => {
      state.receivedRequests = state.receivedRequests.filter(request => request._id !== action.payload);
    },

    // Update request status
    updateRequestStatus: (state, action) => {
      const { requestId, status, isSent } = action.payload;
      
      if (isSent) {
        state.sentRequests = state.sentRequests.map(request => 
          request._id === requestId ? { ...request, status } : request
        );
      } else {
        state.receivedRequests = state.receivedRequests.map(request => 
          request._id === requestId ? { ...request, status } : request
        );
      }
    }
  }
});

export const { 
  setLoading,
  setError,
  addSentRequests, 
  removeSentRequest,
  addReceivedRequests,
  removeReceivedRequest,
  updateRequestStatus
} = requestSlice.actions;

export default requestSlice.reducer;
