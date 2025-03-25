import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";
import { addUser } from "../../services";
import { ACCOUNT, PASSWORD, USER_NAME } from "../../constants";
import { handleBlur, handleFocus, handleConfirm } from "../../services";
import { handleSignUp } from "../../services/validationService";
import { register, getToken } from "../../services/authService";

function SignUp() {
  const [account, setAccount] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [accountError, setAccountError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken(); // Chờ Promise giải quyết
      console.log("token là", token); // In ra giá trị thực (chuỗi hoặc null)
      if (token) {
        // Kiểm tra token thực tế
        navigate("/", { replace: true });
      }
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ userName, account, password, email, phoneNumber });
      console.log("Đăng kí thành công");
      navigate("/login");
    } catch (error) {
      console.error({ message: error.message });
    }
  };

  return (
    <div className="containter form-1">
      <div className="title">
        <h1>SignUp</h1>
      </div>
      <div className="">
        <Form className="d-flex flex-column form-2 login">
          <Form.Group>
            <Form.Label className="fw-semibold">Tài khoản:</Form.Label>
            <Form.Control
              onChange={(e) => setAccount(e.target.value)}
              placeholder="Nhập tên tài khoản..."
              className="form-control"
              onBlur={() =>
                handleBlur({
                  field: ACCOUNT,
                  account,
                  password,
                  userName,
                  setAccountError,
                  setPasswordError,
                  setUserNameError,
                })
              }
              onFocus={() =>
                handleFocus({
                  field: ACCOUNT,
                  account,
                  password,
                  userName,
                  setAccountError,
                  setPasswordError,
                  setUserNameError,
                })
              }
            ></Form.Control>
            <Form.Text className="text-danger">{accountError}</Form.Text>
          </Form.Group>
          <Form.Group className="mt-4">
            <Form.Label className="fw-semibold">Password:</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
              className="form-control"
              onBlur={() =>
                handleBlur({
                  field: PASSWORD,
                  account,
                  password,
                  userName,
                  setAccountError,
                  setPasswordError,
                  setUserNameError,
                })
              }
              onFocus={() =>
                handleFocus({
                  field: PASSWORD,
                  account,
                  password,
                  userName,
                  setAccountError,
                  setPasswordError,
                  setUserNameError,
                })
              }
            ></Form.Control>
            <Form.Text className="text-danger">{passwordError}</Form.Text>
          </Form.Group>
          <Form.Group className="mt-4">
            <Form.Label className="fw-semibold">Confirm password:</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyUp={(e) => {
                handleConfirm({
                  password,
                  confirmPassword,
                  confirmPasswordError,
                  setConfirmPasswordError,
                });
              }}
              placeholder="Nhập lại mật khẩu..."
              className="form-control"
            ></Form.Control>
            <Form.Text className="text-danger">
              {confirmPasswordError}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mt-4">
            <Form.Label className="fw-semibold">Name:</Form.Label>
            <Form.Control
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Nhập tên người dùng..."
              className="form-control"
              onBlur={() =>
                handleBlur({
                  field: USER_NAME,
                  account,
                  password,
                  userName,
                  setAccountError,
                  setPasswordError,
                  setUserNameError,
                })
              }
              onFocus={() =>
                handleFocus({
                  field: USER_NAME,
                  account,
                  password,
                  userName,
                  setAccountError,
                  setPasswordError,
                  setUserNameError,
                })
              }
            ></Form.Control>
            <Form.Text className="text-danger">{userNameError}</Form.Text>
          </Form.Group>
        </Form>

        <Form className="">
          <div className="d-flex flex-column form-2 additional">
            <Form.Group className="mt-4">
              <Form.Label className="fw-semibold">Email:</Form.Label>
              <Form.Control
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email..."
                className="form-control"
              ></Form.Control>
              <Form.Text></Form.Text>
            </Form.Group>
            <Form.Group className="mt-4">
              <Form.Label className="fw-semibold">Phone:</Form.Label>
              <Form.Control
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Nhập số điện thoại..."
                className="form-control"
              ></Form.Control>
              <Form.Text></Form.Text>
            </Form.Group>
          </div>
          {error && <p className="text-danger">{error}</p>}
          <Button type="submit" onClick={handleSubmit}>
            Sign up
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default SignUp;
