import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import React, { useState, useEffect } from "react";
import { UserAvatar } from "../../components";
import '../../styles/common.css';
import "./Navigation.css";
import { Row } from "react-bootstrap";
import {getToken} from "../../services/authService"
function Navigation() {

    const [isAuthenticated, setIsAuthenticated] = useState(null); // Khởi tạo là null hoặc giá trị mặc định

    useEffect(() => {
      getToken()
        .then(token => {
          console.log(token); // In ra token thực tế
          setIsAuthenticated(token); // Cập nhật state với token
        })
        .catch(error => {
          console.error("Lỗi lấy token:", error);
          setIsAuthenticated(null); // Xử lý lỗi nếu cần
        });
    }, [isAuthenticated]);

    return (
      <Row className="">
        <Navbar expand="lg" className="bg-body-tertiary nav-background">
          <Container >
            <Navbar.Brand href="/" className= "fw-bold mb-2">Gugugaga</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="d-flex flex-grow-1">
                <Nav.Link href="calendar" className="fw-semibold">Calendar</Nav.Link>
                <Nav.Link href="note" className="fw-semibold">Note</Nav.Link>
                <Nav.Link href="chat" className="fw-semibold">Chat</Nav.Link>
                {!isAuthenticated ? <div className="d-lg-flex d-none flex-grow-1 justify-content-end "> 

                      <Nav.Link href="sign-up">Sign up</Nav.Link>
                      <Nav.Link href="login">Login</Nav.Link>
                </div> : <UserAvatar/>}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Row>
    );
}

export default Navigation;