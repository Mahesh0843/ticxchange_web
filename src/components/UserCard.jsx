import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../utils/constants';

const UserCard = ({ user }) => {
  const [ratings, setRatings] = useState([]);
  const {
    role = 'user',
    photoUrl = '/default-avatar.png',
    firstName = '',
    lastName = '',
    sellerStats = { ticketsSold: 0, ticketsAllowed: 0 },
    averageRating = 0,
    phoneVerified = false,
    createdAt = new Date().toISOString(),
    _id
  } = user?.data?.user || {};

  useEffect(() => {
    if (role === 'seller' && _id) {
      fetchSellerRatings(_id);
    }
  }, [role, _id]);

  const fetchSellerRatings = async (sellerId) => {
    try {
      const response = await fetch(`${BASE_URL}/ratings/seller/${sellerId}`);
      const data = await response.json();
      if (data.success) {
        setRatings(data.ratings);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  return (
    <div className="w-96 rounded-xl shadow-xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Public Profile</h2>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary">
            {role}
          </span>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative h-32 w-32 overflow-hidden rounded-full ring-2 ring-primary/20">
            <img
              src={photoUrl}
              alt={`${firstName}'s profile`}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-4 text-center">
          <p className="text-xl font-bold">{`${firstName} ${lastName}`}</p>

          {role === 'seller' && sellerStats && (
            <div className="rounded-lg p-4">
              <div className="text-center">
                <div className="text-sm opacity-70">
                  Tickets Sold
                </div>
                <div className="text-2xl font-bold">
                  {sellerStats.ticketsSold}/{sellerStats.ticketsAllowed}
                </div>
                <div className="text-xs opacity-60">
                  Monthly Limit
                </div>
              </div>
            </div>
          )}

          {/* Star Rating and Reviews Section */}
          {role === 'seller' && (
            <>
              <div className="flex items-center justify-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      disabled
                      className="h-5 w-5"
                      aria-label={`${i + 1} stars`}
                    >
                      <svg
                        className={`h-5 w-5 ${
                          Math.floor(averageRating) > i
                            ? 'fill-warning'
                            : 'opacity-20'
                        }`}
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
                <span className="text-sm opacity-70">
                  ({averageRating?.toFixed(1) || 'N/A'})
                </span>
              </div>

              {/* Collapsible Reviews Section */}
              <div tabIndex={0} className="collapse collapse-arrow border border-base-300">
                <div className="collapse-title font-medium">
                  {ratings?.length > 0 ? `${ratings.length} Reviews` : "No Reviews Yet"}
                </div>
                <div className="collapse-content">
                  {ratings?.length > 0 ? (
                    <div className="space-y-3">
                      {ratings.map((review) => (
                        <div key={review._id} className="text-left p-2 rounded">
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-warning">★</span>
                            <span className="text-sm">{review.rating}</span>
                          </div>
                          <p className="text-sm opacity-70">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm opacity-70">This seller has no reviews yet.</p>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
              phoneVerified 
                ? 'bg-success/10 text-success'
                : 'bg-warning/10 text-warning'
            }`}>
              {phoneVerified ? 'Verified' : 'Unverified'}
            </span>
            <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium opacity-70">
              Member since {new Date(createdAt).getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;