// import { Routes, Route } from "react-router-dom";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import Body from "./components/Body";
// import Login from "./components/Login";
// import Profile from "./components/Profile";
// import TicketSearch from "./components/PublicTicketSearch";
// import CreateTicketPage from "./components/CreateTicketPage";
// import TicketLocationPage from './components/TicketLocationPage';
// import SellerTicketsPage from "./components/SellerTicketsPage";
// import UpdateTicketPage from "./components/UpdateTicketPage";
// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Body />}>
//       <Route index element={<TicketSearch />} />
//         <Route path="login" element={<Login />} />
//         <Route path="profile" element={<Profile />} />
//         <Route path="createticket" element={<CreateTicketPage />} />
//         <Route path="tickets/location/:id" element={<TicketLocationPage />} />
//         <Route path="seller/tickets" element={<SellerTicketsPage />} />
//         <Route path="tickets/update/:id" element={<UpdateTicketPage />} />
//       </Route>
//     </Routes>
//   );
// }

// export default App;


import { Routes, Route } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import TicketSearch from "./components/PublicTicketSearch";
import CreateTicketPage from "./components/CreateTicketPage";
import TicketLocationPage from "./components/TicketLocationPage";
import SellerTicketsPage from "./components/SellerTicketsPage";
import UpdateTicketPage from "./components/UpdateTicketPage";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import TicketDetails from "./components/TicketDetails";
import HowItWorks from "./components/HowItWorks";
import HowToSell from "./components/HowToSell";
import AboutUs from "./components/AboutUs";
import Chat from "./components/Chat";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Body />}>

        <Route index element={<TicketSearch />} />
        <Route path="login" element={<Login />} />
        <Route path="how-to-sell" element={<HowToSell />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="profile" element={<Profile />} />
        <Route path="createticket" element={<CreateTicketPage />} />
        <Route path="tickets/location/:id" element={<TicketLocationPage />} />
        <Route path="seller/tickets" element={<SellerTicketsPage />} />
        <Route path="tickets/update/:id" element={<UpdateTicketPage />} />
        <Route path="connections" element={<Connections />} />
        <Route path="requests" element={<Requests />} />
        <Route path="ticket/:id" element={<TicketDetails />} />
        <Route path="chat/:targetUserId" element={<Chat />} />
      </Route>
    </Routes>
  );
}

export default App;

