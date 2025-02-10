import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setSearchResults, setError, setQuery } from "../utils/searchSlice";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import _ from "lodash";
import { BASE_URL } from "../utils/constants";

const PublicTicketSearch = () => {
  const dispatch = useDispatch();
  const { query, loading, results, error, pagination } = useSelector((state) => state.search);
  const [filters, setFilters] = useState({
    city: "",
    sortBy: "eventDate",
    sortOrder: "asc",
  });

  const fetchResults = async (searchValue, currentFilters, page = 1) => {
    try {
      dispatch(setLoading());
      const queryParams = new URLSearchParams({
        search: searchValue,
        ...currentFilters,
        page,
        limit: 12,
      }).toString();

      const response = await axios.get(`${BASE_URL}/tickets/filter?${queryParams}`);
      dispatch(setSearchResults({
        tickets: response.data.data.tickets,
        pagination: response.data.data.pagination
      }));
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Error searching tickets"));
    }
  };

  const debouncedSearch = useRef(_.debounce(fetchResults, 500)).current;

  // Initial load to get all tickets
  useEffect(() => {
    fetchResults('', {
      city: '',
      sortBy: 'eventDate',
      sortOrder: 'asc'
    }, 1);
  }, []);

  useEffect(() => {
    debouncedSearch(query, filters, 1);
    return () => debouncedSearch.cancel();
  }, [query, filters, debouncedSearch]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchResults(query, filters, newPage);
  };

  const clearFilters = () => {
    dispatch(setQuery(''));
    setFilters({
      city: '',
      sortBy: 'eventDate',
      sortOrder: 'asc'
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-info mb-4">Discover Premium Event Tickets</h1>
        <p className="text-lg text-white/80">Find exclusive access to top-tier events and experiences</p>
      </div>

      <div className="bg-base-100 rounded-box shadow-lg p-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Available Tickets ({pagination.totalItems})</h2>
          <button 
            className="btn btn-ghost"
            onClick={clearFilters}
            disabled={!query && !filters.city}
          >
            Clear Filters
          </button>
        </div>

        <div className="flex flex-col gap-6 mb-8">
          <div className="form-control relative">
            <label className="input input-bordered flex items-center gap-4">
              <MagnifyingGlassIcon className="w-6 h-6 text-neutral/50" />
              <input
                type="text"
                value={query}
                onChange={(e) => dispatch(setQuery(e.target.value))}
                placeholder="Search events, venues, or artists..."
                className="w-full placeholder-primary-content/50"
              />
              {query && (
                <button 
                  className="btn btn-ghost btn-sm absolute right-2"
                  onClick={() => dispatch(setQuery(''))}
                >
                  ✕
                </button>
              )}
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <input
                type="text"
                placeholder="Filter by City"
                value={filters.city}
                onChange={(e) => handleFilterChange({ city: e.target.value })}
                className="input input-bordered"
              />
            </div>
            
            <div className="form-control">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                className="select select-bordered"
              >
                <option value="eventDate">Sort by Event Date</option>
                <option value="price">Sort by Price</option>
                <option value="uploadedAt">Sort by Listing Date</option>
              </select>
            </div>
            
            <div className="form-control">
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange({ sortOrder: e.target.value })}
                className="select select-bordered"
              >
                <option value="asc">Ascending Order</option>
                <option value="desc">Descending Order</option>
              </select>
            </div>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        )}

        {error && (
          <div className="alert alert-error shadow-lg mt-6">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {results.map((ticket) => (
                <div key={ticket._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                  <figure className="px-4 pt-4">
                    {ticket.imageUrl && (
                      <img 
                        src={ticket.imageUrl} 
                        alt={ticket.eventName} 
                        className="rounded-xl h-48 w-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </figure>
                  <div className="card-body">
                    <h2 className="card-title">{ticket.eventName}</h2>
                    <div className="space-y-2">
                      <p className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-neutral/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        {new Date(ticket.eventDate).toLocaleDateString()}
                      </p>
                      <p className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-neutral/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        {ticket.venue} • {ticket.location?.city}
                      </p>
                      <p className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-neutral/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        ${ticket.price.toFixed(2)}
                      </p>
                      {ticket.sellerId && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-8">
                              <span className="text-xs">
                                {ticket.sellerId.firstName?.[0]}
                                {ticket.sellerId.lastName?.[0]}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {ticket.sellerId.firstName} {ticket.sellerId.lastName}
                            </p>
                            {ticket.sellerId.rating && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-neutral/70">Rating: {ticket.sellerId.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="card-actions justify-end mt-4">
                      <button className="btn btn-primary">View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pagination.totalItems > 0 && (
              <div className="flex justify-center gap-2">
                <button 
                  className="btn btn-outline" 
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </button>
                <span className="btn btn-ghost">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button 
                  className="btn btn-outline" 
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </button>
              </div>
            )}

            {!loading && results.length === 0 && (
              <div className="text-center py-12">
                <div className="text-2xl text-neutral/70 mb-4">No tickets found</div>
                <button 
                  className="btn btn-primary"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PublicTicketSearch;