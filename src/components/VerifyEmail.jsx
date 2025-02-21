import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        // Changed to GET request and passing token as query parameter
        const response = await axios.get(`${BASE_URL}/verify-email?token=${token}`);
        
        if (response.data.success) {
          setStatus('success');
          // Redirect to login after 3 seconds
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Email verification failed:', error);
        setStatus('error');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {status === 'verifying' && (
          <div className="space-y-4">
            <div className="loading loading-spinner loading-lg"></div>
            <p className="text-lg">Verifying your email...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="text-success text-5xl">✓</div>
            <h1 className="text-2xl font-bold">Email Verified!</h1>
            <p>Your email has been successfully verified. Redirecting to login...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="text-error text-5xl">✕</div>
            <h1 className="text-2xl font-bold">Verification Failed</h1>
            <p>The verification link is invalid or has expired.</p>
            <button 
              onClick={() => navigate('/login')} 
              className="btn btn-primary"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;