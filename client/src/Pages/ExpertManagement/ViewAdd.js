import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { setIsAddView, addExpertThunk } from "../../redux/businessSlice";

function ViewAdd() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    expert_name: "",
    account: "",
    password: "",
    gender: "male",
    file: null,
    expert_phone: "",
    expert_email: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await dispatch(addExpertThunk(formData));
      dispatch(setIsAddView(false)); // Redirect back to ExpertManagement
    } catch (error) {
      console.error("Error adding expert:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(setIsAddView(false));
  };

  return (
    <div className="history p-4">
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          {[
            { label: "Account", name: "account", type: "text", placeholder: "Enter account" },
            { label: "Password", name: "password", type: "password", placeholder: "Enter password" },
            { label: "Full Name", name: "expert_name", type: "text", placeholder: "Enter full name" },
            { label: "Phone", name: "expert_phone", type: "phone", placeholder: "Enter phone number" },
            { label: "Email", name: "expert_email", type: "email", placeholder: "Enter email" },
          ].map(({ label, name, type, placeholder }) => (
            <Col md={6} key={name}>
              <Form.Group controlId={`form${name}`}>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          ))}
          <Col md={6}>
            <Form.Group controlId="formGender">
              <Form.Label>Gender</Form.Label>
              <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formDiploma">
              <Form.Label>Diploma Image</Form.Label>
              <Form.Control
                type="file"
                name="file"
                onChange={handleChange}
                accept="image/*"
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex gap-3">
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            Close
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? <Spinner animation="border" size="sm" /> : "Add"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default ViewAdd;
