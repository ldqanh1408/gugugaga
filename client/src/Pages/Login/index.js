import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { logging, getToken } from "../../services/authService.js";
import { handleBlur, handleFocus } from "../../services";
import { ACCOUNT, PASSWORD } from "../../constants";
import { ClipLoader } from "react-spinners";
import "./Login.css";
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
        const futureMails =
          JSON.parse(localStorage.getItem("futureMails")) || [];
        const today = new Date().toISOString().split("T")[0];

        const todayMail = futureMails.find(
          (mail) => mail.receiveDate === today && !mail.notified
        );

        if (todayMail) {
          navigate("/today-mails", { state: { mail: todayMail } });
        } else {
          navigate("/", { replace: true });
        }
      }
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await logging({ account, password });

      // Kiểm tra thư đến hạn
      const futureMails = JSON.parse(localStorage.getItem("futureMails")) || [];
      const today = new Date().toISOString().split("T")[0];
      const todayMail = futureMails.find(
        (mail) => mail.receiveDate === today && !mail.notified
      );

      if (todayMail) {
        // Nếu có thư đến hạn, chuyển hướng đến TodayMailsPage
        navigate("/today-mails", { state: { mail: todayMail } });

        // Đánh dấu thư đã được thông báo
        const updatedMails = futureMails.map((mail) =>
          mail.id === todayMail.id ? { ...mail, notified: true } : mail
        );
        localStorage.setItem("futureMails", JSON.stringify(updatedMails));
      } else {
        navigate("/");
      }
    } catch (error) {
      setError("Incorrect password or account.");
    }
    setLoading(false);
  };

  return (
    <div className="container form-1">
      {/* Overlay che toàn màn hình khi loading */}
      {loading && (
        <div className="loading-overlay">
          <ClipLoader color="#ffffff" size={50} />
        </div>
      )}

      <div className="container login-container">
        <h1 className="login-header">Login</h1>
        <hr className="login-line"></hr>

        <Form className="">
          <div className="d-flex flex-column form-2">
            <Form.Group>
              <Form.Label className="login-custom-h2-label">
                User name:
              </Form.Label>
              <Form.Control
                placeholder="Enter your username..."
                className="login-box"
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
              <Form.Label className="login-custom-h2-label">
                Password:
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password..."
                className="login-box"
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
          <div className="d-flex justify-content-end">
            <Button
              style={{ marginRight: "0" }}
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <ClipLoader color="white" size={20} /> : "Login"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
