import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';  // For handling dynamic routes
import './CustomerDetailsPage.css';
import CustomerDetailDropdown from './CustomerDetailDropdown';  // Assume this component exists


const CustomerDetailsPage = () => {
  const { name } = useParams();  // Extract the customer name from URL
  const [customer, setCustomer] = useState(null);  // Store customer details
  const [loading, setLoading] = useState(true);  // Track loading state
  const [error, setError] = useState(null);  // Track errors if any

  // Fetch customer details from API when the component is mounted
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      const authToken = localStorage.getItem('token'); // Get the token from localStorage

      if (!authToken) {
        alert('no authorization token found');
        console.error("No authorization token found.");
        return;
      }

      try {
        const response = await fetch(`https://kugtde.zapto.org/customer_detail/?name=${name}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`, // Add the authorization token in the header
          }
        });
        if (!response.ok) {
          throw new Error('Customer not found');
        }
        const data = await response.json();
        setCustomer(data);  // Set customer data in state
      } catch (error) {
        setError(error.message);  // Set error if something goes wrong
      } finally {
        setLoading(false);  // Set loading to false when fetch is done
      }
    };

    fetchCustomerDetails();
  }, [name]);  // Dependency array ensures fetch happens when 'name' changes

  // If customer details are loading, show a loading message
  if (loading) {
    return <p>Loading customer details...</p>;
  }

  // If there is an error, show an error message
  if (error) {
    return <p>{error}</p>;
  }

  // If no customer is found, show a message
  if (!customer) {
    return <p>Customer not found.</p>;
  }

  // Display customer details
  return (

    <div className="CustomerDetails-page">
      <div className="CustomerDetails-header">
        <div className="CustomerDetails-info">
          <div className="username-container">
            <h2 className="username">{customer.name}</h2>
            <p className="status">{customer.company}</p>
            <p className="status">{customer.contact}</p>
            {/* <p className="status">{customer.address}</p>  Assuming address is part of customer data */}
          </div>
        </div>
      </div>

      {/* Dropdown for selecting additional options */}
      <div className="dropdown-container">
        {/* <h3>Select a DateTime:</h3> */}
        <CustomerDetailDropdown /> {/* Assuming this dropdown is used for additional data */}
      </div>
    </div>

  );
};

export default CustomerDetailsPage;
