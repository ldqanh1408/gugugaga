import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import React, { useEffect } from "react";
import { UserAvatar } from "../../components";
import "../../styles/common.css";
import "./Navigation.css";
import { Row } from "react-bootstrap";
import { checkToken } from "../../redux/authSlice";
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";
import { setProfile } from "../../redux/userSlice"; // Thêm dòng này để import setProfile

function Navigation() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { user, profile } = useSelector((state) => state.user);

  useEffect(() => {
    // Khôi phục profile từ localStorage khi component được mount
    const storedProfile = JSON.parse(localStorage.getItem("profile"));
    if (storedProfile) {
      dispatch(setProfile(storedProfile));
    }
  }, [dispatch]);


  useEffect(() => {
    dispatch(checkToken());
  }, [dispatch]);

  const {role} = useSelector((state) => state?.auth)

  const renderNavItems = () => {
    switch (role) {
      case "BUSINESS":
        return (
          <>
            <Nav.Link as={Link} to="/business/expert-list">
              Expert List
            </Nav.Link>
            <Nav.Link as={Link} to="/business/complaints">
              Complaints
            </Nav.Link>
          </>
        );
      case "USER":
        return (
          <>
            <Nav.Link as={Link} to="/calendar" className="fw-semibold">
              Calendar
            </Nav.Link>
            <Nav.Link as={Link} to="/note" className="fw-semibold">
              Note
            </Nav.Link>
            <Nav.Link as={Link} to="/chat" className="fw-semibold">
              Chat
            </Nav.Link>
            <Nav.Link as={Link} to="/therapy" className="fw-semibold">
              Therapy
            </Nav.Link>
            <Nav.Link as={Link}  to="/explore-yourself"
 className="fw-semibold">
              Explore
            </Nav.Link>
            <Nav.Link as={Link} to="/me/therapy" className="fw-semibold">
              Me
            </Nav.Link>
             <Nav.Link as={Link} to="/today-mails" className="fw-semibold">
              Today Mails
            </Nav.Link>
            
          </>
        );
      case "EXPERT":
        return (
          <>
            <Nav.Link as={Link} to="/expert/schedule" className="fw-semibold">
              Schedule
            </Nav.Link>
            <Nav.Link as={Link} to="/expert/history" className="fw-semibold">
              History
            </Nav.Link>
          </>
        );
      default:
        return <Nav.Link href="/">Home</Nav.Link>;
    }
  };

  return (
    <Row>
      <Navbar expand="lg" className="bg-body-tertiary nav-background">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold mb-2">
            Gugugaga
          </Navbar.Brand>

          {/* Sử dụng Link để tránh reload */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="d-flex flex-grow-1">
              {renderNavItems()}
                {!isAuthenticated ? (
                  <div className="d-lg-flex d-none flex-grow-1 justify-content-end">
                    <Nav.Link as={Link} to="/sign-up">
                      Sign up
                    </Nav.Link>
                    <Nav.Link as={Link} to="/login">
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
