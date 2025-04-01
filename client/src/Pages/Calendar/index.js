import "./Calendar.css";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Card, Dropdown, ButtonGroup } from "react-bootstrap";
import { fetchNotes, setCurrentIndex, setIsEditing } from "../../redux/notesSlice";
import { ReactComponent as HappyIcon } from "../../assets/icons/happy.svg";
import { ReactComponent as SadIcon } from "../../assets/icons/sad.svg";
import { ReactComponent as ExcitedIcon } from "../../assets/icons/excited.svg";
import { ReactComponent as AngryIcon } from "../../assets/icons/angry.svg";
import { ReactComponent as NeutralIcon } from "../../assets/icons/neutral.svg";
import EditButton from "../../assets/imgs/EditButton.svg";
import FilterButton from "../../assets/imgs/FilterButton.svg"
import {updateExistingNote} from "../../redux/notesSlice"
import { getEntries } from "../../services";

function Calendar() {
  const [filterMode, setFilterMode] = useState("day"); // "day" hoặc "all"
  const [showDropdown, setShowDropdown] = useState(false); // Hiển thị dropdown
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lấy dữ liệu từ Redux store
  const { notes, loading, error, currentNote, currentIndex } = useSelector((state) => state.notes);
  
  // Định dạng ngày
  const formatDateLocal = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  const noteDatesSet = new Set(notes.map((note) => formatDateLocal(note.createdAt)));

  // Thêm dấu chấm nhỏ vào những ngày có ghi chú
  const getDayClassName = (date) => {
    return noteDatesSet.has(formatDateLocal(date)) ? "note-day" : "";
  };

  const formatTimeFromCreatedAt = (createdAt) => {
    const date = new Date(createdAt);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  useEffect(() => {
    if(!notes){
      dispatch(fetchNotes()); // Fetch notes khi component mount
    }
  }, [dispatch]);

  // Lọc các ghi chú theo ngày được chọn
  const filteredNotes = notes.filter(
    (note) => formatDateLocal(note.createdAt) === formatDateLocal(selectedDate)
  );



  const handleEditClick = (index) => {
    dispatch(setCurrentIndex(index)); // Đặt ghi chú hiện tại (current note)
    dispatch(setIsEditing(true));
    navigate(`/note`); // Chuyển sang trang chỉnh sửa
  };

  const getMoodIcon = (mood) => {
    switch (mood) {
      case "happy":
        return <HappyIcon className="mood-icon" />;
      case "neutral":
        return <NeutralIcon className="mood-icon" />;
      case "sad":
        return <SadIcon className="mood-icon" />;
      case "excited":
        return <ExcitedIcon className="mood-icon" />;
      case "angry":
        return <AngryIcon className="mood-icon" />;
      default:
        return null;
    }
  };

  const displayedNotes = filterMode === "all" ? notes : filteredNotes;
  return (
    <div className="container parent">
      <Row className="justify-content-between gap-3 calendar">
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
                dayClassName={getDayClassName} // Áp dụng className cho ngày có ghi chú

              />
            </div>
          </div>
        </Col>

        <Col sm={12} md={5} className="custom-right">
          <Card className="mb-3 custom-card-title">
            <Card.Body className="fw-bold">Your history</Card.Body>
            
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

          {loading ? (
            <p>Loading notes...</p>
          ) : error ? (
            <p>Error loading notes: {error}</p>
          ) : (
            <div className="notification-container">
              {displayedNotes.length === 0 ? (
                <p>No notes available.</p>
              ) : (
                displayedNotes.map((item, index) => {
                  const originalIndex = notes.indexOf(item); // Giữ nguyên index của item trong mảng notes
                  return (
                    <Card key={originalIndex} className="mb-3 custom-card">
                      <Card.Body className="custom-card-content">
                        <div className="card-header">
                          <span className="time-text">
                            {formatTimeFromCreatedAt(item.createdAt)}
                          </span>
                        </div>
                        <div className="card-body">
                          <span className="date-text">
                            {formatDateLocal(item.createdAt)}
                          </span>
                          <span className="header-text">Header: {item.header}</span>
                          <div className="mood-container">
                            <span className="mood-label">Mood:</span>
                            {getMoodIcon(item.mood)}
                          </div>
                
                          <button
                            className="history-edit-btn"
                            onClick={() => handleEditClick(originalIndex)}  // Truyền index gốc
                          >
                            <img src={EditButton} alt="Edit" className="edit-icon" />
                          </button>
                        </div>
                      </Card.Body>
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default Calendar;
