import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getFutureMails, getPayLoad } from "../../services";
import "./TodayMailsPage.css";

const TodayMailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentMail, setCurrentMail] = useState(location.state?.mail);
  const [receivedMails, setReceivedMails] = useState([]);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTodayMails = async () => {
      try {
        const { userId } = await getPayLoad();
        if (!userId) {
          navigate("/");
          return;
        }

        // Lấy thư từ API
        const mails = await getFutureMails(userId);
        setReceivedMails(mails || []);

        // Nếu có mail từ state và chưa có trong danh sách, thêm vào
        if (
          location.state?.mail &&
          !mails?.find((m) => m._id === location.state.mail._id)
        ) {
          setReceivedMails((prev) => [...prev, location.state.mail]);
        }

        // Nếu không có mail đang xem, set mail đầu tiên
        if (!currentMail && mails && mails.length > 0) {
          setCurrentMail(mails[0]);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy thư:", error);
        setIsLoading(false);
      }
    };

    fetchTodayMails();
  }, [location.state, navigate]);

  const handleMailClick = (mail) => {
    // Cập nhật trạng thái đã đọc
    const updatedMails = receivedMails.map((m) =>
      m._id === mail._id ? { ...m, read: true } : m
    );
    setReceivedMails(updatedMails);
    setCurrentMail(mail);
    setReplyContent(mail.reply || ""); // Load reply content nếu có
  };

  const handleSaveReply = () => {
    if (!replyContent.trim()) {
      alert("Vui lòng nhập cảm nghĩ của bạn!");
      return;
    }

    const updatedMails = receivedMails.map((m) =>
      m._id === currentMail._id ? { ...m, reply: replyContent } : m
    );
    setReceivedMails(updatedMails);

    // Lưu vào localStorage để giữ lại phản hồi
    const allMails = JSON.parse(localStorage.getItem("futureMails")) || [];
    const updatedAllMails = allMails.map((m) =>
      m._id === currentMail._id ? { ...m, reply: replyContent } : m
    );
    localStorage.setItem("futureMails", JSON.stringify(updatedAllMails));

    alert("Đã lưu cảm nghĩ của bạn!");
  };

  if (isLoading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (!isLoading && receivedMails.length === 0) {
    return (
      <div className="no-mail-container">
        <h2>Không có thư nào để hiển thị</h2>
        <button onClick={() => navigate("/")} className="back-button">
          Quay về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="today-mails-container">
      <div className="mails-list">
        <h3>Thư đã nhận hôm nay</h3>
        {receivedMails.map((mail) => (
          <div
            key={mail._id}
            className={`mail-item ${currentMail?._id === mail._id ? "selected" : ""}`}
            onClick={() => handleMailClick(mail)}
          >
            <div className="mail-title">{mail.title || "Thư từ quá khứ"}</div>
            <div className="mail-details">
              Ngày gửi: {new Date(mail.sendDate).toLocaleDateString()}
              {mail.read && <span className="read-badge"> • Đã đọc</span>}
            </div>
          </div>
        ))}
      </div>

      {currentMail && (
        <div className="mail-card">
          <div className="mail-header">
            <h2>📨 {currentMail.title || "Thư từ quá khứ"}</h2>
            <p className="mail-date">
              <strong>Ngày gửi:</strong>{" "}
              {new Date(currentMail.sendDate).toLocaleDateString()}
              <br />
              <strong>Ngày nhận:</strong>{" "}
              {new Date(currentMail.receiveDate).toLocaleDateString()}
            </p>
          </div>

          <div className="mail-content">
            <p>{currentMail.content}</p>
          </div>

          <div className="mail-actions">
            <textarea
              className="reply-box"
              placeholder="Viết cảm nghĩ của bạn về bức thư này..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <div>
              <button className="reply-button" onClick={handleSaveReply}>
                Lưu cảm nghĩ
              </button>
              <button className="back-button" onClick={() => navigate("/")}>
                Quay về trang chủ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayMailsPage;
