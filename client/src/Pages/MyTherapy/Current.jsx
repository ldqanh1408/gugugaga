import "./MyTherapy.css";
import React, { use, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Row,
  Col,
  Card,
  Dropdown,
  ButtonGroup,
  Button,
  Container,
} from "react-bootstrap";
import ViewInfor from "./ViewInfor";
import DatePicker from "react-datepicker";
import EditButton from "../../assets/imgs/EditButton.svg";
import FilterButton from "../../assets/imgs/FilterButton.svg";
import { getTreaments } from "../../services/userService";
import {
  getTreatmentsThunk,
  setIsViewing,
  setSelectedTreatment,
} from "../../redux/userSlice";
import dateHelper from "../../utils/dateHelper.js";
function Current() {
  const [filterMode, setFilterMode] = useState("day"); // "day" hoặc "all"
  const [status, setStatus] = useState("pending");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { treatments, currentTreatments, pendingTreatments, isViewing } =
    useSelector((state) => state?.user);
  const dispatch = useDispatch();
  return (
    <Col sm={12} md={5} className="custom-right">
      <Card className="mb-3 custom-card-title">
        <Card.Body className="fw-bold"> View Expert's upcoming list</Card.Body>

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
        {currentTreatments?.length === 0 ? (
          <div className="no-treatments-message">
            No {status === "current" ? "current" : "pending"} treatments found.
          </div>
        ) : (
          currentTreatments?.map((treatment, index) => (
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
                    <div className="header-text">
                      Status: {treatment.treatmentStatus}
                    </div>
                    <div className="header-text">
                      Description: {treatment.description}
                    </div>
                    <div>
                      Start at:{" "}
                      {dateHelper.formatDateToVN(
                        treatment.schedule_id.start_time
                      )}
                    </div>
                    <div>Duration: {treatment.duration} minutes</div>
                    <div className="d-flex justify-content-end">
                      <Button
                        className="small-btn"
                        onClick={() => {
                          dispatch(setSelectedTreatment(treatment));
                          dispatch(setIsViewing(true));
                        }}
                      >
                        View
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

export default Current;
