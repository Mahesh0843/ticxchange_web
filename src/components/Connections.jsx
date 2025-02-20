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
import { Link, useParams, useNavigate } from "react-router-dom";
import Chat from "./Chat";

const Connections = () => {
  const { connections, loading, error } = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const { userId } = useParams();

  const fetchConnections = async () => {
    try {
      dispatch(setLoading());
      const res = await axios.get(BASE_URL + "/user/getConnections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data?.data || []));
    } catch (err) {
      console.error("Error fetching connections:", err);
      dispatch(setError(err.message || "Failed to fetch connections"));
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const getFilteredConnections = () => {
    if (!Array.isArray(connections)) return [];

    return connections
      .filter(connection => {
        if (!connection?.user || !connection?.ticket) return false;
        if (filter !== 'all' && connection.status !== filter) return false;
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const userFullName = `${connection.user.firstName || ''} ${connection.user.lastName || ''}`.toLowerCase();
          const eventName = (connection.ticket.eventName || '').toLowerCase();
          return userFullName.includes(searchLower) || eventName.includes(searchLower);
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return `${a.user?.firstName || ''} ${a.user?.lastName || ''}`.localeCompare(
              `${b.user?.firstName || ''} ${b.user?.lastName || ''}`
            );
          case 'event':
            return (a.ticket?.eventName || '').localeCompare(b.ticket?.eventName || '');
          case 'date':
          default:
            return new Date(b.connectedAt || 0) - new Date(a.connectedAt || 0);
        }
      });
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  const filteredConnections = getFilteredConnections();

  return (
    <div className="drawer lg:drawer-open h-screen">
      <input id="connections-drawer" type="checkbox" className="drawer-toggle" />
      
      {/* Sidebar Content */}
      <div className="drawer-side z-10">
        <label htmlFor="connections-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="bg-base-200 w-80 min-h-full flex flex-col">
          {/* Search and Filters Header */}
          <div className="p-4 border-b border-base-300">
            <div className="form-control">
              <input
                type="text"
                placeholder="Search connections..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 mt-2">
              <select 
                className="select select-bordered select-sm flex-1"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="accepted">Active</option>
                <option value="archived">Archived</option>
              </select>
              <select 
                className="select select-bordered select-sm flex-1"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Recent</option>
                <option value="name">Name</option>
                <option value="event">Event</option>
              </select>
            </div>
          </div>

          {/* Connections List */}
          <div className="overflow-y-auto flex-1">
            {filteredConnections.length === 0 ? (
              <div className="p-4 text-center text-base-content/60">
                No connections found
              </div>
            ) : (
              filteredConnections.map((connection) => {
                if (!connection?.user || !connection?.ticket) return null;

                const { user, ticket, connectedAt, status } = connection;
                const isActive = user._id === userId;

                return (
                  <Link 
                    to={`/chat/${user._id}?ticketId=${ticket._id}`}
                    key={`${user._id}-${ticket._id}`}
                    className={`
                      flex items-center gap-3 p-3 hover:bg-base-300 transition-colors
                      border-b border-base-300 cursor-pointer
                      ${isActive ? 'bg-base-300' : ''}
                    `}
                  >
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full">
                        <img 
                          src={user.photoUrl || '/default-avatar.png'} 
                          alt={user.firstName || 'User'} 
                          onError={(e) => {
                            e.target.src = '/default-avatar.png';
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium truncate">
                          {user.firstName || ''} {user.lastName || ''}
                        </h3>
                        <span className="text-xs opacity-50">
                          {connectedAt ? new Date(connectedAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <div className="text-sm opacity-70 truncate">
                        {ticket.eventName || 'No event name'}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`badge badge-sm ${
                          status === 'accepted' ? 'badge-success' : 
                          status === 'archived' ? 'badge-ghost' : 'badge-warning'
                        }`}>
                          {status || 'pending'}
                        </span>
                        <span className="text-xs opacity-50">
                          ₹{ticket.price || 0}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Updated to show Chat */}
      <div className="drawer-content flex flex-col bg-base-100">
        {/* Mobile Header */}
        <div className="lg:hidden navbar bg-base-200">
          <div className="flex-none">
            <label htmlFor="connections-drawer" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Messages</h1>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 h-[calc(100vh-4rem)]">
          {userId ? (
            <Chat />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
                <p>Select a connection to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Connections;


















// import axios from "axios";
// import { BASE_URL } from "../utils/constants";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { addConnections, setLoading, setError } from "../utils/connectionSlice";
// import { Link } from "react-router-dom";

// const Connections = () => {
//   const { connections, loading, error } = useSelector((store) => store.connections);
//   const dispatch = useDispatch();
//   const [filter, setFilter] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortBy, setSortBy] = useState('date');

//   const fetchConnections = async () => {
//     try {
//       dispatch(setLoading());
//       const res = await axios.get(BASE_URL + "/user/getConnections", {
//         withCredentials: true,
//       });
//       console.log("Fetched connections:", res.data.data); // Debug log
//       dispatch(addConnections(res.data.data));
//     } catch (err) {
//       console.error("Error fetching connections:", err);
//       dispatch(setError(err.message));
//     }
//   };

//   useEffect(() => {
//     fetchConnections();
//   }, []);

//   const getFilteredConnections = () => {
//     if (!Array.isArray(connections)) return [];

//     return connections.filter(connection => {
//       // First apply status filter
//       if (filter !== 'all' && connection.status !== filter) {
//         return false;
//       }

//       // Then apply search filter if there's a search term
//       if (searchTerm) {
//         const searchLower = searchTerm.toLowerCase();
//         const userFullName = `${connection.user.firstName} ${connection.user.lastName}`.toLowerCase();
//         const eventName = connection.ticket.eventName.toLowerCase();
        
//         return userFullName.includes(searchLower) || 
//                eventName.includes(searchLower);
//       }

//       return true;
//     }).sort((a, b) => {
//       switch (sortBy) {
//         case 'name':
//           return `${a.user.firstName} ${a.user.lastName}`.localeCompare(
//             `${b.user.firstName} ${b.user.lastName}`
//           );
//         case 'event':
//           return a.ticket.eventName.localeCompare(b.ticket.eventName);
//         case 'date':
//         default:
//           return new Date(b.connectedAt) - new Date(a.connectedAt);
//       }
//     });
//   };

//   if (loading) return <div className="text-center my-10 text-white">Loading...</div>;
//   if (error) return <div className="text-center my-10 text-white">Error: {error}</div>;

//   const filteredConnections = getFilteredConnections();

//   return (
//     <div className="text-center my-10 px-4">
//       <h1 className="text-bold text-white text-3xl mb-6">Connections</h1>

//       {/* Search and Filters */}
//       <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto mb-6">
//         <input
//           type="text"
//           placeholder="Search by name or event..."
//           className="input input-bordered flex-1"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
        
//         <select 
//           className="select select-bordered"
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//         >
//           <option value="all">All Connections</option>
          
//           <option value="accepted">Accepted</option>
//           <option value="pending_archive">Pending Archive</option>
//           <option value="archived">Archived</option>
//         </select>

//         <select 
//           className="select select-bordered"
//           value={sortBy}
//           onChange={(e) => setSortBy(e.target.value)}
//         >
//           <option value="date">Sort by Date</option>
//           <option value="name">Sort by Name</option>
//           <option value="event">Sort by Event</option>
//         </select>
//       </div>

//       {/* Debug info */}
//       <div className="text-white text-sm mb-4">
//         Total Connections: {connections.length} | 
//         Filtered: {filteredConnections.length} | 
//         Filter: {filter} | 
//         Search: {searchTerm}
//       </div>

//       {/* Connection Cards */}
//       <div className="max-w-3xl mx-auto">
//         {filteredConnections.length === 0 ? (
//           <div className="text-white p-4 bg-base-300 rounded-lg">
//             No connections found matching your filters
//           </div>
//         ) : (
//           filteredConnections.map((connection) => {
//             const { user, ticket, connectedAt, status } = connection;
//             const connectionDate = new Date(connectedAt).toLocaleDateString();

//             return (
//               <div
//                 key={user._id + ticket._id}
//                 className="flex flex-col md:flex-row items-center justify-between m-4 p-6 rounded-lg bg-base-300 w-full"
//               >
//                 <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
//                   <div className="flex-shrink-0">
//                     <img
//                       alt={`${user.firstName}'s photo`}
//                       className="w-20 h-20 rounded-full object-cover"
//                       src={user.photoUrl}
//                     />
//                   </div>
//                   <div className="text-center md:text-left space-y-2">
//                     <h2 className="font-bold text-xl">
//                       {user.firstName} {user.lastName}
//                     </h2>
//                     <div className="text-sm opacity-75">
//                       <p>Event: {ticket.eventName}</p>
//                       <p>Date: {new Date(ticket.eventDate).toLocaleDateString()}</p>
//                       <p>Price: ₹{ticket.price}</p>
//                       <p>Connected on: {connectionDate}</p>
//                       <p className="badge badge-outline mt-2">{status}</p>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="mt-4 md:mt-0">
                
//                     <Link to={`/chat/${user._id}?ticketId=${ticket._id}`}>
//                       <button className="btn btn-primary">
//                         Chat
//                       </button>
//                     </Link>
                  
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// };

// export default Connections;
