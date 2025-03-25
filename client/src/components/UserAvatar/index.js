import React from "react";
import ReactDOM from "react-dom";
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Row,
  Col,
  DropdownToggle,
  Dropdown,
  DropdownMenu,
} from "react-bootstrap";
import avatar from "../../assets/imgs/avatar.svg";
import smile from "../../assets/imgs/smile.svg";
import "./UserAvatar.css";
import {useNavigate} from 'react-router-dom'
import { logout } from "../../services/authService";

function UserAvatar() {
  const navigate = useNavigate();
  const Logout = async () => {
    await logout();
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="container justify-content-end d-flex">
      <Row>
       
        <Col>
          <Dropdown className="d-none d-lg-block">
            <DropdownToggle as="div" className="p-0 border-0 bg-transparent">
              <img src={avatar} alt="User avatar" className="avatar" />
            </DropdownToggle>
            <DropdownMenu>
              <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
              <Dropdown.Item as={Link} to="/edit-password">Profile</Dropdown.Item>
              <Dropdown.Item href="" onClick={Logout}>Logout</Dropdown.Item>
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Row>
    </div>
  );
}

export default UserAvatar;
