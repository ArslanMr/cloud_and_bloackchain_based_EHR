import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { API_URL } from "../../../constants/global";
import { saveToken } from '../../../utils/helpers.js'
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import './HospitalLogin.css'

function HospitalLogin() {
  const [regNumber, setRegNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Code to validate registration number and password goes here
    // if (isValid) {
      axios.post(`${API_URL}/hospital_login`, { regNumber, password })
      .then(response => {
        console.log("Login Response: ", response.data);
        saveToken(response.data.token);
        navigate("/Hdata");
      })
      .catch(error => {
        console.log("Error in login: ", error);
        setError(error.response.data);
      });
    // } else {
    //   setError("Invalid registration number or password");
    // }
  };
 
  return (
    <div className="hltoph">
         <h1>Hospital Login </h1>
      <div id="hLform" >
   
      <form onSubmit={handleSubmit}>
        <label className="PFLabel1">
          Hospital ID: <span className='steric'>*</span>
          <input className='hlinput1'
            type="text"
            value={regNumber}
            maxLength={6}
            onChange={(event) => setRegNumber(event.target.value)}
            required
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
          <input  className='hlinput2'
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
    <p className='PRlink'>
        Don't have an account? <Link to="/Hospital_Registeration">Sign up</Link>
      </p>
    </div>
  );
}



export default HospitalLogin;
