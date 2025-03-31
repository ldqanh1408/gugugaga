# Hướng Dẫn Cài Đặt Visual Studio 2022 & CUDA Toolkit

## 1. Tải Visual Studio 2022
- Truy cập [trang tải Visual Studio](https://visualstudio.microsoft.com/).
- Chọn phiên bản phù hợp: **Community**, **Professional**, hoặc **Enterprise**.
- Tải về tệp cài đặt (ví dụ: `VisualStudioSetup.exe`).

## 2. Cài Đặt Visual Studio 2022
- Mở tệp cài đặt và chờ Visual Studio Installer tải các thành phần cần thiết.
- Chọn **Desktop development with C++**.
- Nhấn **Install** để cài đặt.

## 3. Kiểm Tra Phiên Bản Driver Nvidia
- Mở **Command Prompt** (`Win + S`, nhập `cmd`, nhấn **Enter**).
- Chạy lệnh kiểm tra phiên bản driver:
  ```cmd
  nvidia-smi
  ```
- Ghi lại **Driver Version** (ví dụ: `531.79`).

## 4. Xác Định Phiên Bản CUDA Toolkit Phù Hợp
- Truy cập [CUDA Toolkit Release Notes](https://docs.nvidia.com/cuda/cuda-toolkit-release-notes/index.html).
- Đối chiếu với phiên bản driver của bạn để tìm bản CUDA phù hợp.

## 5. Tải và Cài Đặt CUDA Toolkit
- Truy cập [CUDA Toolkit Downloads](https://developer.nvidia.com/cuda-toolkit).
- Chọn hệ điều hành **Windows** và tải phiên bản phù hợp.
- Chạy trình cài đặt, chọn **Express Installation** hoặc **Custom Installation** nếu cần.

## 6. Kiểm Tra Cài Đặt CUDA Toolkit
- Mở **Command Prompt** và nhập lệnh:
  ```cmd
  nvcc --version
  ```
- Nếu hiển thị phiên bản CUDA tương ứng, cài đặt đã thành công! 🎉

