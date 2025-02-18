import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import SellerTicketCard from '../components/SellerTicketCard';

const SellerTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Redux store access with safe optional chaining
  const user = useSelector((store) => store.user?.data?.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError(null);

        // Redirect if not authenticated seller
        if (!user || user?.role !== 'seller') {
          navigate('/login');
          return;
        }

        const response = await axios.get(`${BASE_URL}/seller/tickets`, {
          params: {
            page: pagination.currentPage,
            limit: 10
          },withCredentials: true 
        });

        const { data } = response;
        
        setTickets(data.data.tickets);
        setPagination({
          currentPage: data.data.pagination.currentPage,
          totalPages: data.data.pagination.totalPages,
          totalItems: data.data.pagination.totalItems,
          hasNextPage: data.data.pagination.hasNextPage,
          hasPrevPage: data.data.pagination.hasPrevPage
        });

      } catch (err) {
        console.error('Ticket fetch error:', err);
        // setError('Failed to load tickets. Please try again later.');
        if (err.response?.status === 401) {
            setError('Your session has expired. Please login again.');
            navigate('/login'); // Redirect to login on authentication error
          } else {
            setError('Failed to load tickets. Please try again later.');
          }
        } finally {
          setLoading(false);
        }
    };

    if (user?.role === 'seller') {
      fetchTickets();
    }
  }, [pagination.currentPage, user, navigate]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Your Listed Tickets</h1>
          <button 
            onClick={() => navigate('/createticket')}
            className="btn btn-primary md:w-48"
          >
            Create New Ticket
          </button>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-500 mb-4">
              No tickets found in your account
            </div>
            <button
              onClick={() => navigate('/createticket')}
              className="btn btn-primary"
            >
              List Your First Ticket
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {tickets.map(ticket => (
                <SellerTicketCard 
                  key={ticket._id}
                  ticket={{
                    ...ticket,
                    // Add any additional formatting here
                  }}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-8">
              <div className="join">
                <button
                  className="join-item btn"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </button>
                <button className="join-item btn pointer-events-none">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </button>
                <button
                  className="join-item btn"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SellerTicketsPage;