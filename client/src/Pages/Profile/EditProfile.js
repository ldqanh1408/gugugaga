import React, { useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';

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
                console.log('Du lieu gui di:', result);
                alert('Updated successfully!!!');
                onSave(profile);
                setIsChanged(false);
            } 
            else {
                alert ("Failed... Please try again!");
            }
        } catch (error){
            console.error('Loi khi gui du lieu:', error);
            alert('Da xay ra loi khi gui du lieu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-profile-container">
            <h1>Edit Profile</h1>
            <hr className="note-line"></hr>

            <Form onSubmit={handleSubmit}>
                <h3>Avatar</h3>
                <Form.Group>
                    <Form.Control type="file" accept="image/*" onChange={handleAvatarChange} />
                </Form.Group>

                <h3>Name</h3>
                <Form.Control type="text" name="name" value={profile.name} onChange={handleChange} placeholder="Enter your name" />

                <h3>Username</h3>
                <Form.Control type="text" name="username" value={profile.username} onChange={handleChange} placeholder="Enter your username" />

                <h3>Bio</h3>
                <Form.Control as="textarea" name="bio" value={profile.bio} onChange={handleChange} placeholder="Enter your bio" />

                <h3>Date of Birth</h3>
                <Form.Control type="date" name="dob" value={profile.dob} onChange={handleChange} />

                <h3>Gender</h3>
                <Form.Control type="text" name="gender" value={profile.gender} onChange={handleChange} placeholder="Enter your gender" />

                <h3>Phone</h3>
                <Form.Control type="tel" name="phone" value={profile.phone} onChange={handleChange} placeholder="Enter your phone number" />

                <h3>Email</h3>
                <Form.Control type="email" name="email" value={profile.email} onChange={handleChange} placeholder="Enter your email" required />

                <h3>Website</h3>
                <Form.Control type="url" name="website" value={profile.website} onChange={handleChange} placeholder="Enter your link" />

                <Button variant="primary" type="submit" className="mt-3" disabled={!isChanged || loading}>
                    {loading ? 'Updating...' : 'Submit'}
                </Button>

            </Form>
        </div>
    );
}

export default EditProfile;
