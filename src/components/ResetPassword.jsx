import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState('validating');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid reset link. Please request a new password reset.');
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/reset-token`, {
          params: { token }
        });

        if (response.data.success) {
          setStatus('idle');
          setMessage('');
        } else {
          setStatus('error');
          setMessage(response.data.message || 'Invalid reset link');
        }
      } catch (error) {
        console.error('Token validation error:', error);
        setStatus('error');
        setMessage(
          error.response?.data?.message || 
          'This password reset link is invalid or has expired. Please request a new one.'
        );
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match');
      return;
    }

    try {
      setStatus('loading');
      const response = await axios.post(`${BASE_URL}/auth/reset-password`, {
        token,
        newPassword: formData.newPassword
      });

      if (response.data.success) {
        setStatus('success');
        setMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(response.data.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setStatus('error');
      setMessage(
        error.response?.data?.message || 
        'Failed to reset password. Please try again.'
      );
    }
  };

  if (status === 'validating') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
        <div className="max-w-md w-full p-8 bg-base-100 rounded-xl shadow-lg text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
        <div className="max-w-md w-full p-8 bg-base-100 rounded-xl shadow-lg text-center">
          <div className="text-error text-xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-error mb-4">Reset Link Invalid</h2>
          <p className="text-base-content/70 mb-6">{message}</p>
          <button 
            onClick={() => navigate('/forgot-password')}
            className="btn btn-primary"
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="max-w-md w-full p-8 bg-base-100 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Reset Password</h2>
          <p className="mt-2 text-base-content/70">
            Please enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Enter new password"
                required
                disabled={status === 'loading'}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Confirm new password"
                required
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
            className={`btn btn-primary w-full ${status === 'loading' ? 'loading' : ''}`}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;