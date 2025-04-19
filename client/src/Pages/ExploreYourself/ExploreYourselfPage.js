import React, { useState, useEffect } from "react";
import "./ExploreYourselfPage.css";

const ExploreYourselfPage = () => {
  const [activeTab, setActiveTab] = useState("statistics");
  const [mailContent, setMailContent] = useState("");
  const [sendDate, setSendDate] = useState("");
  const [timeRange, setTimeRange] = useState("today");
  const [futureMails, setFutureMails] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState("3 months");

  // Mock data for statistics
  const emotionData = {
    today: {
      lineChart: [3, 4, 2, 5, 4, 3, 4],
      pieChart: [30, 10, 20, 25, 15],
    },
    week: {
      lineChart: [3, 4, 2, 5, 4, 3, 4, 2, 3, 4, 3, 5, 4, 3],
      pieChart: [35, 15, 15, 20, 15],
    },
    month: {
      lineChart: Array(30)
        .fill()
        .map(() => Math.floor(Math.random() * 5)),
      pieChart: [40, 10, 10, 25, 15],
    },
    year: {
      lineChart: Array(12)
        .fill()
        .map(() => Math.floor(Math.random() * 5)),
      pieChart: [45, 5, 10, 25, 15],
    },
  };

  // Load saved mails from localStorage
  useEffect(() => {
    const savedMails = JSON.parse(localStorage.getItem("futureMails")) || [];
    setFutureMails(savedMails);
  }, []);

  // Check for due mails periodically
  useEffect(() => {
    const checkMails = () => {
      const now = new Date();
      const updatedMails = futureMails.map((mail) => {
        const receiveDate = new Date(mail.receiveDate);

        if (receiveDate <= now && !mail.notified) {
          showMailNotification(mail);
          return { ...mail, notified: true };
        }
        return mail;
      });

      if (JSON.stringify(updatedMails) !== JSON.stringify(futureMails)) {
        setFutureMails(updatedMails);
        localStorage.setItem("futureMails", JSON.stringify(updatedMails));
      }
    };

    const interval = setInterval(checkMails, 60000); // Check every minute
    checkMails(); // Check immediately on load

    return () => clearInterval(interval);
  }, [futureMails]);

  const handleSendMail = () => {
    if (!mailContent || !sendDate) {
      alert("Vui lòng nhập nội dung và chọn ngày gửi");
      return;
    }

    const newMail = {
      id: Date.now(),
      title:
        mailContent.substring(0, 30) + (mailContent.length > 30 ? "..." : ""),
      recipient: `Chính mình của ngày ${sendDate}`,
      duration: calculateDuration(sendDate),
      receiveDate: sendDate,
      content: mailContent,
      notified: false,
    };

    const updatedMails = [...futureMails, newMail];
    setFutureMails(updatedMails);
    localStorage.setItem("futureMails", JSON.stringify(updatedMails));

    setMailContent("");
    setSendDate("");
    alert(
      "Thư đã được gửi thành công! Bạn sẽ nhận được thông báo khi đến ngày nhận."
    );
  };

  const calculateDuration = (dateString) => {
    const today = new Date();
    const receiveDate = new Date(dateString);
    const diffTime = receiveDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) return "1 week";
    if (diffDays <= 30) return "1 month";
    if (diffDays <= 90) return "3 months";
    if (diffDays <= 180) return "6 months";
    return "1 year";
  };

  const showMailNotification = (mail) => {
    if (
      window.confirm(
        `📨 Thư từ quá khứ đã đến!\n\nTiêu đề: ${mail.title}\nNgày gửi: ${new Date(mail.receiveDate).toLocaleDateString()}\n\nBạn có muốn xem nội dung ngay bây giờ?`
      )
    ) {
      alert(`Nội dung thư:\n\n${mail.content || "Không có nội dung cụ thể"}`);
    }
  };

  const renderEmotionDots = (data) => {
    return data.map((percent, index) => {
      const className = ["happy", "sad", "angry", "excited", "neutral"][index];
      return (
        <div
          key={index}
          style={{ display: "flex", alignItems: "center", margin: "5px 0" }}
        >
          <span className={`dot ${className}`} />
          <span style={{ marginLeft: "5px" }}>{percent}%</span>
        </div>
      );
    });
  };

  return (
    <div className="explore-container">
      <h2 className="explore-title">Yourself</h2>
      <div className="explore-tabs">
        <button
          className={activeTab === "statistics" ? "active" : ""}
          onClick={() => setActiveTab("statistics")}
        >
          Thống kê
        </button>
        <button
          className={activeTab === "future" ? "active" : ""}
          onClick={() => setActiveTab("future")}
        >
          Hộp thư tương lai
        </button>
      </div>

      <div className="explore-content">
        {activeTab === "statistics" && (
          <div className="statistics-section">
            <h4>
              Thống kê cảm xúc của bạn trong
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                style={{ marginLeft: "10px", padding: "5px" }}
              >
                <option value="today">hôm nay</option>
                <option value="week">1 tuần</option>
                <option value="month">1 tháng</option>
                <option value="year">1 năm</option>
              </select>
            </h4>

            <div className="line-chart">
              <h5>Cảm xúc theo thời gian</h5>
              <div
                style={{
                  height: "200px",
                  border: "1px solid #ddd",
                  margin: "20px 0",
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                {emotionData[timeRange].lineChart.map((value, index) => (
                  <div
                    key={index}
                    style={{
                      flex: 1,
                      height: `${(value + 1) * 20}%`,
                      backgroundColor: [
                        "#67c6e3",
                        "#f15b2a",
                        "#ffd966",
                        "#7ed957",
                        "#f891c5",
                      ][value],
                      margin: "0 2px",
                      borderRadius: "3px 3px 0 0",
                    }}
                    title={`Ngày ${index + 1}: ${["Sad", "Angry", "Neutral", "Happy", "Excited"][value]}`}
                  />
                ))}
              </div>
            </div>

            <div className="pie-chart">
              <div
                style={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  background: `conic-gradient(
                  #7ed957 ${emotionData[timeRange].pieChart[0]}%,
                  #67c6e3 0 ${emotionData[timeRange].pieChart[0] + emotionData[timeRange].pieChart[1]}%,
                  #f15b2a 0 ${emotionData[timeRange].pieChart[0] + emotionData[timeRange].pieChart[1] + emotionData[timeRange].pieChart[2]}%,
                  #f891c5 0 ${emotionData[timeRange].pieChart[0] + emotionData[timeRange].pieChart[1] + emotionData[timeRange].pieChart[2] + emotionData[timeRange].pieChart[3]}%,
                  #ffd966 0 ${emotionData[timeRange].pieChart[0] + emotionData[timeRange].pieChart[1] + emotionData[timeRange].pieChart[2] + emotionData[timeRange].pieChart[3] + emotionData[timeRange].pieChart[4]}%
                )`,
                  margin: "0 auto",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: "20px",
                }}
              >
                <div>
                  {renderEmotionDots(
                    emotionData[timeRange].pieChart.slice(0, 3)
                  )}
                </div>
                <div>
                  {renderEmotionDots(emotionData[timeRange].pieChart.slice(3))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "future" && (
          <div className="future-mail-section">
            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ flex: 1 }}>
                <h4>Gửi thư cho chính mình trong tương lai</h4>
                <textarea
                  placeholder="Viết điều bạn muốn nhắn gửi..."
                  value={mailContent}
                  onChange={(e) => setMailContent(e.target.value)}
                />
                <div className="future-options">
                  <label>
                    Gửi vào:
                    <input
                      type="date"
                      value={sendDate}
                      onChange={(e) => setSendDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      style={{ marginLeft: "10px", padding: "5px" }}
                    />
                  </label>
                  <button className="send-button" onClick={handleSendMail}>
                    Gửi thư
                  </button>
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <h4>Thư đã gửi</h4>
                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                >
                  {futureMails.length === 0 ? (
                    <p>Chưa có thư nào được gửi</p>
                  ) : (
                    futureMails.map((mail) => (
                      <div
                        key={mail.id}
                        style={{
                          padding: "10px",
                          borderBottom: "1px solid #eee",
                          cursor: "pointer",
                          backgroundColor:
                            selectedDuration === mail.duration
                              ? "#f0f0f0"
                              : "transparent",
                        }}
                        onClick={() => {
                          setSelectedDuration(mail.duration);
                          alert(
                            `Nội dung thư:\n\n${mail.content || "Không có nội dung"}`
                          );
                        }}
                      >
                        <div style={{ fontWeight: "bold" }}>{mail.title}</div>
                        <div style={{ fontSize: "0.9em", color: "#666" }}>
                          Gửi đến: {mail.receiveDate} ({mail.duration})
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                backgroundColor: "#f0f0f0",
                borderRadius: "8px",
              }}
            >
              <h4>Tùy chọn khác</h4>
              <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
                <button
                  style={{
                    padding: "8px 15px",
                    backgroundColor: "#5e5df0",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const futureDate = new Date();
                    futureDate.setMonth(futureDate.getMonth() + 3);
                    setSelectedDuration("3 months");
                    setMailContent("Liệu 3 tháng nx có tốt hơn bây giờ ko?");
                    setSendDate(futureDate.toISOString().split("T")[0]);
                  }}
                >
                  Gửi thư 3 tháng
                </button>
                <button
                  style={{
                    padding: "8px 15px",
                    backgroundColor: "#5e5df0",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const futureDate = new Date();
                    futureDate.setMonth(futureDate.getMonth() + 6);
                    setSelectedDuration("6 months");
                    setMailContent("Nóng số: the day");
                    setSendDate(futureDate.toISOString().split("T")[0]);
                  }}
                >
                  Gửi thư 6 tháng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreYourselfPage;
