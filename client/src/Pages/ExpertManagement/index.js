import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Container, Row, Col } from "react-bootstrap";
import "./ExpertManagement.css";
import { getExpertsThunk } from "../../redux/businessSlice";
import ViewAdd from "./ViewAdd";
import ViewDetail from "./ViewDetail";
import { setIsAddView, setIsViewDetail } from "../../redux/businessSlice";

function ExpertManagement() {
  const { experts, isAddView, isViewDetail } = useSelector(
    (state) => state?.business
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getExpertsThunk());
  }, [dispatch]);

  const renderExpertHeader = () => (
    <Row className="expert-item mb-3 border p-3">
      <Col md={1}>
        <div className="expert-index">#</div>
      </Col>
      <Col md={2}>
        <div className="expert-name">Expert name</div>
      </Col>
      <Col md={2}>
        <div className="expert-email">Expert mail</div>
      </Col>
      <Col md={2}>
        <div className="expert-phone">Expert phone</div>
      </Col>
      <Col md={1}>
        <div className="expert-gender">Gender</div>
      </Col>
      <Col md={2}>
        <div className="expert-account">Account</div>
      </Col>
      <Col md={2}>
        <div>Actions</div>
      </Col>
    </Row>
  );

  const renderExpertItem = (expert, index) => (
    <Row key={expert._id || index} className="expert-item mb-3 border p-3">
      <Col md={1}>
        <div className="expert-index">{index + 1}</div>
      </Col>
      <Col md={2}>
        <div className="expert-name">{expert.expert_name || ""}</div>
      </Col>
      <Col md={2}>
        <div className="expert-email">{expert.expert_email || ""}</div>
      </Col>
      <Col md={2}>
        <div className="expert-phone">{expert.expert_phone || ""}</div>
      </Col>
      <Col md={1}>
        <div className="expert-gender">{expert.gender || ""}</div>
      </Col>
      <Col md={2}>
        <div className="expert-account">{expert.account || ""}</div>
      </Col>
      <Col md={2}>
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            dispatch(setIsViewDetail({ status: true, expert }))
          }
        >
          View
        </Button>
      </Col>
    </Row>
  );

  return (
    <Container className="vh-100">
      <h1 className="mt-4">Expert Management</h1>
      <hr />
      {isAddView ? (
        <ViewAdd />
      ) : isViewDetail ? (
        <ViewDetail />
      ) : (
        <div className="expert-list">
          <div className="d-flex justify-content-end mb-3">
            <Button onClick={() => dispatch(setIsAddView(true))}>
              Add Expert
            </Button>
          </div>
          {renderExpertHeader()}
          <div className="table-container">
            {experts && experts.length > 0 ? (
              experts.map((expert, index) => renderExpertItem(expert, index))
            ) : (
              <div className="text-center">No experts found.</div>
            )}
          </div>
        </div>
      )}
    </Container>
  );
}

export default ExpertManagement;
