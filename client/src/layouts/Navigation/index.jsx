import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import React, { useEffect } from "react";
import { UserAvatar } from "../../components";
import "../../styles/common.css";
import "./Navigation.css"; // Ensure this file contains the new styles
import { Row } from "react-bootstrap";
import { checkToken } from "../../redux/authSlice";
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";
import { setProfile } from "../../redux/userSlice";

function Navigation() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { user, profile } = useSelector((state) => state.user);

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem("profile"));
    if (storedProfile) {
      dispatch(setProfile(storedProfile));
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(checkToken());
  }, [dispatch]);

  const { role } = useSelector((state) => state?.auth);

  const renderNavItems = () => {
    switch (role) {
      case "BUSINESS":
        return (
          <>
            <Nav.Link as={Link} to="/business/expert-list" className="nav-item">
              Expert List
            </Nav.Link>
            <Nav.Link as={Link} to="/business/complaints" className="nav-item">
              Complaints
            </Nav.Link>
          </>
        );
      case "USER":
        return (
          <>
            <Nav.Link as={Link} to="/calendar" className="nav-item">
              Calendar
            </Nav.Link>
            <Nav.Link as={Link} to="/note" className="nav-item">
              Note
            </Nav.Link>
            <Nav.Link as={Link} to="/chat" className="nav-item">
              Chat
            </Nav.Link>
            <Nav.Link as={Link} to="/therapy" className="nav-item">
              Therapy
            </Nav.Link>
            <Nav.Link as={Link} to="/me/therapy" className="nav-item">
              Me
            </Nav.Link>

            <Nav.Link as={Link} to="/explore-yourself" className="nav-item">
              Explore
            </Nav.Link>
          </>
        );
      case "EXPERT":
        return (
          <>
            <Nav.Link as={Link} to="/expert/schedule" className="nav-item">
              Schedule
            </Nav.Link>
            <Nav.Link as={Link} to="/expert/history" className="nav-item">
              History
            </Nav.Link>
          </>
        );
      default:
        return <Nav.Link href="/" className="nav-item">Home</Nav.Link>;
    }
  };

  return (
    <Row>
      <Navbar expand="lg" className="bg-body-tertiary nav-background mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold mb-2">
            Gugugaga
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="d-flex flex-grow-1">
              {renderNavItems()}
              {!isAuthenticated ? (
                <div className="d-lg-flex d-none flex-grow-1 justify-content-end">
                  <Nav.Link as={Link} to="/sign-up" className="nav-item">
                    Sign up
                  </Nav.Link>
                  <Nav.Link as={Link} to="/login" className="nav-item">
                    Login
                  </Nav.Link>
                </div>
              ) : (
                <UserAvatar />
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Row>
  );
}

export default Navigation;
