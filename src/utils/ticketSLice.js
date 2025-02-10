import { createSlice } from "@reduxjs/toolkit";

const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    sellerTickets: [],
    buyerTickets: [],
    availableTickets: [],
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

    // For seller's tickets
    addSellerTickets: (state, action) => {
      state.sellerTickets = action.payload;
      state.loading = false;
    },
    removeSellerTicket: (state, action) => {
      state.sellerTickets = state.sellerTickets.filter(
        (ticket) => ticket._id !== action.payload
      );
    },
    updateSellerTicket: (state, action) => {
      state.sellerTickets = state.sellerTickets.map(ticket =>
        ticket._id === action.payload._id ? { ...ticket, ...action.payload } : ticket
      );
    },

    // For buyer's tickets
    addBuyerTickets: (state, action) => {
      state.buyerTickets = action.payload;
      state.loading = false;
    },
    removeBuyerTicket: (state, action) => {
      state.buyerTickets = state.buyerTickets.filter(
        (ticket) => ticket._id !== action.payload
      );
    },

    // For available tickets (marketplace)
    setAvailableTickets: (state, action) => {
      state.availableTickets = action.payload;
      state.loading = false;
    },
    updateAvailableTicket: (state, action) => {
      state.availableTickets = state.availableTickets.map(ticket =>
        ticket._id === action.payload._id ? { ...ticket, ...action.payload } : ticket
      );
    }
  }
});

export const { 
  setLoading,
  setError,
  addSellerTickets, 
  removeSellerTicket,
  updateSellerTicket,
  addBuyerTickets,
  removeBuyerTicket,
  setAvailableTickets,
  updateAvailableTicket
} = ticketSlice.actions;

export default ticketSlice.reducer;
