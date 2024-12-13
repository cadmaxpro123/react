import React from 'react';
import './Popup.css'; // Optional styling for the popup

const Popup = ({ formData, onConfirm, onCancel }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Confirm Submission</h2>
        <div className="popup-content-working">
          {Object.keys(formData).map((key, index) => (
            <p key={index}>
              <strong>{key}:</strong> {formData[key]}
            </p>
          ))}
        </div>
        <div className="popup-actions">
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
