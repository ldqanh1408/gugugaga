import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TodayMailsPage.css";

const TodayMailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentMail, setCurrentMail] = useState(location.state?.mail);
  const [receivedMails, setReceivedMails] = useState([]);

  useEffect(() => {
    // Lấy danh sách thư từ localStorage
    const futureMails = JSON.parse(localStorage.getItem("futureMails")) || [];
    const today = new Date().toISOString().split("T")[0];

    // Lọc thư cho ngày hiện tại
    const todayMails = futureMails.filter((mail) => mail.receiveDate === today);
    setReceivedMails(todayMails);

    // Nếu không có thư từ state và không có thư nào cho ngày hôm nay
    if (!location.state?.mail && todayMails.length === 0) {
      navigate("/", { replace: true });
      return;
    }

    // Nếu có thư từ state, thêm vào danh sách nếu chưa có
    if (
      location.state?.mail &&
      !todayMails.find((m) => m.id === location.state.mail.id)
    ) {
      setReceivedMails([...todayMails, location.state.mail]);
      setCurrentMail(location.state.mail);
    }
  }, [location.state, navigate]);

  const handleMailClick = (mail) => {
    setCurrentMail(mail);
  };

  if (!currentMail && receivedMails.length === 0) {
    return (
      <div className="no-mail-container">
        <h2>Không có thư nào để hiển thị</h2>
        <button onClick={() => navigate("/")}>Quay về trang chủ</button>
      </div>
    );
  }

  return (
    <div className="mail-page-container">
      <aside className="mail-list">
        <h3>📬 Thư đã nhận</h3>
        <div className="mail-items">
          {receivedMails.map((mail) => (
            <div
              key={mail.id}
              className={`mail-item ${currentMail?.id === mail.id ? "selected" : ""}`}
              onClick={() => handleMailClick(mail)}
            >
              <div className="mail-preview">
                <div className="mail-title">
                  {mail.title || "Không có tiêu đề"}
                </div>
                <div className="mail-date">
                  {new Date(mail.sendDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {currentMail && (
        <main className="mail-content">
          <div className="mail-header">
            <h2>📨 Thư từ quá khứ</h2>
            <div className="mail-info">
              <p>
                Ngày gửi: {new Date(currentMail.sendDate).toLocaleDateString()}
              </p>
              <p>
                Ngày nhận:{" "}
                {new Date(currentMail.receiveDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="mail-body">{currentMail.content}</div>
          <div className="mail-actions">
            <button className="back-button" onClick={() => navigate("/")}>
              Quay về trang chủ
            </button>
          </div>
        </main>
      )}
    </div>
  );
};

export default TodayMailsPage;
