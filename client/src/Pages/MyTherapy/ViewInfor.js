import React, { useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setIsViewing, updateTreatmentThunk } from "../../redux/userSlice";

function ViewInfor() {
  const { selectedTreatment } = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    rating: selectedTreatment?.rating || "",
    feedback: selectedTreatment?.feedback || "",
    complaint: selectedTreatment?.complaint || "",
  });
  const getValueByPath = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  };

  const handleFeedbackChange = (key, value) => {
    setFeedbackData((prev) => ({ ...prev, [key]: value }));
  };
  const renderField = (label, isSelect = false, customOptions = [], key, readOnly = true) => {
    const isFeedbackField = ["rating", "feedback", "complaint"].includes(key);
    const value = isFeedbackField ? feedbackData[key] ?? "" : getValueByPath(selectedTreatment, key) ?? "";
    return (
      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm="4" className="text-end">
          {label}
        </Form.Label>
        <Col sm="8">
          {isSelect ? (
            <Form.Select
              value={value.toString()}
              disabled={readOnly}
              onChange={(e) => isFeedbackField && handleFeedbackChange(key, e.target.value)}
            >
              <option value="">Select</option>
              {customOptions.length > 0
                ? customOptions.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))
                : [
                    <option key="male" value="male">Male</option>,
                    <option key="female" value="female">Female</option>,
                    <option key="other" value="other">Other</option>,
                  ]}
            </Form.Select>
          ) : (
            <Form.Control
              type="text"
              value={value}
              disabled={readOnly}
              onChange={(e) => isFeedbackField && handleFeedbackChange(key, e.target.value)}
            />
          )}
        </Col>
      </Form.Group>
    );
  };

  const handleSave = async () => {
    dispatch(updateTreatmentThunk({treatment_id: selectedTreatment._id, data:feedbackData}));
    
    setIsEditing(false);
    // dispatch an update action here if needed
  };
  return (
    <div className="history p-3">
      <Row>
        <Col md={6}>
          <div className="fw-bold mb-2">TREATMENT</div>
          {renderField("Treatment code:", false, [], "_id")}
          {renderField("Time", false, [], "schedule_id.start_time")}
          {renderField("Duration", false, [], "duration")}
          {renderField("Status", false, [], "treatmentStatus")}
          {renderField("Description", false, [], "description")}
          {renderField("Address", false, [], "address")}

          <div className="fw-bold mt-4 mb-2">EXPERT</div>
          {renderField("Expert code:", false, [], "expert_id._id")}
          {renderField("Expert name:", false, [], "expert_id.expert_name")}
          {renderField("Gender:", true, [], "expert_id.gendar")}
          {renderField("Phone", false, [], "expert_id.expert_phone")}
          {renderField("Email", false, [], "expert_id.expert_email")}

          <div className="fw-bold mt-4 mb-2">USER</div>
          {renderField("User code:", false, [], "user_id._id")}
          {renderField("User name:", false, [], "user_id.userName")}
          {renderField("Gender:", true, [], "user_id.gender")}
          {renderField("Phone", false, [], "user_id.phone")}
          {renderField("Email", false, [], "user_id.email")}
        </Col>

        <Col md={6}>
          <div className="fw-bold mb-2">FEEDBACK</div>
          {renderField("Star:", true, [
            { value: "1", label: "Bad" },
            { value: "2", label: "Not oke" },
            { value: "3", label: "Neutral" },
            { value: "4", label: "So good" },
            { value: "5", label: "Very good" },
          ], "rating", !isEditing)}
          {renderField("Comment:", false, [], "feedback", !isEditing)}
          {renderField("Complaint:", false, [], "complaint", !isEditing)}

          <div className="fw-bold mt-4 mb-2">INFORMATION OF BUSINESS</div>
          {renderField("Business code:", false, [], "business_id._id")}
          {renderField("Business name:", false, [], "business_id.business_name")}
          {renderField("Business email:", false, [], "business_id.business_email")}
          <div className="mt-4 text-end">
        {isEditing ? (
          <Button variant="success" onClick={handleSave}>
            Save
          </Button>
        ) : (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => dispatch(setIsViewing(false))}
        >
          Close
        </Button>
      </div>
        </Col>
      </Row>

     
    </div>
  );
}

export default ViewInfor;
