import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import { getUsers } from "../../services/userService.js";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import {
  handleLogin,
  handleBlur,
  handleFocus,
} from "../../services";
import {ACCOUNT, PASSWORD} from '../../constants'

function Login() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [accountError, setAccountError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({
      account,
      password,
      accountError,
      passwordError,
      setError,
      navigate,
      setAccountError,
      setPasswordError,
    });
  };

  return (
    <div className="containter form-1">
      <div className="title">
        <h1>Login</h1>
      </div>
      <div className="">
        <Form className="">
          <div className="d-flex flex-column form-2">
            <Form.Group>
              <Form.Label className="fw-semibold">User name:</Form.Label>
              <Form.Control
                placeholder="Nhập tên tài khoản..."
                className="form-control"
                onChange={(e) => setAccount(e.target.value)}
                onBlur={() =>
                  handleBlur({
                    account,
                    field: ACCOUNT,
                    password,
                    setAccountError,
                    setPasswordError,
                  })
                }
                onFocus={() =>
                  handleFocus({
                    account,
                    field: ACCOUNT,
                    password,
                    setAccountError,
                    setPasswordError,
                  })
                }
              ></Form.Control>
              <Form.Text className="text-danger">{accountError}</Form.Text>
            </Form.Group>
            <Form.Group className="mt-4">
              <Form.Label className="fw-semibold">Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu..."
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() =>
                  handleBlur({
                    account,
                    field: PASSWORD,
                    password,
                    setAccountError,
                    setPasswordError,
                  })
                }
                onFocus={() =>
                  handleFocus({
                    account,
                    field: PASSWORD,
                    password,
                    setAccountError,
                    setPasswordError,
                  })
                }
              ></Form.Control>
              <Form.Text className="text-danger">{passwordError}</Form.Text>
            </Form.Group>
          </div>
          <Button type="submit" onClick={handleSubmit}>
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Login;
