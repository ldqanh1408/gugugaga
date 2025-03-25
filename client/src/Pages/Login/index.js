import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { logging, getToken } from "../../services/authService.js";
import { handleBlur, handleFocus } from "../../services";
import { ACCOUNT, PASSWORD } from "../../constants";
import { ClipLoader } from "react-spinners";
import './Login.css'
function Login() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [accountError, setAccountError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (token) {
        navigate("/", { replace: true });
      }
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await logging({ account, password });
      console.log({ message: "Logging thành công..." });
      navigate("/");
      window.location.reload();
    } catch (error) {
      setError("Mật khẩu hoặc tài khoản không chính xác");
    }
    setLoading(false);
  };

  return (
    <div className={`container form-1`}>
      {/* Overlay che toàn màn hình khi loading */}
      {loading && (
        <div className="loading-overlay">
          <ClipLoader color="#ffffff" size={50} />
        </div>
      )}

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
          <Form.Text className="text-danger d-block">{error}</Form.Text>
          
          {/* Nút login hiển thị loading khi đang xử lý */}
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? <ClipLoader color="white" size={20} /> : "Login"}
          </Button>
        </Form>
      </div>
     
    </div>
  );
}

export default Login;
