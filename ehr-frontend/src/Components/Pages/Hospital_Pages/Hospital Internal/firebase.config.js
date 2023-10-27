// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "YourAPI_key",
  authDomain: "otp-ehr.firebaseapp.com",
  projectId: "otp-ehr",
  storageBucket: "otp-ehr.appspot.com",
  messagingSenderId: "109026555173",
  appId: "1:109026555173:web:5804092c60991265cf16cc",
  measurementId: "G-CGQWDRB9H0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);