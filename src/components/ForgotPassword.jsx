import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    try {
      setStatus('loading');
      setMessage('');

      const response = await axios.post(`${BASE_URL}/forgot-password`, { email: email.toLowerCase() });

      setStatus('success');
      setMessage(response.data.message);

      // Redirect to login after 5 seconds
      setTimeout(() => {
        navigate('/login');
      }, 5000);

    } catch (error) {
      console.error('Forgot password error:', error);
      setStatus('error');
      setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-base-100 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Forgot Password</h2>
          <p className="mt-2 text-base-content/70">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full mt-1"
              placeholder="Enter your email"
              disabled={status === 'loading'}
            />
          </div>

          {message && (
            <div className={`alert ${status === 'success' ? 'alert-success' : 'alert-error'}`}>
              <span>{message}</span>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              className={`btn btn-primary w-full ${status === 'loading' ? 'loading' : ''}`}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
            </button>

            <Link 
              to="/login"
              className="text-sm text-center hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;