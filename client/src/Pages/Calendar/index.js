import './Calendar.css';
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Card } from "react-bootstrap";
import { FaSmile, FaMeh, FaFrown } from "react-icons/fa";

function Calendar() {
    const [SelectedDate, setSelectedDate] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem("calendarHistory")) || [];
        if (SelectedDate){
           
            const selectedDate = new Date(SelectedDate);
            selectedDate.setHours(12); // Đảm bảo không bị lệch múi giờ
            const formattedDate = selectedDate.toISOString().split('T')[0];            

            const filteredHistory = Array.from(
                new Map(
                    storedHistory   
                        .filter((item) => item.date === formattedDate)
                        .map((item) => [item.title + item.time, item])
                ).values()
            );
            setNotifications(filteredHistory);
        } 
        else {
            setNotifications([]);
        }
    }, [SelectedDate]);

    const saveNoteToLocalStorage = (note) => {
        const history = [...notifications, note];
        localStorage.setItem("calendarHistory", JSON.stringify(history));
        setNotifications(history);
    };

    const getMoodIcon = (mood) => {
        switch (mood) {
            case "happy": return <FaSmile className="mood-icon happy" />;
            case "neutral": return <FaMeh className="mood-icon neutral" />;
            case "sad": return <FaFrown className="mood-icon sad" />;
            default: return null;   
        }
    }

    return (
        <div className="container parent">
            <Row className="justify-content-between gap-3">
                <Col md={5} className="custom-left">
                    <h1 className="heading">Calendar</h1>
                    <p className="paragraph">Check your day. Check your life.</p>

                    <div className="custom-datepicker-container">
                        <div className="datepicker-wrapper">
                            <DatePicker
                                selected={SelectedDate}
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
                <Col md={5} className="custom-right">
                    <Card className="mb-3 custom-card-title">
                        <Card.Body className="fw-bold">Your history</Card.Body>
                    </Card>

                    {notifications.map((item, index) => (
                        <Card key={index} className="mb-3 custom-card">
                            <Card.Body className="custom-card-content">
                                <div className="card-header">
                                    <span className="time-text">{item.time}</span>
                                </div>

                                <div className="card-body">
                                    <span className="date-text">{item.date}</span>
                                    <span className="title-text">Title: {item.title}</span>
                                    <div className="mood-container">
                                        <span className="mood-label">Mood:</span> {getMoodIcon(item.mood)}
                                    </div>
                                </div>
                            </Card.Body>

                        </Card>
                    ))}
                </Col>
            </Row>
        </div>
    );
}

export default Calendar;