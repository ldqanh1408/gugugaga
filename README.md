## 📌 Giới thiệu

Dự án website dùng FastAPI để xây dựng API cho chatbot với llama.cpp, hỗ trợ GPU và CPU. Dưới đây là hướng dẫn cài đặt và danh sách các thư viện cần thiết.

---

## 📌 Công Nghệ Sử Dụng

- **FastAPI**: Xây dựng API cho chatbot.
- **llama.cpp**: Xử lý mô hình AI. ( hướng dẫn sử dụng [llama.cpp](https://github.com/ggml-org/llama.cpp) )
- **MongoDB + PyMongo**: Lưu trữ hội thoại chatbot.
- **ChromaDB + Sentence Transformers**: Tìm kiếm ngữ nghĩa.
- **CUDA Toolkit**: Hỗ trợ GPU cho mô hình AI.
- **Uvicorn**: Chạy máy chủ ASGI.
- **Pydantic**: Xác thực dữ liệu API.
- **Requests**: Gửi yêu cầu HTTP đến llama.cpp.
- **BSON (PyMongo tích hợp sẵn)**: Chuyển đổi ObjectId của MongoDB.
- **CORS Middleware (FastAPI tích hợp sẵn)**: Hỗ trợ Cross-Origin Resource Sharing (CORS).

---
## 📂 Cấu trúc thư mục
```
├──📁 llama.cpp
├──📄run_model.bat
├──📄chatbot_api.py
├──📄setup_storage4_model.ps1 (chạy file powershell setup_storage4_model để setup cho chatbot_api.py)
├──📄setupnbuild_2run_model_oCPU.ps1 (chạy 1 trong 2 file powershell (setupnbuild_2run_model_oCPU, setupnbuild_2run_model_oGPU) để tạo folder llama.cpp)
├──📄setupnbuild_2run_model_oGPU.ps1
```

---
## 📌 Hướng Dẫn Cài Đặt
## 1. Cài Đặt llama.cpp
### 1.1 Cài Đặt llama.cpp Chạy Trên GPU (cách 1, lâu dài)

#### 1. Cài Đặt Visual Studio 2022

- **Tải Visual Studio** từ [Visual Studio](https://visualstudio.microsoft.com/).
- **Cài đặt**:
  - Mở tệp cài đặt `VisualStudioSetup.exe`.
  - Chờ quá trình tải xuống hoàn tất.
  - Chọn tùy chọn: `Desktop development with C++`.
  - Nhấn **Install** và chờ cài đặt hoàn tất.

#### 2. Cài Đặt NVIDIA Driver & CUDA Toolkit

##### Kiểm Tra Phiên Bản Driver NVIDIA

- Mở **Command Prompt** (Win + S, gõ `cmd`, nhấn Enter).
- Chạy lệnh:
  ```sh
  nvidia-smi
  ```
- Ghi lại **Driver Version** (ví dụ: `531.79`).

##### Cập Nhật Driver NVIDIA (nếu cần)

- Mở **NVIDIA App** trên máy tính.
- Chọn **Driver** > **Update Driver** nếu có bản mới.
- Chọn **Express Installation** và hoàn tất cài đặt.

##### Cài Đặt CUDA Toolkit

- Truy cập [CUDA Toolkit Downloads](https://developer.nvidia.com/cuda-downloads) và tải phiên bản phù hợp.
- **Chọn cài đặt tùy chỉnh** (Custom Installation), chỉ cài CUDA.
- Sau khi cài đặt, kiểm tra bằng lệnh:
  ```sh
  nvcc --version
  ```
- Nếu lệnh hiển thị phiên bản CUDA, cài đặt đã thành công! 🎉

#### 3. Build Dự Án llama.cpp Trên GPU

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
cd "Thư mục cha của file setupnbuild_2run_model_oGPU"
.\setupnbuild_2run_model_oGPU.ps1
```

---

### 1.2. Cài Đặt llama.cpp Chạy Trên CPU (cách 2, không lâu dài)

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
cd "Thư mục cha của file setupnbuild_2run_model_oCPU"
.\setupnbuild_2run_model_oCPU.ps1
```

---

## 2. Chạy Script Thiết Lập Lưu Trữ Dữ Liệu Cho Model

1. **Mở PowerShell với quyền Admin:**
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force
   ```
2. **Di chuyển đến thư mục chứa file script:**
   ```powershell
   cd "Thư mục cha của file setup_storage4_mode"
   ```
3. **Chạy script để thiết lập lưu trữ dữ liệu:**
   ```powershell
   .\setup_storage4_model.ps1
   ```

---

## 3. Tải Mô Hình và Chạy

- **Tải mô hình GGUF** từ [HuggingFace](https://huggingface.co/models?search=gguf).
- **Cấu hình file run_model.bat**:
  ```powershell
  @echo off
  set "BASE_DIR=%~dp0"
  
  start "Llama Server" cmd /k "%BASE_DIR%llama.cpp\build\bin\llama-server.exe -m %BASE_DIR%"NAME_MODEL" --gpu-layers xx --threads yy --port 8090"
  start "Chroma Service" cmd /k python "%BASE_DIR%chatbot_api.py"

  ```
- thay xx là số lớp GPU bạn muốn chia
- thay yy là số luồng CPU bạn muốn dùng
- "NAME_MODEL" = tên model của AI (ví dụ "MODEL_NAME" = mistral.gguf)

---

## 🔥 Lưu Ý

- Nếu gặp lỗi “Script cannot be loaded”, chạy:
  ```powershell
  Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```
- GPU giúp tăng tốc mô hình, CPU phù hợp thử nghiệm mô hình nhỏ.

Với hướng dẫn này, bạn đã có thể cài đặt và chạy dự án trên GPU hoặc CPU! 🚀

