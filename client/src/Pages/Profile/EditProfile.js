import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Modal } from 'react-bootstrap';
import './EditProfile.css';
import avatarPlaceholder from "../../assets/imgs/userDefault.svg";import { updateAvatar, updateProfile, uploadProfileAsync } from '../../redux/userSlice'; // Redux action
import {Loading} from "../../components/Common/Loading"
function EditProfile({ setIsEditing }) {
    const dispatch = useDispatch();
    const profileData = useSelector((state) => state?.user?.profile); // Lấy profile từ Redux store
    console.log("profileData", profileData)
    const [profile, setProfile] = useState(profileData);
    const [isChanged, setIsChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
        setIsChanged(true);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {

            setAvatarFile(file); // Lưu file để upload sau

            // Hiển thị ảnh preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile({ ...profile, avatarPreview: reader.result });
                setIsChanged(true);
            };
            reader.readAsDataURL(file);
        }
    };
    const isValidAccount = (account) => {
        const accountRegex = /^[a-zA-Z0-9._]{5,20}$/;
        return accountRegex.test(account);
      };
    
      const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      };
    
      const isValidPassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%,?&#])[A-Za-z\d@$!%,?&#]{8,32}$/;
        return passwordRegex.test(password) && !/\s/.test(password);
      };
    
      const isValidPhoneNumber = (phone) => {
        const phoneRegex = /^(0|\+84)(\d{9})$/;
        return phoneRegex.test(phone);
      };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validation checks
        if (!isValidAccount(profile?.userName)) {
            setErrorMessage("Invalid account. Please ensure it is 5-20 characters long and contains only letters, numbers, dots, or underscores.");
            setShowErrorModal(true);
            setLoading(false);
            return;
        }
    
        if (!isValidEmail(profile?.email)) {
            setErrorMessage("Invalid email format. Please enter a valid email.");
            setShowErrorModal(true);
            setLoading(false);
            return;
        }
    
        if (!isValidPhoneNumber(profile?.phone)) {
            setErrorMessage("Invalid phone number. Please enter a valid phone number starting with 0 or +84.");
            setShowErrorModal(true);
            setLoading(false);
            return;
        }

        // Proceed with profile update
        try {
            const newProfile = await dispatch(uploadProfileAsync({ profile, avatarFile })); // Cập nhật qua Redux action
            await dispatch(updateAvatar(newProfile.avatar));
            setIsEditing(false);
            window.location.reload();
        } catch (error) {
            console.error('Error updating profile:', error);
            setErrorMessage("Failed to update profile. Please try again.");
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    const closeErrorModal = () => {
        setShowErrorModal(false);
        setIsEditing(false);
    };

    return (
        <div className="container edit-profile-container wrapper">
            <h1 className="edit-profile-header">Edit Profile</h1>
            <hr className="edit-profile-line" />

            <Form onSubmit={handleSubmit} className='wrapper'>
                <Form.Group>
                    <Form.Label className="custom-h2-label">Avatar</Form.Label>
                    <Form.Group className="edit-profile-box">
                        <div className="avatar-content">
                            <div className="avatar-preview">

                                <img
                                    src={profile?.avatarPreview || profile?.avatar || avatarPlaceholder}
                                    alt="Avatar"

                                    className="avatar-image"
                                />
                            </div>

                            <div className="change-photo-area">
                                <Form.Label htmlFor="avatar-input" className="change-photo-text">
                                    Change photo
                                </Form.Label>
                                <Form.Control
                                    id="avatar-input"

                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}

                                    className="custom-avatar-input"
                                />
                            </div>
                        </div>
                    </Form.Group>
                </Form.Group>

                <Form.Group>
                    <Form.Label className="custom-h2-label">Name</Form.Label>
                    <Form.Group className="edit-profile-box">
                        <Form.Control
                            className="no-border"
                            type="text"
                            name="userName"
                            value={profile?.userName}
                            onChange={handleChange}
                            placeholder="Enter your name"
                        />
                    </Form.Group>
                </Form.Group>

                <Form.Group>
                    <Form.Label className="custom-h2-label">Bio</Form.Label>
                    <Form.Group className="edit-profile-box">
                        <Form.Control
                            className="no-border bio"
                            as="textarea"
                            name="bio"
                            value={profile?.bio}
                            onChange={handleChange}
                            placeholder="Enter your bio"
                        />
                    </Form.Group>
                </Form.Group>

                <Form.Group>
                    <Form.Label className="custom-h2-label">Date of Birth</Form.Label>
                    <Form.Group className="edit-profile-box">
                        <Form.Control
                            className="no-border"
                            type="date"
                            name="dob"
                            value={profile?.dob ? profile.dob.split('T')[0] : ''}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Form.Group>

                <Form.Group>
                    <Form.Label className="custom-h2-label">Gender</Form.Label>
                    <Form.Group className="edit-profile-box">
                        <Form.Select
                            className="no-border"
                            name="gender"
                            value={profile?.gender}
                            onChange={handleChange}
                        >
                            <option value="">-- Select Gender --</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Secret!!!</option>
                        </Form.Select>
                    </Form.Group>
                </Form.Group>

                <Form.Group>
                    <Form.Label className="custom-h2-label">Phone</Form.Label>
                    <Form.Group className="edit-profile-box">
                        <Form.Control
                            className="no-border"
                            type="tel"
                            name="phone"
                            value={profile?.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                        />
                    </Form.Group>
                </Form.Group>

                <Form.Group>
                    <Form.Label className="custom-h2-label">Email</Form.Label>
                    <Form.Group className="edit-profile-box">
                        <Form.Control
                            className="no-border"
                            type="email"
                            name="email"
                            value={profile?.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </Form.Group>
                </Form.Group>

                <div className="edit-profile-btn-wrapper d-flex justify-content-end">
                    <Button
                        style={{ marginRight: '10px' }}
                        variant="primary"
                        type="submit"
                        className="mt-3 edit-profile-btn"
                        disabled={!isChanged || loading}
                    >
                        {loading ? 'Updating...' : 'Submit'}
                    </Button>

                    <Button
                        style={{ marginRight: '0' }}
                        variant="primary"
                        className="mt-3 edit-profile-btn "
                        disabled={loading}
                        onClick={() => setIsEditing(false)}
                    >
                        {loading ? 'Updating...' : 'Close'}
                    </Button>
                </div>
            </Form>

            <Modal show={showErrorModal} onHide={closeErrorModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Update Failed</Modal.Title>
                </Modal.Header>
                <Modal.Body>{errorMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeErrorModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default EditProfile;
