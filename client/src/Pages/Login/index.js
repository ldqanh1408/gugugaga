import React, {useState} from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import { getUsers } from '../../services/userService.js'
import './Login.css'
import {useNavigate} from 'react-router-dom'
function Login(){
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const users = await getUsers();
          const user = users.find((user, index) => user.user_name === userName && user.password === password);
          if(user){
             // Giả sử bạn có một token giả lập để lưu vào localStorage
            const token = 'fake-jwt-token';
            localStorage.setItem('token', token);
            // Chuyển hướng người dùng đến trang khác
            console.log('Login successful:', user);
            navigate('/');
            window.location.reload();
          }
          // Lưu token vào localStorage hoặc state quản lý
            // Chuyển hướng người dùng đến trang khác 
            else {
                setError('Invalid username or password');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('An error occurred. Please try again.');
        }
      };
    return(
        <div className="containter form-1">
            <div className="title">
                <h1>Login</h1>
            </div>
            <div className="">
                <Form className="d-flex flex-column form-2">
                    <Form.Group>
                        <Form.Label className="fw-semibold">User name:</Form.Label>
                        <Form.Control placeholder="Nhập tên tài khoản..." className="form-control" onChange={(e) => setUserName(e.target.value)}></Form.Control>
                        <Form.Text></Form.Text>
                    </Form.Group>
                    <Form.Group className="mt-4">
                        <Form.Label className="fw-semibold">Password:</Form.Label>
                        <Form.Control placeholder="Nhập mật khẩu..." className="form-control" onChange={(e) => setPassword(e.target.value)}></Form.Control>
                        <Form.Text></Form.Text>
                    </Form.Group>
                </Form>
                <Form>
                    <Button type="submit" onClick={handleSubmit}>Login</Button>
                </Form>
            </div>
        </div>
    );
}

export default Login;