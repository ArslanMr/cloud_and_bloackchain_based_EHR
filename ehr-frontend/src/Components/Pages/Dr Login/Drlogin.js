import React, { useState } from "react";
import {useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import './Drlogin.css';
import {API_URL} from '../../../constants/global.js'
import { saveToken } from '../../../utils/helpers.js'
import axios from 'axios';

function DoctorLogin() {
  const [DrCNIC, setDrCnic] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [userType, setUserType] = useState("");
  const handleLogin = (event) => {
    event.preventDefault();
    // Here, you can add code to verify the CNIC and password
    // If the verification is successful, navigate to the patient data page
    axios.post(`${API_URL}/doctor_login`, { DrCNIC, password })
      .then(response => {
        console.log("Login Response: ", response.data);
        saveToken(response.data.token);
        setUserType('doctor');
        navigate("/DRdata");
      })
      .catch(error => {
        console.log("Error in login: ", error);
        setError(error.response.data);
      });
  };

  return (
    <div className="dltoph">
      <h2>Doctor Login</h2>
      <div id="dLform">
      <form onSubmit={handleLogin}>
        <label className="PFLabel1">
          CNIC: <span className='steric'>*</span>
          <input className='dlinput1'
            type="text" 
            value={DrCNIC}
            onChange={(event) => setDrCnic(event.target.value)}
            required
            maxLength={13} // Set the maximum length to 13
            onKeyPress={(event) => {
              const keyCode = event.which || event.keyCode;
              const keyValue = String.fromCharCode(keyCode);
              const numericRegex = /^[0-9]*$/;
              if (!numericRegex.test(keyValue)) {
                event.preventDefault();
              }
            }}
          />
        </label>
        <br />
        <label className="PFLabel1">
          Password: <span className='steric'>*</span>
          <input className='dlinput2'
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <br />
        <Button type='submit' variant="success">Login</Button>{' '}
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
    <p className='dRlink'>
        Don't have an account? <span className='steric'> Please Contact to Your Hospital </span>
      </p>
    </div>
  );
}

export default DoctorLogin;