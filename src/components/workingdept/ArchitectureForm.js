import React, { useState, useEffect } from 'react';
import Popup from './Popup';
import './WorkingDept.css'; // Ensure correct styling is applied

const ArchitectureForm = () => {
    const [formData, setFormData] = useState({
        ClientName: '', // We'll set this to the selected client name
        BuildingType: '',
        Location: '',
        TotalArea: '',
        TotalCost: '',
        DesignStyle: '',
        Remarks: ''
    });

    const [showPopup, setShowPopup] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [clients, setClients] = useState([]); // To store the client list

    // Fetch clients on mount
    useEffect(() => {
        const fetchClients = async () => {
            const tk = localStorage.getItem('token'); // Retrieve token from localStorage
            if (!tk) {
                alert('No token found');
                console.error('No token found');
                return;
            }

            try {
                const response = await fetch('https://kugtde.zapto.org/customers/', { // Adjust the endpoint to fetch clients
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${tk}`, // Add token to request headers
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setClients(data); // Store client data in state
                } else {
                    console.error('Failed to fetch clients:', data);
                }
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        fetchClients();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowPopup(true); // Show pop-up with form data
    };

    const handleConfirm = async () => {
        try {
            setIsSubmitting(true); // Set submitting state

            const tk = localStorage.getItem('token');
            if (!tk) {
                console.error('No token found');
                alert('No token found. Please login again.');
                return;
            }

            const response = await fetch('https://kugtde.zapto.org/Architecture/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tk}`,
                },
                body: JSON.stringify(formData), // Send form data as JSON
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Architecture submitted:', data);
                setShowPopup(false); // Hide the pop-up after successful submission
                alert('Architecture submitted successfully!');
                setFormData({
                    ClientName: '',
                    BuildingType: '',
                    Location: '',
                    TotalArea: '',
                    TotalCost: '',
                    DesignStyle: '',
                    Remarks: ''
                });
            } else {
                console.error('Submission failed:', data);
                alert('Error submitting Architecture. Please try again.');
            }
        } catch (error) {
            console.error('Error during submission:', error);
            alert('Network error. Please try again.');
        } finally {
            setIsSubmitting(false); // Reset submitting state
        }
    };

    const handleCancel = () => {
        setShowPopup(false);
    };


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="architecture-form">
                    <div className="form-group">
                        <label>Client Name</label>
                        {/* Replace input with select for dropdown */}
                        <select
                            name="ClientName"
                            value={formData.ClientName}
                            onChange={handleChange}
                            className="form-input"
                        >
                            <option value="">Select Client</option> {/* Default option */}
                            {clients.map((client) => (
                                <option key={client.name} value={client.name}>
                                    {client.name} {/* Display client name in dropdown */}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Building Type</label>
                        <input
                            type="text"
                            name="BuildingType"
                            value={formData.BuildingType}
                            className='form-input'
                            onChange={handleChange}
                            placeholder="Enter Building type"
                        />
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            name="Location"
                            value={formData.Location}
                            className='form-input'
                            onChange={handleChange}
                            placeholder="Enter Location"
                        />
                    </div>
                    <div className="form-group">
                        <label>Area</label>
                        <input
                            type="number"
                            name="TotalArea"
                            value={formData.TotalArea}
                            className='form-input'
                            onChange={handleChange}
                            placeholder="Enter Area"
                        />
                    </div>
                    <div className="form-group">
                        <label>Total Cost</label>
                        <input
                            type="number"
                            name="TotalCost"
                            value={formData.TotalCost}
                            className='form-input'
                            onChange={handleChange}
                            placeholder="Enter Total cost"
                        />
                    </div>
                    <div className="form-group">
                        <label>Design Style</label>
                        <input
                            type="text"
                            name="DesignStyle"
                            value={formData.DesignStyle}
                            className='form-input'
                            onChange={handleChange}
                            placeholder="Enter Design style"
                        />
                    </div>
                    <div className="form-group">
                        <label>Remarks</label>
                        <input
                            type="text"
                            name="Remarks"
                            value={formData.Remarks}
                            className='form-input'
                            onChange={handleChange}
                            placeholder="Enter remarks"
                        />
                    </div>
                    <button type="submit" className="submit-btn">Submit</button>
                </div>
            </form>

            {showPopup && (
                <Popup
                    formData={formData}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
};

export default ArchitectureForm;
