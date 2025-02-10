import React from 'react';

const UserCard = ({ user }) => {
  const {
    role = 'user',
    photoUrl = '/default-avatar.png',
    firstName = '',
    lastName = '',
    sellerStats = { ticketsSold: 0, ticketsAllowed: 0 },
    averageRating = 0,
    ratings = [],
    phoneVerified = false,
    createdAt = new Date().toISOString()
  } = user?.data?.user || {};

  return (
    <div className="w-96 rounded-xl bg-white shadow-lg dark:bg-gray-800">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold dark:text-white">Public Profile</h2>
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            {role}
          </span>
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative h-32 w-32 overflow-hidden rounded-full">
            <img
              src={photoUrl}
              alt={`${firstName}'s profile`}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-4 text-center">
          <p className="text-xl font-bold dark:text-white">{`${firstName} ${lastName}`}</p>

          {role === 'seller' && sellerStats && (
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Tickets Sold
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {sellerStats.ticketsSold}/{sellerStats.ticketsAllowed}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Monthly Limit
                </div>
              </div>
            </div>
          )}

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
                        ? 'fill-yellow-400'
                        : 'fill-gray-300'
                    }`}
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              ({averageRating?.toFixed(1) || 'N/A'})
            </span>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-300">
            {ratings?.length > 0 ? `${ratings.length} reviews` : "No reviews yet"}
          </div>

          <div className="flex justify-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
              phoneVerified 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
            }`}>
              {phoneVerified ? 'Verified' : 'Unverified'}
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-100">
              Member since {new Date(createdAt).getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;