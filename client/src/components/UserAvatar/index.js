import React from "react";
import ReactDOM from "react-dom";
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

function UserAvatar() {
  const navigate = useNavigate();
  const Logout = () => {
    localStorage.setItem("token","");
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="container justify-content-end d-flex">
      <Row>
        <Col className="d-lg-block d-none">
          <Dropdown className="d-none d-lg-block">
            <DropdownToggle as="div" className="p-0 border-0 bg-transparent">
              <img src={smile} alt="Smile" className="smile" />
            </DropdownToggle>
            <DropdownMenu className="mt-2">
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </DropdownMenu>
          </Dropdown>
        </Col>
        <Col>
          <Dropdown className="d-none d-lg-block">
            <DropdownToggle as="div" className="p-0 border-0 bg-transparent">
              <img src={avatar} alt="User avatar" className="avatar" />
            </DropdownToggle>
            <DropdownMenu>
              <Dropdown.Item href="#/action-1">Profile</Dropdown.Item>
              <Dropdown.Item href="" onClick={Logout}>Logout</Dropdown.Item>
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Row>
    </div>
  );
}

export default UserAvatar;
