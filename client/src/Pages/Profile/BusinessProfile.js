import React, { useEffect } from "react";
import "./Profile.css";
import { useDispatch, useSelector } from "react-redux";
import { getExpertsThunk } from "../../redux/businessSlice";

function BusinessProfile() {
  const {entity} = useSelector((state) => state.auth);
  const {experts, treatments} = useSelector((state) => state.business);
  const dispatch = useDispatch();
  useEffect(() => {
    if(experts.length === 0) {
      dispatch(getExpertsThunk());
    }
  }, [dispatch]);
  return (
    <div className="profile-container">
      <div className="profile-header"></div>
      <div className="profile-content text-center">
        <h2 className="profile-name">{entity?.business_name}</h2> 
        <p className="profile-username">{entity.business_email}</p>
        <p className="profile-bio">Providing expert mental health services.</p>
        <div className="row profile-stats align-items-center">
          <div className="col text-center">
            <h3>{experts?.length}</h3>
            <p>Experts Managed</p>
          </div>
          
        </div>
        <button className="btn-edit mt-3">Good job!</button>
      </div>
    </div>
  );
}

export default BusinessProfile;
