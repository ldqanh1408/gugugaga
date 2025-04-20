import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Col, Form, Row, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { setRole, setTempRole } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import "./Login.css";
function Login() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="form-1 container w-100 flex-grow-1">
      {/* Overlay che toàn màn hình khi loading */}
      {loading && (
        <div className="loading-overlay">
          <ClipLoader color="#ffffff" size={50} />
        </div>
      )}

      <Row className="w-100 flex-grow-1">
        {/* Companies */}
        <Col className="d-flex flex-column justify-content-center align-items-center text-center p-5 border-end">
          <h2 className="fw-bold">For Companies</h2>
          <p className="text-muted">
            Thousands of companies have embraced the new way to hire and upskill
            developers across roles and throughout their careers.
          </p>
          <Button
            variant="dark"
            className="my-4 px-5"
            onClick={() => {
              dispatch(setTempRole("EXPERT"));
              setTimeout(() => {
                navigate("/login/enter");
              }, 0);
            }}
          >
            Login for expert
          </Button>
          <Button
            variant="dark"
            className="my-4 px-5"
            onClick={() => {
              dispatch(setTempRole("BUSINESS"));
              setTimeout(() => {
                navigate("/login/enter");
              }, 0);
            }}
          >
            Login for business
          </Button>
          <p>
            Don't have an account? <br />
            <span
              onClick={() => navigate("/business/sign-up")}
              className="text-success fw-bold"
              style={{ cursor: "pointer" }}
            >
              Sign up
            </span>
          </p>
        </Col>

        {/* Lovers */}
        <Col className="d-flex flex-column justify-content-center align-items-center text-center p-5">
          <h2 className="fw-bold">For Lovers</h2>
          <p className="text-muted">
            Join over 26 million developers, practice coding skills, prepare for
            interviews, and get hired.
          </p>
          <Button
            variant="outline-dark"
            className="my-4 px-5"
            onClick={async () => {
              dispatch(setTempRole("USER"));
              setTimeout(() => {
                navigate("/login/enter");
              }, 0);
            }}
          >
            login
          </Button>
          <p>
            Don't have an account? <br />
            <span
              onClick={() => navigate("/sign-up")}
              className="text-success fw-bold"
              style={{ cursor: "pointer" }}
            >
              Sign up
            </span>
          </p>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
