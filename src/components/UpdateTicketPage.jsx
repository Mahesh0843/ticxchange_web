import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { format } from 'date-fns';

const UpdateTicketPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ticketImage, setTicketImage] = useState(null);
  
  const [formData, setFormData] = useState({
    eventType: '',
    ticketId: '',
    eventName: '',
    eventDate: '',
    seatNumber: '',
    price: '',
    numberOfTickets: '',
    venue: '',
    isAvailable: true,
    location: {
      type: 'Point',
      coordinates: [],
      city: ''
    }
  });

  // Event type options
  const eventTypes = ['MOVIE', 'SPORT', 'EVENT'];

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/tickets/${id}`, {
          withCredentials: true
        });
        const ticket = response.data.data;
        
        // Format date for input
        const formattedDate = format(new Date(ticket.eventDate), "yyyy-MM-dd'T'HH:mm");
        
        setFormData({
          eventType: ticket.eventType || '',
          ticketId: ticket.ticketId,
          eventName: ticket.eventName,
          eventDate: formattedDate,
          seatNumber: ticket.seatNumber,
          price: ticket.price,
          numberOfTickets: ticket.numberOfTickets,
          venue: ticket.venue,
          isAvailable: ticket.isAvailable,
          location: ticket.location || {
            type: 'Point',
            coordinates: [],
            city: ''
          }
        });

        setTicketImage(ticket.imageUrl);
      } catch (error) {
        showToast(error.response?.data?.error || 'Failed to fetch ticket details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await axios.put(
        `${BASE_URL}/tickets/update/${id}`,
        formData,
        { withCredentials: true }
      );

      if (response.data.ticket) {
        showToast('Ticket updated successfully!', 'success');
        setTimeout(() => navigate('/seller/tickets'), 1500);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to update ticket', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${BASE_URL}/tickets/delete/${id}`, {
        withCredentials: true
      });
      showToast('Ticket deleted successfully!', 'success');
      setTimeout(() => navigate('/seller/tickets'), 1500);
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to delete ticket', 'error');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

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

      <div className="card bg-base-100 max-w-4xl mx-auto shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-6">
            <h2 className="card-title text-2xl">Manage Ticket</h2>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="btn btn-error btn-sm"
              disabled={saving || deleting}
            >
              Delete Ticket
            </button>
          </div>

          {/* Ticket Image Display */}
          {ticketImage && (
            <div className="mb-6">
              <label className="label">
                <span className="label-text font-semibold">Ticket Image</span>
              </label>
              <div className="w-full max-w-sm mx-auto">
                <img 
                  src={ticketImage} 
                  alt="Ticket" 
                  className="rounded-lg shadow-md w-full h-auto"
                />
              </div>
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">Event Type *</span>
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select Event Type</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Ticket ID</span>
                </label>
                <input
                  type="text"
                  name="ticketId"
                  value={formData.ticketId}
                  className="input input-bordered"
                  disabled
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
                  min="0"
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

              {/* Location Information */}
              {formData.location && (
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text">Location</span>
                  </label>
                  <div className="bg-base-200 p-4 rounded-lg">
                    <p className="text-sm">
                      <span className="font-semibold">City:</span> {formData.location.city}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-semibold">Coordinates:</span> {formData.location.coordinates.join(', ')}
                    </p>
                  </div>
                </div>
              )}

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Available for Sale</span>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleInputChange}
                    className="checkbox checkbox-primary"
                  />
                </label>
              </div>
            </div>

            <div className="form-control mt-6">
              <button 
                type="submit" 
                className={`btn btn-primary ${saving ? 'loading' : ''}`}
                disabled={saving || deleting}
              >
                {saving ? 'Saving...' : 'Update Ticket'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete Ticket</h3>
            <p className="py-4">Are you sure you want to delete this ticket? This action cannot be undone.</p>
            <div className="modal-action">
              <button 
                className="btn btn-ghost"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button 
                className={`btn btn-error ${deleting ? 'loading' : ''}`}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateTicketPage;