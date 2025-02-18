// components/SellerTicketCard.jsx
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const SellerTicketCard = ({ ticket }) => {
  // Format currency with proper localization
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date and time
  const eventDateTime = format(new Date(ticket.eventDate), 'dd MMM yyyy, h:mm a');

  return (
    <div className="card bg-base-100 shadow-lg mb-4 hover:shadow-xl transition-shadow">
      <div className="card-body">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          {/* Event Image */}
          {ticket.imageUrl && (
            <div className="md:w-1/4">
              <img 
                src={ticket.imageUrl} 
                alt="Event visual" 
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Event Details */}
          <div className={`flex-1 ${ticket.imageUrl ? 'md:w-3/4' : 'w-full'}`}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="card-title text-xl mb-2">{ticket.eventName}</h2>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                  <span className="badge badge-info">{ticket.location?.city}</span>
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {eventDateTime}
                  </span>
                </div>
              </div>
              <div className={`badge ${ticket.isAvailable ? 'badge-success' : 'badge-error'} gap-2`}>
                {ticket.isAvailable ? 'Available' : 'Sold'}
              </div>
            </div>

            {/* Ticket Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="text-sm font-semibold">Price:</label>
                <p className="font-medium">{formatCurrency(ticket.price)}</p>
              </div>
              <div>
                <label className="text-sm font-semibold">Quantity:</label>
                <p className="font-medium">{ticket.numberOfTickets}</p>
              </div>
              <div>
                <label className="text-sm font-semibold">Seat:</label>
                <p className="font-medium">{ticket.seatNumber}</p>
              </div>
              <div>
                <label className="text-sm font-semibold">Venue:</label>
                <p className="font-medium truncate">{ticket.venue}</p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-4 pt-2 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Ticket ID:</span> {ticket.ticketId}
                </div>
                <div>
                  <span className="font-medium">Created:</span> 
                  {format(new Date(ticket.createdAt), 'dd MMM yyyy')}
                </div>
                {ticket.uniqueIdentifier && (
                  <div className="truncate max-w-[200px]">
                    <span className="font-medium">Unique ID:</span> 
                    {ticket.uniqueIdentifier}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card-actions justify-end mt-4">
          <Link 
            to={`/tickets/update/${ticket._id}`}
            className="btn btn-primary btn-sm"
          >
            Manage Ticket
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellerTicketCard;