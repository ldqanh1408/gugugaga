import './Calendar.css';
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col, Card } from "react-bootstrap";
import { FaSmile, FaMeh, FaFrown } from "react-icons/fa";

function Calendar() {
    const [SelectedDate, setSelectedDate] = useState(null);
    
    const notifications = [
        { date: "04/03", title: "Hom nay toi vui", mood: "happy", time: "9:41AM"},
        { date: "05/03", title: "Hom nay binh thuong", mood: "neutral", time: "10:15AM"},
        { date: "06/03", title: "Hom nay chan", mood: "sad", time: "1:00AM"}
    ];

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
