import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // For handling dynamic routes
import './WorkingDataDropdowns.css';
import axios from 'axios';
// import { jsPDF } from 'jspdf'; // Import jsPDF
import generateInvoice from './GenerateBill';

const CustomerDetailDropdown = () => {
    const { name } = useParams(); // Extract the customer name from URL
    const [taskData, setTaskData] = useState({}); // Store task data for the selected date
    const [selectedDate, setSelectedDate] = useState(''); // Store selected date
    const [departments, setDepartments] = useState([]); // Store department names
    const [selectedDepartment, setSelectedDepartment] = useState(''); // Store selected department

    const authToken = localStorage.getItem('token'); // Retrieve the authentication token

    useEffect(() => {
        const fetchDepartments = async () => {
            if (!authToken || !selectedDate) {
                console.error('User is not authenticated or date is not selected');
                setDepartments([]);
                return;
            }
            try {
                const response = await axios.get(`https://kugtde.zapto.org/forms/?date=${selectedDate}&name=${name}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // Attach token to the request header
                    },
                });
                setDepartments(response.data || []); // Update state with department names
            } catch (error) {
                console.error('Error fetching departments:', error);
                setDepartments([]);

            }
        };

        if (selectedDate) {
            fetchDepartments(); // Fetch departments on mount
        }
    }, [authToken, selectedDate, name]);

    const fetchTaskData = async (date, department) => {
        if (!authToken) {
            console.error('User is not authenticated. Token is missing.');
            return;
        }

        try {
            const response = await axios.get(
                `https://kugtde.zapto.org/customer_working/?date=${date}&Department=${department}&name=${name}`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // Attach token to the request header
                    },
                }
            );
            console.log('Fetched task data:', response.data); // Check the API response

            setTaskData((prevData) => ({
                ...prevData,
                [date]: response.data, // Update data for the selected date
            }));
        } catch (error) {
            console.error('Error fetching task data:', error);
        }
    };

    const handleDateChange = (event) => {
        const selectedDate = event.target.value;
        setSelectedDate(selectedDate);
        if (selectedDepartment) {
            fetchTaskData(selectedDate, selectedDepartment);
        }
    };

    const handleDepartmentChange = (event) => {
        const selectedDept = event.target.value;
        setSelectedDepartment(selectedDept);
        if (selectedDate) {
            fetchTaskData(selectedDate, selectedDept);
        }
    };

    return (
        <div className="working-data-container">
            <h2 className="working-data-header">Select Customer Data</h2>

            {/* Date picker and department dropdown container */}
            <div className="input-fields-container">

                {/* Date picker */}
                <div className="field-wrapper">
                    <label htmlFor="date-picker" className="field-label">Select Date:</label>
                    <input
                        type="date"
                        id="date-picker"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="field-input"
                    />
                </div>

                {/* Department dropdown */}
                <div className="field-wrapper">
                <label htmlFor="date-picker" className="field-label">Select Department</label>
                    <select
                        id="department-dropdown"
                        value={selectedDepartment}
                        onChange={handleDepartmentChange}
                        className="field-input"
                        disabled={departments.length === 0} // Disable the dropdown if no departments
                    >   
                        
                        <option value="" disabled>Select Department</option>
                        {departments.length === 0 ? (
                            <option disabled>No departments available</option>
                        ) : (
                                departments.map((dept, index) => (
                                    <option key={index} value={dept}>
                                        {dept}
                                    </option>
                                ))
                            )}
                    </select>
                </div>

                
            </div>

            {/* Display task data for the selected date and department */}
            {selectedDate && taskData[selectedDate] && (
                <div className="task-details">
                    <div><strong>Department:</strong> {taskData[selectedDate].Department}</div>
                    <div><strong>Cost:</strong> {taskData[selectedDate].TotalCost || 'N/A'}</div>
                    <div><strong>Working:</strong> {taskData[selectedDate].Working || 'N/A'}</div>
                    <div><strong>Staff:</strong> {taskData[selectedDate].Staff || 'N/A'}</div>
                    <div><strong>Area:</strong> {taskData[selectedDate].TotalArea || 'N/A'}</div>

                    {/* Generate Bill button */}
                    <div className="generate-bill-container">
                        <button
                            onClick={() => generateInvoice({ selectedDate, taskData })}
                            className="generate-bill-button"
                        >
                            Generate Bill
                        </button>
                    </div>
                </div>
            )}

            {/* Display message if no task is available */}
            {selectedDate && !taskData[selectedDate] && (
                <div className="no-task">
                    No task available for this day.
                </div>
            )}
        </div>
    );
};

export default CustomerDetailDropdown;
