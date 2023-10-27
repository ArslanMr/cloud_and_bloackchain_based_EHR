import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {API_URL} from '../../../constants/global.js'
import { saveToken } from '../../../utils/helpers.js'
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import './Patient_Login.css';

function PatientLogin() {
  const [cnic, setCnic] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  
  const handleLogin = (event) => {
    event.preventDefault();
    // Here, you can add code to verify the CNIC and password
    // If the verification is successful, navigate to the patient data page
    axios.post(`${API_URL}/patient_login`, { cnic, password })
      .then(response => {
        console.log("Login Response: ", response.data);
        saveToken(response.data.token);
        navigate("/Pdata",{ state:{cnic,usertype:'patient'} });
      })
      .catch(error => {
        console.log("Error in login: ", error);
        setError(error.response.data);
      });
  };


  return (
    <div className="pltoph">
      <h2>Patient Login</h2>
      <div id="PLform">
      <form onSubmit={handleLogin}>
        <label className="PFLabel1">
          CNIC: <span className='steric'>*</span>
          <input className='plinput1'
            type="text"
            value={cnic}
            onChange={(event) => setCnic(event.target.value)}
            required
            maxLength={13} // Set the maximum length to 13
            onKeyPress={(event) => {
              const keyCode = event.which || event.keyCode;
              const keyValue = String.fromCharCode(keyCode);
              const numericRegex = /^[0-9]*$/;
              if (!numericRegex.test(keyValue)) {
                event.preventDefault();
              }
            }}/>
        </label>
        <br />
        <label className="PFLabel1">
          Password: <span className='steric'>*</span>
          <input className='plinput2'
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <br />
        <Button type='submit' variant="success" >Login</Button>{' '}
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
    <p className='PRlink'>
        Don't have an account? <Link to="/Patient_Registeration">Sign up</Link>
      </p>
      <p className="PRlink">Frogot Password? <Link to="/ForgotPassword">Reset</Link></p>
    </div>
  );
}




export default PatientLogin;