const dateHelper = {
  formatDateToVN: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  },
  getDayClassName: (date, treatments) => {
    // Lấy ngày từ đối tượng `date` mà không phải qua UTC
    const formattedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()); // Đảm bảo rằng chỉ có ngày, không có giờ
  
    // Tìm treatment khớp với ngày đó
    const match = treatments?.find((t) => {
      const treatmentDate = new Date(t.schedule_id.start_time);
      // Đảm bảo so sánh chỉ phần ngày, không so sánh giờ
      const treatmentDateOnly = new Date(treatmentDate.getFullYear(), treatmentDate.getMonth(), treatmentDate.getDate());
      return treatmentDateOnly.getTime() === formattedDate.getTime();
    });
  
    if (match) {
      const now = new Date();
      if (new Date(match.schedule_id.start_time) > now) return "dot-pending"; // Nếu start_time của treatment lớn hơn thời gian hiện tại, trả về class "dot-pending"
      else return null;
    }
  
    return null; // Nếu không có treatment nào khớp
  },
  getVietnamDate: (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  },
  getVietnamTime: (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // dùng 24h format
    });
  },
};

export default dateHelper;
