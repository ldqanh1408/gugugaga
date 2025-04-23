import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setIsViewing } from "../../redux/complaintSlice";
function ViewInfor() {
  const {isViewing} = useSelector((state) => state?.complaint);
  const dispatch = useDispatch();
  return (
    <div className="history">
       <Row>
        <Col className="left">
          <div>
            <div className="fw-bold">TREATMENT</div>
            <div>Treatment code:</div>
            <div>Time</div>
            <div>Duration</div>
            <div>Status</div>
            <div>Description</div>
            <div>Address</div>
          </div>

          <div>
            <div className="fw-bold">EXPERT</div>
            <div>Expert code:</div>
            <div>Expert name:</div>
            <div>Gendar: </div>
            <div>Diploma</div>
            <div>Number of treatments</div>
            <div>Phone</div>
            <div>Email</div>
          </div>
          <div>
            <div className="fw-bold">USER</div>
            <div>User code:</div>
            <div>User name:</div>
            <div>Gendar: </div>
            <div>Phone</div>
            <div>Email</div>
          </div>
        </Col>
        <Col className="right">
          <div>
            <div className="fw-bold">FEEDBACK</div>
            <div>Star:</div>
            <div>Comment:</div>
            <div>Complaint: </div>
          </div>
          <div>
            <div className="fw-bold">INFORMATION OF BUSINESS</div>
            <div>Business code:</div>
            <div>Business name:</div>
            <div>Business email: </div>
          </div>
        </Col>
      </Row>
      <Button onClick={() => dispatch(setIsViewing(false))}>Close</Button>
    </div>
  );
}

export default ViewInfor;
