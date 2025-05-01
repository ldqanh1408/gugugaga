import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import userAva from "../../assets/imgs/userDefault.svg"; 
import EditExpertProfile from './EditExpertProfile';
import { fetchUser, fetchProfile, updateAvatar, fetchEntries, fetchConsecutiveDays } from '../../redux/userSlice';
import Loading from "../../components/Common/Loading"
function ExpertProfile() {
  const dispatch = useDispatch();
      const { user, profile, loading, entries, consecutiveDays } = useSelector((state) => state.user);
      const [isEditing, setIsEditing] = useState(true);
  
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
  
  return (
    <div>
      {isEditing ? (
                <EditExpertProfile 
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

           <div className="line"></div>
           <div>
            <div>Nơi công tác :</div>
            <div>Nơi công tác :</div>
            <div>Nơi công tác :</div>
            <div>Nơi công tác :</div>
           </div>
          </div>
        </div>)}
    </div>
  );
}

export default ExpertProfile;
