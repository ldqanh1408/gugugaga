import React, { use, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./SchedulePage.css";
import { Row, Col, Card, Dropdown, ButtonGroup, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import EditButton from "../../assets/imgs/EditButton.svg";
import FilterButton from "../../assets/imgs/FilterButton.svg";
function SchedulePage() {
  const [filterMode, setFilterMode] = useState("day"); // "day" hoặc "all"
  const [showDropdown, setShowDropdown] = useState(false); // Hiển thị dropdown
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("pending");
  const displayedNotes = [];
  const notes = [];
  const [selectedDate, setSelectedDate] = useState(new Date());
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

            <Card className="mb-3 custom-card">
              <Card.Body className="custom-card-content">
                <div className="card-header">
                  <span className="time-text"></span>
                </div>
                <div className="card-body">
                  <span className="date-text"></span>
                  <span className="header-text fw-bold">Name: Phạm Minh D</span>
                  <span className="header-text">Time: 30/05/2005</span>
                  <span className="header-text">Des: IM SO TIRED</span>
                  <div className="d-flex justify-content-end">
                    <Button className="small-btn">View</Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
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

            <Card className="mb-3 custom-card">
              <Card.Body className="custom-card-content">
                <div className="card-header">
                  <span className="time-text"></span>
                </div>
                <div className="card-body">
                  <span className="date-text"></span>
                  <span className="header-text fw-bold">Name: Phạm Minh D</span>
                  <span className="header-text">Time: 30/05/2005</span>
                  <span className="header-text">Des: IM SO TIRED</span>
                  <div className="d-flex justify-content-end">
                    <Button className="small-btn">Accept</Button>
                    <Button className="small-btn">Reject</Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default SchedulePage;
