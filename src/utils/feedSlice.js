import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: [], // Initialize as empty array
  reducers: {
    addFeed: (state, action) => {
      state.push(action.payload); // Append to array
    },
    removeUserFromFeed: (state, action) => {
      return state.filter((user) => user._id !== action.payload); // Return new array
    },
  },
});

export const { addFeed, removeUserFromFeed } = feedSlice.actions;
export default feedSlice.reducer;