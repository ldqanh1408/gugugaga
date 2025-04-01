export const getVietnamDate = () => {
  const now = new Date();
  now.setHours(now.getHours() + 7); // Thêm 7 giờ để chuyển từ UTC sang GMT+7
  return now.toISOString().split("T")[0]; // Lấy phần ngày (YYYY-MM-DD)
};
