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
import { getEmotionStats } from "../../services/emotion.service";

const formatRatingData = (rawData) =>
  rawData.map((item) => ({
    name: item.date,
    value: item.value,
  }));

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
  const [timeRange, setTimeRange] = useState("day");
  const [futureMails, setFutureMails] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState("3 months");
  const [showSentMails, setShowSentMails] = useState(false); // State để điều khiển hiển thị danh sách thư
  const [zoomLevel, setZoomLevel] = useState("allTime");
  const [ratingData, setRatingData] = useState({
    allTime: [],
    year: [],
    month: [],
  });
  const [zoomData, setZoomData] = useState(ratingData.allTime);
  const navigate = useNavigate();
  const { entity } = useSelector((state) => state.auth);

  //   log chi tiết để kiểm tra lưu trữ trong localStorage
  const handleZoom = (level) => {
    setZoomLevel(level);
    setZoomData(ratingData[level]);
  };

  useEffect(() => {
    const fetchState = async () => {
      try {
        const raw = await getEmotionStats(timeRange); // [{ date: "2025-05-01", value: 123 }, ...]
        console.log("raw", raw);
        const formatted = raw.map((item) => ({
          name: item.date,
          value: item.value,
        }));

        // Cập nhật dữ liệu phù hợp với `zoomLevel`
        const newRatingData = {
          allTime: formatted, // có thể bạn muốn phân loại sâu hơn, đây là demo
          year: formatted,
          month: formatted,
        };

        setRatingData(newRatingData);
        setZoomData(newRatingData[zoomLevel]); // đồng bộ với zoom hiện tại
      } catch (err) {
        console.error("Lỗi khi lấy thống kê cảm xúc:", err);
      }
    };

    fetchState();
  }, [timeRange, zoomLevel]);

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
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={zoomData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name"   tick={{ fontSize: 12 }} />
          <YAxis
            domain={[0, 1]} // Giới hạn từ 0 đến 1
            tickFormatter={(tick) => {
              if (tick === 0) return "negative";
              if (tick === 0.5) return "neutral";
              if (tick === 1) return "positive";
              return ""; // Ẩn các giá trị khác
              
            }}
              tick={{ fontSize: 12 }} // giảm cỡ chữ

          />
          <Tooltip
            formatter={(value, name) => {
              return [value, "emotion"]; // đổi nhãn từ "value" thành "emotion"
            }}
          />
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
                <option value="day">hôm nay</option>
                <option value="week">1 tuần</option>
                <option value="month">1 tháng</option>
                <option value="year">1 năm</option>
                <option value="allTime">Mọi lúc</option>
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
