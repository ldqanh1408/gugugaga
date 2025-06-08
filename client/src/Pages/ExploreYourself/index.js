import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addFutureMailAsync } from "../../redux/userSlice";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ExploreYourselfPage.css";

const ExploreYourselfPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const entity = useSelector((state) => state.auth)
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

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);

      if (selected < today) {
        toast.error("Không thể gửi thư cho ngày trong quá khứ!");
        return;
      }

      const maxDate = new Date(today);
      maxDate.setDate(today.getDate() + 30);
      if (selected > maxDate) {
        toast.error("Chỉ có thể gửi thư trong vòng 30 ngày!");
        return;
      }

      setIsLoading(true);

      if (!entity?._id) {
        throw new Error("Không thể xác thực người dùng");
      }

      const mailData = {
        title: title.trim(),
        content: content.trim(),
        sendDate: new Date(),
        receiveDate: selectedDate,
      };

      const result = await dispatch(
        addFutureMailAsync({ userId: entity._id, mailData })
      ).unwrap();

      // Nếu ngày nhận là ngày hiện tại
      if (selected.getTime() === today.getTime()) {
        toast.success("Thư đã được gửi thành công!", {
          autoClose: 1000,
        });

        setIsRedirecting(true);
        // Hiển thị thông báo có thư đến ngay
        toast.info("🎉 Bạn có thư mới! Đang chuyển đến trang xem thư...", {
          autoClose: 2000,
          onClose: () => {
            navigate("/today-mails", {
              state: { mail: result, fromExplore: true },
            });
          },
        });
      } else {
        toast.success("📮 Thư đã được lên lịch gửi thành công!");
        // Reset form sau khi gửi thành công
        setTitle("");
        setContent("");
        setSelectedDate(null);
      }
    } catch (error) {
      console.error("Lỗi khi gửi thư:", error);
      toast.error(error.message || "Có lỗi xảy ra khi gửi thư.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isRedirecting) {
    return (
      <div className="redirecting-container">
        <div className="loading-spinner"></div>
        <p>Đang chuyển đến trang xem thư...</p>
      </div>
    );
  }

  return (
    <div className="explore-yourself-container">
      <h2>✉️ Gửi thư cho hiện tại và tương lai</h2>
      <form
        onSubmit={handleSendMail}
        className={isLoading ? "form-loading" : ""}
      >
        <div className="form-group">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tiêu đề thư..."
            className="title-input"
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nội dung thư..."
            className="content-input"
            disabled={isLoading}
          />
        </div>
        <div className="form-group date-picker">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            maxDate={new Date(new Date().setDate(new Date().getDate() + 30))}
            placeholderText="Chọn ngày nhận thư..."
            dateFormat="dd/MM/yyyy"
            className="date-input"
            disabled={isLoading}
          />
          <small className="text-muted">
            *Bạn có thể chọn ngày nhận thư trong vòng 30 ngày kể từ hôm nay
          </small>
        </div>
        <button type="submit" className="send-button" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="button-spinner"></span>
              Đang gửi...
            </>
          ) : (
            "Gửi thư"
          )}
        </button>
      </form>
    </div>
  );
};

export default ExploreYourselfPage;