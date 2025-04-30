import React from "react";
import userAva from "../../assets/imgs/userDefault.svg";
import "./Profile.css";

function UserProfile({ profile, consecutiveDays, entries, setIsEditing }) {
  return (
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
            <p>Number of days in streak</p>
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
        >
          Edit
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
