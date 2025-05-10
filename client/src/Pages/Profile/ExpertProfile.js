import React, { useEffect } from "react";
import "./Profile.css";

import { useDispatch, useSelector } from "react-redux";
import { getTreaments } from "../../services/userService";
import { getAverageRatingThunk, getTreatmentsThunk } from "../../redux/expertSlice";

function ExpertProfile() {
  const { treatments, averageRating } = useSelector((state) => state?.expert);
  const {entity} = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    if(treatments?.length === 0) {
      dispatch(getTreatmentsThunk());
    }
    dispatch(getAverageRatingThunk({ expert_id: entity?._id }));
  }, [dispatch]);
  return (
    <div className="profile-container">
      <div className="profile-header"></div>
      <div className="profile-content text-center">
        <h2 className="profile-name">{entity.expert_name}</h2>
        <p className="profile-username">{entity.expert_email}</p>
        <p className="profile-bio">Expert in mental health therapy.</p>
        <div className="row profile-stats align-items-center">
          <div className="col text-center">
            <h3>{treatments?.length || 0}</h3>
            <p>Sessions Conducted</p>
          </div>
          <div className="col-auto">
            <div className="divider"></div>
          </div>
          <div className="col text-center">
            <h3>{averageRating}</h3>
            <p>Average Rating</p>
          </div>
        </div>
        <button className="btn-edit mt-3">Good job</button>
      </div>
    </div>
  );
}

export default ExpertProfile;
