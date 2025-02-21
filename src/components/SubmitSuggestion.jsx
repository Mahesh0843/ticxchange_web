import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useSelector } from 'react-redux';

const SubmitSuggestion = () => {
  const user = useSelector((store) => store.user);
  const location = useLocation();
  const email = user?.data?.user?.email || ''; // Default to empty string if not available
  const [suggestion, setSuggestion] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestionsCount, setSuggestionsCount] = useState(0);
  const [lastSubmissionDate, setLastSubmissionDate] = useState(null);

  useEffect(() => {
    // Check local storage for the last submission date and count
    const storedDate = localStorage.getItem('lastSubmissionDate');
    const storedCount = localStorage.getItem('suggestionsCount');

    if (storedDate) {
      const date = new Date(storedDate);
      const today = new Date();
      // Reset count if the last submission was not today
      if (date.toDateString() !== today.toDateString()) {
        setSuggestionsCount(0);
        localStorage.setItem('suggestionsCount', 0);
      } else {
        setSuggestionsCount(parseInt(storedCount, 10) || 0);
      }
      setLastSubmissionDate(date);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !suggestion) {
      setStatus('error');
      setMessage('Please enter both your email and suggestion');
      return;
    }

    if (suggestionsCount >= 2) {
      setStatus('error');
      setMessage('You have reached the limit of 2 suggestions for today.');
      return;
    }

    try {
      setStatus('loading');
      const response = await axios.post(`${BASE_URL}/submit-suggestion`, 
        { email, suggestion },
        { withCredentials: true }
      );
      console.log('Response:', response);

      // Update suggestions count and last submission date
      const newCount = suggestionsCount + 1;
      setSuggestionsCount(newCount);
      localStorage.setItem('suggestionsCount', newCount);
      localStorage.setItem('lastSubmissionDate', new Date().toISOString());

      setStatus('success');
      setMessage(response.data.message);
      setSuggestion(''); // Clear suggestion input after submission
    } catch (error) {
      console.error('Submit suggestion error:', error);
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to submit suggestion. Please try again.');
    }
  };

  // Ensure the component only renders on the home page
  if (location.pathname !== '/') {
    return null;
  }

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg shadow-lg mt-4 bg-transparent">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <h2 className="text-lg font-semibold">Your feedback matters! Write here...</h2>
        <span className={`transform transition-transform ${isOpen ? 'rotate-90' : ''}`}>➤</span>
      </div>
      {isOpen && (
        <div className="mt-4">
          <p className="text-gray-600 mb-2">We value your feedback! Please share your suggestions below.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              id="suggestion"
              required
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              className="textarea textarea-bordered w-full mt-1"
              placeholder="Enter your suggestion here"
              rows="3"
            />
            {message && (
              <div className={`alert ${status === 'success' ? 'alert-success' : 'alert-error'}`}>
                <span>{message}</span>
              </div>
            )}
            <button
              type="submit"
              className={`btn btn-primary w-full ${status === 'loading' ? 'loading' : ''}`}
              disabled={status === 'loading' || suggestionsCount >2}
            >
              {status === 'loading' ? 'Submitting...' : 'Submit Suggestion'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SubmitSuggestion;