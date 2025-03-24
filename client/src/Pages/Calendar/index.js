import "./Calendar.css";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Card } from "react-bootstrap";
import { FaSmile, FaMeh, FaFrown } from "react-icons/fa";
import { getNotes } from "../../services/journalService";
import { ReactComponent as HappyIcon } from "../../assets/icons/happy.svg";
import { ReactComponent as SadIcon } from "../../assets/icons/sad.svg";
import { ReactComponent as ExcitedIcon } from "../../assets/icons/excited.svg";
import { ReactComponent as AngryIcon } from "../../assets/icons/angry.svg";
import { ReactComponent as NeutralIcon } from "../../assets/icons/neutral.svg";

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notifications, setNotifications] = useState([]);

  // Hàm chuyển đổi createdAt thành giờ (HH:mm)
  const formatTimeFromCreatedAt = (createdAt) => {
    const date = new Date(createdAt);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Hàm định dạng ngày theo giờ địa phương (YYYY-MM-DD)
  const formatDateLocal = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = String(d.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notes = await getNotes(); // Gọi API lấy tất cả ghi chú
        console.log("Tất cả ghi chú từ API:", notes); // Debug dữ liệu gốc

        if (selectedDate) {
          const formattedDate = formatDateLocal(selectedDate);
          console.warn("Ngày được chọn:", formattedDate); // Debug ngày chọn

          // Lọc ghi chú theo ngày từ createdAt
          const filteredNotes = notes.filter((item) => {
            const itemDate = formatDateLocal(item.createdAt);
            return itemDate === formattedDate;
          });
          console.log("Ghi chú sau khi lọc:", filteredNotes); // Debug kết quả
          setNotifications(filteredNotes);
        } else {
          setNotifications([]); // Nếu không chọn ngày, hiển thị rỗng
        }
      } catch (error) {
        console.error("Lỗi khi lấy ghi chú:", error);
        setNotifications([]);
      }
    };

    fetchNotes();
  }, [selectedDate]);

  const getMoodIcon = (mood) => {
    switch (mood) {
      case "happy":
        return <HappyIcon className="mood-icon"></HappyIcon>;
      case "neutral":
        return <NeutralIcon className="mood-icon"></NeutralIcon>;
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
              />
            </div>
          </div>
        </Col>

        <Col sm={12} md={5} className="custom-right">
          <Card className="mb-3 custom-card-title">
            <Card.Body className="fw-bold">Your history</Card.Body>
          </Card>

          <div className="notification-container">
            {notifications.length === 0 ? (
              <p>Không có ghi chú nào cho ngày này</p>
            ) : (
              notifications.map((item) => (
                <Card key={item._id} className="mb-3 custom-card">
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
                        <span className="mood-label">Mood:</span>{" "}
                        {getMoodIcon(item.mood)}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Calendar;
