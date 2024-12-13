import React, { useEffect, useState } from 'react';
import './ProfilePage.css'; // Importing CSS for styling
import WorkingDataDropdowns from './WorkingDataDropdowns'; // Import the WorkingDataDropdowns component

function ProfilePage() {
    // State to store the user data
    const [userData, setUserData] = useState({ username: 'Loading...', jobRole: 'Loading...' });
    const [error, setError] = useState(null); // To track any errors during the fetch

    // Fetch user data from API once the component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            const authToken = localStorage.getItem('token'); // Get the token from localStorage

            if (!authToken) {
                alert('no authorization token found');
                console.error("No authorization token found.");
                return;
            }

            try {
                // Make the API request with the Authorization header
                const response = await fetch('https://kugtde.zapto.org/profile/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authToken}`, // Add the authorization token in the header
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch user data. Status: ${response.status}`);
                }

                const data = await response.json();

                // Set user data once it's fetched
                setUserData({
                    username: data.username,
                    jobRole: data.Jobrole,
                });
            } catch (err) {
                setError('Failed to fetch user data.');
                console.error("Error fetching user data:", err);
            }
        };

        fetchUserData();
    }, []); // Empty dependency array ensures this runs once when the component mounts

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="profile-info">
                    <div className="username-container">
                        <div className="avatar"></div> {/* Optional avatar */}
                        <h1 className="username">{userData.username}</h1>
                        <p className="job-role">{userData.jobRole}</p>
                    </div>
                </div>
            </div>

            {/* Display error if any */}
            {error && <div className="error-message">{error}</div>}

            {/* Container for last 7 days working data */}
            <WorkingDataDropdowns />
        </div>
    );
}

export default ProfilePage;
