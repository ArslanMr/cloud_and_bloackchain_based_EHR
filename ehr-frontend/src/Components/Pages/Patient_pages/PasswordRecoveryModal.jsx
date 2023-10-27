import React, { useState, } from 'react';

import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "./firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate,Navigate} from "react-router-dom";
import UpdatePassword from './UpdatePassword';
//import { Document, Page } from 'react-pdf';

import './Patient_Login.css';


function PasswordRecoveryModal() {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [cnic, setCnic] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
 

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  function onSignup() {
    setLoading(true);
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
          <Navigate to="../UpdatePassword" replace={true} state={{cnic}}/>
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
              <h1>Veify OTP</h1>
              <p>To update your Password</p>
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
                
                <button id='otpbtn' onClick={onSignup}>
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

export default PasswordRecoveryModal;
