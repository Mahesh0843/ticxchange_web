import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],   // Store chat conversations
    loading: false, // Track loading state
    error: null,   // Store error messages
  },
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    addChats: (state, action) => {
      state.chats = action.payload;
      state.loading = false;
    },
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      state.chats = state.chats.map(chat => 
        chat._id === chatId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      );
    },
    removeChats: (state) => {
      state.chats = [];
      state.loading = false;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  }
});

export const { setLoading, addChats, addMessage, removeChats, setError } = chatSlice.actions;
export default chatSlice.reducer;
