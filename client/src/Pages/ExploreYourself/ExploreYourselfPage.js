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

const generateMinuteData = (minutes) => {
  const data = [];
  for (let i = 0; i < minutes; i++) {
    data.push({
      name: `${i} min`,
      value: Math.floor(Math.random() * 100),
    });
  }
  return data;
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

const ExploreYourselfPage = () => {
  const [activeTab, setActiveTab] = useState("statistics");
  const [mailContent, setMailContent] = useState("");
  const [sendDate, setSendDate] = useState("");
  const [timeRange, setTimeRange] = useState("today");
  const [futureMails, setFutureMails] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState("3 months");
  const [showSentMails, setShowSentMails] = useState(false); // State để điều khiển hiển thị danh sách thư
  const [zoomLevel, setZoomLevel] = useState("day"); // State to manage zoom level, default to 'day'
  const [zoomData, setZoomData] = useState(emotionData.today.lineChart); // State to manage data for the current zoom level, default to 'day'
  const navigate = useNavigate();

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

  useEffect(() => {
    const storedMails = JSON.parse(localStorage.getItem("mailList")) || [];
    const today = new Date();

    // Lọc thư có ngày nhận đúng hôm nay
    const mailsForToday = storedMails.filter((mail) => {
      const receiveDate = new Date(mail.receiveDate);
      return (
        receiveDate.getFullYear() === today.getFullYear() &&
        receiveDate.getMonth() === today.getMonth() &&
        receiveDate.getDate() === today.getDate()
      );
    });

    if (mailsForToday.length > 0) {
      mailsForToday.forEach((mail) => {
        alert(
          `📬 Bạn có thư từ quá khứ!\n\nNội dung: ${mail.content}\nNgày gửi: ${mail.sendDate}\nNgày nhận: ${mail.receiveDate}`
        );
      });

      // Nếu muốn hiển thị thư đầu tiên trong danh sách (tùy ý)
      navigate("/today-mails", {
        state: { mail: mailsForToday[0], fromExplore: true },
      });
    }
  }, []);

  const handleSendMail = async () => {
    if (!mailContent || !sendDate) {
      alert("Vui lòng nhập nội dung và chọn ngày gửi");
      return;
    }

    // Đặt giờ về 00:00:00 để so sánh chính xác ngày
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(today); // Đảm bảo todayString luôn phản ánh ngày hiện tại chính xác

    const selectedDate = new Date(sendDate);
    selectedDate.setHours(0, 0, 0, 0);

    // Kiểm tra nếu chọn ngày trong quá khứ
    if (selectedDate < today) {
      alert("Không thể gửi thư cho ngày trong quá khứ!");
      return;
    }

    try {
      const payload = await getPayLoad();
      const now = new Date();
      const sendDateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`; // Đảm bảo ngày gửi luôn là ngày hiện tại với định dạng YYYY-MM-DD

      const newMail = {
        id: Date.now(),
        title:
          mailContent.substring(0, 30) + (mailContent.length > 30 ? "..." : ""),
        content: mailContent,
        sendDate: sendDateTime, // Ngày gửi được đặt chính xác là ngày hiện tại
        receiveDate: sendDate, // Ngày nhận là ngày được chọn trong lịch
        notified: false,
        read: false,
      };

      console.log("Debug: newMail.receiveDate =", newMail.receiveDate);
      console.log("Debug: todayString =", todayString);

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

      console.log("Debug: Checking if newMail.receiveDate matches todayString");
      console.log("Debug: newMail.receiveDate =", newMail.receiveDate);
      console.log("Debug: todayString =", todayString);
      console.log(
        "Debug: Condition newMail.receiveDate === todayString =",
        newMail.receiveDate === todayString
      );

      console.log("Debug: Starting handleSendMail");
      console.log("Debug: newMail.receiveDate =", newMail.receiveDate);
      console.log("Debug: todayString =", todayString);
      console.log(
        "Debug: typeof newMail.receiveDate =",
        typeof newMail.receiveDate
      );
      console.log("Debug: typeof todayString =", typeof todayString);
      console.log(
        "Debug: newMail.receiveDate === todayString =",
        newMail.receiveDate === todayString
      );
      console.log(
        "Debug: newMail.receiveDate.trim() === todayString.trim() =",
        newMail.receiveDate.trim() === todayString.trim()
      );

      const normalizedReceiveDate = new Date(newMail.receiveDate)
        .toISOString()
        .split("T")[0];
      const normalizedTodayString = new Date(todayString)
        .toISOString()
        .split("T")[0];

      const receiveDate = new Date(newMail.receiveDate);
      const isToday =
        receiveDate.getFullYear() === today.getFullYear() &&
        receiveDate.getMonth() === today.getMonth() &&
        receiveDate.getDate() === today.getDate();

      if (isToday) {
        alert(
          `📨 Thư từ quá khứ đã đến!\n\nNội dung: ${newMail.content}\nNgày gửi: ${newMail.sendDate}\nNgày nhận: ${newMail.receiveDate}\n\nChúc bạn trải nghiệm vui vẻ 🥰✨`
        );

        setTimeout(() => {
          navigate("/today-mails", {
            state: { mail: newMail, fromExplore: true },
          });
        }, 1000);
      } else if (receiveDate > today) {
        alert(
          `📨 Thư đã được gửi thành công cho tương lai!\n\nNội dung: ${newMail.content}\nNgày gửi: ${newMail.sendDate}\nNgày nhận: ${newMail.receiveDate}\n\nChúc bạn trải nghiệm vui vẻ 🥰✨`
        );
      }
    } catch (error) {
      console.error("Lỗi khi gửi thư:", error);
      alert("Có lỗi xảy ra khi gửi thư. Vui lòng thử lại.");
    }
  };

  const toggleSentMails = () => {
    setShowSentMails(!showSentMails);
  };

  const handleZoom = (level, data) => {
    setZoomLevel(level);
    setZoomData(data);
  };

  const renderZoomControls = () => {
    return (
      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={() => handleZoom("year", emotionData.year.lineChart)}
          disabled={zoomLevel === "year"}
        >
          Year
        </button>
        <button
          onClick={() => handleZoom("month", emotionData.month.lineChart)}
          disabled={zoomLevel === "month"}
        >
          Month
        </button>
        <button
          onClick={() => handleZoom("week", emotionData.week.lineChart)}
          disabled={zoomLevel === "week"}
        >
          Week
        </button>
        <button
          onClick={() => handleZoom("today", emotionData.today.lineChart)}
          disabled={zoomLevel === "today"}
        >
          Day
        </button>
      </div>
    );
  };

  const renderLineChartWithZoom = () => {
    return (
      <div>
        {renderZoomControls()}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={zoomData}>
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
      </div>
    );
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

            {renderLineChartWithZoom()}

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

              <div
                style={{
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  margin: "20px 0",
                }}
              ></div>

              <div style={{ flex: 1 }}>
                <h4>Thư đã gửi</h4>
                <button
                  style={{
                    backgroundColor: "pink",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginBottom: "10px",
                  }}
                  onClick={toggleSentMails}
                >
                  {showSentMails ? "Ẩn thư" : "Xem thư"}
                </button>

                {showSentMails && (
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
                )}
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
                    setMailContent(
                      "liệu 6 tháng nữa có còn sống không mà đòi viết thư , à thoai cứ viết đuy"
                    );
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
