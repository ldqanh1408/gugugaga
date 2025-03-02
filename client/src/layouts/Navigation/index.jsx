import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import React, { useState } from "react";
import { UserAvatar } from "../../components";
import '../../styles/common.css';
import "./Navigation.css";

function Navigation() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    return (
      <div className="nav-background">
        <Navbar expand="lg" className="bg-body-tertiary nav-background">
          <Container >
            <Navbar.Brand href="#home" className= "fw-bold">Gugugaga</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="d-flex flex-grow-1">
                <Nav.Link href="calendar">Calendar</Nav.Link>
                <Nav.Link href="note">Note</Nav.Link>
                {!isAuthenticated ? <div className="d-flex flex-grow-1 justify-content-end"> 
                  <Nav.Link href="sign-up">Sign up</Nav.Link>
                  <Nav.Link href="login">Login</Nav.Link>
                </div> : <UserAvatar/>}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    );
}

export default Navigation;