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
      
      <h1 className="signup-header">Sign Up</h1>
      <hr className="signup-line"></hr>

      <div className="">
        <Form className="d-flex flex-column form-2 login">
          <Form.Group className="mt-4">
            <Form.Label className="signup-custom-h2-label">Username:</Form.Label>
            <Form.Control
              onChange={(e) => setAccount(e.target.value)}
              placeholder="Enter your username..."
              className="change-password-box"
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
              Enter an account name with 5-20 characters,
              consisting only of letters (A-Z, a-z), numbers (0-9),
              dots (.), or underscores (_). Special characters are not allowed. 
            </span>
            <Form.Text className="text-danger">{accountError}</Form.Text>
          </Form.Group>
          <Form.Group className="mt-4">
            <Form.Label className="signup-custom-h2-label">Password:</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password..."
              className="signup-box"
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
              Enter a password with 8 to 32 characters, including at least 1 lowercase letter (a-z),
              1 uppercase letter (A-Z), 1 number (0-9), 1 special character (@, $, !, %, , ?, &, #), and no spaces.
            </span>
            <Form.Text className="text-danger">{passwordError}</Form.Text>
          </Form.Group>
          <Form.Group className="mt-4">
            <Form.Label className="signup-custom-h2-label">Confirm password:</Form.Label>
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
              placeholder="Re-enter your password..."
              className="signup-box"
            ></Form.Control>
            <Form.Text className="text-danger">
              {confirmPasswordError}
            </Form.Text>
          </Form.Group>
          <Form.Group className="mt-4">
            <Form.Label className="signup-custom-h2-label">Name:</Form.Label>
            <Form.Control
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name..."
              className="signup-box"
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
              <Form.Label className="signup-custom-h2-label">Email:</Form.Label>
              <Form.Control
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email..."
                className="signup-box"
              ></Form.Control>
              <Form.Text></Form.Text>
            </Form.Group>
            <Form.Group className="mt-4">
              <Form.Label className="signup-custom-h2-label">Phone:</Form.Label>
              <Form.Control
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại..."
                className="signup-box"
              ></Form.Control>
              <Form.Text></Form.Text>
            </Form.Group>
          </div>
          {error && <p className="text-danger">{error}</p>}
          <div className="d-flex justify-content-end">  
            <Button type="submit" onClick={handleSubmit} disabled={loading}>
              {loading ? <ClipLoader color="white" size={20} /> : "Sign Up"}
            </Button>
          </div>  
        </Form>
      </div>
    </div>
  );
}

export default SignUp;
