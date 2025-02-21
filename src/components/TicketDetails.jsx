import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useSelector } from 'react-redux';

const TicketDetails = () => {
  const { ticketId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user); // Access the user state from Redux
  const [ticket, setTicket] = useState(state?.ticket || null); // Initialize ticket state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sellerReviews, setSellerReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    if (!state?.ticket) {
      fetchTicketDetails();
    } else if (state.ticket.sellerId?._id) {
      fetchSellerReviews(state.ticket.sellerId._id);
    }
  }, [state]);

  useEffect(() => {
    if (ticket?.sellerId?._id) {
      fetchSellerReviews(ticket.sellerId._id);
    }
  }, [ticket]);

  const fetchTicketDetails = async () => {
    const controller = new AbortController();
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/tickets/${ticketId}?populate=sellerId`, {
        signal: controller.signal,
      });
      console.log("API Response:", response.data); // Log the response for debugging
      setTicket(response.data.data);
    } catch (err) {
      if (!axios.isCancel(err)) {
        setError('Failed to fetch ticket details');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerReviews = async (sellerId) => {
    try {
      setReviewsLoading(true);
      const response = await axios.get(`${BASE_URL}/ratings/seller/${sellerId}`);
      if (response.data.success) {
        setSellerReviews(response.data.ratings);
      }
    } catch (err) {
      console.error('Error fetching seller reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleInterest = async () => {
    const controller = new AbortController();
    try {
      setLoading(true);
      
      // Check if user is logged in and is a buyer
      if (!user || user.data?.user?.role !== 'buyer') {
        return navigate('/login');
      }

      // Check if phone number is verified
      if (!user.data?.user?.phoneVerified) {
        // Show alert for phone verification
        const alert = document.createElement('div');
        alert.innerHTML = `
          <div class="alert alert-warning shadow-lg">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
              <div>
                <h3 class="font-bold">Phone Verification Required!</h3>
                <div class="text-xs">Please verify your phone number in your profile before showing interest.</div>
              </div>
            </div>
            <div class="flex-none">
              <button class="btn btn-sm" onclick="window.location.href='/profile'">Go to Profile</button>
            </div>
          </div>
        `;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 5000); // Remove alert after 5 seconds
        return navigate('/profile');
      }

      const sellerId = ticket.sellerId._id || ticket.sellerId;
      const response = await axios.post(
        `${BASE_URL}/connection/connect/${ticket._id}/${sellerId}`,
        {},
        { withCredentials: true, signal: controller.signal }
      );

      if (response.data) {
        setTicket((prev) => ({ ...prev, hasRequest: true }));
        // Show success alert
        const alert = document.createElement('div');
        alert.innerHTML = `
          <div class="alert alert-success shadow-lg">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>Interest shown successfully! The seller will be notified.</span>
            </div>
          </div>
        `;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 3000); // Remove alert after 3 seconds
      }
    } catch (err) {
      if (!axios.isCancel(err)) {
        setError(err.response?.data?.message || 'Failed to send interest');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-error">Ticket not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <button
        className="btn btn-ghost mb-8"
        onClick={() => navigate(-1)}
      >
        ← Back to Results
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Ticket Details */}
        <div className="card bg-base-100 shadow-xl">
          <figure className="px-4 pt-4">
            <img
              src={ticket.imageUrl}
              alt={ticket.eventName}
              className="rounded-xl h-64 w-full object-cover"
            />
          </figure>
          <div className="card-body">
            <h1 className="card-title text-3xl">{ticket.eventName}</h1>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Event Details</h3>
                <p>📅 {new Date(ticket.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p>📍 {ticket.venue}, {ticket.location?.city}</p>
                <p>💰 ₹{ticket.price.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Ticket Info</h3>
                <p>Seat: {ticket.seatNumber}</p>
                <p>Listed: {new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Seller Card with Reviews */}
        <div className="card bg-base-100 shadow-xl h-fit">
          <div className="card-body">
            <h2 className="card-title text-2xl">Seller Information</h2>
            {ticket.sellerId && (
              <>
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-16 rounded-full">
                      <img
                        src={ticket.sellerId?.photoUrl || "https://via.placeholder.com/150"}
                        alt={ticket.sellerId.firstName}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {ticket.sellerId.firstName} {ticket.sellerId.lastName}
                    </h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span>⭐</span>
                        <span>{ticket.sellerId.averageRating || 'New Seller'}</span>
                      </div>
                      <p>🎫 Tickets Sold: {ticket.sellerId.sellerStats?.ticketsSold || 0}</p>
                      <p>🛡️ Status: {ticket.sellerId.accountStatus || 'Unknown'}</p>
                    </div>
                  </div>
                </div>

                {/* Reviews Collapse Section */}
                <div tabIndex={0} className="collapse collapse-arrow border border-base-300 mt-4">
                  <div className="collapse-title font-medium">
                    {reviewsLoading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      `Seller Reviews (${sellerReviews.length})`
                    )}
                  </div>
                  <div className="collapse-content">
                    {reviewsLoading ? (
                      <div className="flex justify-center py-4">
                        <span className="loading loading-spinner loading-md"></span>
                      </div>
                    ) : sellerReviews.length > 0 ? (
                      <div className="space-y-3">
                        {sellerReviews.map((review) => (
                          <div key={review._id} className="text-left p-2 rounded">
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-warning">★</span>
                              <span className="text-sm">{review.rating}</span>
                            </div>
                            <p className="text-sm opacity-70">{review.comment}</p>
                            <p className="text-xs opacity-50 mt-1">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm opacity-70">No reviews yet for this seller.</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="alert alert-error mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="card-actions justify-end mt-6">
              {!user.data?.user?.phoneVerified && (
                <div className="alert alert-warning shadow-sm mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Phone verification required to show interest</span>
                </div>
              )}
              <button
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                onClick={handleInterest}
                disabled={ticket.hasRequest || !ticket.isAvailable || !user.data?.user?.phoneVerified}
              >
                {ticket.hasRequest ? 'Request Sent' : 
                 !user.data?.user?.phoneVerified ? 'Verify Phone First' : 
                 'Show Interest'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;