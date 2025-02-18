import React from "react";
import { useNavigate } from "react-router-dom";

const TicketCard = ({ ticket, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(); // Trigger the onClick handler passed from the parent
    } else {
      // Fallback navigation if no onClick handler is provided
      navigate(`/ticket/${ticket._id}`); // Navigate to the ticket details page
    }
  };

  // Ensure the ticket object has the required fields
  if (!ticket || !ticket.imageUrl || !ticket.eventName || !ticket.eventDate || !ticket.venue || !ticket.price) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-error">Invalid Ticket Data</h2>
          <p>This ticket cannot be displayed due to missing information.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card bg-base-100 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
      onClick={handleClick}
    >
      <figure className="px-4 pt-4">
        <img
          src={ticket.imageUrl}
          alt={ticket.eventName}
          className="rounded-xl h-48 w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{ticket.eventName}</h2>
        <p>📅 {new Date(ticket.eventDate).toLocaleDateString()}</p>
        <p>📍 {ticket.venue}, {ticket.location?.city || "Unknown City"}</p>
        <p>💰 ₹{ticket.price.toLocaleString()}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">View Details</button>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;