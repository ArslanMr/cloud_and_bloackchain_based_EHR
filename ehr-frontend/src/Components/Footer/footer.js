import React from 'react';
import './footer.css';



const Footer = () => {
    return (
        <footer className="Ftcontainer">
            <div className="Ft2container">
                <div className='Footlable'>
                    <div className='FoTl1'>
                    <ul>
                        <li><h4>Hash Chain</h4></li>
                        <p>Our motive to create a Secure and shared medical Recode System. To Help the patients,Hospitals and Doctors.</p>
                    </ul>
                    </div>

                    <div className='FoTl2'>
                        <ul>
                            <li><h4>Logins</h4></li>
                            <li><a href="#action/3.6" id='anch'>Dr Login</a></li>
                            <li><a href="#action/3.6" id='anch'>Patient Login</a></li>
                            <li><a href="#action/3.6" id='anch'>Hospital Login</a></li>
                        </ul>
                    </div>
                    
                    <div className='FoTl3'>
                        <ul>
                            <li><h4>Registers</h4></li>
                            <li><a href="#action/3.6" id='anch'>Hospital Registers</a></li>
                            <li><a href="#action/3.6" id='anch'>Patient Registeration</a></li>
                        </ul>
                    </div>

                    <div className='FoTl4'>
                        <ul>
                            <li><h4>Contact Us</h4></li>
                            <li>Plot#33 Karachi</li>
                            <li>+92 302 4444 444</li>
                            <li>hospital@gmail.com</li>
                        </ul>
                    </div>
                </div>
               

               
        <div className="icons">
        <i className="fa fa-facebook"></i>
        <i className="fa fa-instagram"></i>
            <i className="fa fa-twitter"></i>
            <i className="fa fa-linkedin"></i>
            <i className="fa fa-whatsapp"></i>
            
        </div>
           <hr/>
        <div className="copy">
            <b><p>Copyright claim <i className="fa fa-copyright"></i> Hash Chain </p></b>
        </div>
            </div>
        </footer>
    );
}
export default Footer;