import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  setLoading,
  setError,
  addReceivedRequests,
  removeReceivedRequest,
  updateRequestStatus
} from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { receivedRequests, loading, error } = useSelector((state) => state.requests);

  const reviewRequest = async (status, requestId) => {
    if (!requestId) {
      console.error("Invalid request ID");
      return;
    }

    try {
      dispatch(setLoading());
      await axios.post(
        `${BASE_URL}/connection/review/${requestId}/${status}`,
        {},
        { withCredentials: true }
      );
      
      dispatch(updateRequestStatus({ 
        requestId, 
        status: status.toUpperCase(), 
        isSent: false 
      }));
      
      setTimeout(() => {
        dispatch(removeReceivedRequest(requestId));
        
        if (status === "accepted") {
          navigate("/connections");
        }
      }, 500);

    } catch (err) {
      dispatch(setError(err.message || "Failed to review request"));
      console.error("Request review error:", err);
    }
  };

  const fetchRequests = async () => {
    try {
      dispatch(setLoading());
      const response = await axios.get(`${BASE_URL}/user/requests/received`, {
        withCredentials: true,
      });
      
      if (!response?.data?.data) {
        throw new Error("Invalid response format");
      }
      
      dispatch(addReceivedRequests(response.data.data));
    } catch (err) {
      dispatch(setError(err.message || "Failed to fetch requests"));
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

  if (!Array.isArray(receivedRequests) || receivedRequests.length === 0) {
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
        {receivedRequests.map((request) => {
          // Validate request object has required properties
          if (!request?.requestId || !request?.buyer) {
            return null;
          }

          const { requestId, buyer, ticket, requestedAt } = request;

          return (
            <div
              key={requestId}
              className="card bg-base-100 shadow-xl transition-all hover:shadow-2xl"
            >
              <div className="card-body">
                {/* Buyer Information */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="avatar">
                    <div className="w-16 rounded-full">
                      <img 
                        src={buyer.photoUrl || '/default-avatar.png'} 
                        alt={`${buyer.firstName || ''} ${buyer.lastName || ''}`}
                        onError={(e) => {
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="card-title">
                      {[buyer.firstName, buyer.lastName].filter(Boolean).join(' ') || 'Anonymous User'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {buyer.buyerStats?.totalTicketsBought || 0} previous purchases
                    </p>
                  </div>
                </div>

                {/* Ticket Details */}
                {ticket ? (
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2">
                      {ticket.eventName || 'Unnamed Event'}
                    </h3>
                    <div className="text-sm space-y-1">
                      <p>🗓 {ticket.eventDate ? 
                        new Date(ticket.eventDate).toLocaleDateString() : 
                        'Date not set'}
                      </p>
                      <p>📍 {ticket.venue || 'Venue not specified'}</p>
                      <p>💵 ₹{(Number(ticket.price) || 0).toLocaleString()}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="alert alert-warning">
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                      </svg>
                      <span>Ticket information unavailable</span>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-400 mb-4">
                  Requested: {requestedAt ? 
                    new Date(requestedAt).toLocaleString() : 
                    'Time not available'}
                </p>

                {/* Action Buttons */}
                <div className="card-actions justify-end">
                  <button 
                    onClick={() => reviewRequest("rejected", requestId)}
                    className="btn btn-outline btn-error btn-sm"
                    disabled={loading}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => reviewRequest("accepted", requestId)}
                    className="btn btn-primary btn-sm"
                    disabled={loading}
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;