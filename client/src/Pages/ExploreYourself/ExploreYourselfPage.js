import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPayLoad } from "../../services/authService";
import { addFutureMail } from "../../services/userService";
import "./ExploreYourselfPage.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ExploreYourselfPage = () => {
  const [activeTab, setActiveTab] = useState("statistics");
  const [mailContent, setMailContent] = useState("");
  const [sendDate, setSendDate] = useState("");
  const [timeRange, setTimeRange] = useState("today");
  const [futureMails, setFutureMails] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState("3 months");
  const navigate = useNavigate();

  const generateMinuteData = (minutes) => {
    return Array.from({ length: minutes }, (_, index) => ({
      name: `${index} phút`,
      value: Math.floor(Math.random() * 5) + 1, // Random value between 1 and 5
    }));
  };

  const emotionData = {
    today: {
      lineChart: generateMinuteData(60), // 60 minutes of data
      pieChart: [30, 10, 20, 25, 15],
    },
    week: {
      lineChart: generateMinuteData(60 * 7), // 7 days of minute data
      pieChart: [35, 15, 15, 20, 15],
    },
    month: {
      lineChart: generateMinuteData(60 * 30), // 30 days of minute data
      pieChart: [40, 10, 10, 25, 15],
    },
    year: {
      lineChart: generateMinuteData(60 * 24 * 365), // 1 year of minute data
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
      const now = new Date().toISOString().split("T")[0];
      const pendingMails = futureMails.filter(
        (mail) => mail.receiveDate === now && !mail.notified
      );

      // Update to show a detailed alert for past mails
      if (pendingMails.length > 0) {
        const firstMail = pendingMails[0];
        const formattedSendDate = firstMail.sendDate.split("T")[0]; // Extract only the date part
        const formattedReceiveDate = firstMail.receiveDate; // Already in YYYY-MM-DD format

        const userConfirmed = window.confirm(
          `📨 Thư từ quá khứ đã đến!\n\nNội dung: ${firstMail.title}\nNgày gửi: ${formattedSendDate}\nNgày nhận: ${formattedReceiveDate}\n\nChúc bạn trải nghiệm vui vẻ 🥰✨`
        );
        if (userConfirmed) {
          navigate("/today-mails", { state: { mail: firstMail } });
        }

        // Mark all mails as notified
        const updatedMails = futureMails.map((mail) =>
          pendingMails.find((m) => m.id === mail.id)
            ? { ...mail, notified: true }
            : mail
        );
        setFutureMails(updatedMails);
        localStorage.setItem("futureMails", JSON.stringify(updatedMails));
      }
    };

    // Kiểm tra ngay khi component mount
    checkMails();

    // Kiểm tra mỗi phút
    const interval = setInterval(checkMails, 60000);
    return () => clearInterval(interval);
  }, [futureMails, navigate]);

  const handleSendMail = async () => {
    if (!mailContent || !sendDate) {
      alert("Vui lòng nhập nội dung và chọn ngày gửi");
      return;
    }

    // Đặt giờ về 00:00:00 để so sánh chính xác ngày
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().split("T")[0];

    const selectedDate = new Date(sendDate);
    selectedDate.setHours(0, 0, 0, 0);

    // Kiểm tra nếu chọn ngày trong quá khứ
    if (selectedDate < today) {
      alert("Không thể gửi thư cho ngày trong quá khứ!");
      return;
    }

    // Kiểm tra giới hạn 30 ngày
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30);
    if (selectedDate > maxDate) {
      alert("Bạn chỉ có thể gửi thư trong vòng 30 ngày kể từ hôm nay.");
      return;
    }

    try {
      const payload = await getPayLoad();
      const now = new Date();
      const sendDateTime = now.toISOString(); // Use the exact current date and time

      const newMail = {
        id: Date.now(),
        title:
          mailContent.substring(0, 30) + (mailContent.length > 30 ? "..." : ""),
        content: mailContent,
        sendDate: sendDateTime, // Updated to use the exact current time
        receiveDate: sendDate,
        notified: false,
        read: false,
      };

      // Lưu vào backend
      if (payload?.userId) {
        await addFutureMail(payload.userId, newMail);
      }

      // Lưu vào localStorage
      const savedMails = JSON.parse(localStorage.getItem("futureMails")) || [];
      const updatedMails = [...savedMails, newMail];
      localStorage.setItem("futureMails", JSON.stringify(updatedMails));
      setFutureMails(updatedMails);

      // Reset form
      setMailContent("");
      setSendDate("");

      // Hiển thị thông báo trước khi chuyển hướng
      const formattedSendDate = newMail.sendDate.split("T")[0]; // Extract only the date part

      if (sendDate === todayString) {
        alert(
          `📨 Thư vừa được gửi thành công!\n\nNội dung: ${newMail.title}\nNgày gửi: ${formattedSendDate}\nNgày nhận: ${newMail.receiveDate}`
        );
        navigate("/today-mails", {
          state: { mail: newMail, fromExplore: true },
        });
      } else {
        alert(
          "Thư đã được gửi thành công! Bạn sẽ nhận được thông báo khi đến ngày nhận."
        );
      }
    } catch (error) {
      console.error("Lỗi khi gửi thư:", error);
      alert("Có lỗi xảy ra khi gửi thư. Vui lòng thử lại.");
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

  const renderLineChart = (data) => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
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

            {renderLineChart(
              emotionData[timeRange].lineChart.map((item, index) => ({
                name: item.name, // Ensure name is passed correctly
                value: item.value, // Ensure value is passed correctly
              }))
            )}

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
