// import io from "socket.io-client";
// import { BASE_URL } from "./constants";

// export const createSocketConnection = () => {
//   if (location.hostname === "localhost") {
//     return io(BASE_URL, {
//       withCredentials: true,
//       transports: ["websocket"]
//     });
//   } else {
//     return io("/", { 
//       path: "/api/socket.io",
//       withCredentials: true,
//       transports: ["websocket"]
//     });
//   }
// };

import io from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  if (location.hostname === "localhost") {
    // Development environment
    return io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket"]
    });
  } else {
    // Production environment
    return io("https://ticxchange.onrender.com", {  // Replace with your actual backend URL
      withCredentials: true,
      transports: ["websocket"],
      path: "/socket.io"  // Default Socket.IO path
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