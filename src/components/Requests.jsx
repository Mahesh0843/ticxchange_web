import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  setLoading,
  setError,
  addReceivedRequests,
  removeReceivedRequest,
  updateRequestStatus
} from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const { receivedRequests, loading, error } = useSelector((state) => state.requests);

  const reviewRequest = async (status, requestId) => {
    try {
      dispatch(setLoading());
      await axios.post(
        `${BASE_URL}/connection/review/${requestId}/${status}`,
        {},
        { withCredentials: true }
      );
      
      // Update status before removal if needed
      dispatch(updateRequestStatus({ 
        requestId, 
        status: status.toUpperCase(), 
        isSent: false 
      }));
      
      // Remove from UI after short delay
      setTimeout(() => {
        dispatch(removeReceivedRequest(requestId));
        
        // Navigate to Connections page if request is accepted
        if (status === "accepted") {
          navigate("/connections"); // Navigate to the Connections page
        }
      }, 500);

    } catch (err) {
      dispatch(setError(err.message));
      console.error("Request review error:", err);
    }
  };

  const fetchRequests = async () => {
    try {
      dispatch(setLoading());
      const { data } = await axios.get(`${BASE_URL}/user/requests/received`, {
        withCredentials: true,
      });
      dispatch(addReceivedRequests(data.data));
    } catch (err) {
      dispatch(setError(err.message));
      console.error("Fetch requests error:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center my-10">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-md mx-auto my-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error: {error}</span>
      </div>
    );
  }

  if (!receivedRequests || receivedRequests.length === 0) {
    return (
      <div className="flex justify-center my-10">
        <h1 className="text-xl text-neutral-content">No connection requests found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-8 text-primary">
        Received Connection Requests
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {receivedRequests.map(({ requestId, buyer, ticket, requestedAt }) => (
          <div
            key={requestId}
            className="card bg-base-100 shadow-xl transition-all hover:shadow-2xl"
          >
            <div className="card-body">
              {/* Buyer Information */}
              <div className="flex items-center gap-4 mb-4">
                <div className="avatar">
                  <div className="w-16 rounded-full">
                    <img src={buyer.photoUrl} alt={buyer.fullName} />
                  </div>
                </div>
                <div>
                  <h2 className="card-title">{buyer.firstName} {buyer.lastName}</h2>
                  <p className="text-sm text-gray-500">
                    {buyer.buyerStats?.totalTicketsBought || 0} previous purchases
                  </p>
                </div>
              </div>

              {/* Ticket Details */}
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2">{ticket.eventName}</h3>
                <div className="text-sm space-y-1">
                  <p>🗓 {new Date(ticket.eventDate).toLocaleDateString()}</p>
                  <p>📍 {ticket.venue}</p>
                  <p>💵 ₹{ticket.price.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">
                    Requested: {new Date(requestedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="card-actions justify-end">
                <button 
                  onClick={() => reviewRequest("rejected", requestId)}
                  className="btn btn-outline btn-error btn-sm"
                >
                  Reject
                </button>
                <button
                  onClick={() => reviewRequest("accepted", requestId)}
                  className="btn btn-primary btn-sm"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Requests;