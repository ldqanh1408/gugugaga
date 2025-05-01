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
import Current from "./Current.jsx";
import History from "./History.jsx";
import WaitingFeedback from "./WaitingFeedback.jsx";
import {
  getTreatmentsThunk,
  setIsViewing,
  setSelectedTreatment,
} from "../../redux/userSlice";

import { setStatus } from "../../redux/myTherapySlice.js";
import dateHelper from "../../utils/dateHelper.js";
function MyTherapy() {
  console.log(dateHelper);
  const [filterMode, setFilterMode] = useState("day"); // "day" hoặc "all"
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { treatments } = useSelector((state) => state?.user);
  const { status } = useSelector((state) => state?.myTherapy);
  console.log(status);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchTreaments = () => {
      dispatch(getTreatmentsThunk());
    };
    fetchTreaments();
  }, [dispatch]);

  const renderPage = () => {
    if (status === "current") {
      return <Current></Current>;
    }
    if (status === "feedback") {
      return <WaitingFeedback></WaitingFeedback>;
    }
    if (status === "history") {
      return <History></History>;
    }
  };

  return (
    <div className="schedule container mt-4 fade-in">
      <h1>My Therapy</h1>
      <hr className=""></hr>
      <Row className="d-flex flex-row justify-content-start">
        <Col xs="auto" onClick={() => dispatch(setStatus("current"))}>
          <Button>Current</Button>
        </Col>
        <Col xs="auto" onClick={() => dispatch(setStatus("feedback"))}>
          <Button>Waiting feedback</Button>
        </Col>
        <Col xs="auto" onClick={() => dispatch(setStatus("history"))}>
          <Button>History</Button>
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
                minDate={new Date()}
                dayClassName={(date) =>
                  dateHelper.getDayClassName(date, treatments)
                }
              />
            </div>
          </div>
        </Col>
        {renderPage()}
      </Row>
    </div>
  );
}

export default MyTherapy;
