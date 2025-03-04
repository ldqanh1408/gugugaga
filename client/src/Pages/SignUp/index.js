import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
import { addUser } from "../../services";
import {ACCOUNT, PASSWORD} from "../../constants"
import {
    handleBlur,
    handleFocus,
    handleConfirm,
}
from '../../services'

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
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      const newUser = {
        account,
        user_name: userName,
        password,
        email,
        phone_number: phoneNumber,
      };
      await addUser(newUser);
      console.log("User added successfully");
      navigate("/login");
    } catch (error) {
      setError("An error occurred. Please try again.");
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
              onBlur={() => handleBlur({
                field : ACCOUNT,
                account,
                password,
                setAccountError,
                setPasswordError,
              })}
              onFocus={() => handleFocus({
                field : ACCOUNT,
                account,
                password,
                setAccountError,
                setPasswordError,
              })}
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
              onBlur={() => handleBlur({
                field : PASSWORD,
                account,
                password,
                setAccountError,
                setPasswordError,
              })}
              onFocus={() => handleFocus({
                field : PASSWORD,
                account,
                password,
                setAccountError,
                setPasswordError,
              })}
           ></Form.Control>
            <Form.Text className="text-danger">{passwordError}</Form.Text>
          </Form.Group>
          <Form.Group className="mt-4">
            <Form.Label className="fw-semibold">Confirm password:</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                handleConfirm({
                  password,
                  confirmPassword,
                  setConfirmPasswordError,
                })
              }}
              placeholder="Nhập lại mật khẩu..."
              className="form-control"
            ></Form.Control>
            <Form.Text className="text-danger">{confirmPasswordError}</Form.Text>
          </Form.Group>
        </Form>

        <Form className="">
          <div className="d-flex flex-column form-2 additional">
            <Form.Group>
              <Form.Label className="fw-semibold">Name:</Form.Label>
              <Form.Control
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Nhập tên người dùng..."
                className="form-control"
              ></Form.Control>
              <Form.Text></Form.Text>
            </Form.Group>
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
