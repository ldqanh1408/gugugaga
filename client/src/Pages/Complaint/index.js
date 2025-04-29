import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Container, Card, Row, Col, Modal } from "react-bootstrap";
import ViewInfor from "./ViewInfor";
import { setIsViewing } from "../../redux/complaintSlice";
import { getComplaintsThunk } from "../../redux/businessSlice";

function Complaint() {
  const { isViewing } = useSelector((state) => state?.complaint);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const {complaints} = useSelector((state) => state?.business);
  useEffect(() => {
    dispatch(getComplaintsThunk());
  }, [dispatch]);

  const handleView = (complaint) => {
    setSelectedComplaint({
      userName: complaint.user_id?.userName,
      expertName: complaint.expert_id?.expert_name,
      userId: complaint.user_id?._id,
      expertId: complaint.expert_id?._id,
      treatmentId: complaint._id,
      duration: complaint.duration,
      complaint: complaint.complaint,
      description: complaint.description,
      feedback: complaint.feedback,
      rating: complaint.rating,
      treatmentStatus: complaint.treatmentStatus,
      createdAt: complaint.createdAt,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedComplaint(null);
  };
  console.log(complaints)
  return (
    <Container className="history p-4">
      <h1 className="mb-4">Complaints</h1>
      <hr />
      <Row>
        {complaints.map((cp) => (
          <Col md={6} lg={4} key={cp._id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>User name: {cp.user_id?.userName || "Unknown User"}</Card.Title>
                <Card.Text>
                  <strong>Expert:</strong> {cp.expert_id?.expert_name || "Unknown Expert"} <br />
                  <strong>Complaint:</strong> {cp.complaint || "N/A"} <br />
                </Card.Text>
                <Button variant="primary" onClick={() => handleView(cp)}>
                  View
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Complaint Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedComplaint && (
            <div>
              <p>
                <strong>User Name:</strong> {selectedComplaint.userName || "N/A"}
              </p>
              <p>
                <strong>Expert Name:</strong> {selectedComplaint.expertName || "N/A"}
              </p>
              <p>
                <strong>User ID:</strong> {selectedComplaint.userId || "N/A"}
              </p>
              <p>
                <strong>Expert ID:</strong> {selectedComplaint.expertId || "N/A"}
              </p>
              <p>
                <strong>Treatment ID:</strong> {selectedComplaint.treatmentId || "N/A"}
              </p>
              <p>
                <strong>Duration:</strong> {selectedComplaint.duration || "N/A"}
              </p>
              <p>
                <strong>Complaint:</strong> {selectedComplaint.complaint || "N/A"}
              </p>
              <p>
                <strong>Description:</strong> {selectedComplaint.description || "N/A"}
              </p>
              <p>
                <strong>Feedback:</strong> {selectedComplaint.feedback || "N/A"}
              </p>
              <p>
                <strong>Rating:</strong> {selectedComplaint.rating || "N/A"}
              </p>
           
      
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Complaint;
