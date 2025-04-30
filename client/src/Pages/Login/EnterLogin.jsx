import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Col, Form, Row, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { handleBlur, handleFocus } from "../../services";
import { ACCOUNT, PASSWORD } from "../../constants";
import { ClipLoader } from "react-spinners";
import "./Login.css";
import { loggingThunk, setIsAuthenticated, setRole } from "../../redux/authSlice.js";
import { useDispatch } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";


import Loading from "../../components/Common/Loading";
import { useSelector } from "react-redux";

function EnterLogin() {
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
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const {tempRole} = useSelector((state) => state?.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const formData = {
        account,
        password,
        role: tempRole
      }
      const response = await dispatch(loggingThunk(formData));
      console.log(response);
      if(response.payload?.data?.data) {
        await dispatch(setIsAuthenticated(true))
        navigate("/");
      } ;
    }
    catch(error){
      console.error(error.message);
    }
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
              <Form.Label className="signup-custom-h2-label">
                Account:
              </Form.Label>
              <Form.Control
                onChange={(e) => setAccount(e.target.value)}
                placeholder="Enter your username..."
                className="signup-box"
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
              <Form.Label className="signup-custom-h2-label">
                Password:
              </Form.Label>
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
    </div>
  );
}

export default EnterLogin