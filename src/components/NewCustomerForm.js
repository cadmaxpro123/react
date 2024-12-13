
const NewCustomerForm = ({ customerData, handleInputChange, handleSubmit, toggleNewCustomerForm }) => (
  <div className="new-customer-form">
    <h3>Register New Customer</h3>
    {['Name', 'Company', 'Contact', 'Address'].map((field) => (
      <div key={field} className="form-group">
        <label>{field}</label>
        <input
          type="text"
          name={field.toLowerCase()}
          className="form-input"
          placeholder={`Enter ${field}`}
          value={customerData[field.toLowerCase()]}
          onChange={handleInputChange}
        />
      </div>
    ))}
    <button className="submit-btn" onClick={handleSubmit}>Submit</button>
    <button className="back-btn" onClick={toggleNewCustomerForm}>Back </button>
  </div>
);

export default NewCustomerForm;