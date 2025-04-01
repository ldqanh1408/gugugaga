import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Profile.css';
import userAva from "../../assets/imgs/userDefault.svg"; 
import EditProfile from './EditProfile';
import { fetchUser, fetchProfile, updateAvatar, fetchEntries, fetchConsecutiveDays } from '../../redux/userSlice';
import Loading from "../../components/Common/Loading"

function Profile() {
    const dispatch = useDispatch();
    const { user, profile, loading, entries, consecutiveDays } = useSelector((state) => state.user);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if(!profile){
            dispatch(fetchProfile());
        }
        if(!entries){
            dispatch(fetchEntries());
        }
        if(!consecutiveDays){
            dispatch(fetchConsecutiveDays());
        }
    }, [dispatch]);

        

    const handleSave = (updatedProfile) => {
        setIsEditing(false);
        // Đồng bộ avatar (nếu avatar trong profile thay đổi)
        if (updatedProfile.avatar) {
            dispatch(updateAvatar(updatedProfile.avatar));  // Cập nhật avatar cho cả user và profile
        }
    };

    if (loading) return <Loading></Loading>;
    return (
        <div>
            {isEditing ? (
                <EditProfile 
                    setIsEditing={setIsEditing}
                    initialData={profile}
                    onSave={handleSave}
                />    
            ) : (
                <div className="profile-container"> 
                    <div className="profile-header"></div>
                    <div className="profile-content text-center">
                        <img
                            src={profile?.avatar || userAva}
                            alt="userAva"
                            className="img-fluid rounded-circle profile-image"
                        />
                        <h2 className="profile-name">{profile?.nickName}</h2>
                        <p className="profile-username">{profile?.userName}</p>
                        <p className="profile-bio">{profile?.bio}</p>
                   

                        <div className="row profile-stats align-items-center">
                            <div className="col text-center">
                                <h3>{consecutiveDays}</h3>
                                <p>Number of days in streak  </p>
                            </div>
                            <div className="col-auto">
                                <div className="divider"></div>
                            </div>
                            <div className="col text-center">
                                <h3>{entries.length}</h3>
                                <p>Number of days with different entries</p>
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
