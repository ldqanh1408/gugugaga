import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { setIsAddView } from "../../redux/businessSlice";
import { addExpertThunk } from "../../redux/businessSlice";

function ViewAdd() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    expert_name: "",
    account: "",
    password: "",
    gendar: "male",
    diploma_url: "",
  });
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi dữ liệu ở đây (gửi về API backend)
    dispatch(addExpertThunk(formData))
  };
  return (
    <div className="history p-4">
      
      <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formAccount">
              <Form.Label>Tài khoản</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tài khoản đăng nhập"
                name="account"
                value={formData.account}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formPassword">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Mật khẩu"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formName">
              <Form.Label>Họ tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập họ tên"
                name="expert_name"
                value={formData.expert_name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          
        </Row>

        <Row className="mb-3">
          

          <Col md={12}>
            <Form.Group controlId="formDegree">
              <Form.Label>Ảnh bằng cấp</Form.Label>
              <Form.Control
                type="file" 
                name="dipoma_url"
                onChange={handleChange}
                accept="image/*"
              />
            </Form.Group>
          </Col>
        </Row>

        

        <Row className="mb-4">
          <Col md={6}>
            <Form.Group controlId="formGender">
              <Form.Label>Giới tính</Form.Label>
              <Form.Select
                name="gendar"
                value={formData.gendar}
                onChange={handleChange}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex gap-3">
          <Button variant="secondary" onClick={() => dispatch(setIsAddView(false))}>
            Close
          </Button>
          <Button type="submit" variant="primary">
            Add
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default ViewAdd;
