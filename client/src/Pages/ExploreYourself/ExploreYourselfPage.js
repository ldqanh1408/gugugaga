import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addFutureMail } from "../../services/userService";
import axios from "axios";
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
  Brush,
  Legend
} from "recharts";
import { useSelector } from "react-redux";

// Custom tooltip to show emotion details
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className="date">{label}</p>
        <p className="score">Score: {data.emotionScore.toFixed(2)}</p>
        <p className="emotion">Emotion: {data.emotion}</p>
        <p className="source">Source: {data.source}</p>
        {data.notes && <p className="notes">Notes: {data.notes}</p>}
      </div>
    );
  }
  return null;
};

const EmotionLegend = () => (
  <div className="emotion-legend">
    <h5>Emotion Scale</h5>
    <ul>
      <li><span className="dot excited"></span>Excited (0.9)</li> 
      <li><span className="dot happy"></span>Happy (0.75)</li>
      <li><span className="dot neutral"></span>Neutral (0.5)</li>
      <li><span className="dot sad"></span>Sad (0.25)</li>
      <li><span className="dot angry"></span>Angry (0.1)</li>
    </ul>
  </div>
);

const ExploreYourselfPage = () => {
  const [activeTab, setActiveTab] = useState("statistics");
  const [timeRange, setTimeRange] = useState("month");
  const [mailContent, setMailContent] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [sendDate, setSendDate] = useState("");
  const [emotionData, setEmotionData] = useState([]);
  const [emotionStats, setEmotionStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState("month");
  const [zoomData, setZoomData] = useState([]);
  const navigate = useNavigate();
  const { entity } = useSelector((state) => state.auth);

  const handleZoom = (level) => {
    setZoomLevel(level);
    switch (level) {
      case "allTime":
        setZoomData(emotionData); // Assuming allTime data is the full emotionData
        break;
      case "year":
        setZoomData(emotionData.filter(data => new Date(data.name).getFullYear() === new Date().getFullYear()));
        break;
      case "month":
        setZoomData(emotionData.filter(data => new Date(data.name).getMonth() === new Date().getMonth()));
        break;
      default:
        setZoomData(emotionData);
    }
  };

  useEffect(() => {
    // Initialize with month view
    handleZoom("month");
  }, [emotionData]);

  // Fetch emotion data when timeRange changes
  useEffect(() => {
    const fetchEmotionData = async () => {
      try {
        const [historyRes, statsRes] = await Promise.all([
          axios.get(`/api/emotions/history?timeRange=${timeRange}`),
          axios.get(`/api/emotions/stats?timeRange=${timeRange}`)
        ]);

        // Luôn dùng dữ liệu thật từ API
        const formattedData = historyRes.data.data.map(e => ({
          name: new Date(e.timestamp).toLocaleDateString(),
          emotionScore: e.emotionScore,
          emotion: e.emotion,
          source: e.source,
          notes: e.notes
        }));
        setEmotionData(formattedData);
        setEmotionStats(statsRes.data.data); // dùng dữ liệu thật từ API
      } catch (error) {
        setEmotionData([]);
        setEmotionStats([]);
        console.error('Error fetching emotion data:', error);
      }
    };
    fetchEmotionData();
  }, [timeRange]);

  const renderLineChartWithZoom = () => (
    <div>
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
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={zoomData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Brush dataKey="name" height={30} stroke="#8884d8" />
          <Line
            type="monotone"
            dataKey="emotionScore"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const showCustomAlert = (title, content) => {
    Swal.fire({
      title: title,
      html: content,
      background: "#ffe4e1",
      confirmButtonColor: "#ff69b4",
      icon: title.toLowerCase() === "error" ? "error" : "success"
    });
  };

  // Future mail section handler
  const handleSendFutureMail = async () => {
    if (!mailContent) {
      showCustomAlert('Error', 'Vui lòng nhập nội dung thư');
      return;
    }

    setIsLoading(true);
    try {
      await addFutureMail({
        content: mailContent,
        sendDate,
        duration: selectedDuration
      });

      setMailContent('');
      setSendDate('');
      setSelectedDuration('');

      showCustomAlert('Success', 'Thư đã được gửi thành công!');
    } catch (error) {
      showCustomAlert('Error', 'Có lỗi xảy ra khi gửi thư');
    } finally {
      setIsLoading(false);
    }
  };

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
        <button
          className={activeTab === "future" ? "active" : ""}
          onClick={() => setActiveTab("future")}
        >
          Hộp thư tương lai
        </button>
      </div>      <div className="explore-content">
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
              {emotionData.length > 0 && emotionData[0].notes?.includes('Demo') && (
                <span style={{ 
                  marginLeft: "10px", 
                  fontSize: "14px", 
                  color: "#666",
                  backgroundColor: "#f8f9fa",
                  padding: "4px 8px",
                  borderRadius: "4px"
                }}>
                  (Dữ liệu mẫu)
                </span>
              )}
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
                  style={{
                    width: "100%",
                    height: "150px",
                    padding: "10px",
                    marginTop: "10px",
                    marginBottom: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                  }}
                  value={mailContent}
                  onChange={(e) => setMailContent(e.target.value)}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
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
                    setMailContent("liệu 6 tháng nữa có còn sống không mà đòi viết thư , à thoai cứ viết đuy");
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
