// import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import React, { useState, useEffect } from 'react';


const CustomerSelection = ({ toggleNewCustomerForm }) => {
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const navigate = useNavigate(); // useNavigate replaces useHistory
  const [customers, setCustomers] = useState([]);


  // Handle customer selection
  useEffect(() => {
    const fetchCustomers = async () => {
      const authToken = localStorage.getItem('token'); // Get the token from localStorage

      if (!authToken) {
        alert('no authorization token found');
        console.error("No authorization token found.");
        return;
      }

      try {
        const response = await fetch('https://kugtde.zapto.org/customers/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`, // Add the authorization token in the header
        }
    });
  if (!response.ok) {
    throw new Error('Failed to fetch customers');
  }
  const data = await response.json();
  setCustomers(data); // Store fetched customer data in state
} catch (error) {
  console.error('Error fetching customers:', error);
}
    };

fetchCustomers(); // Call the function to fetch data
  }, []);
const handleCustomerChange = (event) => {
  const customerName = event.target.value;
  setSelectedCustomer(customerName);

  if (customerName !== 'Search...') {
    // Redirect to the customer details page
    
    // console.log(customerName);
    navigate(`/customer/${customerName}`); // Use navigate instead of history.push
  }
};

return (
  <div className="customer-box">
    <label htmlFor="existing-customer" className="select-label">
      Select Existing Customer
    </label>
    <select
      id="existing-customer"
      className="select-customer"
      value={selectedCustomer}
      onChange={handleCustomerChange}
    >
      <option>Search...</option>
      {customers.map((customer) => (
        <option key={customer.name} value={customer.name}>
          {customer.name}
        </option>
      ))}
    </select>
    <div className="or-divider">
      <span>or</span>
    </div>
    <button className="add-customer-btn" onClick={toggleNewCustomerForm}>
      Add a new customer
    </button>
  </div>
);
};

export default CustomerSelection;
