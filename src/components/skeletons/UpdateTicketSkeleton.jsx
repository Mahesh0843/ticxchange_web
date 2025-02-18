const UpdateTicketSkeleton = () => {
  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="card bg-base-100 max-w-4xl mx-auto shadow-xl animate-pulse">
        <div className="card-body">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-6">
            <div className="skeleton h-8 w-48"></div>
            <div className="skeleton h-10 w-32"></div>
          </div>

          {/* Ticket Image Skeleton */}
          <div className="mb-6">
            <div className="skeleton h-4 w-32 mb-2"></div>
            <div className="skeleton h-64 w-full max-w-sm mx-auto"></div>
          </div>

          {/* Form Fields Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Event Type Skeleton */}
            <div className="md:col-span-2">
              <div className="skeleton h-4 w-24 mb-2"></div>
              <div className="skeleton h-12 w-full"></div>
            </div>

            {/* Regular Fields Skeleton */}
            {[...Array(6)].map((_, index) => (
              <div key={index}>
                <div className="skeleton h-4 w-24 mb-2"></div>
                <div className="skeleton h-12 w-full"></div>
              </div>
            ))}

            {/* Location Info Skeleton */}
            <div className="md:col-span-2">
              <div className="skeleton h-4 w-24 mb-2"></div>
              <div className="skeleton h-24 w-full"></div>
            </div>

            {/* Availability Toggle Skeleton */}
            <div className="flex items-center justify-between">
              <div className="skeleton h-4 w-32"></div>
              <div className="skeleton h-6 w-6"></div>
            </div>
          </div>

          {/* Submit Button Skeleton */}
          <div className="mt-6">
            <div className="skeleton h-12 w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTicketSkeleton; 