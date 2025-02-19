import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import ticketReducer from "./ticketSLice";
import chatReducer from "./chatSlice";
import requestReducer from "./requestSlice";
import connectionReducer from "./connectionSlice";
import searchReducer from "./searchSlice";
import notificationReducer from "./notificationSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    tickets: ticketReducer,
    chat: chatReducer,
    requests: requestReducer,
    connections: connectionReducer,
    search: searchReducer,
    notifications: notificationReducer
  }
});

export default appStore;