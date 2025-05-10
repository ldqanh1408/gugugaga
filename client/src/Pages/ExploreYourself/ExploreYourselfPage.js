import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useSelector } from "react-redux";

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
    background: "#ffe4e1",
    confirmButtonColor: "#ff69b4",
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
  const { entity } = useSelector((state) => state.auth);

  //   log chi tiết để kiểm tra lưu trữ trong localStorage
  useEffect(() => {
    const savedMails = JSON.parse(localStorage.getItem("futureMails")) || [];
    console.log("[Debug] Loaded futureMails from localStorage:", savedMails);

    // Kiểm tra định dạng receiveDate
    savedMails.forEach((mail) => {
      console.log(
        `[Debug] Mail ID: ${mail.id}, receiveDate: ${mail.receiveDate}, Valid Format:`,
        /^\d{4}-\d{2}-\d{2}$/.test(mail.receiveDate)
      );
    });

    setFutureMails(savedMails);
  }, []);

  // Thêm logic đặt lại trạng thái `notified` trong localStorage để kiểm tra hiển thị
  useEffect(() => {
    const resetNotifiedStatus = () => {
      const savedMails = JSON.parse(localStorage.getItem("futureMails")) || [];
      const updatedMails = savedMails.map((mail) => {
        if (mail.receiveDate === "2025-05-09") {
          return { ...mail, notified: false };
        }
        return mail;
      });
      localStorage.setItem("futureMails", JSON.stringify(updatedMails));
      console.log(
        "[Debug] Reset notified status for mails with receiveDate 2025-05-09:",
        updatedMails
      );
    };

    resetNotifiedStatus();
  }, []);

  // Thêm logic kiểm tra và đặt lại trạng thái `notified` cho thư ngày mai
  useEffect(() => {
    const resetNotifiedForTomorrow = () => {
      const savedMails = JSON.parse(localStorage.getItem("futureMails")) || [];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowString = tomorrow.toISOString().split("T")[0];

      const updatedMails = savedMails.map((mail) => {
        if (mail.receiveDate === tomorrowString) {
          console.log(
            `[Debug] Found mail for tomorrow: ID=${mail.id}, receiveDate=${mail.receiveDate}`
          );
          return { ...mail, notified: false };
        }
        return mail;
      });

      localStorage.setItem("futureMails", JSON.stringify(updatedMails));
      console.log(
        "[Debug] Reset notified status for mails with receiveDate tomorrow:",
        updatedMails
      );
    };

    resetNotifiedForTomorrow();
  }, []);

  // Check for due mails periodically
  useEffect(() => {
    const checkMails = () => {
      const now = new Date().toISOString().split("T")[0];
      console.log("[Debug] Current date (now):", now);

      const pendingMails = futureMails.filter((mail) => {
        const isPending = mail.receiveDate === now && !mail.notified;
        console.log(
          `[Debug] Checking mail ID: ${mail.id}, receiveDate: ${mail.receiveDate}, notified: ${mail.notified}, isPending: ${isPending}`
        );
        return isPending;
      });

      console.log("[Debug] Pending mails for today:", pendingMails);

      if (pendingMails.length > 0) {
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
        console.log(
          "[Debug] Updated futureMails in localStorage:",
          updatedMails
        );
      } else {
        console.log("[Debug] No pending mails for today.");
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

      if (entity?._id) {
        await addFutureMail(entity._id, newMail);
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
    <div className="explore-container fade-in">
      <h2 className="explore-title fs-2 ex-gradient-text">Yourself</h2>
      <div className="explore-tabs">
        <button
          className={activeTab === "statistics" ? "active" : ""}
          onClick={() => setActiveTab("statistics")}
        >
          Thống kê
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
        
      </div>
    </div>
  );
};

export default ExploreYourselfPage;
