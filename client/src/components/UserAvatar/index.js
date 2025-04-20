import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, DropdownToggle, Dropdown, DropdownMenu } from "react-bootstrap";
import avatarPlaceholder from "../../assets/imgs/userDefault.svg"; // Placeholder nếu không có avatar
import "./UserAvatar.css";
import { useNavigate } from "react-router-dom";
import { fetchProfile, fetchUser, logoutUserAsync } from "../../redux/userSlice"; // Import Redux Thunks
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";

function UserAvatar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lấy user, trạng thái loading, và logout từ Redux store
  const { profile, loading, logoutLoading } = useSelector((state) => state.user);

  // Gọi fetchUser khi component mount nếu chưa có user trong Redux store
  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfile());
    }
  }, [dispatch, profile]);

  // Hàm xử lý logout
  const handleLogout = async () => {
    await dispatch(logoutUserAsync()); // Gọi Thunk logoutUserAsyn
    await dispatch(logout())
    await navigate("/login"); // Điều hướng về trang chính sau khi logout
  };
  return (
    <div className="container justify-content-end d-flex">
      <Row>
        <Col>
          <Dropdown className="d-none d-lg-block">
            <DropdownToggle as="div" className="p-0 border-0 bg-transparent">
              {/* Nếu user.avatar tồn tại thì hiển thị ảnh user, nếu không thì dùng avatar mặc định */}
              <img src={profile?.avatar || avatarPlaceholder} alt="" className="avatar" />
            </DropdownToggle>
            <DropdownMenu>
              <Dropdown.Item as={Link} to="/profile">
                Profile
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/personalize">
                Personalize
              </Dropdown.Item>
              <Link to="/change-password" state={{ user: profile }} className="dropdown-item">
                Change Password
              </Link>
              <Dropdown.Item onClick={handleLogout}>
                {logoutLoading ? "Logging out..." : "Logout"} {/* Hiển thị trạng thái logout */}
              </Dropdown.Item>
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Row>
    </div>
  );
}

export default UserAvatar;
