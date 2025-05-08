import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPayLoad } from "../../services/authService";
import { addFutureMail } from "../../services/userService";
import Swal from "sweetalert2";
import "./ExploreYourselfPage.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush, // Import Brush for zoom functionality
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

const generateDenseRatingData = (startYear, endYear) => {
  const data = [];
  for (let year = startYear; year <= endYear; year++) {
    for (let month = 1; month <= 12; month++) {
      for (let day = 1; day <= 30; day++) {
        // Simulate daily data for each month
        data.push({
          name: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
          value: Math.floor(Math.random() * 1000),
        });
      }
    }
  }
  return data;
};

const ratingData = {
  allTime: generateDenseRatingData(2015, 2025),
  year: generateDenseRatingData(2025, 2025),
  month: generateDenseRatingData(2025, 2025).slice(0, 31), // Fake daily data for May 2025
};

const showCustomAlert = (title, content) => {
  Swal.fire({
    title: title,
    html: content,
    background: "#ffe4e1", // Light pink background
    confirmButtonColor: "#ff69b4", // Pink confirm button
    icon: "info",
  });
};

const ExploreYourselfPage = () => {
  const [activeTab, setActiveTab] = useState("statistics");
  const [mailContent, setMailContent] = useState("");
  const [sendDate, setSendDate] = useState("");
  const [timeRange, setTimeRange] = useState("today");
  const [futureMails, setFutureMails] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState("3 months");
  const [showSentMails, setShowSentMails] = useState(false); // State để điều khiển hiển thị danh sách thư
  const [zoomLevel, setZoomLevel] = useState("allTime");
  const [zoomData, setZoomData] = useState(ratingData.allTime);
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
      console.log("Debug: Current date (now) =", now);

      const pendingMails = futureMails.filter(
        (mail) => mail.receiveDate === now && !mail.notified
      );

      if (pendingMails.length > 0) {
        console.log("Debug: Pending mails for today =", pendingMails);
        const firstMail = pendingMails[0];
        const formattedSendDate = firstMail.sendDate.split("T")[0];
        const formattedReceiveDate = firstMail.receiveDate;

        showCustomAlert(
          "📨 Thư từ quá khứ đã đến!",
          `<p><strong>Nội dung:</strong> ${firstMail.title}</p>
           <p><strong>Ngày gửi:</strong> ${formattedSendDate}</p>
           <p><strong>Ngày nhận:</strong> ${formattedReceiveDate}</p>
           <p>Chúc bạn trải nghiệm vui vẻ 🥰✨</p>`
        );

        const updatedMails = futureMails.map((mail) =>
          pendingMails.find((m) => m.id === mail.id)
            ? { ...mail, notified: true }
            : mail
        );
        setFutureMails(updatedMails);
        localStorage.setItem("futureMails", JSON.stringify(updatedMails));
      } else {
        console.log("Debug: No pending mails for today.");
      }
    };

    checkMails();
    const interval = setInterval(checkMails, 60000);
    return () => clearInterval(interval);
  }, [futureMails, navigate]); // Thêm `navigate` vào dependency

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
        showCustomAlert(
          "📬 Bạn có thư từ quá khứ!",
          `<p><strong>Nội dung:</strong> ${mail.content}</p>
           <p><strong>Ngày gửi:</strong> ${mail.sendDate}</p>
           <p><strong>Ngày nhận:</strong> ${mail.receiveDate}</p>`
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(today);

    const selectedDate = new Date(sendDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert("Không thể gửi thư cho ngày trong quá khứ!");
      return;
    }

    try {
      const payload = await getPayLoad();
      const now = new Date();
      const sendDateTime = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

      const newMail = {
        id: Date.now(),
        title:
          mailContent.substring(0, 30) + (mailContent.length > 30 ? "..." : ""),
        content: mailContent,
        sendDate: sendDateTime,
        receiveDate: sendDate,
        notified: selectedDate.getTime() === today.getTime(), // Mark as notified if today
        read: false,
      };

      if (payload?.userId) {
        await addFutureMail(payload.userId, newMail);
      }

      const savedMails = JSON.parse(localStorage.getItem("futureMails")) || [];
      const updatedMails = [...savedMails, newMail];
      localStorage.setItem("futureMails", JSON.stringify(updatedMails));
      setFutureMails(updatedMails);

      setMailContent("");
      setSendDate("");

      const isToday = selectedDate.getTime() === today.getTime();

      if (isToday) {
        // Thông báo đầu tiên
        Swal.fire({
          title: "📨 Thư đã được gửi thành công cho tương lai!",
          html: `<p><strong>Nội dung:</strong> ${newMail.content}</p>
                 <p><strong>Ngày gửi:</strong> ${newMail.sendDate}</p>
                 <p><strong>Ngày nhận:</strong> ${newMail.receiveDate}</p>
                 <p>Chúc bạn trải nghiệm vui vẻ 🥰✨</p>`,
          background: "#ffe4e1",
          confirmButtonColor: "#ff69b4",
          icon: "info",
        }).then(() => {
          // Chuyển trang trước, sau đó hiển thị thông báo thứ hai
          navigate("/today-mails", {
            state: { mail: newMail, fromExplore: true },
          });

          setTimeout(() => {
            Swal.fire({
              title: "📨 Thư từ quá khứ đã đến!",
              html: `<p><strong>Nội dung:</strong> ${newMail.content}</p>
                     <p><strong>Ngày gửi:</strong> ${newMail.sendDate}</p>
                     <p><strong>Ngày nhận:</strong> ${newMail.receiveDate}</p>
                     <p>Chúc bạn trải nghiệm vui vẻ 🥰✨</p>`,
              background: "#ffe4e1",
              confirmButtonColor: "#ff69b4",
              icon: "info",
            });
          }, 500); // Đợi 500ms sau khi chuyển trang
        });
      } else if (selectedDate > today) {
        Swal.fire({
          title: "📨 Thư đã được gửi thành công cho tương lai!",
          html: `<p><strong>Nội dung:</strong> ${newMail.content}</p>
                 <p><strong>Ngày gửi:</strong> ${newMail.sendDate}</p>
                 <p><strong>Ngày nhận:</strong> ${newMail.receiveDate}</p>
                 <p>Chúc bạn trải nghiệm vui vẻ 🥰✨</p>`,
          background: "#ffe4e1",
          confirmButtonColor: "#ff69b4",
          icon: "info",
        });
      }
    } catch (error) {
      console.error("Lỗi khi gửi thư:", error);
      alert("Có lỗi xảy ra khi gửi thư. Vui lòng thử lại.");
    }
  };

  const toggleSentMails = () => {
    setShowSentMails(!showSentMails);
  };

  const handleZoom = (level) => {
    setZoomLevel(level);
    if (level === "allTime") {
      setZoomData(ratingData.allTime);
    } else if (level === "year") {
      setZoomData(ratingData.year);
    } else if (level === "month") {
      setZoomData(ratingData.month);
    }
  };

  const renderZoomControls = () => (
    <div style={{ marginBottom: "10px" }}>
      <button
        onClick={() => handleZoom("allTime")}
        disabled={zoomLevel === "allTime"}
      >
        All Time
      </button>
      <button
        onClick={() => handleZoom("year")}
        disabled={zoomLevel === "year"}
      >
        Year
      </button>
      <button
        onClick={() => handleZoom("month")}
        disabled={zoomLevel === "month"}
      >
        Month
      </button>
    </div>
  );

  const renderLineChartWithZoom = () => (
    <div>
      {renderZoomControls()}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={zoomData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Brush dataKey="name" height={30} stroke="#8884d8" />{" "}
          {/* Add Brush for zoom functionality */}
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
                            showCustomAlert(
                              "Nội dung thư",
                              `<p>${mail.content || "Không có nội dung"}</p>`
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
