# Gugugaga

## 📌 Giới thiệu
**Gugugaga** là một ứng dụng hỗ trợ ghi nhật ký, trò chuyện và theo dõi tâm trạng cá nhân. Dự án sử dụng **Node.js, Express, MongoDB** để xây dựng backend API.

---

## 🚀 Công nghệ sử dụng
- **Node.js & Express.js** - Xây dựng server backend
- **MongoDB & Mongoose** - Quản lý cơ sở dữ liệu
- **JWT (JSON Web Token)** - Xác thực người dùng
- **Bcrypt.js** - Mã hóa mật khẩu
- **Swagger** - Tạo tài liệu API

---

## 📂 Cấu trúc thư mục
```
📦 gugugaga
├── 📁 config         # Cấu hình môi trường và kết nối database
├── 📁 controllers    # Xử lý logic API
├── 📁 models         # Định nghĩa Schema cho MongoDB
├── 📁 routes         # Định nghĩa các API endpoint
├── 📁 scripts        # Scripts hỗ trợ backup database
├── 📁 utils          # Chứa helper functions như JWT, hash mật khẩu
├── server.js        # File chính để khởi chạy server
├── swagger.json     # Cấu hình tài liệu API Swagger
└── README.md        # Hướng dẫn sử dụng
```

---

## 🔧 Cài đặt và chạy dự án
### 1️⃣ **Clone dự án**
```sh
git clone https://github.com/ldqanh1408/gugugaga.git
cd gugugaga
```

### 2️⃣ **Cài đặt dependencies**
```sh
npm install
```

### 3️⃣ **Cấu hình môi trường**
Tạo file `.env` trong thư mục gốc và điền các giá trị sau:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/gugugaga
JWT_SECRET=your_secret_key
```

### 4️⃣ **Chạy server**
```sh
npm start
```
Mặc định server sẽ chạy trên `http://localhost:5000`

---

## 📌 API Endpoints
Dưới đây là một số API chính của dự án:

### 🔹 **Authentication**
| Method | Endpoint         | Mô tả |
|--------|----------------|------|
| POST   | `/auth/register` | Đăng ký người dùng mới |
| POST   | `/auth/login`    | Đăng nhập |
| POST   | `/auth/logout`   | Đăng xuất |

### 🔹 **Journal**
| Method | Endpoint         | Mô tả |
|--------|----------------|------|
| POST   | `/journals/:journalId/notes` | Thêm ghi chú |
| PUT    | `/journals/:journalId/notes/:noteId` | Cập nhật ghi chú |
| GET    | `/journals/:journalId/entries` | Lấy danh sách ngày có ghi chú |

📌 **Xem chi tiết API với Swagger:**
Sau khi chạy server, mở trình duyệt và truy cập:
```sh
http://localhost:5000/api-docs
```

---

## 🔄 Backup Database
Dự án hỗ trợ backup MongoDB bằng `mongodump`. Chạy script sau để backup:
```sh
bash scripts/backup_db.sh
```
Dữ liệu sẽ được lưu trong thư mục `backup/`.

---

## 👨‍💻 Đóng góp
1. Fork repository
2. Tạo nhánh mới (`git checkout -b feature-moi`)
3. Commit thay đổi (`git commit -m 'Thêm tính năng mới'`)
4. Push lên GitHub (`git push origin feature-moi`)
5. Tạo pull request

---

## 📜 Giấy phép
Dự án được phát hành dưới giấy phép **MIT License**. Bạn có thể tự do sử dụng, sửa đổi và chia sẻ.

---

**🔥 Chúc bạn code vui vẻ!** 🚀

