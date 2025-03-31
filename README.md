
## 1. Cấu Hình và Chạy trên GPU (Tối Ưu Tốc Độ)

### 1.1. Cài Đặt Visual Studio 2022

- **Tải Visual Studio 2022:**

  - Truy cập [Visual Studio](https://visualstudio.microsoft.com/).
  - Chọn phiên bản phù hợp: **Community**, **Professional** hoặc **Enterprise**.
  - Tải về tệp cài đặt (ví dụ: `VisualStudioSetup.exe`).

- **Cài Đặt Visual Studio 2022:**

  - Mở tệp `VisualStudioSetup.exe`.
  - Chờ Visual Studio Installer tải xuống các thành phần cần thiết.
  - Chọn tùy chọn: **Desktop development with C++**.
  - Nhấn **Install** và chờ quá trình cài đặt hoàn tất.

### 1.2. Kiểm Tra, Cập Nhật và Cài Đặt NVIDIA Driver & CUDA Toolkit

- **Kiểm Tra Phiên Bản Driver NVIDIA:**

  - Mở Command Prompt (nhấn **Win + S**, gõ `cmd`, sau đó nhấn Enter).
  - Chạy lệnh:
    ```sh
    nvidia-smi
    ```
  - Ghi lại **Driver Version** (ví dụ: `531.79`).

- **Cập Nhật Driver NVIDIA (nếu cần):**

  - Mở **NVIDIA App** trên máy tính.
  - Chọn mục **Driver**.
  - Nhấp vào **Update Driver** nếu có bản cập nhật mới.
  - Nhấp Express Installation và cài đặt.

- **Xác Định & Cài Đặt CUDA Toolkit:**

  - Truy cập [CUDA Toolkit Release Notes](https://docs.nvidia.com/cuda/cuda-toolkit-release-notes/index.html) để so sánh phiên bản driver của bạn với các yêu cầu CUDA.
  - Truy cập [CUDA Toolkit Downloads](https://developer.nvidia.com/cuda-downloads) và chọn hệ điều hành **Windows** để tải phiên bản phù hợp.
    ## Lựa chọn:
    - **Custom Installation:** chỉ chọn CUDA để cài đặt.
  - Sau khi cài đặt, mở Command Prompt và chạy:
    ```sh
    nvcc --version
    ```
  - Nếu lệnh hiển thị phiên bản CUDA, cài đặt đã thành công! 🎉

### 1.3. Chuẩn Bị và Build Dự Án llama.cpp cho GPU

- **Mở PowerShell với quyền Admin:**\
  Cho phép chạy script bằng lệnh:
  ```powershell
  Set-ExecutionPolicy Bypass -Scope Process -Force
  ```
- **Di chuyển đến folder chứa file script sau:**\

  ```powershell
  setupnbuild_2run_model_oGPU
  ```
- **Chạy script build cho GPU:**
  ```powershell
  .\setupnbuild_2run_model_oGPU.ps1
  ```
  Script sẽ tự động:
  - Clone repository `llama.cpp` từ GitHub.
  - Build project với cấu hình hỗ trợ CUDA cho GPU.

---

## 2. Cấu Hình và Chạy trên CPU (Dành Cho Thử Nghiệm)

- **Mở PowerShell với quyền Admin:**\
  Cho phép chạy script bằng lệnh:
  ```powershell
  Set-ExecutionPolicy Bypass -Scope Process -Force
  ```
- **Di chuyển đến folder chứa file script sau:**\

  ```powershell
  setupnbuild_2run_model_oCPU
  ```
- **Chạy script build cho CPU:**
  ```powershell
  .\setupnbuild_2run_model_oCPU.ps1
  ```
  Script sẽ tự động:
  - Clone repository `llama.cpp` từ GitHub.
  - Build project với cấu hình tối ưu cho CPU.

---

## 3. So Sánh GPU vs CPU

| **Tiêu chí**              | **GPU**                            | **CPU**                                 |
| ------------------------- | ---------------------------------- | --------------------------------------- |
| **Tốc độ xử lý**          | Nhanh hơn nhiều lần                | Chậm hơn đáng kể                        |
| **Khả năng chạy mô hình** | Hỗ trợ mô hình lớn (7B trở lên)    | Phù hợp cho mô hình nhỏ (dưới 7B)       |
| **Cấu hình yêu cầu**      | Cần card đồ họa NVIDIA hỗ trợ CUDA | Chỉ cần CPU đủ mạnh                     |
| **Tiêu thụ tài nguyên**   | Tiêu tốn VRAM cao, cần GPU mạnh    | Tiêu tốn RAM nhiều hơn                  |
| **Khuyến nghị**           | Dùng `--gpu-layers xx` nếu đủ VRAM | Dùng `--threads` để tối ưu đa luồng CPU |

---

## 4. Chạy Script Thiết Lập Lưu Trữ Dữ Liệu Cho Model

- **Mở PowerShell với quyền Admin:**
  ```powershell
  Set-ExecutionPolicy Bypass -Scope Process -Force
  ```
  - **Di chuyển đến folder chứa file script sau:**\
  ```powershell
  setup_storage4_mode
  ```
- **Chạy script để thiết lập lưu trữ dữ liệu:**
  ```powershell
  .\setup_storage4_model.ps1
  ```


## 5. Tải Mô Hình và Ví Dụ Lệnh

• Tải mô hình GGUF từ [HuggingFace Hub](https://huggingface.co/models?search=gguf).\
• Ví dụ chạy trên GPU với mô hình 7B:

```powershell
.\llama-server.exe -m models\llama-2-7b.gguf --gpu-layers 32 
```

• Ví dụ chạy trên CPU:

```powershell
.\llama-server.exe -m models\llama-2-7b.gguf --threads 8 
```

⚠️ **Khuyến nghị:**

- Trên GPU: Dùng `--gpu-layers xx` để đẩy toàn bộ layer lên GPU ("xx"phụ thuộc vào VRAM của GPU).
- Trên CPU: Tăng `--threads` theo số lõi CPU (ví dụ: 8 threads cho CPU 4 lõi/8 luồng).

---

**Lưu ý chung:**

- Nếu gặp lỗi “Script cannot be loaded”, hãy chạy:
  ```powershell
  Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```
- Chạy trên GPU sẽ tối ưu tốc độ xử lý so với CPU, đặc biệt với các mô hình lớn. CPU phù hợp cho thử nghiệm với các mô hình nhỏ hơn.

Với hướng dẫn này, bạn đã cập nhật driver NVIDIA nếu cần và có thể cài đặt, build dự án trên cả GPU và CPU theo nhu cầu của mình.
