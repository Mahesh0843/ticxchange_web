import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import UserCard from './UserCard';
import { BASE_URL } from '../utils/constants';

const EditProfile = ({ user }) => {
  const [formData, setFormData] = useState({
    firstName: user.data?.user?.firstName,
    lastName: user.data?.user?.lastName,
    photoUrl: user.data?.user?.photoUrl,
    phoneNumber: user.data?.user?.phoneNumber || ''
  });
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(''); // 'success' or 'error'
  const dispatch = useDispatch();

  // Toast handler
  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000); // Hide toast after 3 seconds
  };

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      
      const response = await axios.post(`${BASE_URL}/profile/send-otp`, {
        phoneNumber: formData.phoneNumber
      }, { withCredentials: true });

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setShowOtpField(true);
        showToastMessage('OTP sent successfully!', 'success');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to send OTP';
      setError(errorMessage);
      showToastMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      
      const response = await axios.post(`${BASE_URL}/profile/verify-otp`, {
        phoneNumber: formData.phoneNumber,
        code: otp
      }, { withCredentials: true });

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        showToastMessage('Phone number verified successfully!', 'success');
        
        // Get updated profile after verification
        const profileResponse = await axios.get(`${BASE_URL}/profile/view`, {
          withCredentials: true
        });
        
        if (profileResponse.data.success) {
          dispatch(addUser(profileResponse.data.data.user));
          setShowOtpField(false);
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Verification failed';
      setError(errorMessage);
      showToastMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      
      const response = await axios.patch(
        `${BASE_URL}/profile/edit`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          photoUrl: formData.photoUrl
        },
        { withCredentials: true }
      );
      
      if (response.data.message) {
        setSuccessMessage(response.data.message);
        dispatch(addUser(response.data));
        showToastMessage('Profile updated successfully!', 'success');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Update failed';
      setError(errorMessage);
      showToastMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      {/* Toast Notification */}
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className={`alert ${toastType === 'success' ? 'alert-success' : 'alert-error'}`}>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="rounded-lg bg-white shadow-lg flex-1 dark:bg-gray-800">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

          <div className="space-y-6">
          

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                First Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Last Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Profile Photo URL
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                value={formData.photoUrl}
                onChange={(e) =>
                  setFormData({ ...formData, photoUrl: e.target.value })
                }
              />
            </div>

            {/* Phone Number - Read Only */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-600"
                  value={formData.phoneNumber}
                  disabled={true}
                />
                {!user.data?.user?.phoneVerified && (
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSendOTP}
                    disabled={loading || showOtpField}
                  >
                    {loading ? 'Sending...' : 'Verify Phone'}
                  </button>
                )}
                {user.data?.user?.phoneVerified && (
                  <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg dark:bg-green-800 dark:text-green-100">
                    Verified
                  </span>
                )}
              </div>
            </div>

            {/* OTP Verification */}
            {showOtpField && !user.phoneVerified && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Verification Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="4-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length !== 4}
                  >
                    {loading ? 'Verifying...' : 'Confirm'}
                  </button>
                </div>
              </div>
            )}

            <button
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              onClick={handleSaveProfile}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <UserCard user={user} />
    </div>
  );
};

export default EditProfile;