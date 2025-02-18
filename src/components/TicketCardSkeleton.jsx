const TicketCardSkeleton = () => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="p-4">
        <div className="skeleton h-48 w-full rounded-xl"></div>
      </div>
      <div className="card-body">
        <div className="skeleton h-8 w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-1/2"></div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="skeleton w-8 h-8 rounded-full"></div>
          <div className="flex flex-col gap-2">
            <div className="skeleton h-3 w-24"></div>
            <div className="skeleton h-3 w-16"></div>
          </div>
        </div>
        <div className="card-actions justify-end mt-4">
          <div className="skeleton h-10 w-32"></div>
        </div>
      </div>
    </div>
  );
};

export default TicketCardSkeleton; 