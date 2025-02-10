import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import TicketSearch from "./components/PublicTicketSearch";
import CreateTicketPage from "./components/CreateTicketPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Body />}>
      <Route index element={<TicketSearch />} />
        <Route path="login" element={<Login />} />
        <Route path="profile" element={<Profile />} />
        <Route path="createticket" element={<CreateTicketPage />} />
      </Route>
    </Routes>
  );
}

export default App;
