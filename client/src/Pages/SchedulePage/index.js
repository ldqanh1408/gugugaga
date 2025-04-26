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
  setSelectedTreatment,
} from "../../redux/expertSlice";
import { setIsViewing, setStatus } from "../../redux/expertSlice";
import { rejectTreatment } from "../../services/treatmentService";
import ViewInfor from "./ViewInfor";
import Current from "./Current";
import Booking from "./Booking";
import Pending from "./Pending";
function SchedulePage() {
  const [filterMode, setFilterMode] = useState("day"); // "day" hoặc "all"
  const [selectedDate, setSelectedDate] = useState(new Date());
  const {
    treatments,
    currentTreatments,
    pendingTreatments,
    selectedTreatment,
    status,
  } = useSelector((state) => state?.expert);
  console.log(currentTreatments);
  const { isViewing } = useSelector((state) => state?.expert);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchTreatments = async () => {
      dispatch(getTreatmentsThunk());
    };
    fetchTreatments();
  }, [dispatch]);

  const renderPage = () => {
    if (status === "pending") {
      return <Pending></Pending>;
    } else if (status === "booking") {
      return <Booking></Booking>;
    } else if (status === "current") {
      return <Current></Current>;
    }
  };

  return (
    <div className="schedule container">
      <h1>Schedule</h1>
      <hr className=""></hr>

      <Row className="d-flex flex-row justify-content-start">
        <Col xs="auto" onClick={() => dispatch(setStatus("booking"))}>
          <Button>Booking</Button>
        </Col>
        <Col xs="auto" onClick={() => dispatch(setStatus("pending"))}>
          <Button>Pending</Button>
        </Col>
        <Col xs="auto" onClick={() => dispatch(setStatus("current"))}>
          <Button>Current</Button>
        </Col>
      </Row>
      <Row>
        <Col sm={12} md={5} className="custom-left">
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
        {renderPage()}
      </Row>
    </div>
  );
}

export default SchedulePage;
