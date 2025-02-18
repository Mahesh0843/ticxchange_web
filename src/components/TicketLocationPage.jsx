// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { BASE_URL } from '../utils/constants';

// const TicketLocationPage = () => {
//   const [map, setMap] = useState(null);
//   const [marker, setMarker] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState({ show: false, message: '', type: '' });
//   const { id } = useParams();

//   useEffect(() => {
//     let mapInstance = null;
//     let geocoder = null;
//     let L = null;

//     // Function to load Leaflet library
//     const loadLeaflet = () => {
//       return new Promise((resolve) => {
//         if (typeof window.L !== 'undefined') {
//           resolve();
//           return;
//         }

//         const script = document.createElement('script');
//         script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
//         script.onload = () => {
//           const css = document.createElement('link');
//           css.rel = 'stylesheet';
//           css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
//           document.head.appendChild(css);
//           resolve();
//         };
//         document.body.appendChild(script);
//       });
//     };

//     // Function to load Leaflet Geocoder
//     const loadGeocoder = () => {
//       return new Promise((resolve) => {
//         if (typeof window.L.Control?.Geocoder !== 'undefined') {
//           resolve();
//           return;
//         }

//         const script = document.createElement('script');
//         script.src = 'https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js';
//         script.onload = () => {
//           const css = document.createElement('link');
//           css.rel = 'stylesheet';
//           css.href = 'https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css';
//           document.head.appendChild(css);
//           resolve();
//         };
//         document.body.appendChild(script);
//       });
//     };

//     // Initialize the map and geocoder
//     const initializeMap = () => {
//       L = window.L;
//       mapInstance = L.map('map').setView([0, 0], 2);

//       // Add OpenStreetMap tiles
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '© OpenStreetMap contributors',
//       }).addTo(mapInstance);

//       // Initialize geocoder for location search
//       geocoder = L.Control.geocoder({
//         defaultMarkGeocode: false,
//         position: 'topleft',
//         placeholder: 'Search location...',
//       }).addTo(mapInstance);

//       // Handle geocoder search results
//       geocoder.on('markgeocode', (e) => {
//         const { center } = e.geocode;
//         updateMarker(center.lat, center.lng);
//         mapInstance.setView(center, 13);
//       });

//       // Handle map clicks to place marker
//       mapInstance.on('click', (e) => {
//         const { lat, lng } = e.latlng;
//         updateMarker(lat, lng);
//       });

//       // Set user's current location if available
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const { latitude, longitude } = position.coords;
//             updateMarker(latitude, longitude);
//             mapInstance.setView([latitude, longitude], 13);
//           },
//           (error) => {
//             console.error('Error getting location:', error);
//             showToast('Unable to retrieve your location', 'error');
//           }
//         );
//       }

//       setMap(mapInstance);
//     };

//     // Update or create a marker
//     const updateMarker = (lat, lng) => {
//       if (marker) {
//         marker.setLatLng([lat, lng]);
//       } else {
//         const newMarker = L.marker([lat, lng], { draggable: true }).addTo(mapInstance);
//         newMarker.on('dragend', () => {
//           const position = newMarker.getLatLng();
//           mapInstance.setView(position, mapInstance.getZoom());
//         });
//         setMarker(newMarker);
//       }
//       mapInstance.setView([lat, lng], 13);
//     };

//     // Load resources and initialize the map
//     const loadResources = async () => {
//       try {
//         await loadLeaflet();
//         await loadGeocoder();
//         initializeMap();
//       } catch (error) {
//         console.error('Error loading resources:', error);
//         showToast('Failed to load map resources', 'error');
//       }
//     };

//     loadResources();

//     // Cleanup on unmount
//     return () => {
//       if (mapInstance) {
//         mapInstance.remove();
//       }
//     };
//   }, []);

//   // Show toast notifications
//   const showToast = (message, type) => {
//     setToast({ show: true, message, type });
//     setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
//   };

//   // Handle form submission
//   const handleSubmit = async () => {
//     if (!marker) {
//       showToast('Please select a location on the map', 'error');
//       return;
//     }

//     setLoading(true);
//     const position = marker.getLatLng();

//     try {
//       const response = await axios.put(
//         `${BASE_URL}/tickets/location/${id}`,
//         {
//           coordinates: [position.lng, position.lat], // GeoJSON format
//         },
//         { withCredentials: true }
//       );

//       if (response.data.ticket) {
//         showToast('Location updated successfully!', 'success');
//       }
//     } catch (error) {
//       const errorMsg = error.response?.data?.error || 'Failed to update location';
//       showToast(errorMsg, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-base-200 p-4 md:p-8">
//       {/* Toast Notification */}
//       {toast.show && (
//         <div className="toast toast-top toast-center">
//           <div className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'}`}>
//             <span>{toast.message}</span>
//           </div>
//         </div>
//       )}

//       {/* Map Card */}
//       <div className="card bg-base-100 max-w-4xl mx-auto shadow-xl">
//         <div className="card-body">
//           <h2 className="card-title text-2xl mb-6">Set Ticket Location</h2>
//           <div className="text-sm mb-4">
//             Search for a location or click on the map to place a marker
//           </div>

//           {/* Map Container */}
//           <div id="map" className="w-full h-96 rounded-lg mb-6" style={{ height: '384px' }} />

//           {/* Submit Button */}
//           <div className="form-control mt-6">
//             <button
//               onClick={handleSubmit}
//               className={`btn btn-primary ${loading ? 'loading' : ''}`}
//               disabled={loading || !marker}
//             >
//               {loading ? 'Updating...' : 'Save Location'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// export default TicketLocationPage;





import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const TicketLocationPage = () => {
  const [map, setMap] = useState(null);
  const [hasMarker, setHasMarker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const { id } = useParams();
  const navigate = useNavigate(); // Added navigation hook
  const markerRef = useRef(null);

  useEffect(() => {
    let mapInstance = null;
    let geocoder = null;
    let L = null;

    const loadLeaflet = () => {
      return new Promise((resolve) => {
        if (typeof window.L !== 'undefined') {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
          const css = document.createElement('link');
          css.rel = 'stylesheet';
          css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(css);
          resolve();
        };
        document.body.appendChild(script);
      });
    };

    const loadGeocoder = () => {
      return new Promise((resolve) => {
        if (typeof window.L.Control?.Geocoder !== 'undefined') {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js';
        script.onload = () => {
          const css = document.createElement('link');
          css.rel = 'stylesheet';
          css.href = 'https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css';
          document.head.appendChild(css);
          resolve();
        };
        document.body.appendChild(script);
      });
    };

    const initializeMap = () => {
      L = window.L;
      mapInstance = L.map('map').setView([0, 0], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapInstance);

      geocoder = L.Control.geocoder({
        defaultMarkGeocode: false,
        position: 'topleft',
        placeholder: 'Search location...',
      }).addTo(mapInstance);

      geocoder.on('markgeocode', (e) => {
        const { center, name } = e.geocode;
        updateMarker(center.lat, center.lng);
        mapInstance.setView(center, 13);
        showToast(`Location found: ${name}`, 'success');
      });

      mapInstance.on('click', (e) => {
        const { lat, lng } = e.latlng;
        updateMarker(lat, lng);
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            updateMarker(latitude, longitude);
            mapInstance.setView([latitude, longitude], 13);
          },
          (error) => {
            console.error('Geolocation error:', error);
            showToast('Unable to retrieve your location', 'error');
          }
        );
      }

      setMap(mapInstance);
    };

    const updateMarker = (lat, lng) => {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        const newMarker = L.marker([lat, lng], { draggable: true }).addTo(mapInstance);
        newMarker.on('dragend', () => {
          const position = newMarker.getLatLng();
          mapInstance.setView(position, mapInstance.getZoom());
        });
        markerRef.current = newMarker;
        setHasMarker(true);
      }
      mapInstance.setView([lat, lng], 13);
    };

    const loadResources = async () => {
      try {
        await loadLeaflet();
        await loadGeocoder();
        initializeMap();
      } catch (error) {
        console.error('Resource loading error:', error);
        showToast('Failed to load map resources', 'error');
      }
    };

    loadResources();

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
        setHasMarker(false);
      }
    };
  }, []);

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmit = async () => {
    if (!markerRef.current) {
      showToast('Please select a location first', 'error');
      return;
    }

    setLoading(true);
    const position = markerRef.current.getLatLng();

    try {
      const response = await axios.put(
        `${BASE_URL}/tickets/location/${id}`,
        { coordinates: [position.lng, position.lat] },
        { withCredentials: true }
      );

      if (response.data.ticket) {
        showToast('Location updated successfully!', 'success');
        // Navigate to /lists after successful update
        navigate('/seller/tickets');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to update location';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      {toast.show && (
        <div className="toast toast-top toast-center">
          <div className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="card bg-base-100 max-w-4xl mx-auto shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-6">Set Ticket Location</h2>
          <div className="text-sm mb-4">
            Search for a location or click on the map to place a marker
          </div>

          <div id="map" className="w-full h-96 rounded-lg mb-6" style={{ height: '384px' }} />

          <div className="form-control mt-6">
            <button
              onClick={handleSubmit}
              className={`btn btn-primary ${loading ? 'loading' : ''}`}
              disabled={loading || !hasMarker}
            >
              {loading ? 'Updating...' : 'Save Location'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketLocationPage;




// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { BASE_URL } from '../utils/constants';

// const TicketLocationPage = () => {
//   const [map, setMap] = useState(null);
//   const [marker, setMarker] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState({ show: false, message: '', type: '' });
//   const { id } = useParams();

//   useEffect(() => {
//     let mapInstance = null;
//     let geocoder = null;
//     let L = null;

//     // Function to load Leaflet library
//     const loadLeaflet = () => {
//       return new Promise((resolve) => {
//         if (typeof window.L !== 'undefined') {
//           resolve();
//           return;
//         }

//         const script = document.createElement('script');
//         script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
//         script.onload = () => {
//           const css = document.createElement('link');
//           css.rel = 'stylesheet';
//           css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
//           document.head.appendChild(css);
//           resolve();
//         };
//         document.body.appendChild(script);
//       });
//     };

//     // Function to load Leaflet Geocoder
//     const loadGeocoder = () => {
//       return new Promise((resolve) => {
//         if (typeof window.L.Control?.Geocoder !== 'undefined') {
//           resolve();
//           return;
//         }

//         const script = document.createElement('script');
//         script.src = 'https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js';
//         script.onload = () => {
//           const css = document.createElement('link');
//           css.rel = 'stylesheet';
//           css.href = 'https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css';
//           document.head.appendChild(css);
//           resolve();
//         };
//         document.body.appendChild(script);
//       });
//     };

//     // Initialize the map and geocoder
//     const initializeMap = () => {
//       L = window.L;
//       mapInstance = L.map('map').setView([0, 0], 2);

//       // Add OpenStreetMap tiles
//       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         attribution: '© OpenStreetMap contributors',
//       }).addTo(mapInstance);

//       // Initialize geocoder for location search
//       geocoder = L.Control.geocoder({
//         defaultMarkGeocode: false, // Disable automatic marker placement
//         position: 'topleft', // Position of the search bar
//         placeholder: 'Search for a location...', // Placeholder text
//       }).addTo(mapInstance);

//       // Handle geocoder search results
//       geocoder.on('markgeocode', (e) => {
//         const { center, name } = e.geocode;
//         updateMarker(center.lat, center.lng); // Move the existing marker
//         mapInstance.setView(center, 13); // Zoom to the searched location
//         showToast(`Location found: ${name}`, 'success');
//       });

//       // Handle map clicks to place marker
//       mapInstance.on('click', (e) => {
//         const { lat, lng } = e.latlng;
//         updateMarker(lat, lng); // Move the existing marker
//       });

//       // Set user's current location if available
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const { latitude, longitude } = position.coords;
//             updateMarker(latitude, longitude); // Move the existing marker
//             mapInstance.setView([latitude, longitude], 13);
//           },
//           (error) => {
//             console.error('Error getting location:', error);
//             showToast('Unable to retrieve your location', 'error');
//           }
//         );
//       }

//       setMap(mapInstance);
//     };

//     // Update or move the existing marker
//     const updateMarker = (lat, lng) => {
//       if (marker) {
//         // Move the existing marker
//         marker.setLatLng([lat, lng]);
//       } else {
//         // Create a new marker if it doesn't exist
//         const newMarker = L.marker([lat, lng], { draggable: true }).addTo(mapInstance);
//         newMarker.on('dragend', () => {
//           const position = newMarker.getLatLng();
//           mapInstance.setView(position, mapInstance.getZoom());
//         });
//         setMarker(newMarker);
//       }
//       mapInstance.setView([lat, lng], 13); // Center the map on the marker
//     };

//     // Load resources and initialize the map
//     const loadResources = async () => {
//       try {
//         await loadLeaflet();
//         await loadGeocoder();
//         initializeMap();
//       } catch (error) {
//         console.error('Error loading resources:', error);
//         showToast('Failed to load map resources', 'error');
//       }
//     };

//     loadResources();

//     // Cleanup on unmount
//     return () => {
//       if (mapInstance) {
//         mapInstance.remove();
//       }
//     };
//   }, []);

//   // Show toast notifications
//   const showToast = (message, type) => {
//     setToast({ show: true, message, type });
//     setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
//   };

//   // Handle form submission
//   const handleSubmit = async () => {
//     if (!marker) {
//       showToast('Please select a location on the map', 'error');
//       return;
//     }

//     setLoading(true);
//     const position = marker.getLatLng();

//     try {
//       const response = await axios.put(
//         `${BASE_URL}/tickets/location/${id}`,
//         {
//           coordinates: [position.lng, position.lat], // GeoJSON format
//         },
//         { withCredentials: true }
//       );

//       if (response.data.ticket) {
//         showToast('Location updated successfully!', 'success');
//       }
//     } catch (error) {
//       const errorMsg = error.response?.data?.error || 'Failed to update location';
//       showToast(errorMsg, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-base-200 p-4 md:p-8">
//       {/* Toast Notification */}
//       {toast.show && (
//         <div className="toast toast-top toast-center">
//           <div className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'}`}>
//             <span>{toast.message}</span>
//           </div>
//         </div>
//       )}

//       {/* Map Card */}
//       <div className="card bg-base-100 max-w-4xl mx-auto shadow-xl">
//         <div className="card-body">
//           <h2 className="card-title text-2xl mb-6">Set Ticket Location</h2>
//           <div className="text-sm mb-4">
//             Search for a location or click on the map to place a marker
//           </div>

//           {/* Map Container */}
//           <div id="map" className="w-full h-96 rounded-lg mb-6" style={{ height: '384px' }} />

//           {/* Submit Button */}
//           <div className="form-control mt-6">
//             <button
//               onClick={handleSubmit}
//               className={`btn btn-primary ${loading ? 'loading' : ''}`}
//               disabled={loading || !marker}
//             >
//               {loading ? 'Updating...' : 'Save Location'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TicketLocationPage;