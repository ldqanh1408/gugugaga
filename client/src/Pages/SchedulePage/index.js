import React, { use, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./SchedulePage.css";
import { Row, Col, Card, Dropdown, ButtonGroup, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import EditButton from "../../assets/imgs/EditButton.svg";
import FilterButton from "../../assets/imgs/FilterButton.svg";
import {
  acceptTreatmentThunk,
  getTreatmentsThunk,
  rejectTreatmentThunk,
} from "../../redux/expertSlice";
import { rejectTreatment } from "../../services/treatmentService";
function SchedulePage() {
  const [filterMode, setFilterMode] = useState("day"); // "day" hoặc "all"
  const [status, setStatus] = useState("pending");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { treatments, currentTreatments, pendingTreatments } = useSelector(
    (state) => state?.expert
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchTreatments = async () => {
      dispatch(getTreatmentsThunk());
    };
    fetchTreatments();
  }, [dispatch]);
  return (
    <div className="schedule container">
      <h1>Schedule</h1>
      <hr className=""></hr>
      <Row className="d-flex flex-row justify-content-start">
        <Col xs="auto" onClick={() => setStatus("pending")}>
          <Button>Pending</Button>
        </Col>
        <Col xs="auto" onClick={() => setStatus("current")}>
          <Button>Current</Button>
        </Col>
      </Row>
      {status === "current" ? (
        <Row>
          <Col sm={12} md={5} className="custom-left">
            <h1 className="heading">Calendar</h1>
            <p className="paragraph">Check your day. Check your life.</p>

            <div className="custom-datepicker-container">
              <div className="datepicker-wrapper">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  inline
                  className="custom-datepicker"
                  showYearDropdown
                  showFullMonthYearPicker
                  scrollableYearDropdown
                  yearDropdownItemNumber={2000}
                  showMonthDropdown
                  maxDate={new Date()}
                />
              </div>
            </div>
          </Col>
          <Col sm={12} md={5} className="custom-right">
            <Card className="mb-3 custom-card-title">
              <Card.Body className="fw-bold">
                {" "}
                View Expert's upcoming list
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

            {currentTreatments.length === 0 ? (
              <div className="no-treatments-message">
                No {status === "current" ? "current" : "pending"} treatments
                found.
              </div>
            ) : (
              currentTreatments
                .filter((t) => t.treatmentStatus === "approved")
                .map((treatment, index) => (
                  <Card className="mb-3 custom-card">
                    <Card.Body className="custom-card-content">
                      <div className="card-header">
                        <span className="time-text"></span>
                      </div>
                      <div className="card-body">
                        <div>
                          <span className="date-text"></span>
                          <span className="header-text fw-bold">
                            Name: {treatment.user_id.userName}
                          </span>
                          <div className="header-text">
                            Status: {treatment.treatmentStatus}
                          </div>
                          <div className="d-flex justify-content-end">
                            <Button className="small-btn">View</Button>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))
            )}
          </Col>
        </Row>
      ) : (
        <Row>
          <Col sm={12} md={5} className="custom-left">
            <h1 className="heading">Calendar</h1>
            <p className="paragraph">Check your day. Check your life.</p>

            <div className="custom-datepicker-container">
              <div className="datepicker-wrapper">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  inline
                  className="custom-datepicker"
                  showYearDropdown
                  showFullMonthYearPicker
                  scrollableYearDropdown
                  yearDropdownItemNumber={2000}
                  showMonthDropdown
                  maxDate={new Date()}
                />
              </div>
            </div>
          </Col>
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

            {pendingTreatments.length === 0 ? (
              <div className="no-treatments-message">
                No {status === "current" ? "current" : "pending"} treatments
                found.
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
                            onClick={() =>
                              dispatch(
                                acceptTreatmentThunk({
                                  treatment_id: treatment._id,
                                })
                              )
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            className="small-btn"
                            onClick={() =>
                              dispatch(
                                rejectTreatmentThunk({ treatment_id: treatment._id })
                              )
                            }
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
          </Col>
        </Row>
      )}
    </div>
  );
}

export default SchedulePage;
