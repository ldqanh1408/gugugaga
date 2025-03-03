import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import './SignUp.css'
function SignUp(){
    return(
        <div className="containter form-1">
            <div className="title">
                <h1>SignUp</h1>
            </div>
            <div className="">
                <Form className="d-flex flex-column form-2 login">
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

                <Form className="d-flex flex-column form-2 additional">
                    <Form.Group>
                        <Form.Label className="fw-semibold">Name:</Form.Label>
                        <Form.Control placeholder="Nhập tên tài khoản..." className="form-control"></Form.Control>
                        <Form.Text></Form.Text>
                    </Form.Group>
                    <Form.Group className="mt-4">
                        <Form.Label className="fw-semibold">Email:</Form.Label>
                        <Form.Control placeholder="Nhập mật khẩu..." className="form-control"></Form.Control>
                        <Form.Text></Form.Text>
                    </Form.Group>
                    <Form.Group className="mt-4">
                        <Form.Label className="fw-semibold">Phone:</Form.Label>
                        <Form.Control placeholder="Nhập mật khẩu..." className="form-control"></Form.Control>
                        <Form.Text></Form.Text>
                    </Form.Group>
                </Form>
                <Button>Sign up</Button>
            </div>
        </div>
    );
}

export default SignUp;