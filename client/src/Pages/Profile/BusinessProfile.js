import React from "react";

function BusinessProfile() {
    return (
        <div className="profile-container">
            <div className="profile-header"></div>
            <div className="profile-content text-center">
                <h2 className="profile-name">Business Name</h2>
                <p className="profile-username">business@example.com</p>
                <p className="profile-bio">Providing expert mental health services.</p>
                <div className="row profile-stats align-items-center">
                    <div className="col text-center">
                        <h3>20</h3>
                        <p>Experts Managed</p>
                    </div>
                    <div className="col-auto">
                        <div className="divider"></div>
                    </div>
                    <div className="col text-center">
                        <h3>100+</h3>
                        <p>Clients Served</p>
                    </div>
                </div>
                <button className="btn-edit mt-3">Edit Profile</button>
            </div>
        </div>
    );
}

export default BusinessProfile;
