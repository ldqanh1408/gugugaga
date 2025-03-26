import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
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
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { getUser } from "../../services";

function UserAvatar() {
  const [user, setUser] = useState({});
  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUser();
      setUser(data);
    };
    fetchUser();
  }, []);
  const navigate = useNavigate();
  const Logout = async () => {
    await logout();
    navigate("/");
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
              <Dropdown.Item as={Link} to="/profile">
                Profile
              </Dropdown.Item>
              <Link
                to="/change-password"
                state={{ user: user }}
                className="dropdown-item"
              >
                Change Password
              </Link>
              <Dropdown.Item href="" onClick={Logout}>
                Logout
              </Dropdown.Item>
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Row>
    </div>
  );
}

export default UserAvatar;
