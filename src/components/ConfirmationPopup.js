const ConfirmationPopup = ({ customerData, handleConfirmSubmit, handleCancelSubmit }) => (
    <div className="confirmation-popup">
      <div className="popup-content">
        <h3>Please check the details and confirm</h3>
        {Object.entries(customerData).map(([key, value]) => (
          <p key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}</p>
        ))}
        <button className="confirm-btn" onClick={handleConfirmSubmit}>Confirm</button>
        <button className="cancel-btn" onClick={handleCancelSubmit}>Cancel</button>
      </div>
    </div>
  );

  export default ConfirmationPopup;