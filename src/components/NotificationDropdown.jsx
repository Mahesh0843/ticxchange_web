import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { 
  setNotifications, 
  addNotification, 
  markAsRead, 
  markAllAsRead,
  setUnreadCount,
  clearNotifications 
} from '../utils/notificationSlice';
import { createSocketConnection } from '../utils/socket';

const NotificationDropdown = () => {
  const dispatch = useDispatch();
  const { items: notifications, unreadCount } = useSelector(state => state.notifications);
  const user = useSelector(state => state.user?.data?.user);

  useEffect(() => {
    if (!user) return;

    const socket = createSocketConnection();
    
    // Listen for new notifications
    socket.on('notification', (notification) => {
      dispatch(addNotification(notification));
    });

    // Fetch initial notifications
    fetchNotifications();
    fetchUnreadCount();

    return () => {
      socket.off('notification');
      socket.disconnect();
    };
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/notifications`, {
        withCredentials: true
      });
      dispatch(setNotifications(response.data));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/notifications/unread/count`, {
        withCredentials: true
      });
      dispatch(setUnreadCount(response.data.count));
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.patch(
        `${BASE_URL}/notifications/${notificationId}/read`,
        {},
        { withCredentials: true }
      );
      dispatch(markAsRead(notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Using the new endpoint that marks as read and deletes
      await axios.patch(`${BASE_URL}/notifications/read-and-delete-all`, {}, {
        withCredentials: true
      });
      
      // Clear all notifications from Redux state
      dispatch(clearNotifications());
    } catch (error) {
      console.error('Error processing notifications:', error);
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unreadCount > 0 && (
            <span className="badge badge-sm indicator-item">{unreadCount}</span>
          )}
        </div>
      </div>
      <div tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-80 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center p-2 border-b">
          <h3 className="font-bold">Notifications</h3>
          {notifications.length > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="btn btn-ghost btn-xs"
            >
              Clear all
            </button>
          )}
        </div>
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification._id}
              onClick={() => handleMarkAsRead(notification._id)}
              className={`p-3 hover:bg-base-200 cursor-pointer ${
                !notification.read ? 'bg-base-200' : ''
              }`}
            >
              <div className="text-sm">{notification.message}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown; 