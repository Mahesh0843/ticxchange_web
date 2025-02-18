// import axios from "axios";
// import { BASE_URL } from "../utils/constants";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { addConnections } from "../utils/connectionSlice";
// import { Link } from "react-router-dom";

// const Connections = () => {
//   const connections = useSelector((store) => store.connections?.connections || []);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const dispatch = useDispatch();

//   const fetchConnections = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await axios.get(BASE_URL + "/user/getConnections", {
//         withCredentials: true,
//       });
//       // Add console.log to debug the response
//       console.log("API Response:", res.data);
//       dispatch(addConnections(res.data.data));
//     } catch (err) {
//       console.error("Error fetching connections:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchConnections();
//   }, []);

//   if (loading) return <div className="text-center my-10 text-white">Loading...</div>;
//   if (error) return <div className="text-center my-10 text-white">Error: {error}</div>;
//   if (!Array.isArray(connections)) {
//     console.error("Connections is not an array:", connections);
//     return <div className="text-center my-10 text-white">No connections available</div>;
//   }
//   if (connections.length === 0) return <h1 className="text-center my-10 text-white">No Connections Found</h1>;

//   return (
//     <div className="text-center my-10 px-4">
//       <h1 className="text-bold text-white text-3xl mb-6">Connections</h1>

//       <div className="max-w-3xl mx-auto">
//         {connections.map((connection) => {
//           const { user, ticket, connectedAt } = connection;
//           const connectionDate = new Date(connectedAt).toLocaleDateString();

//           return (
//             <div
//               key={user._id + ticket._id}
//               className="flex flex-col md:flex-row items-center justify-between m-4 p-6 rounded-lg bg-base-300 w-full"
//             >
//               <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
//                 <div className="flex-shrink-0">
//                   <img
//                     alt={`${user.firstName}'s photo`}
//                     className="w-20 h-20 rounded-full object-cover"
//                     src={user.photoUrl}
//                   />
//                 </div>
//                 <div className="text-center md:text-left space-y-2">
//                   <h2 className="font-bold text-xl">
//                     {user.firstName} {user.lastName}
//                   </h2>
//                   <div className="text-sm opacity-75">
//                     <p>Event: {ticket.eventName}</p>
//                     <p>Date: {new Date(ticket.eventDate).toLocaleDateString()}</p>
//                     <p>Price: ₹{ticket.price}</p>
//                     <p>Connected on: {connectionDate}</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="mt-4 md:mt-0">
//               <Link to={`/chat/${user._id}?ticketId=${ticket._id}`}>
//                   <button className="btn btn-primary">
//                     Chat
//                   </button>
//                 </Link>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Connections;


import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections, setLoading, setError } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const { connections, loading, error } = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const fetchConnections = async () => {
    try {
      dispatch(setLoading());
      const res = await axios.get(BASE_URL + "/user/getConnections", {
        withCredentials: true,
      });
      console.log("Fetched connections:", res.data.data); // Debug log
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error("Error fetching connections:", err);
      dispatch(setError(err.message));
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const getFilteredConnections = () => {
    if (!Array.isArray(connections)) return [];

    return connections.filter(connection => {
      // First apply status filter
      if (filter !== 'all' && connection.status !== filter) {
        return false;
      }

      // Then apply search filter if there's a search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const userFullName = `${connection.user.firstName} ${connection.user.lastName}`.toLowerCase();
        const eventName = connection.ticket.eventName.toLowerCase();
        
        return userFullName.includes(searchLower) || 
               eventName.includes(searchLower);
      }

      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.user.firstName} ${a.user.lastName}`.localeCompare(
            `${b.user.firstName} ${b.user.lastName}`
          );
        case 'event':
          return a.ticket.eventName.localeCompare(b.ticket.eventName);
        case 'date':
        default:
          return new Date(b.connectedAt) - new Date(a.connectedAt);
      }
    });
  };

  if (loading) return <div className="text-center my-10 text-white">Loading...</div>;
  if (error) return <div className="text-center my-10 text-white">Error: {error}</div>;

  const filteredConnections = getFilteredConnections();

  return (
    <div className="text-center my-10 px-4">
      <h1 className="text-bold text-white text-3xl mb-6">Connections</h1>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search by name or event..."
          className="input input-bordered flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select 
          className="select select-bordered"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Connections</option>
          
          <option value="accepted">Accepted</option>
          <option value="pending_archive">Pending Archive</option>
          <option value="archived">Archived</option>
        </select>

        <select 
          className="select select-bordered"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="event">Sort by Event</option>
        </select>
      </div>

      {/* Debug info */}
      <div className="text-white text-sm mb-4">
        Total Connections: {connections.length} | 
        Filtered: {filteredConnections.length} | 
        Filter: {filter} | 
        Search: {searchTerm}
      </div>

      {/* Connection Cards */}
      <div className="max-w-3xl mx-auto">
        {filteredConnections.length === 0 ? (
          <div className="text-white p-4 bg-base-300 rounded-lg">
            No connections found matching your filters
          </div>
        ) : (
          filteredConnections.map((connection) => {
            const { user, ticket, connectedAt, status } = connection;
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
                      <p className="badge badge-outline mt-2">{status}</p>
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
          })
        )}
      </div>
    </div>
  );
};

export default Connections;