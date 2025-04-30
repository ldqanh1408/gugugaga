import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPayLoad } from "../../services/authService";
import { addFutureMail } from "../../services";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ExploreYourselfPage.css";

const ExploreYourselfPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendMail = async (e) => {
    e.preventDefault();

    try {
      if (!title?.trim()) {
        toast.error("Vui lòng nhập tiêu đề thư");
        return;
      }
      if (!content?.trim()) {
        toast.error("Vui lòng nhập nội dung thư");
        return;
      }
      if (!selectedDate) {
        toast.error("Vui lòng chọn ngày nhận thư");
        return;
      }

      setIsLoading(true);

      const payload = await getPayLoad();
      if (!payload?._id) {
        throw new Error("Không thể xác thực người dùng");
      }

      const mailData = {
        title: title.trim(),
        content: content.trim(),
        sendDate: new Date(),
        receiveDate: selectedDate,
      };

      const result = await addFutureMail(payload._id, mailData);

      if (result.success) {
        toast.success("Gửi thư thành công!");

        // Nếu ngày nhận là ngày hiện tại, chuyển đến TodayMailsPage
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const receiveDate = new Date(selectedDate);
        receiveDate.setHours(0, 0, 0, 0);

        if (receiveDate.getTime() === today.getTime()) {
          navigate("/today-mails", {
            state: { mail: result.futureMail },
          });
        }

        // Reset form
        setTitle("");
        setContent("");
        setSelectedDate(null);
      }
    } catch (error) {
      console.error("Lỗi khi gửi thư:", error);
      toast.error(
        error.message || "Có lỗi xảy ra khi gửi thư. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="explore-yourself-container">
      <h2>✉️ Gửi thư cho tương lai</h2>
      <form onSubmit={handleSendMail}>
        <div className="form-group">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tiêu đề thư"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nội dung thư..."
            className="form-control"
            rows="6"
          />
        </div>
        <div className="form-group">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
            placeholderText="Chọn ngày nhận thư"
            className="form-control"
          />
        </div>
        <button type="submit" className="send-button" disabled={isLoading}>
          {isLoading ? "Đang gửi..." : "Gửi thư"}
        </button>
      </form>
    </div>
  );
};

export default ExploreYourselfPage;
