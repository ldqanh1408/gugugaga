import { useDispatch, useSelector } from "react-redux";
import { setIsViewDetail } from "../../redux/businessSlice";
import { Button, Col, Row } from "react-bootstrap";

function ViewDetail() {
  const { isViewDetail, selectedExpert } = useSelector((state) => state?.business);
  
  const dispatch = useDispatch();
  return (
    <div>
      <Row>
        <Col className="left">
          
          <div>
            <div className="fw-bold">EXPERT</div>
            <div>Expert code:</div> 
            <input value={selectedExpert._id}></input>
            <div>Expert name:</div>
            <input value={selectedExpert.expert_name}></input>
            <div>Gender: </div>
            <select value={selectedExpert.gendar}>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <div>Diploma</div>
            <input type="file"></input>
            <div>Phone</div>
            <input type="phone"></input>
            <div>Email</div>
            <input type="email"></input>
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
      <Button onClick={() => dispatch(setIsViewDetail({ status: false }))}>
        Close
      </Button>
      <Button onClick={() => dispatch(setIsViewDetail({ status: false }))}>
        Edit
      </Button>
      <Button onClick={() => dispatch(setIsViewDetail({ status: false }))}>
        Delete
      </Button>
    </div>
  );
}

export default ViewDetail;
