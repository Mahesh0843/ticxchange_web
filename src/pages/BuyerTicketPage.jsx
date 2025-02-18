import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import TicketCard from "../components/TicketCard";
import TicketCardSkeleton from "../components/TicketCardSkeleton";
import { 
  setLoading, 
  setError, 
  addBuyerTickets 
} from "../utils/ticketSlice";
import BuyerTicketCard from "../components/BuyerTicketCard";

const BuyerTicketPage = () => {
  const dispatch = useDispatch();
  const { buyerTickets, loading, error } = useSelector((state) => state.tickets);

  useEffect(() => {
    const fetchBuyerTickets = async () => {
      try {
        dispatch(setLoading());
        const response = await axios.get(`${BASE_URL}/buyer/tickets`, {
          withCredentials: true,
        });
        dispatch(addBuyerTickets(response.data.data.tickets));
      } catch (err) {
        dispatch(setError(
          err.response?.data?.message || 
          "Failed to fetch tickets. Please try again later."
        ));
      }
    };

    fetchBuyerTickets();
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Your Purchased Tickets</h1>
        <p className="text-white/70">
          Manage and view all your purchased tickets
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <TicketCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="alert alert-error shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      ) : buyerTickets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎫</div>
          <h2 className="text-2xl font-semibold mb-2">No Tickets Found</h2>
          <p className="text-white/70 mb-6">
            You haven't purchased any tickets yet.
          </p>
          <a href="/" className="btn btn-primary">
            Browse Available Tickets
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buyerTickets.map((ticket) => (
            <BuyerTicketCard key={ticket._id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerTicketPage;