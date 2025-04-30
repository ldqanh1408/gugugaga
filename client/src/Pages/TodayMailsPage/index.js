import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getFutureMails } from "../../services/userService";
import { jwtDecode } from "jwt-decode";
import "./TodayMailsPage.css";

const TodayMailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentMail, setCurrentMail] = useState(null);
  const [receivedMails, setReceivedMails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchTodayMails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !isAuthenticated) {
          console.error("Not authenticated");
          navigate("/login");
          return;
        }

        const decoded = jwtDecode(token);
        if (!decoded?._id) {
          console.error("Invalid token payload");
          navigate("/login");
          return;
        }

        // Lấy danh sách thư
        const mails = await getFutureMails(decoded._id);
        console.log("Fetched mails:", mails);

        if (Array.isArray(mails) && mails.length > 0) {
          setReceivedMails(mails);

          // Nếu có mail từ navigation state, hiển thị nó
          if (location.state?.mail) {
            const navigationMail = location.state.mail;
            setCurrentMail(navigationMail);
            if (!mails.find((m) => m._id === navigationMail._id)) {
              setReceivedMails((prev) => [navigationMail, ...mails]);
            }
          } else {
            // Nếu không có mail từ navigation, hiển thị mail đầu tiên
            setCurrentMail(mails[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching mails:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayMails();
  }, [location.state, navigate, isAuthenticated]);

  const handleMailClick = (mail) => {
    setCurrentMail(mail);
  };

  if (isLoading) {
    return (
      <div className="today-mails-page">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  if (!isLoading && (!receivedMails || receivedMails.length === 0)) {
    return (
      <div className="today-mails-page">
        <div className="no-mail-container">
          <h2>Không có thư nào để hiển thị</h2>
          <button onClick={() => navigate("/")} className="back-button">
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="today-mails-page">
      <div className="today-mails-container">
        <div className="mails-list">
          <h3>📬 Thư đã nhận</h3>
          {receivedMails.map((mail) => (
            <div
              key={mail._id}
              className={`mail-item ${currentMail?._id === mail._id ? "selected" : ""}`}
              onClick={() => handleMailClick(mail)}
            >
              <div className="mail-title">{mail.title || "Thư từ quá khứ"}</div>
              <div className="mail-date">
                Ngày gửi: {new Date(mail.sendDate).toLocaleDateString("vi-VN")}
              </div>
            </div>
          ))}
        </div>

        {currentMail && (
          <div className="mail-content">
            <div className="mail-card">
              <div className="mail-header">
                <h2>📨 {currentMail.title || "Thư từ quá khứ"}</h2>
                <div className="mail-info">
                  <p>
                    <strong>Ngày gửi:</strong>{" "}
                    {new Date(currentMail.sendDate).toLocaleDateString("vi-VN")}
                  </p>
                  <p>
                    <strong>Ngày nhận:</strong>{" "}
                    {new Date(currentMail.receiveDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
              </div>

              <div className="mail-body">{currentMail.content}</div>

              <div className="mail-actions">
                <button className="back-button" onClick={() => navigate("/")}>
                  Quay về trang chủ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayMailsPage;
