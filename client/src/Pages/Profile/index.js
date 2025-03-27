import React, {useState, useEffect} from 'react';
import './Profile.css';
import userAva from "../../assets/imgs/userAva.jpg"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditProfile from './EditProfile';

function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [consecutiveDays, setConsecutiveDays] = useState(0);
    const [profileData, setProfileData] = useState({
        avatar: userAva,
        name: 'Công Chúa Bong Bóng',
        username: '@your_little_princess',
        bio: 'Thắng đời 1-0 vì biết đến website viết nhật ký siêu tâm lí như này',
        dob: '',
        gender: '',
        phone: '',
        email: '',
        website: ''
    });

    useEffect (() => {
        const fetchConsecutiveDays = async () => {
            try {
                const response = await fetch(`/api/v1/journals/${profileData.journalId}/stats/consecutive-days`);
                const data = await response.json();
                setConsecutiveDays(data.consecutiveDays);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu số ngày viết liên tục:", error);
            }
        };

        fetchConsecutiveDays();
        }, [profileData.journalId]
    );

    const handleSave = (updatedProfile) => {
        setProfileData(updatedProfile);
        setIsEditing(false);
    };

    return (
        <div>
            {isEditing ? (
                <EditProfile 
                    initialData={profileData} //truyen data ban dau
                    onSave={handleSave} //Them callback
                />    
            ) :(
                <div className="profile-container"> 
                    <div className="profile-header"></div>
                    <div className="profile-content text-center">
                        <img
                            src={profileData.avatar}
                            alt="userAva"
                            className="img-fluid rounded-circle profile-image"
                        />

                        <h2 className="profile-name">{profileData.name}</h2>
                        <p className="profile-username">{profileData.username}</p>
                        <p className="profile-bio">{profileData.bio}</p>

                        <div className="row profile-stats align-items-center">
                            <div className="col text-center">
                                <h3>{consecutiveDays}</h3>
                                <p>days streak</p>
                            </div>
                            <div className="col-auto">
                                <div className="divider"></div>
                            </div>
                            <div className="col text-center">
                                <h3>15</h3>
                                <p>pages of diary entries</p>
                            </div>
                        </div>

                        <button 
                            className="btn btn-edit mt-3"
                            onClick={() => setIsEditing(true)}
                        >Edit</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;