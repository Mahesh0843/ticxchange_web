import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections?.connections || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(BASE_URL + "/user/getConnections", {
        withCredentials: true,
      });
      // Add console.log to debug the response
      console.log("API Response:", res.data);
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error("Error fetching connections:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading) return <div className="text-center my-10 text-white">Loading...</div>;
  if (error) return <div className="text-center my-10 text-white">Error: {error}</div>;
  if (!Array.isArray(connections)) {
    console.error("Connections is not an array:", connections);
    return <div className="text-center my-10 text-white">No connections available</div>;
  }
  if (connections.length === 0) return <h1 className="text-center my-10 text-white">No Connections Found</h1>;

  return (
    <div className="text-center my-10 px-4">
      <h1 className="text-bold text-white text-3xl mb-6">Connections</h1>

      <div className="max-w-3xl mx-auto">
        {connections.map((connection) => {
          const { user, ticket, connectedAt } = connection;
          const connectionDate = new Date(connectedAt).toLocaleDateString();

          return (
            <div
              key={user._id + ticket._id}
              className="flex flex-col md:flex-row items-center justify-between m-4 p-6 rounded-lg bg-base-300 w-full"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                <div className="flex-shrink-0">
                  <img
                    alt={`${user.firstName}'s photo`}
                    className="w-20 h-20 rounded-full object-cover"
                    src={user.photoUrl}
                  />
                </div>
                <div className="text-center md:text-left space-y-2">
                  <h2 className="font-bold text-xl">
                    {user.firstName} {user.lastName}
                  </h2>
                  <div className="text-sm opacity-75">
                    <p>Event: {ticket.eventName}</p>
                    <p>Date: {new Date(ticket.eventDate).toLocaleDateString()}</p>
                    <p>Price: ₹{ticket.price}</p>
                    <p>Connected on: {connectionDate}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0">
              <Link to={`/chat/${user._id}?ticketId=${ticket._id}`}>
                  <button className="btn btn-primary">
                    Chat
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;