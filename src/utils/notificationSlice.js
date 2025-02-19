import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    unreadCount: 0,
    loading: false,
    error: null
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
    setNotifications: (state, action) => {
      state.items = action.payload;
      state.loading = false;
    },
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    markAsRead: (state, action) => {
      const notification = state.items.find(n => n._id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach(notification => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    }
  }
});

export const { 
  setLoading, 
  setError, 
  setNotifications, 
  addNotification,
  setUnreadCount,
  markAsRead,
  markAllAsRead,
  clearNotifications
} = notificationSlice.actions;

export default notificationSlice.reducer; 