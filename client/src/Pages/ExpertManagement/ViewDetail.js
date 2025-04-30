import { useDispatch, useSelector } from "react-redux";
import {
  setIsViewDetail,
  updateExpertThunk,
  deleteExpertThunk,
} from "../../redux/businessSlice";
import { Button, Col, Row, Form, Modal, Spinner } from "react-bootstrap";
import { useState } from "react";

function ViewDetail() {
  const { isViewDetail, selectedExpert } = useSelector(
    (state) => state?.business
  );
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [filePreview, setFilePreview] = useState(selectedExpert.diploma_url);
  const [file, setFile] = useState(null);
  const [feedbackData, setFeedbackData] = useState({
    ...selectedExpert,
    expert_id: selectedExpert._id,
    file: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleFeedbackChange = (key, value) => {
    setFeedbackData((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await dispatch(updateExpertThunk({ ...feedbackData, file }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating expert:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await dispatch(deleteExpertThunk({ expert_id: selectedExpert._id }));
      dispatch(setIsViewDetail({ status: false }));
    } catch (error) {
      console.error("Error deleting expert:", error);
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  const renderField = (
    label,
    isSelect = false,
    customOptions = [],
    key,
    readOnly = true,
    type = "text"
  ) => {
    const value = key
      .split(".")
      .reduce((acc, part) => acc?.[part], feedbackData);

    if (key === "diploma_url" && value) {
      return (
        <Form.Group as={Row} className="mb-2">
          <Form.Label column sm="4" className="text-end">
            {label}
          </Form.Label>
          <Col sm="8">
            <Form.Control
              type="file"
              disabled={!isEditing}
              onChange={(e) => {
                if (e.target.files[0]) {
                  const previewUrl = URL.createObjectURL(e.target.files[0]);
                  setFilePreview(previewUrl);
                  setFile(e.target.files[0]);
                }
              }}
            />
            <img
              src={filePreview}
              alt="Diploma"
              style={{ width: "200px", height: "auto" }}
            />
          </Col>
        </Form.Group>
      );
    }

    return (
      <Form.Group as={Row} className="mb-2">
        <Form.Label column sm="4" className="text-end">
          {label}
        </Form.Label>
        <Col sm="8">
          {isSelect ? (
            <Form.Select
              value={value?.toString()}
              disabled={readOnly}
              onChange={(e) => handleFeedbackChange(key, e.target.value)}
            >
              <option value="">Select</option>
              {customOptions.length > 0
                ? customOptions.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))
                : ["Male", "Female", "Other"].map((gender) => (
                    <option key={gender} value={gender.toLowerCase()}>
                      {gender}
                    </option>
                  ))}
            </Form.Select>
          ) : type === "textarea" ? (
            <Form.Control
              as="textarea"
              rows={3}
              value={value}
              disabled={readOnly}
              onChange={(e) => handleFeedbackChange(key, e.target.value)}
            />
          ) : (
            <Form.Control
              type={type}
              value={value}
              disabled={readOnly}
              onChange={(e) => handleFeedbackChange(key, e.target.value)}
            />
          )}
        </Col>
      </Form.Group>
    );
  };

  return (
    <div>
      <Row>
        <Col>
          <div className="fw-bold">EXPERT</div>
          {renderField("Expert code:", false, [], "_id")}
          {renderField("Expert name:", false, [], "expert_name", !isEditing)}
          {renderField("Gender:", true, [], "gender", !isEditing)}
          {renderField("Phone", false, [], "expert_phone", !isEditing)}
          {renderField("Email", false, [], "expert_email", !isEditing)}
          {renderField("Diploma", false, [], "diploma_url", !isEditing, "file")}
        </Col>
        <Col>
          <div className="fw-bold">INFORMATION OF BUSINESS</div>
          {renderField("Business code:", false, [], "business_id._id")}
          {renderField(
            "Business name:",
            false,
            [],
            "business_id.business_name"
          )}
          {renderField(
            "Business email:",
            false,
            [],
            "business_id.business_email"
          )}
        </Col>
      </Row>

      <div className="mt-4 text-end">
        {isEditing ? (
          <>
            <Button
              variant="success"
              onClick={handleUpdate}
              disabled={isLoading}
            >
              {isLoading ? <Spinner animation="border" size="sm" /> : "Save"}
            </Button>
            <Button
              variant="danger"
              className="ms-2"
              onClick={() => setShowModal(true)}
              disabled={isLoading}
            >
              Delete
            </Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => dispatch(setIsViewDetail({ status: false }))}
        >
          Close
        </Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this expert?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? <Spinner animation="border" size="sm" /> : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ViewDetail;
