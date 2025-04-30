import React from "react";

function ExpertProfile() {
    return (
        <div className="profile-container">
            <div className="profile-header"></div>
            <div className="profile-content text-center">
                <h2 className="profile-name">Expert Name</h2>
                <p className="profile-username">expert@example.com</p>
                <p className="profile-bio">Expert in mental health therapy.</p>
                <div className="row profile-stats align-items-center">
                    <div className="col text-center">
                        <h3>50</h3>
                        <p>Sessions Conducted</p>
                    </div>
                    <div className="col-auto">
                        <div className="divider"></div>
                    </div>
                    <div className="col text-center">
                        <h3>4.8</h3>
                        <p>Average Rating</p>
                    </div>
                </div>
                <button className="btn-edit mt-3">Edit Profile</button>
            </div>
        </div>
    );
}

export default ExpertProfile;
