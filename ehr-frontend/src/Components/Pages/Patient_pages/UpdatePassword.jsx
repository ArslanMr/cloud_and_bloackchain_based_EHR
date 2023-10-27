import React, { useState } from "react";
import './Patient_Login.css';
import Button from 'react-bootstrap/Button';

function UpdatePassword({ onClose }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmedPassword") {
      setConfirmedPassword(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newPassword === confirmedPassword) {
      // Passwords match, proceed with updating the password in the backend
      // Use an API endpoint to update the password using the newPassword state
      // Once the password is updated, close the modal
      // You can pass the onClose function as a prop to this component
      onClose();
    } else {
      // Passwords don't match, handle the error (e.g., show an error message)
      console.log("Passwords do not match!");
    }
  };

  return (
    <div className="pltoph">
      <h2>Password Recovery</h2>
      <div id="PLform">
      <form onSubmit={handleSubmit}>
        <label className="PFLabel1">
          New Password:
          <input
          className='plinput1'
            placeholder="Enter New Password"
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={handlePasswordChange}
            required
          />
        </label >
        <label className="PFLabel1">
          Confirm Password:
          <input
          className='plinput3'
            placeholder="Confirm New Password"
            type="password"
            name="confirmedPassword"
            value={confirmedPassword}
            onChange={handlePasswordChange}
            required
          />
        </label>
         <Button type='submit' variant="success" >Save</Button>{' '}
      </form></div>
    </div>
  );
}

export default UpdatePassword;
