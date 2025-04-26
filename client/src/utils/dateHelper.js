export const getVietnamDate = () => {
  const now = new Date();
  now.setHours(now.getHours() + 7); // Thêm 7 giờ để chuyển từ UTC sang GMT+7
  return now.toISOString().split("T")[0]; // Lấy phần ngày (YYYY-MM-DD)
};

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
    const formattedDate = date.toISOString().split("T")[0];

    // Tìm treatment khớp với ngày đó
    const match = treatments.find((t) => {
      const treatmentDate = new Date(t.schedule_id.start_time)
        .toISOString()
        .split("T")[0];
      return treatmentDate === formattedDate;
    });

    if (match) {
      switch (match.treatmentStatus) {
        case "pending":
          return "dot-pending";
        case "rejected":
          return "dot-rejected";
        case "approved":
          return "dot-approved";
        default:
          return null;
      }
    }

    return null;
  },
};

export default dateHelper;
