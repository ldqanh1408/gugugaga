import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import './Login.css'
function Login(){
    return(
        <div className="containter form-1">
            <div className="title">
                <h1>Login</h1>
            </div>
            <div className="">
                <Form className="d-flex flex-column form-2">
                    <Form.Group>
                        <Form.Label className="fw-semibold">User name:</Form.Label>
                        <Form.Control placeholder="Nhập tên tài khoản..." className="form-control"></Form.Control>
                        <Form.Text></Form.Text>
                    </Form.Group>
                    <Form.Group className="mt-4">
                        <Form.Label className="fw-semibold">Password:</Form.Label>
                        <Form.Control placeholder="Nhập mật khẩu..." className="form-control"></Form.Control>
                        <Form.Text></Form.Text>
                    </Form.Group>
                </Form>
                <Button>Login</Button>
            </div>
        </div>
    );
}

export default Login;