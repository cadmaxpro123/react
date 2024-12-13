import React, { useState } from 'react';
import { useParams } from 'react-router-dom';  // For handling dynamic routes
import './WorkingDataDropdowns.css';
import axios from 'axios';
import { jsPDF } from 'jspdf'; // Import jsPDF
import generateInvoice from './GenerateBill'

const CustomerDetailDropdown = () => {
    const { name } = useParams();  // Extract the customer name from URL
    const [taskData, setTaskData] = useState({});  // Store task data for the selected date
    const [selectedDate, setSelectedDate] = useState('');  // Store selected date

    // Retrieve the authentication token from localStorage or context
    const authToken = localStorage.getItem('token'); // Adjust this if you're using Context or Redux

    // Fetch task data for a specific date when it's selected
    const fetchTaskData = async (date) => {
        if (!authToken) {
            console.error('User is not authenticated. Token is missing.');
            return;
        }

        try {
            const response = await axios.get(`https://kugtde.zapto.org/customer_working/?date=${date}&name=${name}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`, // Attach token to the request header
                }
            });
            console.log('Fetched task data:', response.data); // Check the API response

            const { Department,  ...taskWithoutClient } = response.data;

            // Update taskData for the specific date
            setTaskData((prevData) => ({
                ...prevData,
                [date]: response.data, // Update data for the selected date
            }));
        } catch (error) {
            console.error('Error fetching task data:', error);
        }
    };

    // Handle date selection and fetch task data
    const handleDateChange = (event) => {
        const selectedDate = event.target.value;
        setSelectedDate(selectedDate);
        fetchTaskData(selectedDate);  // Fetch data for the selected date
    };



    return (
        <div className="working-data-container">
            <h2 className="working-data-header">Select Customer Data for a Specific Date</h2>
            
            {/* Date picker for selecting a date */}
            <div className="date-picker-wrapper">
                <label htmlFor="date-picker" className="date-picker-label">Select Date:</label>
                <input
                    type="date"
                    id="date-picker"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="date-picker-input"
                />
            </div>

            {/* Display task data for the selected date */}
            {selectedDate && taskData[selectedDate] && (
                <div className="task-details">
                    <div><strong>Department:</strong> {taskData[selectedDate].Department}</div>
                    <div><strong>Cost:</strong> {taskData[selectedDate].TotalCost || 'N/A'}</div>
                    <div><strong>Working:</strong> {taskData[selectedDate].Working || 'N/A'}</div>
                    <div><strong>Staff:</strong> {taskData[selectedDate].Staff || 'N/A'}</div>
                    <div><strong>Area:</strong> {taskData[selectedDate].TotalArea || 'N/A'}</div>

                    {/* Generate Bill button inside the task details */}
                    <div className="generate-bill-container">
                        <button 
                            onClick={() => generateInvoice(selectedDate)} 
                            className="generate-bill-button"
                        >
                            Generate Bill
                        </button>
                    </div>
                </div>
            )}

            {/* Display message if no task is available for the selected date */}
            {selectedDate && !taskData[selectedDate] && (
                <div className="no-task">
                    No task available for this day.
                </div>
            )}
        </div>
    );
};

export default CustomerDetailDropdown;
