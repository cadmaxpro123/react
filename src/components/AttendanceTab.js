import React, { useState, useEffect } from 'react';
import './AttendanceTab.css';  // Import the CSS for styling
import mapLogo from '../images/maplogo.png';  // Import the map logo

const AttendanceTab = () => {
  const [Address, setAddress] = useState('');  // State for employee address
  const [locationAccessRequested, setLocationAccessRequested] = useState(false); // Track if location is requested
  const [location, setLocation] = useState(null); // Store the fetched location (latitude and longitude)
  const [popupVisible, setPopupVisible] = useState(false);  // Control visibility of the attendance popup
  const [attendanceLocation, setAttendanceLocation] = useState('');  // Location for attendance
  const [attendanceDateTime, setAttendanceDateTime] = useState('');  // Date/Time for attendance
  const [isAuthorized, setIsAuthorized] = useState(false);  // Check if user is authorized
  const [errorMessage, setErrorMessage] = useState('');  // To display any error messages

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'Address') {
      setAddress(value);
    }
  };

  // Check user authorization (e.g., check if token exists in localStorage)
  const checkAuthorization = () => {
    const token = localStorage.getItem('token'); // Check for token in localStorage
    if (token) {
      setIsAuthorized(true); // If token exists, user is authorized
    } else {
      setIsAuthorized(false); // If no token, user is not authorized
      setErrorMessage('You are not authorized to record attendance. Please log in.');
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setPopupVisible(true); // Show the popup when the button is clicked
    setAddress('');  // Reset the field after submitting
  };

  // Handle click on the map logo to request location
  const handleLocationClick = () => {
    setLocationAccessRequested(true); // Trigger the popup to ask for location access
  };

  // Reverse Geocoding Function (Fetch Address using Latitude and Longitude)
  const reverseGeocode = async (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.display_name; // Return the address
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Address not found';
    }
  };

  // Handle "Allow" location access
  const handleAllowLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setAttendanceLocation(`Lat: ${latitude}, Lon: ${longitude}`);
  
          // Get the address from reverse geocoding
          const currentAddress = await reverseGeocode(latitude, longitude);
          setAddress(currentAddress); // Automatically set the address in the input field
          
          alert('Location Access Granted!');
        },
        (error) => {
          // Enhanced error logging to catch specific geolocation errors
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert('Location access denied by user.');
              break;
            case error.POSITION_UNAVAILABLE:
              alert('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              alert('The request to get user location timed out.');
              break;
            default:
              alert('An unknown error occurred: ' + error.message);
          }
          console.error('Error occurred while fetching location:', error);
        },
        {
          enableHighAccuracy: true,  // Optional: helps to get more accurate location
          timeout: 10000,  // Optional: Timeout for the location request
          maximumAge: 0  // Optional: Prevents using cached location data
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
    setLocationAccessRequested(false); // Hide the location popup after request
  };
  
  // Handle "Deny" location access
  const handleDenyLocation = () => {
    alert('Location Access Denied.');
    setLocationAccessRequested(false); // Hide the popup
  };

  // Handle "Confirm" button on the popup
  const handleConfirmAttendance = async () => {
    // Ensure we have the location and address before submitting
    if (!location) {
      alert('Location is not available.');
      return;
    }

    // Get the address from reverse geocoding if not already available
    const locationAddress = Address || await reverseGeocode(location.latitude, location.longitude);

    const attendanceData = {
      location: `${location.latitude},${location.longitude}`, // Use the current location
      address: locationAddress, // Include the address in the payload
      date_time: new Date().toLocaleString(), // Current date/time
    };

    // Send the data to FastAPI
    fetch('https://kugtde.zapto.org/record_attendance/', {  // Replace with your actual FastAPI URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Include token in the request
      },
      body: JSON.stringify(attendanceData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Attendance Recorded:', data);
        alert('Attendance Recorded!');
      })
      .catch((error) => {
        console.error('Error recording attendance:', error);
        alert('Error recording attendance: ' + error.message);
      });

    setPopupVisible(false); // Hide the popup after confirming
  };

  // Handle "Cancel" button on the popup
  const handleCancelAttendance = () => {
    setPopupVisible(false); // Close the popup without saving
  };

  // Set Date/Time when popup is opened
  useEffect(() => {
    if (popupVisible) {
      setAttendanceDateTime(new Date().toLocaleString()); // Set current date/time when popup is visible
    }
  }, [popupVisible]);

  // Check authorization when the component mounts
  useEffect(() => {
    checkAuthorization(); // Check if user is authorized
  }, []);

  return (
    <div className="attendance-page">
      <h2 className="attendance-header">Employee Attendance</h2>

      {/* Display error message if user is not authorized */}
      {!isAuthorized && <div className="error-message">{errorMessage}</div>}

      {/* Attendance Form */}
      {isAuthorized && (
        <form onSubmit={handleSubmit} className="attendance-form">
          <div className="form-group">
            <div className="input-container">
              <input
                type="text"
                id="Address"
                name="Address"
                placeholder="Enter Address"
                value={Address}
                onChange={handleInputChange}
                required
              />
              {/* Map logo image */}
              <img
                src={mapLogo}
                alt="Map Logo"
                className="map-logo"
                onClick={handleLocationClick} // Trigger location access request on click
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">Record Attendance</button>
        </form>
      )}

      {/* Location Access Popup */}
      {locationAccessRequested && (
        <div className="location-popup">
          <div className="popup-content">
            <h3>Access Your Location</h3>
            <div className="popup-buttons">
              <button onClick={handleAllowLocation} className="allow-btn">Allow</button>
              <button onClick={handleDenyLocation} className="deny-btn">Deny</button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Confirmation Popup */}
      {popupVisible && (
        <div className="attendance-popup">
          <div className="popup-content">
            <h3>Confirm Attendance</h3>
            <div className="popup-fields">
              <div><strong>Location:</strong> {attendanceLocation || 'Not Available'}</div>
              {/* <div><strong>Address:</strong> {Address || 'Not Available'}</div> */}
              <div><strong>Date/Time:</strong> {attendanceDateTime}</div>
            </div>
            <div className="popup-buttons">
              <button onClick={handleConfirmAttendance} className="confirm-btn">Confirm</button>
              <button onClick={handleCancelAttendance} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTab;
