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
import Loading from "../../components/Common/Loading";
import { ClipLoader } from "react-spinners";
function SignUp() {
  const [account, setAccount] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [accountError, setAccountError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken(); // Chờ Promise giải quyết
      if (token) {
        // Kiểm tra token thực tế
        navigate("/", { replace: true });
      }
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ userName, account, password, email, phone });
      console.log("Đăng kí thành công");
      navigate("/login");
    } catch (error) {
      setError("Đăng ký thất bại");
      console.error({ message: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="containter form-1">
      {loading && <Loading />}
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
            <span className="notice d-block">
              Nhập tài khoản từ 5-20 ký tự, chỉ gồm chữ cái (A-Z, a-z), số
              (0-9), dấu chấm (.) hoặc gạch dưới (_). Không chứa ký tự đặc biệt
              khác.
            </span>
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
            <span className="notice d-block">
              Nhập mật khẩu từ 8 đến 32 ký tự, gồm ít nhất 1 chữ thường (a-z), 1
              chữ hoa (A-Z), 1 số (0-9), 1 ký tự đặc biệt (@, $, !, %, *, ?, &,
              #) và không chứa khoảng trắng.
            </span>
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
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại..."
                className="form-control"
              ></Form.Control>
              <Form.Text></Form.Text>
            </Form.Group>
          </div>
          {error && <p className="text-danger">{error}</p>}
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? <ClipLoader color="white" size={20} /> : "Sign Up"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default SignUp;
