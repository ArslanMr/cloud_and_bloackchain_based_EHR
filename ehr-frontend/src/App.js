import './App.css';
// import Navbar from './Components/Navbar/navbar';
import Home from './Components/Pages/home'
import Footer from './Components/Footer/footer'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import HosReg from './Components/Pages/Hospital_Pages/Hospital_Registeration';
import BasicExample from './Components/Navbar/nav_bar';
import PatientLog from './Components/Pages/Patient_pages/Patient_Login';
import Drlogin from './Components/Pages/Dr Login/Drlogin';
import Patientdata from './Components/Pages/Patient_pages/Internal data/Patientdata';
import RegistrationForm from'./Components/Pages/Patient_pages/Internal data/RegistrationForm';
import Hosplogin from './Components/Pages/Hospital_Pages/Hospital_login'
import Hosttemp from './Components/Pages/Hospital_Pages/Hospital Internal/HospitalData'
import Hostlist from './Components/Pages/Hospital_List/Hospital_list'
import Drmain from './Components/Pages/Dr Login/DRInternalData/drmain'
import Otp from './otp';
import PasswordRecoveryModal from './Components/Pages/Patient_pages/PasswordRecoveryModal';
import UpdatePassword from './Components/Pages/Patient_pages/UpdatePassword';
function App() {
  return (
   <div className='App'>

    <Router>
    <BasicExample/>

    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='Hospital_Registeration' element={<HosReg/>}/>
      <Route path='Plogin' element={<PatientLog/>}/>
      <Route path='Drlogin' element={<Drlogin/>}/>
      <Route path='HospitalLogin' element={<Hosplogin/>}/>
      <Route path='Hospital_list' element={<Hostlist/>}/>
      <Route path="/Patient_Registeration" element={<RegistrationForm/>} />
      <Route path='/Pdata' element={<Patientdata/>}/>
      <Route path='/DRdata' element={<Drmain/>}/>
      <Route path='/Hdata' element={<Hosttemp/>}/>
      <Route path ='/Otp' element={<Otp/>}/>
      <Route path='/ForgotPassword' element={<PasswordRecoveryModal/>}/>
      <Route path='/UpdatePassword' element={<UpdatePassword/>}/>
    </Routes> 

    <Footer/>

  </Router>
    
   </div>
  );
}

export default App;
