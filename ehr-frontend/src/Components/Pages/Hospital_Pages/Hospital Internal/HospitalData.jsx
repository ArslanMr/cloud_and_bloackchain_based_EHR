import React, { useState, useEffect } from 'react';
import {API_URL} from '../../../../constants/global';
import { getToken } from '../../../../utils/helpers.js'
import axios from 'axios';
import './Hospitaldata.css';
import { generatePassword } from '../Hospital Internal/utils';
import {useNavigate, Navigate } from 'react-router-dom';
import { CgSpinner } from "react-icons/cg";
import Button from 'react-bootstrap/Button';
import OtpInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "./firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";



const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('HostInfo');
  const [hospitalData, setHospitalData] = useState(undefined);
  const [doctors, setDoctors] = useState(undefined);
  const navigate = useNavigate();
  useEffect(() => {


    // hospital info fetch
    const fetchHospitalProfile = () => {
      axios.get(`${API_URL}/hospital_profile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }})
      .then(response => {
        console.log("hospital profile Response: ", response);
        setHospitalData(response.data)
      })
      .catch(error => {
        console.log("Error in fetching hospital profile: ", error);
      });

    }
    fetchHospitalProfile()

//Dr Data fetching
fetch(`${API_URL}/getAlldrdata`, {
  method: 'GET',
  })
  .then(res => res.json())
  .then(data => {
    console.log("Doctor Data: ", data);
    setDoctors(data.data);
  })
  }, [])

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const handleLogout = () => {
    // Perform any necessary logout logic here
    // For example, clear user session, remove tokens, etc.
    // Then navigate back to the login page
    navigate('/HospitalLogin'); // Replace '/login' with the actual login page route
  };


  return (
    <div className="sidebarHos">
      
      <div className="tab-containerHos">
      <div>
      <img src="images/hsopitallogo.png" alt="drlogo"  className='profile-image'/>
      </div>
        <div
          className={`tabHos ${activeTab === 'HostInfo' ? 'active' : ''}`}
          onClick={() => handleTabClick('HostInfo')}
        >
          Hospital Information
        </div>
        <div
          className={`tabHos ${activeTab === 'Drregister' ? 'active' : ''}`}
          onClick={() => handleTabClick('Drregister')}>
          Doctor Registeration
        </div>
        <div
          className={`tabHos ${activeTab === 'PatientDataAccess' ? 'active' : ''}`}
          onClick={() => handleTabClick('PatientDataAccess')}>
          Patient Access
        </div>
      
    {/* Logout Button */}
    <Button type='submit' variant="success" onClick={handleLogout} id='hlobtn'>Logout</Button>


        
      </div>
      <div className="tab-contentHos">
        {activeTab === 'HostInfo' && (
          <HostInfo hospitalprofile={hospitalData} />
        )}
        {activeTab === 'Drregister' && (
          <Drregister doctors={doctors}/>
        )}
        {activeTab === 'PatientDataAccess' && (
          <PatientDataAccess />
        )}
        
      </div>
      
    </div>

  );
};

// tabs data
// Hospital Information
const HostInfo = ({hospitalprofile}) => {
  return (
  <div>
      <h1>Hospital Informtion</h1>
      <table>
        <tbody>
        {hospitalprofile &&(
          <>
          <tr>
            <td>Hospital Name: </td>
            <td>{hospitalprofile.hospitalName}</td>
          </tr>
          <tr>
            <td>Hospital ID</td>
            <td>{hospitalprofile.regNumber}</td>
          </tr>
          <tr>
            <td>State:</td>
            <td>{hospitalprofile.state}</td>
          </tr>
          <tr>
            <td>City:</td>
            <td>{hospitalprofile.city}</td>
          </tr>
          <tr>
            <td> Tel: </td>
            <td>{hospitalprofile.phoneNumber}</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{hospitalprofile.email}</td>
          </tr>
          <tr>
            <td>Address:</td>
            <td>{hospitalprofile.address}</td>
            </tr>
            </>)}
        </tbody>
      </table>
    </div>
  );
};
//Dr Registeration
const Drregister = ({doctors}) => {
  const [hospitalDetails, setHospitalDetails] = useState([]);
  
  const handleSubmit = (event) => {
    event.preventDefault();

    const DrName = event.target.elements.DrName.value;
    const DrCNIC = event.target.elements.DrCNIC.value;
    const DrEmail = event.target.elements.DrEmail.value;
    const PhNmbr = event.target.elements.PhNmbr.value;
    const Degree = event.target.elements.Degree.value;
    const specialist = event.target.elements.specialist.value;

    // Generate a password
    const password = generatePassword();
    console.log(password)

    axios
       .post(`${API_URL}/mailnodemailer`, {
         recipientEmail: DrEmail,
         password: password,
       })
       .then((response) => {
         console.log('Email sent successfully');
         // Handle any additional logic after the email is sent
       })
       .catch((error) => {
         console.error('Failed to send email:', error);
         // Handle any error that occurred during email sending
       });

  

    // Save the details and password to the database
    const newHospitalDetails = [...hospitalDetails, { DrName, DrCNIC, DrEmail, PhNmbr, Degree, specialist, password }];
    setHospitalDetails(newHospitalDetails);

     
  // Send data to the backend server
  fetch(`${API_URL}/doctor_registeration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      DrName,
      DrCNIC,
      DrEmail,
      PhNmbr,
      Degree,
      specialist,
      password
    })
  })
    .then((res) => res.text())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));

 
  // Reset form fields
  event.target.reset();

    // Reset form fields
    event.target.reset();
  };

  return (
    <div >
      <div className="HDR">
      <h1>Doctor Registeration</h1>
      <div >
        {/* Display table of hospital details */}
        <table className='DLlist'>
          <thead>
            <tr>
              <th>Name</th>
              <th>CNIC</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Qualification</th>
              <th>Specialization</th>
            </tr>
          </thead>
          <tbody>
          {doctors.map(dr => {
            return(<tr>
              <td>{dr.DrName}</td>
                <td>{dr.DrCNIC}</td>
                <td>{dr.DrEmail}</td>
                <td>{dr.PhNmbr}</td>
                <td>{dr.Degree}</td>
                <td>{dr.specialist}</td>
            </tr>
            )
          })}
          </tbody>
        </table>
      </div>
      <div className='DRB'>
          <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Add Doctors
          </button>
        </div>
        </div>
      
        {/* Model Window */}
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger" id="exampleModalLabel">Doctor Details</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="DrName" className="form-label">Name <span className='steric'>*</span></label>
                    <input type="text" className="form-control" id="DrName" aria-describedby="emailHelp"  
                    required
                    onKeyPress={(event) => {
            const keyCode = event.which || event.keyCode;
            const keyValue = String.fromCharCode(keyCode);
            const letterRegex = /^[A-Za-z\s]*$/; // Updated regex to allow letters and space
            if (!letterRegex.test(keyValue)) {
              event.preventDefault();
            }
          }}/>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="DrName" className="form-label">CNIC <span className='steric'>*</span></label>
                    <input type="text" className="form-control" id="DrCNIC" aria-describedby="emailHelp"
                     required
                     maxLength={13} // Set the maximum length to 13
              onKeyPress={(event) => {
                const keyCode = event.which || event.keyCode;
                const keyValue = String.fromCharCode(keyCode);
                const numericRegex = /^[0-9]{0,13}$/;
                if (!numericRegex.test(keyValue)) {
                  event.preventDefault();
                }
              }} />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="DrEmail" className="form-label">Email <span className='steric'>*</span></label>
                    <input type="text" className="form-control" id="DrEmail" aria-describedby="emailHelp"  
                    required
                    onKeyPress={(event) => {
            const keyCode = event.which || event.keyCode;
            const keyValue = String.fromCharCode(keyCode);
            const letterRegex = /^[A-Za-z0-9\s!@#$%^&()_+\-=[\]{};':"\\|,.<>/?]$/;
 // Updated regex to allow letters and space
            if (!letterRegex.test(keyValue)) {
              event.preventDefault();
            }
          }}/>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="PhNmbr" className="form-label">Phone Number <span className='steric'>*</span></label>
                    <input type="tel" className="form-control" id="PhNmbr" aria-describedby="emailHelp"
                    required
                    maxLength={11} // Set the maximum length to 13
                    onKeyPress={(event) => {
                      const keyCode = event.which || event.keyCode;
                      const keyValue = String.fromCharCode(keyCode);
                      const numericRegex = /^[0-9]{0,13}$/;
                      if (!numericRegex.test(keyValue)) {
                        event.preventDefault();
                      }
                    }} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="Degree" className="form-label">Qualification <span className='steric'>*</span></label>
                    <input type="text" className="form-control" id="Degree" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="specialist" className="form-label">Specialization <span className='steric'>*</span></label>
                    <input type="text" className="form-control" id="specialist" />
                  </div>
                  <button type="submit" className="btn btn-primary">Submit</button>
                </form>
              </div>
              
            </div>
          </div>
        </div>

    </div>
  );  
};

//Reports Portion

const PatientDataAccess = () => {
  const [otp, setOtp] = useState("");
  const [cnic, setCnic] = useState("");
  const [ph, setPh] = useState("");
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