# Gugugaga

## 📌 Giới thiệu
**Gugugaga** là một ứng dụng hỗ trợ ghi nhật ký, trò chuyện với AI thấu hiểu cảm xúc và theo dõi tâm trạng cá nhân. Dự án sử dụng **Node.js, Express, MongoDB** để xây dựng backend API.

---


## 🚀 Công nghệ sử dụng
- **Node.js & Express.js** - Xây dựng server backend
- **MongoDB & Mongoose** - Quản lý cơ sở dữ liệu
- **JWT (JSON Web Token)** - Xác thực người dùng
- **Bcrypt.js** - Mã hóa mật khẩu
- **Swagger** - Tạo tài liệu API
- **Cloudinary** - Lưu trữ file, ảnh...

---

## 📂 Cấu trúc thư mục
```
📁 Gugugaga
├── 📁 client
│   ├── 📁 data
│   ├── 📁 public
│   ├── 📁 src
│   ├── 📄 .gitignore
│   ├── 📄 README.md
│   ├── 📄 package-lock.json
│   ├── 📄 package.json
│   └── 📄 webpack.config.js
│
├── 📁 server
│   ├── 📁 node_modules
│   ├── 📁 src
│   ├── 📄 .env
│   ├── 📄 package-lock.json
│   ├── 📄 package.json
│   └── 📄 server.js
├── 📁 AI 
    ├──📁 llama.cpp
    ├──📄run_model.bat
    ├──📄chatbot_api.py
    ├──📄setup_storage4_model.ps1 (chạy file powershell setup_storage4_model để setup cho chatbot_api.py)
    ├──📄setupnbuild_2run_model_oCPU.ps1 (chạy 1 trong 2 file powershell (setupnbuild_2run_model_oCPU, setupnbuild_2run_model_oGPU) để tạo folder llama.cpp)
    ├──📄setupnbuild_2run_model_oGPU.ps1
    ├──your_model.gguf
```

---

## 🔧 Cài đặt và chạy dự án
### 1️⃣ **Clone dự án**
```sh
git clone https://github.com/ldqanh1408/gugugaga.git
git clone --branch AI --single-branch https://github.com/ldqanh1408/gugugaga.git
cd gugugaga
```
###Cài đặt MongoDB

Dự án yêu cầu MongoDB. Nếu chưa cài đặt, hãy tải về từ trang chính thức và làm theo hướng dẫn cài đặt tại https://www.mongodb.com/try/download/community
phiên bản 6.0.21
###📦 Yêu cầu hệ thống:
- Node.js v18+
- MongoDB 6.0.21
- Python 3.10+ (cho AI model)

### 2️⃣ **Cài đặt dependencies**
Vào thư mục **./client** và gõ lệnh
```sh
npm run install-all
```

### 3️⃣ **Cấu hình môi trường**
Tạo file `.env` trong thư mục gốc và điền các giá trị sau:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/Diary
JWT_SECRET= 6b01fe644626b1037d5f240391bdb8e25d26b70555e983c4cc325f16a2a4a039
API_SECRET_KEY = your_secret_key
API_KEY = your_key
CLOUD_NAME = your_cloud name
```
Các thông số : API_KEY, SECRET_KEY, CLOUD_NAME, có thể nhận được khi đăng kí cloudinary trên web.
### 4️⃣ **Chạy server**
Vào thư mục client và gõ lệnh sau:
```sh
npm start
```
```sh
double click vào file run_model.bat
```

Mặc định server sẽ chạy trên `http://localhost:5000`

---

## 📌 API Endpoints
- Tất cả API nằm trong http://localhost:5000/api-docs/
📌 **Xem chi tiết API với Swagger:**
Sau khi chạy server, mở trình duyệt và truy cập:
```sh
http://localhost:5000/api-docs
```

---

## 🔄 Backup Database
Dự án hỗ trợ backup MongoDB bằng `mongodump`. 
Có thể backup dữ liệu (import hoặc export) bằng API

---


## 📌 Mở rộng tính năng (Trong tương lai)
📊 Dashboard theo dõi tâm trạng

Hiển thị biểu đồ cảm xúc dựa trên nhật ký.

🔔 Gửi thông báo (Email hoặc Telegram Bot)

Thông báo khi có tin nhắn mới hoặc nhắc nhở viết nhật ký.

🎨 Dark Mode

Cho phép chuyển đổi giao diện Sáng/Tối.

📜 Xuất dữ liệu nhật ký thành PDF

Dùng thư viện pdfkit để xuất nhật ký cá nhân.


1️⃣ Sử dụng MongoDB Atlas (Không cần lưu trữ cục bộ)

2️⃣ Triển khai Backend lên Vercel hoặc Render

3️⃣ Thêm Redis Cache để tăng tốc API

5️⃣ Thêm Xác Thực Đa Yếu Tố (2FA) với Google Authenticator

🔧 Thêm đăng nhập bằng google

🔧 Thêm khôi phục tài khoản bằng gmail 

**🔥 Chúc bạn code vui vẻ!** 🚀

