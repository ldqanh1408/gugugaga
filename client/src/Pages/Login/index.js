import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import { getUsers } from "../../services/userService.js";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { handleLogin, handleBlur, handleFocus } from "../../services";
import { ACCOUNT, PASSWORD } from "../../constants";
import { checkAuth, logging, getToken } from "../../services/authService.js";

function Login() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [accountError, setAccountError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken(); // Chờ Promise giải quyết
      console.log("token là", token); // In ra giá trị thực (chuỗi hoặc null)
      if (token) { // Kiểm tra token thực tế
        navigate('/', { replace: true });
      }
    };
    checkAuth();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await logging({ account, password });
      console.log({ message: "Logging thành công..." });
      navigate("/");
      window.location.reload(); // Reload trang
    } catch (error) {
      console.error({ message: error.message, success: false });
    }
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
