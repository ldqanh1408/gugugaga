import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ChangePassword.css";
import { Modal, Form, Button } from "react-bootstrap";
import { changePassword, logout } from "../../services";
import { ClipLoader } from "react-spinners";
function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation(); // .state để lấy state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const changed = await changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
        setError,
      });
      setLoading(false);
      setShowModal(changed.success);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="container change-password-container">
      <h1 className="change-password-header">Change Your Password</h1>
      <hr className="change-password-line"></hr>

      <Form onSubmit={handleSubmit}>
        {/*mật khẩu hiện tjai */}
        <Form.Group className="mb-3" controlId="currentPassword">
          <Form.Label className="pass-custom-h2-label">
            Current Password
          </Form.Label>
          <Form.Group className="change-password-box">
            <Form.Control
              className="no-border"
              type="password"
              placeholder="Enter your current password"
              onInput={(e) => setCurrentPassword(e.target.value)}
            />
          </Form.Group>
        </Form.Group>

        {/* Mật khẩu mới */}
        <Form.Group className="mb-3" controlId="newPassword">
          <Form.Label className="pass-custom-h2-label">New Password</Form.Label>
          <Form.Group className="change-password-box">
            <Form.Control
              className="no-border"
              type="password"
              placeholder="Enter new password"
              onInput={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>
        </Form.Group>

        {/* Xác nhận mật khẩu mới */}
        <Form.Group className="mb-3" controlId="confirmNewPassword">
          <Form.Label className="pass-custom-h2-label">
            Confirm New Password
          </Form.Label>
          <Form.Group className="change-password-box">
            <Form.Control
              className="no-border"
              type="password"
              placeholder="Confirm new password"
              onInput={(e) => setConfirmNewPassword(e.target.value)}
            />
          </Form.Group>
        </Form.Group>
        <Form.Text className="text-danger error">{error}</Form.Text>
        {/* Nút lưu */}
        <div className="d-flex justify-content-end">
          <Button style={{ marginRight: '0' }} type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? <ClipLoader color="white" size={20} /> : "Save Changes"}
          </Button>
        </div>
      </Form>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          logout();
          window.location.href = "/login";
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Password Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your password has been successfully changed.</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(false);
              logout();
              window.location.href = "/login"; // Reload lại trang login
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ChangePassword;
