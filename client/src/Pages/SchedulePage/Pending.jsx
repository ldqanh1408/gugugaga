import { useState } from "react";
import EditButton from "../../assets/imgs/EditButton.svg";
import FilterButton from "../../assets/imgs/FilterButton.svg";
import { Row, Col, Card, Dropdown, ButtonGroup, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTreatment, setIsViewing, setStatus } from "../../redux/expertSlice";
function Pending() {
    const [filterMode, setFilterMode] = useState("day");
  const {pendingTreatments, status} = useSelector((state) => state?.expert);
  const dispatch = useDispatch();

  return (
    
    <Col sm={12} md={5} className="custom-right">
      <Card className="mb-3 custom-card-title">
        <Card.Body className="fw-bold">
          {" "}
          View list of users booking requests
        </Card.Body>

        {/* div này chứa danh sách tùy chọn lọc dữ liệu. */}
        <div className="filter-dropdown-container">
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle variant="light" className="filter-btn">
              <img src={FilterButton} alt="Filter" />
            </Dropdown.Toggle>

            <Dropdown.Menu align="end">
              <Dropdown.Item
                active={filterMode === "day"}
                onClick={() => setFilterMode("day")}
              >
                View by day
              </Dropdown.Item>

              <Dropdown.Item
                active={filterMode === "all"}
                onClick={() => setFilterMode("all")}
              >
                View all
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Card>
      <div className="treatment-scroll-container">
        {pendingTreatments.length === 0 ? (
          <div className="no-treatments-message">
            No {status === "current" ? "current" : "pending"} treatments found.
          </div>
        ) : (
          pendingTreatments.map((treatment, index) => (
            <Card className="mb-3 custom-card">
              <Card.Body className="custom-card-content">
                <div className="card-header">
                  <span className="time-text"></span>
                </div>
                <div className="card-body">
                  <div>
                    <span className="date-text"></span>
                    <span className="header-text fw-bold">
                      Name: {treatment.expert_id.expert_name}
                    </span>
                    <div className="header-text">Status: pending...</div>
                    <div className="d-flex justify-content-end">
                      <Button
                        className="small-btn"
                        
                      >
                        Accept
                      </Button>
                      <Button
                        className="small-btn"
                        
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </Col>
  );
}

export default Pending;
