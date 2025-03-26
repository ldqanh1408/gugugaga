import './ChangePassword.css';
import {Form, Button} from 'react-bootstrap';

function ChangePassword() {
    return(
        <div className="container change-password-container">
            <h1 className="change-password-header">Change Your Password</h1>
            <hr className="change-password-line"></hr>

            <Form>
                {/*mật khẩu hiện tjai */}
                <Form.Group className="mb-3" controlId="currentPassword">
                    <Form.Label className="pass-custom-h2-label">Current Password</Form.Label> 
                    <Form.Group className="change-password-box">    
                        <Form.Control className="no-border" type="password" placeholder="Enter your current password"/>
                    </Form.Group>
                </Form.Group>

                {/* Mật khẩu mới */}
                <Form.Group className="mb-3" controlId="newPassword">
                    <Form.Label className="pass-custom-h2-label">New Password</Form.Label>
                    <Form.Group className="change-password-box">
                        <Form.Control className="no-border" type="password" placeholder="Enter new password" />
                    </Form.Group>
                </Form.Group>

                {/* Xác nhận mật khẩu mới */}
                <Form.Group className="mb-3" controlId="confirmNewPassword">
                    <Form.Label className="pass-custom-h2-label">Confirm New Password</Form.Label>
                    <Form.Group className="change-password-box">
                        <Form.Control className="no-border" type="password" placeholder="Confirm new password" />
                    </Form.Group>
                </Form.Group>

                {/* Nút lưu */}
                <div className="d-flex justify-content-end">
                    <Button style={{marginRight: '0'}}className="change-password-btn" type="submit">
                        Save Change
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default ChangePassword;