import { format } from "date-fns";
import { CheckBadgeIcon, FireIcon, HeartIcon } from "@heroicons/react/24/solid";

const getUpcomingIndicator = (eventDate) => {
  const currentDate = new Date();
  const timeDiff = eventDate - currentDate;
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  if (daysDiff <= 0) {
    return { text: "It's Showtime! 🎭", icon: <CheckBadgeIcon className="w-4 h-4" /> };
  } else if (daysDiff <= 1) {
    return { text: "Get Ready Bro 🔥", icon: <FireIcon className="w-4 h-4" /> };
  } else if (daysDiff <= 3) {
    return { text: "Hype Ekkinchu 🚀", icon: <FireIcon className="w-4 h-4" /> };
  } else if (daysDiff <= 7) {
    return { text: "Chooddam Pakka 👀", icon: <CheckBadgeIcon className="w-4 h-4" /> };
  } else {
    return { text: "Coming Soon Ra ⏳", icon: <HeartIcon className="w-4 h-4" /> };
  }
};

const BuyerTicketCard = ({ ticket }) => {
  const eventDate = new Date(ticket.eventDate);
  const { text, icon } = getUpcomingIndicator(eventDate);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="indicator w-full">
        <div className="indicator-item indicator-center badge badge-secondary gap-1">
          {icon}
          {text}
        </div>
        <figure className="relative w-full h-48">
          <img
            src={ticket.imageUrl || "https://placehold.co/600x400"}
            alt={ticket.eventName}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 badge badge-primary">
            {ticket.eventType}
          </div>
        </figure>
      </div>

      <div className="card-body">
        <h2 className="card-title">
          {ticket.eventName}
        </h2>
        
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{format(eventDate, "PPP 'at' p")}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{ticket.venue}</span>
          </div>

          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <span>Ticket ID: {ticket.ticketId}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerTicketCard;