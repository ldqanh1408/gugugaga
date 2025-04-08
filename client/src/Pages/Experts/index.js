import React, { useState } from "react";
import "./ExpertsPage.css"; // Gọi file CSS riêng

// Dữ liệu các chuyên gia
const dummyExperts = [
  {
    id: 1,
    name: "Cô Thanh Tâm Lý",
    specialty: "Trị liệu cá nhân",
    experience: 10,
    rating: 4.8,
    price: 500000,
    location: "Hà Nội",
    schedule: "Thứ 2 - Thứ 6, 9h - 17h",
  },
  {
    id: 2,
    name: "Thầy Quốc Anh Sâu Sắc",
    specialty: "Tâm lý trẻ em",
    experience: 7,
    rating: 4.5,
    price: 400000,
    location: "TP.HCM",
    schedule: "Thứ 3 - Thứ 7, 8h - 18h",
  },
  {
    id: 3,
    name: "Thầy Hảo tình cảm",
    specialty: "Tư vấn tình cảm",
    experience: 20,
    rating: 4.5,
    price: 1000000,
    location: "TP.HCM",
    schedule: "Thứ 3 - Thứ 7, 8h - 18h",
  },
  {
    id: 4,
    name: "Thầy BaKa ân cần ",
    specialty: "Tâm lý trẻ sơ sinh",
    experience: 27,
    rating: 4.5,
    price: 500000,
    location: "TP.HCM",
    schedule: "Thứ 3 - Thứ 7, 8h - 19h",
  },
  // Thêm nhiều chuyên gia ở đây nếu cần
];

const ExpertsPage = () => {
  const [search, setSearch] = useState("");

  // Lọc danh sách chuyên gia theo từ khóa tìm kiếm
  const filteredExperts = dummyExperts.filter(
    (expert) =>
      expert.name.toLowerCase().includes(search.toLowerCase()) ||
      expert.specialty.toLowerCase().includes(search.toLowerCase()) ||
      expert.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="experts-container">
      <h2>Danh sách chuyên gia</h2>

      <input
        className="search-input"
        type="text"
        placeholder="Tìm theo tên, chuyên môn, vị trí..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="expert-list">
        {filteredExperts.map((expert) => (
          <div className="expert-card" key={expert.id}>
            <h3>{expert.name}</h3>
            <p>
              <strong>Chuyên môn:</strong> {expert.specialty}
            </p>
            <p>
              <strong>Kinh nghiệm:</strong> {expert.experience} năm
            </p>
            <p>
              <strong>Đánh giá:</strong> ⭐ {expert.rating}
            </p>
            <p>
              <strong>Giá:</strong> {expert.price.toLocaleString()}đ / buổi
            </p>
            <p>
              <strong>Vị trí:</strong> {expert.location}
            </p>
            <p>
              <strong>Lịch làm việc:</strong> {expert.schedule}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpertsPage;
