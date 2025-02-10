// import React from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import "./index.css";
// import App from "./App.jsx";

// const rootElement = document.getElementById("root");

// createRoot(rootElement).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );


import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import appStore from "./utils/appStore.js"; // Import your Redux store
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={appStore}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
