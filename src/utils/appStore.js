import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import ticketReducer from "./ticketSLice";
import chatReducer from "./chatSlice";
import requestReducer from "./requestSlice";
import connectionReducer from "./connectionSlice";
import searchReducer from "./searchSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    tickets: ticketReducer,
    chat: chatReducer,
    requests: requestReducer,
    connections: connectionReducer,
    search: searchReducer
  }
});

export default appStore;