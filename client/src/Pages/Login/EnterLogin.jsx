import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { handleBlur, handleFocus } from "../../services";
import { ACCOUNT, PASSWORD } from "../../constants";
import { ClipLoader } from "react-spinners";
import "./Login.css";
import { loggingThunk, setIsAuthenticated } from "../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Common/Loading";
import { toast } from "react-toastify";
import { fetchTodayMails } from "../../redux/userSlice";

function EnterLogin() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [accountError, setAccountError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const { tempRole, error, loading, entity } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        account,
        password,
        role: tempRole,
      };
      console.log("formData", formData);
      const response = await dispatch(loggingThunk(formData)).unwrap();
      
      if (response.success) {
        await dispatch(setIsAuthenticated(true));

        // Kiểm tra thư đến hạn
        if (entity?._id) {
          const result = await dispatch(fetchTodayMails(entity._id)).unwrap();
          if (result?.length > 0) {
            toast.info(`Bạn có ${result.length} thư từ quá khứ đến!`, {
              autoClose: 2000,
              onClose: () => navigate("/today-mails"),
            });
            return; // Return để không navigate đến trang chủ
          }
        }

        navigate("/");
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error(error.message);
      setShowErrorModal(true);
    }
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div className="container">
      {loading && <Loading />}
      <div>
        <div>
          <h1 className="signup-header">Login for {tempRole}</h1>
          <hr className="signup-line"></hr>
        </div>

        <div className="">
          <Form className="d-flex flex-column form-1 login">
            <Form.Group className="mt-4">
              <Form.Label className="signup-custom-h2-label">Account:</Form.Label>
              <Form.Control
                onChange={(e) => setAccount(e.target.value)}
                placeholder="Enter your username..."
                className="signup-box"
                onBlur={() =>
                  handleBlur({
                    field: ACCOUNT,
                    account,
                    password,
                    setAccountError,
                    setPasswordError,
                  })
                }
                onFocus={() =>
                  handleFocus({
                    field: ACCOUNT,
                    account,
                    password,
                    setAccountError,
                    setPasswordError,
                  })
                }
              ></Form.Control>
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
                    setAccountError,
                    setPasswordError,
                  })
                }
                onFocus={() =>
                  handleFocus({
                    field: PASSWORD,
                    account,
                    password,
                    setAccountError,
                    setPasswordError,
                  })
                }
              ></Form.Control>
              <Form.Text className="text-danger">{passwordError}</Form.Text>
            </Form.Group>
            <Button
              style={{ marginRight: "0" }}
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <ClipLoader color="white" size={20} /> : "Login"}
            </Button>
          </Form>
        </div>
      </div>

      <Modal show={showErrorModal} onHide={closeErrorModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login Failed</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error || "An unknown error occurred. Please try again."}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeErrorModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EnterLogin;