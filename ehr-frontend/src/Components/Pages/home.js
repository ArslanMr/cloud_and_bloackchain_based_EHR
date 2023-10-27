import React from 'react';
import './home.css';
//import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
const home = () => (

  <div className='maindiv'>
    {/* <!-- Slider start --> */}
<div id="carouselExampleCaptions" className="carousel slide " data-bs-ride="carousel" >
  <div className="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
   

  </div>
  <div className="carousel-inner">
    <div className="carousel-item active" >
      <img src="images/back.jpg" className="d-block w-100" alt="..."  data-bs-interval="10000/"/>
      <div className="carousel-caption d-none d-md-block" > 
       <h5 className="all">Secure</h5>
        <p>With latest Block Chain</p>
      </div>
    </div>
    <div className="carousel-item">
      <img src="images/stetho.jpg" className="d-block w-100" alt="..."  data-bs-interval="2000"/>
      <div className="carousel-caption d-none d-md-block" >
      
        <h5><strong>Highly Accesible</strong></h5>
        <p>Hosted On Cloud</p>
      
      </div>
    </div>
    <div className="carousel-item">
      <img src="images/sugar.jpg" className="d-block w-100" alt="..."  data-bs-interval="30000" />
      <div className="carousel-caption d-none d-md-block" >
        <h5>Get Your Records</h5>
        <p>On Your Finger Tips</p>
      </div>
    </div>

  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>
{/* Features */}
    <section id="features" >
  <h1>Features</h1>
  <div className="container">
      <div className="row features">
          <div className="col-md-4 text-center wow flipInX center" id='col'>
              <h2>Block Chain Secured</h2>
              <p>The implementation of blockchain technology in EHR provides a highly secure and transparent way to manage and store sensitive medical information. The decentralized and encrypted nature of blockchain makes it a reliable solution for protecting personal health information and ensuring that it is only accessible to authorized parties.</p>
          </div>
          <div className="col-md-4 text-center wow flipInX center " id='col'>
              <h2>Highly Accesible</h2>
              <p>Cloud-based website can be highly accessible due to its ability to leverage the resources of multiple servers and data centers. Cloud computing allows website owners to host their website on a network of remote servers, rather than on a single physical server. This means that if one server experiences downtime, the website can still be accessed through other available servers in the network.</p>
          </div>
          <div className="col-md-4 text-center wow flipInX center" id='col'>
              <h2>2FA Secure Sharing</h2>
              <p>OTP (One-Time Password) can help in secure sharing by adding an extra layer of security to the sharing process. OTP is a unique and temporary code that is sent to the recipient's mobile phone or email address to verify their identity. The code is valid for a single use and a limited period of time, usually a few minutes, and must be entered correctly to access the shared information.

</p>
          </div>
      </div>
  </div>
</section>
{/* Cards */}
<div className="cards">
      
      <div className="row">
        <div className="col-4">
          <div className="card"><Card>
            <Card.Img style={{ height: '300px' }} variant="top" src="images/patient.jpg" />
            <Card.Body id='cards'>
              <Card.Title id='textca'>EHR for Patients</Card.Title>
              <Card.Text id='textca'>
              Electronic Health Records (EHRs) help patients by providing a comprehensive and accurate record of their medical history, treatments, and medications. This information can improve communication and coordination between healthcare providers, resulting in better care and outcomes for patients.
              </Card.Text>
            </Card.Body>
          </Card></div>
        </div>
        <div className="col-4">
          <div className="card"><Card>
            <Card.Img style={{ height: '300px' }} variant="top" src="images/doctor.jpg" />
            <Card.Body id='cards'>
              <Card.Title id='textca'>EHR for Doctors</Card.Title>
              <Card.Text id='textca'>
              Electronic Health Records (EHRs) help doctors by providing quick access to a patient's medical history, test results, and treatment plans, allowing for more efficient and informed decision-making. EHRs can also streamline workflows and reduce administrative tasks, freeing up more time for patient care.
              </Card.Text>
            </Card.Body>
          </Card></div>
        </div>
        <div className="col-4">
          <div className="card"><Card>
            <Card.Img style={{ height: '300px' }} variant="top" src="images/hospital.jpg" />
            <Card.Body id='cards'>
              <Card.Title id='textca'>EHR for Hospitals</Card.Title>
              <Card.Text id='textca'>
              Electronic Health Records (EHRs) help hospitals by improving the quality and safety of patient care, reducing medical errors, and enhancing patient outcomes. EHRs also help hospitals streamline operations, reduce costs, and increase revenue by optimizing workflows and improving billing.
              </Card.Text>
            </Card.Body>
          </Card></div>
        </div>
      </div>
    </div>
    
        </div>
    


)

export default home
