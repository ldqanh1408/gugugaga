import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchTodayMails, markMailNotifiedAsync } from "../../redux/userSlice";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "./TodayMailsPage.css";

const TodayMailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentMail, setCurrentMail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { todayMails, error } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchMails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !isAuthenticated) {
          toast.error("Vui lòng đăng nhập để xem thư");
          navigate("/login");
          return;
        }

        const decoded = jwtDecode(token);
        if (!decoded?._id) {
          toast.error("Phiên đăng nhập không hợp lệ");
          navigate("/login");
          return;
        }

        await dispatch(fetchTodayMails(decoded._id)).unwrap();

        if (location.state?.mail) {
          const navigationMail = location.state.mail;
          setCurrentMail(navigationMail);
        } else if (todayMails.length > 0) {
          setCurrentMail(todayMails[0]);
        }
      } catch (err) {
        toast.error(err.message || "Lỗi khi tải thư");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMails();
  }, [location.state, navigate, isAuthenticated, dispatch, todayMails.length]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleMailClick = async (mail) => {
    setCurrentMail(mail);
    if (!mail.notified) {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        await dispatch(
          markMailNotifiedAsync({ userId: decoded._id, mailId: mail._id })
        ).unwrap();
      } catch (err) {
        toast.error("Lỗi khi đánh dấu thư đã thông báo");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="today-mails-page">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  if (!isLoading && todayMails.length === 0) {
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
          {todayMails.map((mail) => (
            <div
              key={mail._id}
              className={`mail-item ${
                currentMail?._id === mail._id ? "selected" : ""
              }`}
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
