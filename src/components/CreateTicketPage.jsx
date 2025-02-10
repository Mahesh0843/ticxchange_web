import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const CreateTicketPage = () => {
  const [isManual, setIsManual] = useState(false);
  const [formData, setFormData] = useState({
    ticketId: '',
    eventName: '',
    eventDate: '',
    seatNumber: '',
    price: '',
    numberOfTickets: '1',
    venue: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;
      const config = { withCredentials: true };

      if (isManual) {
        // Manual ticket submission
        response = await axios.post(`${BASE_URL}/tickets/manual`, formData, config);
      } else {
        // Automatic ticket submission with file
        const formData = new FormData();
        formData.append('ticketImage', file);
        response = await axios.post(`${BASE_URL}/tickets/create`, formData, {
          ...config,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (response.data.ticket) {
        showToast('Ticket created successfully!', 'success');
        setTimeout(() => {
          navigate(`/tickets/location/${response.data.ticket._id}`);
        }, 1500);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to create ticket';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      {/* Toast Notification */}
      {toast.show && (
        <div className="toast toast-top toast-center">
          <div className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="card bg-base-100 max-w-2xl mx-auto shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Create New Ticket</h2>
          
          {/* Mode Toggle */}
          <div className="tabs tabs-boxed justify-center mb-6">
            <button 
              className={`tab ${!isManual ? 'tab-active' : ''}`}
              onClick={() => setIsManual(false)}
            >
              📷 Upload Ticket
            </button>
            <button 
              className={`tab ${isManual ? 'tab-active' : ''}`}
              onClick={() => setIsManual(true)}
            >
              ✍️ Manual Entry
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isManual ? (
              // File Upload Section
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Upload Ticket Image</span>
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered file-input-primary w-full"
                  accept="image/*"
                  required
                />
              </div>
            ) : (
              // Manual Entry Form
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Ticket ID</span>
                  </label>
                  <input
                    type="text"
                    name="ticketId"
                    value={formData.ticketId}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Event Name</span>
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Event Date</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Seat Number</span>
                  </label>
                  <input
                    type="text"
                    name="seatNumber"
                    value={formData.seatNumber}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Price</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Number of Tickets</span>
                  </label>
                  <input
                    type="number"
                    name="numberOfTickets"
                    value={formData.numberOfTickets}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    min="1"
                    required
                  />
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Venue</span>
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="input input-bordered"
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-control mt-6">
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Create Ticket'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTicketPage;