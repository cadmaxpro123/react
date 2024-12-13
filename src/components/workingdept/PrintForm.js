import React, { useState, useEffect } from 'react';
import Popup from './Popup';
// import '../../Dashboard.css';
import './WorkingDept.css';


const PrintForm = () => {

    const [formData, setFormData] = useState({
        ClientName: '',
        TypeOfPrint: '',
        KhasraNo: '',
        PaperSize: '',
        TotalArea: '',
        TotalCost: '',
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
        setShowPopup(true); // Show popup with form data
    };

    const handleConfirm = async () => {
        try {
            setIsSubmitting(true); // Set submitting state to disable the button

            // Retrieve token from localStorage
            const tk = localStorage.getItem('token');

            // Log the token to the console for debugging
            // console.log('Token retrieved:', tk);

            // Check if the token exists
            if (!tk) {
                console.error('No token found');
                alert('No token found. Please login again.');
                return;
            }

            // Proceed with the fetch request using the token
            const response = await fetch('https://kugtde.zapto.org/Print/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tk}`, // Add authorization header
                },
                body: JSON.stringify(formData), // Send form data as JSON
            });

            const data = await response.json();
            console.log(data);
            if (response.ok) {
                console.log('Print submitted:', data);
                setShowPopup(false); // Hide popup after successful submission
                alert('Print submitted successfully!');


                setFormData({
                    ClientName: '',
                    TypeOfPrint: '',
                    KhasraNo: '',
                    PaperSize: '',
                    TotalArea: '',
                    TotalCost: '',
                    Remarks: ''
                });

            } else {
                console.error('Submission failed:', data);
                alert('Error submitting Print. Please try again.');
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

                <div className="print-form">
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
                        <label>Type Of Print</label>
                        <input type="text" className="form-input" name="TypeOfPrint"
                            value={formData.TypeOfPrint} onChange={handleChange} placeholder="Enter Type of Print" />
                    </div>
                    <div className="form-group">
                        <label>Khasra No.</label>
                        <input type="text" className="form-input" name="KhasraNo"
                            value={formData.KhasraNo} onChange={handleChange} placeholder="Enter Khasra No." />
                    </div>
                    <div className="form-group">
                        <label>Paper Size</label>
                        <input type="text" className="form-input" name="PaperSize"
                            value={formData.PaperSize} onChange={handleChange} placeholder="Enter Paper Size" />
                    </div>
                    <div className="form-group">
                        <label>TotalArea</label>
                        <input type="text" className="form-input" name="TotalArea"
                            value={formData.TotalArea} onChange={handleChange} placeholder="Enter Total Area" />
                    </div>
                    <div className="form-group">
                        <label>Total Cost</label>
                        <input type="text" className="form-input" name="TotalCost"
                            value={formData.TotalCost} onChange={handleChange} placeholder="Enter Total Cost" />
                    </div>
                    <div className="form-group final-field">
                        <label>Remarks</label>
                        <input type="text" className="form-input" name="Remarks"
                            value={formData.Remarks} onChange={handleChange} placeholder="Enter Remarks" />
                    </div>

                    <button className="submit-btn">Submit</button>
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

export default PrintForm;