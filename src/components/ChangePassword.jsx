import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setStatus('error');
      setMessage('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      setStatus('error');
      setMessage('Password must be at least 8 characters long');
      return;
    }

    try {
      setStatus('loading');
      const response = await axios.post(
        `${BASE_URL}/change-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        { withCredentials: true }
      );

      setStatus('success');
      setMessage('Password updated successfully');
      
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-base-100 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Change Password</h2>
          <p className="mt-2 text-base-content/70">
            Enter your current password and new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                required
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="input input-bordered w-full mt-1"
                placeholder="Enter current password"
                disabled={status === 'loading'}
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                required
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="input input-bordered w-full mt-1"
                placeholder="Enter new password"
                minLength="8"
                disabled={status === 'loading'}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="input input-bordered w-full mt-1"
                placeholder="Confirm new password"
                minLength="8"
                disabled={status === 'loading'}
              />
            </div>
          </div>

          {message && (
            <div className={`alert ${status === 'success' ? 'alert-success' : 'alert-error'}`}>
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? (
              <span className="loading loading-spinner"></span>
            ) : (
              'Change Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword; 