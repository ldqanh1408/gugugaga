import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import React, { useEffect } from "react";
import { UserAvatar } from "../../components";
import '../../styles/common.css';
import "./Navigation.css";
import { Row } from "react-bootstrap";
import { checkToken } from "../../redux/authSlice"; // Import Redux Thunk
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom"; // Import Link từ React Router

function Navigation() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth); // Lấy trạng thái isAuthenticated từ Redux store
  const { user, profile } = useSelector((state) => state.user);
  
  // Gọi checkToken() khi component mount
  useEffect(() => {
    dispatch(checkToken());  // Chỉ kiểm tra token nếu chưa đăng nhập
  }, [dispatch, profile]);

  return (
    <Row>
      <Navbar expand="lg" className="bg-body-tertiary nav-background">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold mb-2">Gugugaga</Navbar.Brand> 
          {/* Sử dụng Link để tránh reload */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="d-flex flex-grow-1">
              <Nav.Link as={Link} to="/calendar" className="fw-semibold">Calendar</Nav.Link>
              <Nav.Link as={Link} to="/note" className="fw-semibold">Note</Nav.Link>
              {!isAuthenticated ? (
                <div className="d-lg-flex d-none flex-grow-1 justify-content-end">
                  <Nav.Link as={Link} to="/sign-up">Sign up</Nav.Link>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
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
