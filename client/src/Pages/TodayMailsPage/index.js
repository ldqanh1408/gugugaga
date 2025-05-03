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
  const [showEntranceAnimation, setShowEntranceAnimation] = useState(true);
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

        // Nếu có thư từ navigation state, hiển thị nó
        if (location.state?.mail) {
          setCurrentMail(location.state.mail);
          if (location.state.fromExplore) {
            // Nếu đến từ trang ExploreYourself, hiển thị animation đặc biệt
            setShowEntranceAnimation(true);
            setTimeout(() => setShowEntranceAnimation(false), 1000);
          }
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
  }, [location.state, navigate, isAuthenticated, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Ensure currentMail is set correctly when navigating from ExploreYourselfPage
  useEffect(() => {
    if (location.state?.mail) {
      setCurrentMail(location.state.mail);
      setShowEntranceAnimation(location.state.fromExplore || false);
    } else if (todayMails.length > 0) {
      setCurrentMail(todayMails[0]);
    } else {
      setCurrentMail(null); // Clear currentMail if no mails are available
    }
  }, [location.state, todayMails]);

  // Add logic to handle notifications for future mails
  useEffect(() => {
    const checkFutureMails = () => {
      const now = new Date().toISOString().split("T")[0];
      const futureMails = JSON.parse(localStorage.getItem("futureMails")) || [];
      const dueMails = futureMails.filter(
        (mail) => mail.receiveDate === now && !mail.notified
      );

      if (dueMails.length > 0) {
        toast.info(`Bạn có ${dueMails.length} thư từ quá khứ đến!`);
        const updatedMails = futureMails.map((mail) =>
          dueMails.find((m) => m.id === mail.id)
            ? { ...mail, notified: true }
            : mail
        );
        localStorage.setItem("futureMails", JSON.stringify(updatedMails));
        setCurrentMail(dueMails[0]);
      }
    };

    checkFutureMails();
    const interval = setInterval(checkFutureMails, 60000);
    return () => clearInterval(interval);
  }, []);

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
        toast.error("Lỗi khi đánh dấu thư đã đọc");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="today-mails-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Đang tải thư...</p>
        </div>
      </div>
    );
  }

  if (!isLoading && todayMails.length === 0) {
    return (
      <div className="today-mails-page">
        <div className="no-mail-container">
          <h2>📭 Thư từ quá khứ</h2>
          <p>
            Bạn có thể gửi thư cho mình trong tương lai từ trang Explore
            Yourself
          </p>
          <button onClick={() => navigate("/")} className="back-button">
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const containerClassName = `today-mails-page ${
    showEntranceAnimation ? "entrance-animation" : ""
  }`;

  return (
    <div className={containerClassName}>
      <div className="today-mails-container">
        <div className="mails-list animate-slide-in">
          <h3>📬 Thư đã nhận</h3>
          {todayMails.map((mail, index) => (
            <div
              key={mail._id}
              className={`mail-item ${currentMail?._id === mail._id ? "selected" : ""}`}
              onClick={() => handleMailClick(mail)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mail-title">{mail.title || "Thư từ quá khứ"}</div>
              <div className="mail-date">
                Gửi ngày: {new Date(mail.sendDate).toLocaleDateString("vi-VN")}
              </div>
            </div>
          ))}
        </div>

        {currentMail && (
          <div className="mail-content animate-fade-in">
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
                <button
                  className="send-reply-button"
                  onClick={() => navigate("/explore-yourself")}
                >
                  Gửi thư mới
                </button>
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
