import React, { useState } from 'react';
import { Form, Button} from 'react-bootstrap';
import './EditProfile.css'

function EditProfile({ onCancel, onSave, initialData }) {
    const [profile, setProfile] = useState(initialData);
    const [isChanged, setIsChanged] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
        setIsChanged(true);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile({ ...profile, avatar: reader.result });
                setIsChanged(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(profile)
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('Data sent:', result);
                alert('Updated successfully!!!');
                onSave(profile);
                setIsChanged(false);
            } 
            else {
                alert ("Failed... Please try again!");
            }
        } catch (error){
            console.error('Error sending data:', error);
            alert('An error occurred while sending data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container edit-profile-container">
            <h1 className="edit-profile-header">Edit Profile</h1>
            <hr className="edit-profile-line"></hr>

            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label className="custom-h2-label">Avatar</Form.Label>

                    <Form.Group className="edit-profile-box">
                        <div className="avatar-content">
                            <div className="avatar-preview">
                                <img 
                                    src={profile.avatar || "/default-avatar.png"} 
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
                            <Form.Control className="no-border" type="text" name="name" value={profile.name} onChange={handleChange} placeholder="Enter your name" />
                    </Form.Group>
                </Form.Group>

                <Form.Group>
                    <Form.Label className="custom-h2-label">Username</Form.Label>
                    <Form.Group className="edit-profile-box">
                        <Form.Control className="no-border" type="text" name="username" value={profile.username} onChange={handleChange} placeholder="Enter your username" />
                    </Form.Group>
                </Form.Group>
                
                <Form.Group>
                    <Form.Label className="custom-h2-label">Bio</Form.Label>
                    <Form.Group className="edit-profile-box">
                        <Form.Control className="no-border" as="textarea" name="bio" value={profile.bio} onChange={handleChange} placeholder="Enter your bio" />
                    </Form.Group>   
                </Form.Group>

                <Form.Group>
                    <Form.Label className="custom-h2-label">Date of Birth</Form.Label>
                    <Form.Group className="edit-profile-box">
                        <Form.Control className="no-border" type="date" name="dob" value={profile.dob} onChange={handleChange} />
                    </Form.Group>
                </Form.Group>

                <Form.Group>
                    <Form.Label className="custom-h2-label">Gender</Form.Label>
                    <Form.Group className="edit-profile-box">
                        <Form.Select 
                            className="no-border"
                            name="gender" 
                            value={profile.gender} 
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
                        <Form.Control className="no-border" type="tel" name="phone" value={profile.phone} onChange={handleChange} placeholder="Enter your phone number" />
                    </Form.Group>
                </Form.Group>

                <Form.Group>
                    <Form.Label className="custom-h2-label">Email</Form.Label>
                    <Form.Group className="edit-profile-box">
                        <Form.Control className="no-border" type="email" name="email" value={profile.email} onChange={handleChange} placeholder="Enter your email" required />
                    </Form.Group>
                </Form.Group>
            
                <div className="edit-profile-btn-wrapper">
                    <Button 
                        style={{
                            marginRight: '0',
                        }}
                        variant="primary" 
                        type="submit" 
                        className="mt-3 edit-profile-btn" 
                        disabled={!isChanged || loading}
                    >
                        {loading ? 'Updating...' : 'Submit'}
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default EditProfile;
