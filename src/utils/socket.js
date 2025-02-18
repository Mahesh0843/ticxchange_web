import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  if (location.hostname === "localhost") {
    return io(BASE_URL, {
      withCredentials: true,
      transports: ["websocket"]
    });
  } else {
    return io("/", { 
      path: "/api/socket.io",
      withCredentials: true,
      transports: ["websocket"]
    });
  }
};


// utils/socket.js
// import { io } from "socket.io-client";

// export const createSocketConnection = () => {
//   return io("http://localhost:8888", {
//     withCredentials: true,
//     autoConnect: true,
//     transports: ["websocket"] // Force WebSocket transport
//   });
// };