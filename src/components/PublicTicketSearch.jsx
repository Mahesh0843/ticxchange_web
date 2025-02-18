import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoading, setSearchResults, setError, setQuery } from "../utils/searchSlice";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import _ from "lodash";
import { BASE_URL } from "../utils/constants";
import TicketCard from "../components/TicketCard";
import TicketCardSkeleton from "./TicketCardSkeleton";

const PublicTicketSearch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { query, loading, results, error, pagination } = useSelector((state) => state.search);
  const [filters, setFilters] = useState({
    city: "",
    sortBy: "eventDate",
    sortOrder: "asc",
    eventType: "",
  });

  const fetchResults = async (searchValue, currentFilters, page = 1) => {
    const controller = new AbortController();
    try {
      dispatch(setLoading());
      const queryParams = new URLSearchParams({
        search: searchValue,
        ...currentFilters,
        page,
        limit: 12,
      }).toString();

      const response = await axios.get(`${BASE_URL}/tickets/filter?${queryParams}`, {
        signal: controller.signal,
      });
      dispatch(setSearchResults({
        tickets: response.data.data.tickets,
        pagination: response.data.data.pagination,
      }));
    } catch (err) {
      if (!axios.isCancel(err)) {
        const errorMessage = err.response
          ? err.response.data?.message
          : "Network Error - Please check your connection";
        dispatch(setError(errorMessage));
      }
    } finally {
      controller.abort();
    }
  };

  const debouncedSearch = useRef(_.debounce(fetchResults, 500)).current;

  // Initial load to get all tickets
  useEffect(() => {
    fetchResults('', {
      city: '',
      sortBy: 'eventDate',
      sortOrder: 'asc',
      eventType: '',
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
      sortOrder: 'asc',
      eventType: '',
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
            disabled={!query && !filters.city && !filters.eventType}
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
                aria-label="Search events"
              />
              {query && (
                <button
                  className="btn btn-ghost btn-sm absolute right-2"
                  onClick={() => dispatch(setQuery(''))}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="form-control">
              <input
                type="text"
                placeholder="Filter by City"
                value={filters.city}
                onChange={(e) => handleFilterChange({ city: e.target.value })}
                className="input input-bordered"
                aria-label="Filter by city"
              />
            </div>

            <div className="form-control">
              <select
                value={filters.eventType}
                onChange={(e) => handleFilterChange({ eventType: e.target.value })}
                className="select select-bordered"
                aria-label="Filter by event type"
              >
                <option value="">All Event Types</option>
                <option value="MOVIE">Movies</option>
                <option value="SPORT">Sports</option>
                <option value="EVENT">Events</option>
              </select>
            </div>

            <div className="form-control">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                className="select select-bordered"
                aria-label="Sort by"
              >
                <option value="eventDate">Sort by Event Date</option>
                <option value="price">Sort by Price</option>
                <option value="uploadedAt">Sort by Listing Date</option>
                <option value="eventType">Sort by Event Type</option>
              </select>
            </div>

            <div className="form-control">
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange({ sortOrder: e.target.value })}
                className="select select-bordered"
                aria-label="Sort order"
              >
                <option value="asc">Ascending Order</option>
                <option value="desc">Descending Order</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, index) => (
              <TicketCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="alert alert-error shadow-lg mt-6">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {results.map((ticket) => (
                <TicketCard
                  key={ticket._id}
                  ticket={ticket}
                  onClick={() => navigate(`/ticket/${ticket._id}`, { state: { ticket } })}
                />
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