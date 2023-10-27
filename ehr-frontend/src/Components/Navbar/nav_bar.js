import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from "react-router-bootstrap";
import NavDropdown from 'react-bootstrap/NavDropdown';
import './nav_bar.css';

function BasicExample() {
  return (
    <Navbar id='nav' bg="" expand="lg" className='HNav'>
      <Container id='navcon'>
        <Navbar.Brand id='navhe' href="/">Hash Chain EHR</Navbar.Brand>
        <Navbar.Toggle className='toogle' aria-controls="basic-navbar-nav" data-target="#basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link id='ho'>Home</Nav.Link>
            </LinkContainer>
            <NavDropdown title="Login" id="basic-nav-dropdown">
              <LinkContainer to="/Plogin">
                <NavDropdown.Item>Patient Login</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/Drlogin">
                <NavDropdown.Item>Doctor Login</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/HospitalLogin">
                <NavDropdown.Item>Hospital Login</NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Divider />
              <LinkContainer to="/Hospital_Registeration">
                <NavDropdown.Item>Hospital Registeration</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/Patient_Registeration">
                <NavDropdown.Item>Patient Registeration</NavDropdown.Item>
              </LinkContainer>
            </NavDropdown>
            <LinkContainer to="/Hospital_list">
              <Nav.Link id='ho'>Hospitals Lists</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default BasicExample;
