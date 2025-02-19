import { useState, useEffect, useCallback, memo } from 'react';
import { Users, Eye, Heart, Github } from 'lucide-react';
import { BASE_URL } from '../utils/constants';
import { v4 as uuidv4 } from 'uuid';

// Constants
const VISITOR_ID_KEY = 'visitorId';
const ANALYTICS_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

const Footer = () => {
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    uniqueVisitors: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async (visitorId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${BASE_URL}/analytics/stats?visitorId=${visitorId}`);
      const { success, data } = await response.json();
      
      if (success) {
        setAnalytics({
          totalViews: data.totalViews,
          uniqueVisitors: data.uniqueVisitors
        });
      } else {
        setError('Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Error fetching analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;
    let intervalId;

    const initializeAnalytics = async () => {
      try {
        let visitorId = localStorage.getItem(VISITOR_ID_KEY);
        if (!visitorId) {
          visitorId = uuidv4();
          localStorage.setItem(VISITOR_ID_KEY, visitorId);
        }

        if (isSubscribed) {
          await fetchAnalytics(visitorId);

          intervalId = setInterval(() => {
            if (isSubscribed) {
              fetchAnalytics(visitorId);
            }
          }, ANALYTICS_REFRESH_INTERVAL);
        }
      } catch (err) {
        console.error('Error initializing analytics:', err);
        if (isSubscribed) {
          setError('Failed to initialize analytics');
          setLoading(false);
        }
      }
    };

    initializeAnalytics();

    return () => {
      isSubscribed = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchAnalytics]);

  return (
    <footer className="bottom-0 left-0 w-full bg-base-200 text-base-content p-4 shadow-md mt-16">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="flex items-center gap-2">
            <Users size={18} />
            <span>Unique Visitors:</span>
            {loading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : error ? (
              <span className="text-error">Error</span>
            ) : (
              <span className="font-semibold">{analytics.uniqueVisitors.toLocaleString()}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Eye size={18} />
            <span>Total Views:</span>
            {loading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : error ? (
              <span className="text-error">Error</span>
            ) : (
              <span className="font-semibold">{analytics.totalViews.toLocaleString()}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            Made with <Heart size={16} className="text-red-500" /> by Mahesh
          </span>
          <span>|</span>
          <a
            href="https://github.com/Mahesh0843"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <Github size={18} />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);