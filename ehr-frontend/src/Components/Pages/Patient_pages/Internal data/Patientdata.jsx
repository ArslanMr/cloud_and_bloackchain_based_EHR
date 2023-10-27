import React, { useState, useEffect } from 'react';
import {API_URL} from '../../../../constants/global.js';
import { getToken } from '../../../../utils/helpers.js';
import axios from 'axios';
import './patientdata.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { Buffer } from 'buffer';
import { create } from 'ipfs-http-client';
import Web3 from 'web3';
import Repabi from '../../../../build/contracts/Report.json';
import Surgeryabi from '../../../../build/contracts/Surgeries.json';
import Recordabi from '../../../../build/contracts/Record.json';
import { AiFillFilePdf } from 'react-icons/ai';
import { FcUpload } from 'react-icons/fc';
import { BiSave } from 'react-icons/bi';
import { GrUpdate } from 'react-icons/gr';
import Loader from '../../../../assets/loader.gif'


//import { Document, Page } from 'react-pdf';

const Sidebar = () => {
  const [image, setImage] = useState(null);
  const [activeTab, setActiveTab] = useState('BasicInfo');
  const [userData, setUserData] = useState(undefined);
  const location = useLocation();
  const navigate = useNavigate();
  const cnic = location.state.cnic;
  const user_Type = location.state.usertype;



  useEffect(() => {
    const fetchPatientProfile = () => {
      axios.get(`${API_URL}/patient_profile/${cnic}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }})
      .then(response => {
        console.log("User profile Response: ", response);
        setUserData(response.data)
      })
      .catch(error => {
        console.log("Error in fetching user profile: ", error);
      });
    }
    fetchPatientProfile()
  }, [])

  const handleImageChange = (event) => {
    // setImage(event.target.files[0]);

    // console.log({ userData });
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      setImage(reader.result);
    }

    reader.onerror = () => {
      console.log('Error in uploading image');
    }


  };

  const handleImageUpload = () => {
    axios.post(`${API_URL}/${userData.cnic}/upload-image`, {
      base64Image: JSON.stringify(image)
    }, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })

      .then(response => {
        console.log('Image uploaded successfully:', response.data);
      }
      )
      .catch(error => {
        console.log('Error in uploading image:', error);
      }
      );

  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const handleLogout = () => {
    // Perform any necessary logout logic here
    // For example, clear user session, remove tokens, etc.
    // Then navigate back to the login page
    navigate('/Plogin'); // Replace '/login' with the actual login page route
  };
  return (
    <div className="sidebar">
{/* tab containner */}
      <div className="tab-container">
        {/* iMage Upload Section */}
      
      {/* iMage Upload Section */}

      <div className="profile-image" onClick={() => document.getElementById('upload').click()}>


{image ? (
  <img src={image} alt="Profile" />
) : (
  <img src={userData && userData.profilePicture && JSON.parse(userData.profilePicture)} />
)}
<input id="upload" type="file" onChange={handleImageChange} />
</div>

<button className="btn btn-success" onClick={handleImageUpload}>
Upload
</button>
 
      {/* Tabs selection setting */}
        <div
          className={`tab ${activeTab === 'BasicInfo' ? 'active' : ''}`}
          onClick={() => handleTabClick('BasicInfo')}
        >
          Basic Info
        </div>
        <div
          className={`tab ${activeTab === 'MedicalInfo' ? 'active' : ''}`}
          onClick={() => handleTabClick('MedicalInfo')}
        >
         Medical Info
        </div>
        <div
          className={`tab ${activeTab === 'Reports' ? 'active' : ''}`}
          onClick={() => handleTabClick('Reports')}
        >
          Reports
        </div>
        <div
          className={`tab ${activeTab === 'Surgeries' ? 'active' : ''}`}
          onClick={() => handleTabClick('Surgeries')}
        >
         Surgeries
        </div>

        <div
          className={`tab ${activeTab === 'Record' ? 'active' : ''}`}
          onClick={() => handleTabClick('Record')}
        >
         Record
        </div>


        
 {/* Logout Button */}
 <Button type='submit' variant="success" onClick={handleLogout} id='plobtn'>Logout</Button>
        
      </div>
      <div className="tab-content">
        {activeTab === 'BasicInfo' && (
          <BasicInfo userProfile={userData} userType={user_Type} />
        )}
        {activeTab === 'MedicalInfo' && (
          <MedicalInfo userProfile={userData} userType={user_Type}/>
        )}
        {activeTab === 'Reports' && (
          <Reports userProfile={userData} userType={user_Type}/>
        )}
        {activeTab === 'Surgeries' && (
          <Surgeries userProfile={userData} userType={user_Type}/>
        )}

        {activeTab === 'Record' && (
          <Record userProfile={userData} userType={user_Type}/>
        )}
        
      </div>
    </div>
  );
};

// tabs data
// Basic Info data
const BasicInfo = ({ userProfile}) => {
  return (
  <div>
      <h1>Patient Details</h1>
      <table>
        <tbody>
          {userProfile && (
          <>
          <tr>
            <td>Patient Name:</td>
            <td>{userProfile.name}</td>
          </tr>
          <tr>
            <td>Patient CNIC:</td>
            <td>{userProfile.cnic}</td>
          </tr>
          <tr>
            <td>Gender:</td>
            <td>{userProfile.gender}</td>
          </tr>
          <tr>
          <td>Date of Birth:</td>
                <td>{new Date(userProfile?.dateOfBirth).toDateString()
                }</td>
          </tr>
          <tr>
            <td>Phone Number:</td>
            <td>{userProfile.phoneNumber}</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{userProfile.email}</td>
          </tr>
          <tr>
            <td>Address:</td>
            <td>{userProfile.homeAddress}</td>
          </tr>
          </>)}
          
        </tbody>
      </table>

      <h2>Emergency Contact</h2>
      <table>
        <tbody>
          {userProfile && (<>
            <tr>
            <td>Name:</td>
            <td>{userProfile.emergencyContact.Ename}</td>
          </tr>
          <tr>
            <td>Relationship:</td>
            <td>{userProfile.emergencyContact.Erelationship}</td>
          </tr>
          <tr>
            <td>Phone Number:</td>
            <td>{userProfile.emergencyContact.EphoneNumber}</td>
          </tr>
          </>)}
        </tbody>
      </table>
    </div>
  );
};









//MedicalInfo


const MedicalInfo = ({ userProfile, cnic }) => {
  const [editing, setEditing] = useState(false);
  const [editedConditions, setEditedConditions] = useState({});
  const [editedDisease, setEditedDisease] = useState('');

  const handleEdit = (disease) => {
    setEditing(true);
    setEditedDisease(disease);
    setEditedConditions({ ...editedConditions, [disease]: userProfile.medicalHistory[disease] });
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedDisease('');
    setEditedConditions({});
  };

  const handleSave = () => {
    // Send the updated conditions to the backend
    // You can make an API request here to update the data
    // For simplicity, let's assume it's a synchronous operation
    const updatedMedicalHistory = {
      ...userProfile.medicalHistory,
      ...editedConditions,
    };

    axios
      .put(
        `${API_URL}/patient_medical_history/${userProfile.cnic}`,
        { medicalHistory: updatedMedicalHistory },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      )
      .then((response) => {
        console.log('Medical history updated successfully:', response.data);
        setEditing(false);
        setEditedDisease('');
        window.location.reload();
      })
      .catch((error) => {
        console.log('Error in updating medical history:', error);
        // Handle any error actions if needed
      });
  };

  const handleChange = (disease, value) => {
    setEditedConditions({ ...editedConditions, [disease]: value });
  };

  return (
    <div>
      <h1>Basic Medical Information</h1>
      <div className='meddet'>
        {/* blood group weight height div */}
        <div className='bgw'>
          <table>
            <thead>
              <tr>
                <th>Medical Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {userProfile && (
                <>
                  <tr>
                    <td>Blood Group:</td>
                    <td>{userProfile.medicalHistory.bloodGroup}</td>
                  </tr>
                  <tr>
                    <td>Height(cm):</td>
                    <td>{userProfile.medicalHistory.height}</td>
                  </tr>
                  <tr>
                    <td>Weight(kg):</td>
                    <td>{userProfile.medicalHistory.weight}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
        {/* basic Disease info div */}
        <div className='bdin'>
          <table>
            <thead>
              <tr>
                <th>Disease</th>
                <th>Present</th>
                <th>Family History</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userProfile && (
                <>
                  <tr>
                    <td>Blood Pressure</td>
                    <td>
                      {editing && editedDisease === 'bloodPressure' ? (
                        <select onChange={(e) => handleChange('bloodPressure', e.target.value)}>
                          <option selected disabled>
                            Select
                          </option>
                          <option value='Yes'>Yes</option>
                          <option value='No'>No</option>
                        </select>
                      ) : (
                        userProfile.medicalHistory.bloodPressure ? 'Yes' : 'No'
                      )}
                    </td>
                    <td>
                      {editing && editedDisease === 'bloodPressure' ? (
                        <select onChange={(e) => handleChange('familyHistoryBloodPressure', e.target.value)}>
                          <option selected disabled>
                            Select
                          </option>
                          <option value='Yes'>Yes</option>
                          <option value='No'>No</option>
                        </select>
                      ) : (
                        userProfile.medicalHistory.familyHistoryBloodPressure ? 'Yes' : 'No'
                      )}
                    </td>
                    <td>
                      {editing && editedDisease === 'bloodPressure' ? (
                        <>
                        <Button variant="success" size="sm" className="btn btn-success" onClick={handleSave}>Save</Button>
      <Button variant="success" size="sm" className="btn btn-success" onClick={handleCancel}>Cancel</Button>
                        </>
                      ) : (
                        <button className='btn btn-success' onClick={() => handleEdit('bloodPressure')}>Edit</button>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Diabetes</td>
                    <td>
                      {editing && editedDisease === 'diabetes' ? (
                        <select onChange={(e) => handleChange('diabetes', e.target.value)}>
                          <option selected disabled>
                            Select
                          </option>
                          <option value='Yes'>Yes</option>
                          <option value='No'>No</option>
                        </select>
                      ) : (
                        userProfile.medicalHistory.diabetes ? 'Yes' : 'No'
                      )}
                    </td>
                    <td>
                      {editing && editedDisease === 'diabetes' ? (
                        <select onChange={(e) => handleChange('familyHistoryDiabetes', e.target.value)}>
                          <option selected disabled>
                            Select
                          </option>
                          <option value='Yes'>Yes</option>
                          <option value='No'>No</option>
                        </select>
                      ) : (
                        userProfile.medicalHistory.familyHistoryDiabetes ? 'Yes' : 'No'
                      )}
                    </td>
                    <td>
                      {editing && editedDisease === 'diabetes' ? (
                        <>
                            <Button variant="success" size="sm" className="btn btn-success" onClick={handleSave}>Save</Button>
      <Button variant="success" size="sm" className="btn btn-success" onClick={handleCancel}>Cancel</Button>
                        </>
                      ) : (
                        <button className='btn btn-success' onClick={() => handleEdit('diabetes')}>Edit</button>
                      )}
                    </td>
                  </tr>
                 <tr>
  <td>Hepatitis</td>
  <td>
    {editing && editedDisease === 'hepatitis' ? (
      <select onChange={(e) => handleChange('hepatitis', e.target.value)}>
        <option selected disabled>Select</option>
        <option value='Yes'>Yes</option>
        <option value='No'>No</option>
      </select>
    ) : (
      userProfile.medicalHistory.hepatitis ? 'Yes' : 'No'
    )}
  </td>
  <td>
    {editing && editedDisease === 'hepatitis' ? (
      <select onChange={(e) => handleChange('familyHistoryHepatitis', e.target.value)}>
        <option selected disabled>Select</option>
        <option value='Yes'>Yes</option>
        <option value='No'>No</option>
      </select>
    ) : (
      userProfile.medicalHistory.familyHistoryHepatitis ? 'Yes' : 'No'
    )}
  </td>
  <td>
    {editing && editedDisease === 'hepatitis' ? (
      <>
         <Button variant="success" size="sm" className="btn btn-success" onClick={handleSave}>Save</Button>
      <Button variant="success" size="sm" className="btn btn-success" onClick={handleCancel}>Cancel</Button>
      </>
    ) : (
      <button className='btn btn-success' onClick={() => handleEdit('hepatitis')}>Edit</button>
    )}
  </td>
</tr>
<tr>
  <td>Migraine</td>
  <td>
    {editing && editedDisease === 'migraine' ? (
      <select onChange={(e) => handleChange('migraine', e.target.value)}>
        <option selected disabled>Select</option>
        <option value='Yes'>Yes</option>
        <option value='No'>No</option>
      </select>
    ) : (
      userProfile.medicalHistory.migraine ? 'Yes' : 'No'
    )}
  </td>
  <td>
    {editing && editedDisease === 'migraine' ? (
      <select onChange={(e) => handleChange('familyHistoryMigraine', e.target.value)}>
        <option selected disabled>Select</option>
        <option value='Yes'>Yes</option>
        <option value='No'>No</option>
      </select>
    ) : (
      userProfile.medicalHistory.familyHistoryMigraine ? 'Yes' : 'No'
    )}
  </td>
  <td>
    {editing && editedDisease === 'migraine' ? (
      <>
            <Button variant="success" size="sm" className="btn btn-success" onClick={handleSave}>Save</Button>
      <Button variant="success" size="sm" className="btn btn-success" onClick={handleCancel}>Cancel</Button>
      </>
    ) : (
      <button className='btn btn-success' onClick={() => handleEdit('migraine')}>Edit</button>
    )}
  </td>
</tr>
<tr>
  <td>Cardiac Disease</td>
  <td>
    {editing && editedDisease === 'cardiacDisease' ? (
      <select onChange={(e) => handleChange('cardiacDisease', e.target.value)}>
        <option selected disabled>Select</option>
        <option value='Yes'>Yes</option>
        <option value='No'>No</option>
      </select>
    ) : (
      userProfile.medicalHistory.cardiacDisease ? 'Yes' : 'No'
    )}
  </td>
  <td>
    {editing && editedDisease === 'cardiacDisease' ? (
      <select onChange={(e) => handleChange('familyHistoryCardiacDisease', e.target.value)}>
        <option selected disabled>Select</option>
        <option value='Yes'>Yes</option>
        <option value='No'>No</option>
      </select>
    ) : (
      userProfile.medicalHistory.familyHistoryCardiacDisease ? 'Yes' : 'No'
    )}
  </td>
  <td>
    {editing && editedDisease === 'cardiacDisease' ? (
      <>
       <Button variant="success" size="sm" className="btn btn-success" onClick={handleSave}>Save</Button>
      <Button variant="success" size="sm" className="btn btn-success" onClick={handleCancel}>Cancel</Button>
      </>
    ) : (
      <button className='btn btn-success' onClick={() => handleEdit('cardiacDisease')}>Edit</button>
    )}
  </td>
</tr>
<tr>
  <td>Asthma</td>
  <td>
    {editing && editedDisease === 'asthma' ? (
      <select onChange={(e) => handleChange('asthma', e.target.value)}>
        <option selected disabled>Select</option>
        <option value='Yes'>Yes</option>
        <option value='No'>No</option>
      </select>
    ) : (
      userProfile.medicalHistory.asthma ? 'Yes' : 'No'
    )}
  </td>
  <td>
    {editing && editedDisease === 'asthma' ? (
      <select onChange={(e) => handleChange('familyHistoryAsthma', e.target.value)}>
        <option selected disabled>Select</option>
        <option value='Yes'>Yes</option>
        <option value='No'>No</option>
      </select>
    ) : (
      userProfile.medicalHistory.familyHistoryAsthma ? 'Yes' : 'No'
    )}
  </td>
  <td>
    {editing && editedDisease === 'asthma' ? (
      <>
         <Button variant="success" size="sm" className="btn btn-success" onClick={handleSave}>Save</Button>
      <Button variant="success" size="sm" className="btn btn-success" onClick={handleCancel}>Cancel</Button>
      </>
    ) : (
      <button className='btn btn-success' onClick={() => handleEdit('asthma')}>Edit</button>
    )}
  </td>
</tr>
<tr>
  <td>Tuberculosis</td>
  <td>
    {editing && editedDisease === 'tuberculosis' ? (
      <select onChange={(e) => handleChange('tuberculosis', e.target.value)}>
        <option selected disabled>Select</option>
        <option value='Yes'>Yes</option>
        <option value='No'>No</option>
      </select>
    ) : (
      userProfile.medicalHistory.tuberculosis ? 'Yes' : 'No'
    )}
  </td>
  <td>
    {editing && editedDisease === 'tuberculosis' ? (
      <select onChange={(e) => handleChange('familyHistoryTuberculosis', e.target.value)}>
        <option selected disabled>Select</option>
        <option value='Yes'>Yes</option>
        <option value='No'>No</option>
      </select>
    ) : (
      userProfile.medicalHistory.familyHistoryTuberculosis ? 'Yes' : 'No'
    )}
  </td>
  <td>
    {editing && editedDisease === 'tuberculosis' ? (
      <>
        <Button variant="success" size="sm" className="btn btn-success" onClick={handleSave}>Save</Button>
      <Button variant="success" size="sm" className="btn btn-success" onClick={handleCancel}>Cancel</Button>
      </>
    ) : (
      <button className='btn btn-success' onClick={() => handleEdit('tuberculosis')}>Edit</button>
    )}
  </td>
</tr>

                </>
              )}
            </tbody>
          </table>
        </div>
        <br />
      </div>
    </div>
  );
};



// pdf Viewer
// function PDFViewer({ url }) {
//   const openPDFInNewTab = () => {
//     window.open(url);
//   };
//   return (
//     <div>
//       <button onClick={openPDFInNewTab}>Download Report</button>
//     </div>
//   );
// }











//Reports Portion
const Reports = ({ userType,userProfile }) => {

  // const [reports, setReports] = useState([]);
  const [fileData, setFileData] = useState({name:'', last_modified:''});
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [uniqueId, setUniqueId] = useState(userProfile.cnic);
  // const [uniqueId, setUniqueId] = useState();
  const [buffer, setBuffer] = useState(null);
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [imageDate, setImageDate] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [imageMetadata, setImageMetadata] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');

  
//IPFS Connection
const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    Authorization: `Basic ${btoa('2REKyCxzyodlsnXXh3MeM9oxs67:5467ab13b2ae0877ac7a2ba2ab5b33c9')}`,
  },
});




//Capture file and load the current date
const captureFile = (event) => {
  event.preventDefault();
  const file = event.target.files[0];
  const reader = new window.FileReader();
  reader.readAsArrayBuffer(file);
  reader.onloadend = () => {
    const arrayBuffer = reader.result;
    const buffer = Buffer.from(arrayBuffer);
    setBuffer(buffer);

     // Set the current date
  const currentDate = new Date().toLocaleDateString();
  setImageDate(currentDate);
  };
};


// Form Submit Operation
const onSubmit = async (event) => {
event.preventDefault();
console.log('Submitting file to IPFS...');
try {
  const result = await ipfs.add(buffer);
  console.log('IPFS result', result);
  const hash = result.path;
  console.log('IPFS hash', hash);

  const requestData = {
    hash: hash,
    uniqueId: uniqueId,
    date: imageDate,
    fileName: imageFileName,
  };

  // Make a POST request to your backend API endpoint to save the hash and associated data
  await axios.post(`${API_URL}/uploadreport`, requestData);

  setImage(hash);
  setBuffer(null);
  setUniqueId('');
  setImageDate('');
  setImageFileName('');
} catch (error) {
  console.error('Error uploading file to IPFS:', error);
}
};

// Function to retrieve report data based on unique ID
const retrieveReportData = (uniqueId) => {
axios
  .get(`${API_URL}/getreport/${uniqueId}`)
  .then((response) => {
    const reportData = response.data;
    setImages(reportData.map((report) => report.hash));
    setImageMetadata(reportData.map((report) => [report.date, report.fileName]));
 
    // Perform any further processing or display logic here
  })
  .catch((error) => {
    console.error('Error retrieving report data:', error);
  });
};

// Get the unique ID from the userProfile or any other source
useEffect(() => {
retrieveReportData(uniqueId);
}, [uniqueId]);



const openImage = (index) => {
  const selectedImageHash = images[index];
  setSelectedImage(selectedImageHash);


};

const handleIconClick = () => {
  // Perform the same logic as before when the icon was clicked
  // For example, you can trigger the file input click event
  const fileInput = document.getElementById("file");
  fileInput.click();
};



  return (
    <div className="report-page">
      <div className="report-table">
        <h1 className='titl'>Reports</h1>
        {/* <ul>
            {images.map((hash, index) => (
              <li key={index}>
                <p>Date: {imageMetadata[index][1]}</p>
                <p>File Name: {imageMetadata[index][2]}</p>
                 <img src={`https://ipfs.io/ipfs/${hash}`} alt="Retrieved" /> 
                <button onClick={() => openImage(index)}>View</button>
              </li>
            ))}
          </ul> */}
        <table>
          <thead>
            <tr>
              <th>Actions</th>
              <th>Date</th>
              <th>Report</th>
            </tr>
          </thead>
          <tbody>
               {/* { userType!=="patient"? (  */}
              <tr>
                <td>
{/* chnages */}
                <form onSubmit={onSubmit}>
                {/* <input type="file" onChange={captureFile} /> */}
                <div>
                      <label htmlFor="file" className="PRLabel1"> <button  className='btn btn-sm btn-success' onClick={handleIconClick}>
          Upload Reports
        </button>
        <input type="file" name="file" id="file" 
                        accept=".doc,.docx,.xls,.xlsx,.pdf"
                        onChange={captureFile}/>

                      <input
                      className='prinput1'
                        type="text"
                        placeholder="Report Name"
                        value={imageFileName}
                        onChange={(e) => setImageFileName(e.target.value)}/
                        >
                               <button type="submit" id="prsbtn" className='btn btn-sm btn-success' onClick={onSubmit}>
    Submit
  </button>
                        </label>
                    
                      </div>
                   
                </form>
            
                </td>
                <td>{fileData.name}</td>
                <td>{fileData.last_modified}</td>
              </tr>
              {/* ) : null
              }   */}
              {/* { 
                reports?(
                reports.map( report => 
                  (<tr>
                    <td> 
                      <PDFViewer url={`${API_URL}/uploads/reports/${report.file}`}/>
                    </td>
                    <td>{report.date}</td>
                    <td>{report.name}</td>
                  </tr>) 
                )): null
              } */}
              {/* <h2>Retrieve Images</h2>
          <input type="text" placeholder="Unique ID" value={uniqueId} onChange={(e) => setUniqueId(e.target.value)} />
          <button onClick={retrieveImages}>Retrieve</button> */}
          
          {images.map((hash, index) => (
              <tr key={index}>
                <td>
                  <button onClick={() => openImage(index)}>View</button>
                </td>
                <td>{imageMetadata[index][0]}</td>
                <td>{imageMetadata[index][1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedImage && (
        <div className="image-modal">
          <button className='btn btn-sm btn-success' onClick={() => setSelectedImage('')}>Close</button>
          <a href={`https://ipfs.io/ipfs/${selectedImage}`} target="_blank" id='pdflink'>
            Open PDF
          </a>
        </div>
      )}
    </div>
  );
};


// Surgeries Portion
const Surgeries = ({ userType, userProfile }) => {
  const [account, setAccount] = useState('');
  const [surgeries, setSurgeries] = useState(null);
  const [uniqueId, setUniqueId] = useState(userProfile.cnic);
  const [imageDate, setImageDate] = useState('');
  const [sname, setSname] = useState('');
  const [dname, setDname] = useState('');
  const [hname, setHname] = useState('');
  const [surgerydata, setsurgerydata] = useState([]);

  // Form Submit Operation
  const onSubmit = async (event) => {
    event.preventDefault();
  
    const data = {
      uniqueId: uniqueId,
      imageDate: imageDate,
      sname: sname,
      dname: dname,
      hname: hname
    };
  
    try {
      const response = await axios.post(`${API_URL}/surgeries`, data);
      console.log('Data submitted successfully:', response.data);
  
      // Reset the form fields
      setUniqueId('');
      setImageDate('');
      setSname('');
      setDname('');
      setHname('');
    } catch (error) {
      console.error('Error submitting data to the backend:', error);
    }
  };

//Retrieve Data from Backend
  useEffect(() => {
    // Define the uniqueId for the surgery data you want to retrieve

    // Make the API request to retrieve the surgery data
    axios
      .get(`${API_URL}/getsurgery/${uniqueId}`)
      .then((response) => {
        setsurgerydata(response.data);
      })
      .catch((error) => {
        console.error('Error retrieving surgery data:', error);
      });
  }, []);

  return (
    <div>
      <h1>Surgeries</h1>

      { userType!=="patient"?(
      <table>
            <thead>
            <th>Upload Surgeries</th>
            </thead>
            <tbody>
              <tr>
              <td>
              <form onSubmit={onSubmit}>
                <label htmlFor="" id='prslabel'>
                <input 
                className='prinput1'
                  type="date"
                  placeholder="Date"
                  value={imageDate}
                  onChange={(e) => setImageDate(e.target.value)}
                />
                <input
                className='prinput1'
                  type="text"
                  placeholder="Surgery Name"
                  value={sname}
                  onChange={(e) => setSname(e.target.value)}
                />
             
                <input
                className='prinput1'
                  type="text"
                  placeholder="Doctor Name"
                  value={dname}
                  onChange={(e) => setDname(e.target.value)}
                />
                <input
                className='prinput1'
                  type="text"
                  placeholder="Hospital Name"
                  value={hname}
                  onChange={(e) => setHname(e.target.value)}
                />
              <br />
              <button type="submit" id="prssbtn" onClick={onSubmit}>
    Submit
  </button>
                </label>
              </form>
            </td>
              </tr>
              </tbody>
            </table>):null}


      {/* table 2 */}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Name of Surgery</th>
            <th>Doctor</th>
            <th>Hospital Name</th>
          </tr>
        </thead>
        <tbody>
        {surgerydata.length > 0 ? (
  surgerydata.map((data, index) => (
    <tr key={index}>
      <td>{data.imageDate}</td>
      <td>{data.sname}</td>
      <td>{data.dname}</td>
      <td>{data.hname}</td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="4">No data available</td>
  </tr>
)}


        </tbody>
      </table>
    </div>
  );
};












//Patient Previous reocrd Portion
const Record = ({ userType, userProfile }) => {

  const [uniqueId, setUniqueId] = useState(userProfile.cnic);
  const [precord, setPrecord] = useState('');
  const [account, setAccount] = useState('');
  const [recDate, setRecDate] = useState('');
  const [recdrnaem, setRecdrnaem] = useState('');
  const [recdiseases, setRecdiseases] = useState('');
  const [recmedicines, setRecmedicines] = useState('');
  const [rectest, setRectest] = useState('');

  const [Recorddata, setRecorddata] = useState([]);



 
  const onSubmit = async (event) => {
    event.preventDefault();
    console.log('Submitting data to the backend...');
  
    try {
      // Prepare the data to be sent to the backend
      const data = {
        uniqueId: uniqueId,
        recdate: recDate,
        recdr: recdrnaem,
        recdisease: recdiseases,
        recmedicine: recmedicines,
        rectest: rectest
      };
  
      // Send a POST request to the backend endpoint
      const response = await axios.post(`${API_URL}/recordhistory`, data);
  
      // Clear the form inputs after successful submission
      setUniqueId('');
      setRecDate('');
      setRecdrnaem('');
      setRecdiseases('');
      setRecmedicines('');
      setRectest('');
  
      console.log('Data submitted successfully:');
    } catch (error) {
      console.error('Error submitting data to the backend:', error);
    }
  };

  useEffect(() => {
    // Define the uniqueId for the surgery data you want to retrieve

    // Make the API request to retrieve the surgery data
    axios
      .get(`${API_URL}/getrecord/${uniqueId}`)
      .then((response) => {
        setRecorddata(response.data);
      })
      .catch((error) => {
        console.error('Error retrieving surgery data:', error);
      });
  }, []);




  return (
    <div className='recordtable'>
      <h1>Prescription History</h1>
      { userType!=="patient"?( 
<table>
  
  <thead>
    <th>Update Prespcription</th>
  </thead>
  <tbody>

  
      
         
       
    <tr>
    <td>
          <form onSubmit={onSubmit}>
          <label htmlFor="" id='ppplabel'>
              <input
              className='prinput12'
                type="date"
                name='date'
                placeholder="Date"
                value={recDate}
                onChange={(e) => setRecDate(e.target.value)}
              />
              <input
               className='prinput11'
                type="text"
                name="doctor"
                placeholder="Doctor name"
                value={recdrnaem}
                onChange={(e) => setRecdrnaem(e.target.value)}
              />
              <input
               className='prinput11'
                type="text"
                name="diseases"
                placeholder="Diseases"
                value={recdiseases}
                onChange={(e) => setRecdiseases(e.target.value)}
              />
              <input
               className='prinput11'
                type="text"
                name="medicines"
                placeholder="medicines"
                value={recmedicines}
                onChange={(e) => setRecmedicines(e.target.value)}
              />
              <textarea
               className='prinput11'
                name="extratests"
                id="extratests"
                cols="30"
                rows='5'
                placeholder="Extra tests"
                value={rectest}
                onChange={(e) => setRectest(e.target.value)}
              ></textarea>
              
              <button id="phpbtn">Submit</button>
              </label>
          </form>
          </td>
    </tr>
  </tbody>
</table>):null}

      {/* table 2 */}
      <table>
      <thead>
     
        <tr>
          <th>Date</th>
          <th>Doctor Name</th>
          <th>Disease</th>
          <th>Medicine prescribed</th>
          <th>Extra Tests</th>
          {/* { userType!=="patient"? */}
          {/* :null } */}
        </tr>

      </thead>
      <tbody>

      
       
      {Recorddata.length > 0 ? (
  Recorddata.map((reco, index) => (
    <tr key={index}>
      <td>{reco.recdate}</td>
      <td>{reco.recdr}</td>
      <td>{reco.recdisease}</td>
      <td>{reco.recmedicine}</td>
      <td>{reco.rectest}</td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="5">No data available</td>
  </tr>
)}
      </tbody>
      </table>
    </div>
  );
};

export default Sidebar;