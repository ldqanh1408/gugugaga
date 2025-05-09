import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './Profile.css';

import EditProfile from './EditProfile';
import UserProfile from './UserProfile';
import ExpertProfile from './ExpertProfile';
import BusinessProfile from './BusinessProfile';
import { fetchProfile, fetchEntries, fetchConsecutiveDays, updateAvatar } from '../../redux/userSlice';
import Loading from "../../components/Common/Loading";

function Profile() {
    const dispatch = useDispatch();
    const { loading, entries, consecutiveDays } = useSelector((state) => state.user);
    const { role, entity } = useSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const profile = entity; // Lấy profile từ authSlice
    console.log(profile)
    useEffect(() => {
        if (!profile) {
            dispatch(fetchProfile());
        }
        if (!entries) {
            dispatch(fetchEntries());
        }
        if (!consecutiveDays) {
            dispatch(fetchConsecutiveDays());
        }
    }, [dispatch]);
    if (loading) return <Loading />;

    if (isEditing) {
        return (
            <EditProfile 
                setIsEditing={setIsEditing}
                initialData={profile}
                onSave={(updatedProfile) => {
                    setIsEditing(false);
                    if (updatedProfile.avatar) {
                        dispatch(updateAvatar(updatedProfile.avatar));
                    }
                }}
            />
        );
    }

    switch (role) {
        case "USER":
            return <UserProfile profile={profile} consecutiveDays={consecutiveDays} entries={entries} setIsEditing={setIsEditing} />;
        case "EXPERT":
            return <ExpertProfile />;
        case "BUSINESS":
            return <BusinessProfile />;
        default:
            return <div>Role not recognized</div>;
    }
}

export default Profile;
