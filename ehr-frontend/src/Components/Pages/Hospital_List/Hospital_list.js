import { useState, useEffect } from 'react';
import './Hospital_List.css';
import {API_URL} from '../../../constants/global';

function Hospital_list() {
  const [hospitals, setHospital] = useState(undefined);

  useEffect(() => {
    // Fetch hospital details from the database
     //Dr Data fetching
     fetch(`${API_URL}/hospitallist`, {
      method: 'GET',
      })
      .then(res => res.json())
      .then(data => {
        console.log("Hospital: ", data);
        setHospital(data.data);
      })
  },[]);
  return (
    <div className="App">
      <div class="HLcontainer">
        {/* Display table of hospital details */}
        <table>
          <thead>
            <tr>
              <th>Hospital Name</th>
              <th>City</th>
              <th>Phone Number</th>
              <th>Category</th>
            </tr>
          </thead>
          {hospitals && // Render only if hospitals is defined
      <tbody>
        {hospitals.map(hospital => (
          <tr key={hospital.id}>
            <td>{hospital.hospitalName}</td>
            <td>{hospital.city}</td>
            <td>{hospital.phoneNumber}</td>
            <td>{hospital.category}</td>
          </tr>
        ))}
      </tbody>
    }
        </table>
      </div>
    </div>
  );
}

export default Hospital_list;