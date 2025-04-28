import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TodayMailsPage.css";

const TodayMailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentMail, setCurrentMail] = useState(location.state?.mail);
  const [reply, setReply] = useState("");
  const [receivedMails, setReceivedMails] = useState([]);

  useEffect(() => {
    // Lấy danh sách thư đã nhận từ localStorage
    const futureMails = JSON.parse(localStorage.getItem("futureMails")) || [];
    const today = new Date().toISOString().split("T")[0];
    const received = futureMails.filter(
      (mail) => new Date(mail.receiveDate) <= new Date(today)
    );
    setReceivedMails(received);
  }, []);

  const handleMailClick = (mail) => {
    setCurrentMail(mail);
    setReply("");
  };

  const handleSaveReply = () => {
    if (!reply.trim()) {
      alert("Vui lòng nhập cảm nghĩ của bạn trước khi lưu!");
      return;
    }

    // Lưu phản hồi vào localStorage
    const mailResponses = JSON.parse(
      localStorage.getItem("mailResponses") || "{}"
    );
    mailResponses[currentMail.id] = reply;
    localStorage.setItem("mailResponses", JSON.stringify(mailResponses));

    // Đánh dấu thư đã được đọc
    const futureMails = JSON.parse(localStorage.getItem("futureMails")) || [];
    const updatedMails = futureMails.map((mail) =>
      mail.id === currentMail.id ? { ...mail, read: true } : mail
    );
    localStorage.setItem("futureMails", JSON.stringify(updatedMails));

    alert("Đã lưu cảm nghĩ của bạn!");
    setReply("");
  };

  if (!currentMail && receivedMails.length === 0) {
    return (
      <div className="no-mail-container">
        <h2>Không có thư nào để hiển thị</h2>
        <button onClick={() => navigate("/")} className="back-button">
          Quay về trang chủ
        </button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="today-mails-container">
      <div className="mails-list">
        <h3>Thư đã nhận</h3>
        {receivedMails.map((mail) => (
          <div
            key={mail.id}
            className={`mail-item ${currentMail?.id === mail.id ? "selected" : ""}`}
            onClick={() => handleMailClick(mail)}
          >
            <div className="mail-title">{mail.title}</div>
            <div className="mail-details">
              Ngày gửi: {formatDate(mail.sendDate)}
              {mail.read && <span className="read-badge"> • Đã đọc</span>}
            </div>
          </div>
        ))}
      </div>

      {currentMail && (
        <div className="mail-card">
          <div className="mail-header">
            <h2>📨 Thư từ quá khứ</h2>
            <p className="mail-date">
              <strong>Ngày gửi:</strong> {formatDate(currentMail.sendDate)}
              <br />
              <strong>Ngày nhận:</strong> {formatDate(currentMail.receiveDate)}
            </p>
          </div>

          <div className="mail-content">
            <h3>{currentMail.title}</h3>
            <p>{currentMail.content}</p>
          </div>

          <div className="mail-actions">
            <textarea
              className="reply-box"
              placeholder="Viết cảm nghĩ của bạn về bức thư này..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
            <button className="reply-button" onClick={handleSaveReply}>
              Lưu cảm nghĩ
            </button>
            <button className="back-button" onClick={() => navigate("/")}>
              Quay về trang chủ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayMailsPage;
