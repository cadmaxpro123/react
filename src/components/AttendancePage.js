import React from 'react';
import './AttendancePage.css'; // Ensure to create and style this CSS file if needed

const AttendancePage = () => {
  return (
    <div className="attendance-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form className="attendance-form" style={{ width: '300px', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Enter details here"
          className="attendance-input"
          style={{ width: '100%', padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
      </form>
    </div>
  );
};

export default AttendancePage;
