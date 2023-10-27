import React, { useState, useEffect} from 'react';
import './drmain.css';
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "./firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate,Navigate} from "react-router-dom";
import {API_URL} from '../../../../constants/global';
import { getToken } from '../../../../utils/helpers';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
//import { Document, Page } from 'react-pdf';



const Sidebar = () => {

  const [activeTab, setActiveTab] = useState('DrInfo');
  const [doctorData, setDoctorData] = useState(undefined);
  const navigate = useNavigate();


    useEffect(() => {

      const fetchDoctorProfile = () => {
        axios.get(`${API_URL}/doctor_profile`, {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }})
        .then(response => {
          console.log("doctor profile Response: ", response);
          setDoctorData(response.data)
        })
        .catch(error => {
          console.log("Error in fetching doctor profile: ", error);
        });
  
      }
  
  
      fetchDoctorProfile()
  
  
    }, [])

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const handleLogout = () => {
    // Perform any necessary logout logic here
    // For example, clear user session, remove tokens, etc.
    // Then navigate back to the login page
    navigate('/Drlogin'); // Replace '/login' with the actual login page route
  };
  return (
    <div className="sidebar">
{/* tab containner */}
      <div className="tab-container">

 
      {/* Tabs selection setting */}
      <div>
      <img src="./images/drlogo.png" alt="drlogo"  className='profile-image'/>
      </div>
        <div
          className={`tab ${activeTab === 'DrInfo' ? 'active' : ''}`}
          onClick={() => handleTabClick('DrInfo')}
        >
          Doctor Information
        </div>
        <div
          className={`tab ${activeTab === 'PatientDataAccess' ? 'active' : ''}`}
          onClick={() => handleTabClick('PatientDataAccess')}
        >
          Patient Data Access
        </div>

 {/* Logout Button */}
 <Button type='submit' variant="success" onClick={handleLogout} id='dlobtn'>Logout</Button>
        
      </div>
      <div className="tab-content">
      {activeTab === 'DrInfo' && (
          <DrInfo doctorProfile={doctorData} />
        )}

        {activeTab === 'PatientDataAccess' && (
          <PatientDataAccess />
        )}

        
      </div>
    </div>
  );
};

// tabs data
// Dr Info data
const DrInfo = ({doctorProfile}) => {
  return (
  <div>
      <h1>Doctor Details</h1>
      <table>
      <tbody>
        {doctorProfile && (
          <>
          <tr>
            <td>Doctor Name:</td>
            <td>{doctorProfile.DrName}</td>
          </tr>
          <tr>
            <td>Doctor Email:</td>
            <td>{doctorProfile.DrEmail}</td>
          </tr>
          <tr>
            <td>Phone Number:</td>
            <td>{doctorProfile.PhNmbr}</td>
          </tr>
          <tr>
            <td>Degree:</td>
            <td>{doctorProfile.Degree}</td>
          </tr>
          <tr>
            <td>Specialization:</td>
            <td>{doctorProfile.specialist}</td>
            </tr>
          </>)}

        </tbody>
      </table>
    </div>
  );
};

//Patient data aceess portion
const PatientDataAccess = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [cnic, setCnic] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            handleOTP();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }


  function sendOTP(){
    onCaptchVerify();
    const appVerifier = window.recaptchaVerifier;
    const formatPh = "+" + ph;
    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }


  function handleOTP() {
    setLoading(true);
    axios.post(`${API_URL}/find-patient`,{cnic,ph})
    .then((res)=>{
      const data = res.data;
      sendOTP();
    })
    .catch((error) => {
      setLoading(false);
      setErrorMessage(error.response.data);
      setTimeout(()=>{
        setErrorMessage('');
      },2000)
    }) 
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
       
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  return (
    <section id='optse'>
      <div id='secdiv'>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {user ? (
          <Navigate to="/Pdata" replace={true} state={{cnic}}/>
        ) : (
          <div>
            {showOTP ? (
              <>
                <label htmlFor="otp" id='otplable'>Enter your OTP</label>
                <OtpInput 
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                ></OtpInput>
                <button id='otpbtn' onClick={onOTPVerify}>
                  {loading && <CgSpinner size={20} />}
                  <span id='otpspan'>Verify OTP</span>
                </button>
              </>
            ) : (
              <>
              <h1>Verify OTP</h1>
              <p>To get acces of Patient Records</p>
              <label htmlFor="cnic">Enter your CNIC</label>
              <br/>
                <input
                  type="text"
                  id="cnicotp"
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                   required
         maxLength={13} // Set the maximum length to 13
  onKeyPress={(event) => {
    const keyCode = event.which || event.keyCode;
    const keyValue = String.fromCharCode(keyCode);
    const numericRegex = /^[0-9]{0,13}$/;
    if (!numericRegex.test(keyValue)) {
      event.preventDefault();
    }
  }}/>
              <br/> 
                <label htmlFor="phone" >Enter your phone number</label>
                <PhoneInput country={"pk"} value={ph} onChange={setPh}/>
                <span style={{color:'red'}}>{ errorMessage }</span>
                <button id='otpbtn' onClick={handleOTP}>
                  {loading && <CgSpinner size={20} />}
                  <span>Send code via SMS</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Sidebar;