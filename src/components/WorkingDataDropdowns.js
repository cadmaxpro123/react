import React, { useState } from 'react';
import './WorkingDataDropdowns.css';
import axios from 'axios';

const WorkingDataDropdowns = () => {
  const [taskData, setTaskData] = useState({}); // Store task data for each date
  const [selectedDays, setSelectedDays] = useState({}); // Store selected day for each date

  // Fetch task data from API for a specific date
  const fetchTaskData = async (date) => {
    const authToken = localStorage.getItem('token'); // Retrieve token from localStorage

    if (!authToken) {
      alert('Authorization token is missing. Please log in.'); //  alert if no token
      return; // Exit early if no token is found
    }

    try {
      const response = await axios.get(`https://kugtde.zapto.org/employee_working/?date=${date}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`, // Add the Authorization header with the token
        },
      });

      console.log('Fetched task data:', response.data);
      setTaskData((prevData) => ({
        ...prevData,
        [date]: response.data, // Store task data for each specific date
      }));
    } catch (error) {
      console.error('Error fetching task data:', error);
      // alert('Failed to fetch task data. Please try again later.'); // alert on error
    }
  };

  // Function to format the date as yyyy-mm-dd
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if month < 10
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if day < 10
    return `${year}-${month}-${day}`; // Return date in yyyy-mm-dd format
  };

  // Generate the date labels (Today, Yesterday, and last 5 days)
  const getDateLabels = () => {
    const dates = [];
    const today = new Date();
    dates.push(formatDate(today)); // Today in yyyy-mm-dd format

    for (let i = 1; i <= 6; i++) {
      const previousDay = new Date(today);
      previousDay.setDate(today.getDate() - i); // Subtract days to get previous dates
      dates.push(formatDate(previousDay)); // Add the previous days to the list
    }

    return dates;
  };

  // Handle dropdown value change for a specific day
  const handleDropdownChange = (event, date) => {
    const day = event.target.value; // Get the selected day from the dropdown
    setSelectedDays((prevState) => ({
      ...prevState,
      [date]: day, // Update the selected day for that specific date
    }));
    fetchTaskData(day); // Fetch the task data for the selected day
  };

  // Get task details for a specific date
  const getTaskForDate = (date) => {
    return taskData[date] || []; // Return tasks for the specific date, or an empty array if none
  };

  const dateLabels = getDateLabels(); // Get last 7 days' date labels

  return (
    <div className="working-data-container">
      <h2 className="working-data-header">Select Working Data for the Last 7 Days</h2>
      <div className="dropdowns-wrapper">
        {dateLabels.map((label) => {
          const taskForDate = getTaskForDate(label); // Get task data for the specific day
          return (
            <div key={label} className="dropdown-container">
              <label htmlFor={label} className="dropdown-label">{label}</label>
              <select
                id={label}
                value={selectedDays[label] || ''} // Set the value of the dropdown to the selected day
                onChange={(event) => handleDropdownChange(event, label)} // Handle change event
                className="dropdown"
              >
                <option value="">Select a day</option>
                <option value={label}>{label}</option>
              </select>

              {/* Display task details directly if a task exists for the day */}
              {selectedDays[label] && taskForDate.length > 0 && (
                <div className="task-details">
                  <div><strong>Department:</strong> {taskForDate[0].Department}</div>
                  <div><strong>Area:</strong> {taskForDate[0].TotalArea}</div>
                  <div><strong>Cost:</strong> {taskForDate[0].TotalCost}</div>
                  <div><strong>Client Name:</strong> {taskForDate[0].ClientName}</div>
                </div>
              )}

              {/* Display message if no task is available for the selected day */}
              {selectedDays[label] && taskForDate.length === 0 && (
                <div className="no-task">
                  No task available for this day.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkingDataDropdowns;
