import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import img4 from "../assets/img4.jpg";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { toast } from "react-hot-toast";
import { Toaster } from 'react-hot-toast';

const Chat = () => {
  const { targetUserId } = useParams();
  const [searchParams] = useSearchParams();
  const ticketId = searchParams.get("ticketId");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const user = useSelector((store) => store.user);
  const userId = user?.data?.user?._id;
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const [ticket, setTicket] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processMessage = (messageData) => {
    return {
      senderId: messageData.senderId?._id || messageData.senderId,
      firstName: messageData.senderId?.firstName || messageData.firstName || '',
      lastName: messageData.senderId?.lastName || messageData.lastName || '',
      text: messageData.text,
      timestamp: messageData.timestamp || new Date().toISOString(),
      isOwnMessage: (messageData.senderId?._id || messageData.senderId) === userId,
      messageId: messageData._id || `temp-${Date.now()}`
    };
  };

  const fetchChatMessages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
        params: { ticketId },
        withCredentials: true,
      });

      if (response?.data?.data?.messages) {
        const chatMessages = response.data.data.messages.map(processMessage);
        setMessages(chatMessages);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error fetching messages';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!userId || !targetUserId || !ticketId) return;

    if (!socketRef.current) {
      socketRef.current = createSocketConnection();
      setSocket(socketRef.current);
    }

    fetchChatMessages();

    socketRef.current.emit("joinChat", {
      userId,
      targetUserId,
      ticketId
    });

    socketRef.current.on("newMessage", (message) => {
      if (!message?.text) return;
      addMessageToChat(message);
    });

    socketRef.current.on("messageAcknowledged", (message) => {
      if (!message?.text) return;
      addMessageToChat(message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("newMessage");
        socketRef.current.off("messageAcknowledged");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, targetUserId, ticketId]);

  const addMessageToChat = (messageData) => {
    setMessages(prev => {
      const processedMessage = processMessage(messageData);
      
      const messageExists = prev.some(msg => 
        msg.messageId === processedMessage.messageId ||
        (msg.text === processedMessage.text && 
         new Date(msg.timestamp).getTime() === new Date(processedMessage.timestamp).getTime() && 
         msg.senderId === processedMessage.senderId)
      );

      if (messageExists) return prev;

      return [...prev, processedMessage].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !userId || !socketRef.current) return;
    
    try {
      setError(null);
      const messageData = {
        userId,
        targetUserId,
        ticketId,
        text: newMessage.trim(),
        firstName: user?.data?.user?.firstName,
        lastName: user?.data?.user?.lastName
      };

      setNewMessage("");
      socketRef.current.emit("sendMessage", messageData);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error sending message';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const fetchTicket = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/tickets/${ticketId}`, {
        withCredentials: true
      });
      
      const ticketData = response.data.data || response.data;
      
      if (!ticketData.sellerId || !ticketData.status) {
        throw new Error('Invalid ticket data received');
      }
      
      setTicket(ticketData);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Error fetching ticket details';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchTicket();
    }
  }, [ticketId]);

  const handleMarkAsSold = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await axios.post(
        `${BASE_URL}/tickets/${ticketId}/mark-sold`,
        { buyerId: targetUserId },
        { withCredentials: true }
      );
      
      setTicket(prev => ({
        ...prev,
        status: 'pending'
      }));
      
      toast.success('Ticket marked as pending buyer confirmation');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error marking ticket as sold';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPurchase = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await axios.post(
        `${BASE_URL}/tickets/${ticketId}/confirm`,
        {},
        { withCredentials: true }
      );
      
      setTicket(prev => ({
        ...prev,
        status: 'sold'
      }));
      
      // Show review modal instead of redirecting
      setShowReviewModal(true);
      toast.success('Purchase confirmed successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error confirming purchase';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      const response = await axios.post(
        `${BASE_URL}/ratings/create`,
        {
          ticketId,
          sellerId: ticket.sellerId._id,
          rating,
          comment
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Review submitted successfully');
        setShowReviewModal(false);
        setRating(0);
        setComment("");
        
        setTicket(prev => ({
          ...prev,
          reviewed: true
        }));
      } else {
        throw new Error(response.data.message || 'Failed to submit review');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Error submitting review';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderActionButtons = () => {
    if (!ticket) return null;

    const sellerIdStr = String(ticket.sellerId._id);
    const userIdStr = String(userId);
    const isSeller = sellerIdStr === userIdStr;
    const isBuyer = String(ticket.buyerId) === userIdStr;

    return (
      <div className="flex gap-2">
        {/* Seller buttons */}
        {isSeller && (
          <div>
            {ticket.status === 'available' && (
              <button 
                onClick={handleMarkAsSold} 
                className="btn btn-primary btn-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : '✓ Mark Ticket as Sold'}
              </button>
            )}
          </div>
        )}

        {/* Buyer buttons */}
        {isBuyer && (
          <div>
            {ticket.status === 'pending' ? (
              <button 
                onClick={handleConfirmPurchase} 
                className="btn btn-success btn-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : '✓ Confirm Purchase'}
              </button>
            ) : ticket.status === 'sold' && !ticket.reviewed ? (
              <button 
                onClick={() => setShowReviewModal(true)}
                className="btn btn-secondary btn-lg"
                disabled={isLoading}
              >
                Leave Review
              </button>
            ) : null}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
        <div className="p-5 border-b border-gray-600">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-bold">
              Chat {ticketId && `- Ticket #${ticketId.slice(-4)}`}
            </h1>
            <div className="flex items-center gap-4">
              {ticket && (
                <div className={`badge ${
                  ticket.status === 'available' ? 'badge-info' :
                  ticket.status === 'pending' ? 'badge-warning' :
                  ticket.status === 'sold' ? 'badge-success' :
                  'badge-ghost'
                }`}>
                  {ticket.status?.toUpperCase()}
                </div>
              )}
              {renderActionButtons()}
            </div>
          </div>
        </div>

        {error ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="alert alert-error max-w-md mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-bold">Error</h3>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
              <button 
                onClick={fetchChatMessages} 
                className="btn btn-primary mt-4"
                disabled={isLoading}
              >
                {isLoading ? 'Retrying...' : 'Try Again'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div 
              className="flex-1 overflow-y-auto p-5"
              style={{
                backgroundImage: `url(${img4})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {isLoading && messages.length === 0 ? (
                <div className="text-center">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.messageId}
                    className={`chat ${msg.isOwnMessage ? "chat-end" : "chat-start"}`}
                  >
                    <div className="chat-header">
                      {msg.isOwnMessage ? "You" : `${msg.firstName} ${msg.lastName}`}
                      <time className="text-xs opacity-50 ml-2">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </time>
                    </div>
                    <div className={`chat-bubble ${
                      msg.isOwnMessage ? "chat-bubble-primary" : "chat-bubble-secondary"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-5 border-t border-gray-600 flex items-center gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 input input-bordered"
                disabled={isLoading}
              />
              <button 
                onClick={sendMessage} 
                disabled={!newMessage.trim() || isLoading}
                className="btn btn-primary"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Rate Your Experience</h3>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Rating</span>
              </label>
              <div className="rating rating-lg flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <input
                    key={star}
                    type="radio"
                    name="rating"
                    className="mask mask-star-2 bg-orange-400"
                    checked={rating === star}
                    onChange={() => setRating(star)}
                  />
                ))}
              </div>
              <div className="text-center mt-2 text-sm text-gray-500">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </div>
            </div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Your Review</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="textarea textarea-bordered h-24"
                placeholder="Share your experience..."
              />
            </div>
            <div className="modal-action">
              <button 
                onClick={handleSubmitReview} 
                className="btn btn-primary"
                disabled={isLoading || rating < 1}
              >
                {isLoading ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setRating(0);
                  setComment('');
                }}
                className="btn btn-ghost"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;