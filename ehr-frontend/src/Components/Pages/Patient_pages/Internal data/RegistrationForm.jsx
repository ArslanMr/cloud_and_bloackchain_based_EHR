import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';
import { API_URL } from '../../../../constants/global.js';
import './Patient_RegisterationForm.css';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [cnic, setCnic] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState("");
  const [emergencyContactPhoneNumber, setEmergencyContactPhoneNumber] = useState("");
  const [showModal, setShowModal] = useState(false);
// const [patientDetails, setPatientDetails] = useState("");

  //Model Window value Data:
  const [formData, setFormData] = useState({
    bloodPressure: false,
    familyHistoryBloodPressure: false,
    diabetes: false,
    familyHistoryDiabetes: false,
    hepatitis: false,
    familyHistoryHepatitis: false,
    migrane: false,
    familyHistoryMigrane: false,
    cardiacDisease: false,
    familyHistoryCardiacDisease: false,
    asthma: false,
    familyHistoryAsthma: false,
    tuberculosis: false,
    familyHistoryTuberculosis: false,
    height: '',
    weight: '',
    bloodGroup: '',
  });
  const handleInputChange = (event) => {
    const { name, checked, value } = event.target;

    if (name === 'height' || name === 'weight') {
      setFormData({ ...formData, [name]: value });
    } else if (name === 'bloodGroup') {
      setFormData({ ...formData, bloodGroup: value });
    } else {
      setFormData({ ...formData, [name]: checked });
    }
  };
  

  const handleSubmit = (event) => {
    event.preventDefault();


  const dataToSend = {
    ...formData,
    bloodPressure: formData.bloodPressure ? true : false,
    familyHistoryBloodPressure: formData.familyHistoryBloodPressure ? true : false,
    diabetes: formData.diabetes ? true : false,
    familyHistoryDiabetes: formData.familyHistoryDiabetes ? true : false,
    hepatitis: formData.hepatitis ? true : false,
    familyHistoryHepatitis: formData.familyHistoryHepatitis ? true : false,
    migrane: formData.migrane ? true : false,
    familyHistoryMigrane: formData.familyHistoryMigrane ? true : false,
    cardiacDisease: formData.cardiacDisease ? true : false,
    familyHistoryCardiacDisease: formData.familyHistoryCardiacDisease ? true : false,
    asthma: formData.asthma ? true : false,
    familyHistoryAsthma: formData.familyHistoryAsthma ? true : false,
    tuberculosis: formData.tuberculosis ? true : false,
    familyHistoryTuberculosis: formData.familyHistoryTuberculosis ? true : false,
  };

//Confirm Password Function
          if (password !== confirmPassword) {
      setError('Passwords do not match!');
    } else {
console.log(formData)
    axios.post(`${API_URL}/patient_signup`, {
      name,
      cnic,
      gender,
      dateOfBirth,
      phoneNumber,
      email,
      password,
      homeAddress,
      emergencyContact: {
        Ename: emergencyContactName,
        Erelationship: emergencyContactRelationship,
        EphoneNumber: emergencyContactPhoneNumber
      },
      medicalHistory: dataToSend

      // Add additional form data here
    })
    .then(response => {
      console.log("Signup Response: ", response.data);
      setShowModal(false);
      // Perform any additional actions after successful submission
    })
    .catch(error => {
      console.log("Error in signup: ", error);
    })
    .finally(() => {
      navigate('/Plogin'); // Navigate to another page
    });
  }
  };

  const handleAddDetails = () => {
    setShowModal(true);
  };

  return (
    <div>
      <div className="pftoph">
        <h1>Patient Registration Form</h1>
        <div id="PRForm">
          <form onSubmit={handleSubmit}>
            <div className="Formdiv"></div>
            <label className="PFLabel1">
              Patient Name: <span className='steric'>*</span>
              <input
                className='input1'
                placeholder="Enter Full Name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                onKeyPress={(event) => {
                  const keyCode = event.which || event.keyCode;
                  const keyValue = String.fromCharCode(keyCode);
                  const letterRegex = /^[A-Za-z\s]*$/;
                  if (!letterRegex.test(keyValue)) {
                    event.preventDefault();
                  }
                }}
              />
            </label>
            <br />

            {/* Add other form fields here */}
            <label className="PFLabel1">
        Patient CNIC: <span className='steric'>*</span>
        <input className='input10'
        placeholder="41000000000000"
          type="text"
          value={cnic}
          onChange={(event) => setCnic(event.target.value)}
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
      </label>
      <br />
      <label className="PFLabel1">
        Gender: <span className='steric'>*</span>
        <select className='input2' value={gender} onChange={(event) => setGender(event.target.value)}>
          <option value="">-- Select gender --</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </label>
      <br />
      <label className="PFLabel1">
        Date of Birth: <span className='steric'>*</span>
        <input className='input3'
    type="date"
    value={dateOfBirth}
    onChange={(event) => {
      const selectedDate = event.target.value; // Get the selected date
      const dateParts = selectedDate.split("-"); // Split the date string by dashes
      const year = dateParts[0];
      const month = dateParts[1];
      const day = dateParts[2];
      const formattedDate = `${year}-${month}-${day}`; // Format the date as "YYYY-MM-DD"
      setDateOfBirth(formattedDate); // Set the formatted date in state
    }}
  />
      </label>
      <br />
      <label className="PFLabel1">
        Phone Number: <span className='steric'>*</span>
        <input className='input4'
        placeholder="92000000000"
          type="tel"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          required
          maxLength={12} // Set the maximum length to 13
          onKeyPress={(event) => {
            const keyCode = event.which || event.keyCode;
            const keyValue = String.fromCharCode(keyCode);
            const numericRegex = /^[0-9]{0,13}$/;
            if (!numericRegex.test(keyValue)) {
              event.preventDefault();
            }
          }}/>
      </label>
      <br />
      <label className="PFLabel1">
        Email: <span className='steric'>*</span>
        <input className='input5'
        placeholder="Enter Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <br />
      <label className="PFLabel1">
        Password: <span className='steric'>*</span>
        <input className='input6'
        placeholder="Enter Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <label className='PFLabel1CP' htmlFor="confirmPassword">Confirm Password <span className='steric'>*</span>
        <input
        className='input6CP'
          type="password"
          id="confirmPassword"
          placeholder="Enter Confirm Password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        /></label>
          <br/>
      <br />
      <label className="PFLabel1">
        Address: <span className='steric'>*</span>
        <textarea className='input6'
        placeholder="Enter Complete Address"
          value={homeAddress}
          onChange={(event) => setHomeAddress(event.target.value)}
        />
      </label>
      <br/>
      <h3>Emergency Contact</h3>
      <label className="PFLabel1">
        Name: <span className='steric'>*</span>
        <input className='input7'
        placeholder="Person for contact"
          type="text"
          value={emergencyContactName}
          onChange={(event) => setEmergencyContactName(event.target.value)}
           required
           onKeyPress={(event) => {
            const keyCode = event.which || event.keyCode;
            const keyValue = String.fromCharCode(keyCode);
            const letterRegex = /^[A-Za-z\s]*$/; // Updated regex to allow letters and space
            if (!letterRegex.test(keyValue)) {
              event.preventDefault();
            }
          }}
        />
      </label>
      <br />
      <label className="PFLabel1">
        Relationship: <span className='steric'>*</span>
        <select
  className="input8"
  value={emergencyContactRelationship}
  onChange={(event) => setEmergencyContactRelationship(event.target.value)}
>
  <option value="">-- Select relationship --</option>
  <option value="Parent">Parent</option>
  <option value="Sibling">Sibling</option>
  <option value="Spouse">Spouse</option>
  <option value="Friend">Friend</option>
</select>

      </label>
      <br />
      <label className="PFLabel1">
        Phone Number: <span className='steric'>*</span>
        <input className='input9'
        placeholder="920000000000"
          type="tel"
          value={emergencyContactPhoneNumber}
          onChange={(event) =>
            setEmergencyContactPhoneNumber(event.target.value)
          }
          required
          maxLength={13} // Set the maximum length to 13
          onKeyPress={(event) => {
            const keyCode = event.which || event.keyCode;
            const keyValue = String.fromCharCode(keyCode);
            const numericRegex = /^[0-9]{0,13}$/;
            if (!numericRegex.test(keyValue)) {
              event.preventDefault();
            }
          }}
       />
      </label>
      <br />
      
            <Button type="button" variant="success" onClick={handleAddDetails}>
              Add More Details
            </Button>
          </form>
        </div>
      </div>










{/* Model Window */}
<Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Additional Medical Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <table>
              <thead>
                <tr>
                  <th>Disease</th>
                  <th>Present</th>
                  <th>Family History</th>
                </tr>
              </thead>
              <tbody>
                {/* Add other diseases and fields */}
                <tr>
                  <td>Blood Pressure</td>
                  <td>
  <input type="checkbox" name="bloodPressure" id="bloodPressure" checked={formData.bloodPressure} onChange={handleInputChange} />
</td>
<td>
  <input type="checkbox" name="familyHistoryBloodPressure" id="familyHistoryBloodPressure" checked={formData.familyHistoryBloodPressure} onChange={handleInputChange}/>
</td>
</tr>
<tr>
  <td>Diabetes</td>
  <td>
    <input type="checkbox" name="diabetes" id="diabetes" checked={formData.diabetes} onChange={handleInputChange}/>
  </td>
  <td>
    <input type="checkbox" name="familyHistoryDiabetes" id="familyHistoryDiabetes" checked={formData.familyHistoryDiabetes} onChange={handleInputChange}/>
  </td>
</tr>
<tr>
  <td>Hepatitis</td>
  <td>
    <input type="checkbox" name="hepatitis" id="hepatitis" checked={formData.hepatitis} onChange={handleInputChange}/>
  </td>
  <td>
    <input type="checkbox" name="familyHistoryHepatitis" id="familyHistoryHepatitis" checked={formData.familyHistoryHepatitis} onChange={handleInputChange}/>
  </td>
</tr>
<tr>
  <td>Migrane</td>
  <td>
    <input type="checkbox" name="migrane" id="migrane" checked={formData.migrane} onChange={handleInputChange}/>
  </td>
  <td>
    <input type="checkbox" name="familyHistoryMigrane" id="familyHistoryMigrane" checked={formData.familyHistoryMigrane} onChange={handleInputChange}/>
  </td>
</tr>
<tr>
  <td>Cardiac Disease</td>
  <td>
    <input type="checkbox" name="cardiacDisease" id="cardiacDisease" checked={formData.cardiacDisease} onChange={handleInputChange}/>
  </td>
  <td>
    <input type="checkbox" name="familyHistoryCardiacDisease" id="familyHistoryCardiacDisease" checked={formData.familyHistoryCardiacDisease} onChange={handleInputChange}/>
  </td>
</tr>
<tr>
  <td>Asthma</td>
  <td>
    <input type="checkbox" name="asthma" id="asthma" checked={formData.asthma} onChange={handleInputChange} />
  </td>
  <td>
    <input type="checkbox" name="familyHistoryAsthma" id="familyHistoryAsthma" checked={formData.familyHistoryAsthma} onChange={handleInputChange}/>
  </td>
</tr>
<tr>
  <td>Tuberculosis</td>
  <td>
    <input type="checkbox" name="tuberculosis" id="tuberculosis" checked={formData.tuberculosis} onChange={handleInputChange}/>
  </td>
  <td>
    <input type="checkbox" name="familyHistoryTuberculosis" id="familyHistoryTuberculosis" checked={formData.familyHistoryTuberculosis} onChange={handleInputChange} />
  </td>
</tr>
</tbody>
</table>
{/* Add other details like height, weight, blood group */}
<div>
  <label className="rfml">
    Height (cm):
    <input type="number" name="height" id="height" checked={formData.height} onChange={handleInputChange} required/>
  </label>
</div>
<div>
  <label >
    Weight (kg):
    <input type="number" name="weight" id="weight" checked={formData.weight} onChange={handleInputChange} required/>
  </label>
</div>
<div>
  <label>
    Blood Group:
    <select name="bloodGroup" id="bloodGroup" checked={formData.bloodGroup} onChange={handleInputChange} required>
      <option value="A+">A+</option>
      <option value="A-">A-</option>
      <option value="B+">B+</option>
      <option value="B-">B-</option>
      <option value="AB+">AB+</option>
      <option value="AB-">AB-</option>
      <option value="O+">O+</option>
      <option value="O-">O-</option>
    </select>
  </label>
</div>
{error && <span style={{ color: 'red' }}>{error}</span>}<br/>
<Button type="submit" variant="success">Submit</Button>{' '}
</form>
</Modal.Body>
<Modal.Footer>

</Modal.Footer>
</Modal>
</div>
);
};

export default RegistrationForm;