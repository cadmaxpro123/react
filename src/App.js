import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './SignIn';  // Your sign-in page
import Dashboard from './Dashboard';  // The new page you created
import ProfilePage from './components/ProfilePage'; // Import ProfilePage component
import GenerateBill from './components/GenerateBill';  // Import the GenerateBill component
import CustomerDetailsPage from './components/CustomerDetailsPage';  // Import CustomerDetailsPage component




const App = () => {
  return (
      
    <Router>
      <Routes>
        {/* Define routes for different pages */}
        <Route path="/" element={<SignIn />} />  {/* SignIn page */}
        <Route path="/dashboard" element={<Dashboard />} />  {/* Dashboard page */}
        <Route path="/profile/" element={<ProfilePage />} /> {/* Profile page route */}
        <Route path="/bill" element={<GenerateBill />} /> {/* Profile page route */}
        <Route path="/customer/:name" element={<CustomerDetailsPage />} /> {/* Customer Details route */}
      </Routes>
    </Router>
        
  );
};

export default App;