import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TodayMailsPage.css";

const TodayMailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mail = location.state?.mail;

  useEffect(() => {
    if (!mail) {
      // Nếu không có dữ liệu thư, quay lại trang chính
      navigate("/", { replace: true });
    }
  }, [mail, navigate]);

  if (!mail) {
    return null; // Không hiển thị gì nếu không có thư
  }

  return (
    <div className="today-mails-container">
      <h2>📨 Thư từ quá khứ</h2>
      <div className="mail-content">
        <h3>{mail.title}</h3>
        <p>{mail.content}</p>
        <p>
          <strong>Ngày gửi:</strong> {mail.receiveDate}
        </p>
      </div>
      <textarea placeholder="Trả lời thư..." className="reply-box"></textarea>
      <button className="reply-button">Gửi trả lời</button>
    </div>
  );
};

export default TodayMailsPage;
