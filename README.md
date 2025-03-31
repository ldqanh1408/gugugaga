### Hướng Dẫn Chạy llama.cpp trên GPU

#### 1. Tải Visual Studio 2022  
• Truy cập trang tải **Visual Studio**.  
• Chọn phiên bản phù hợp: **Community, Professional, hoặc Enterprise**.  
• Tải về tệp cài đặt (ví dụ: `VisualStudioSetup.exe`).  

#### 2. Cài Đặt Visual Studio 2022  
• Mở tệp cài đặt và chờ **Visual Studio Installer** tải các thành phần cần thiết.  
• Chọn **Desktop development with C++**.  
• Nhấn **Install** để cài đặt.  

#### 3. Kiểm Tra Phiên Bản Driver NVIDIA  
• Mở **Command Prompt** (Win + S, nhập `cmd`, nhấn Enter).  
• Chạy lệnh:  
```sh
nvidia-smi
```  
• Ghi lại **Driver Version** (ví dụ: `531.79`).  

#### 4. Xác Định Phiên Bản CUDA Toolkit Phù Hợp  
• Truy cập [**CUDA Toolkit Release Notes**](https://docs.nvidia.com/cuda/cuda-toolkit-release-notes/index.html).  
• Đối chiếu phiên bản driver để chọn bản CUDA tương ứng.  

#### 5. Tải và Cài Đặt CUDA Toolkit  
• Truy cập [**CUDA Toolkit Downloads**](https://developer.nvidia.com/cuda-downloads).  
• Chọn hệ điều hành **Windows** và tải phiên bản phù hợp.  
• Chọn **Express Installation** hoặc **Custom Installation** (nếu cần).  

#### 6. Kiểm Tra Cài Đặt CUDA Toolkit  
• Mở **Command Prompt** và chạy:  
```sh
nvcc --version
```  
• Nếu hiển thị phiên bản CUDA, cài đặt thành công! 🎉  

---

### 7. Chạy llama.cpp Trên GPU/CPU Bằng PowerShell Script  

### Hướng Dẫn Chạy llama.cpp Trên GPU/CPU Bằng Script Tự Động  

### 🔸 **Bảng So Sánh Cài Đặt GPU vs CPU**  

| **GPU** (Tối ưu tốc độ)                          | **CPU** (Dành cho thử nghiệm)                   |
|--------------------------------------------------|-------------------------------------------------|
| **Yêu cầu:**                                     | **Yêu cầu:**                                    |
| - Card NVIDIA hỗ trợ CUDA                        | - Không cần card NVIDIA                         |
| - Đã cài CUDA Toolkit và driver NVIDIA           |                                                 |
| **Cài đặt tự động:**                             | **Cài đặt tự động:**                            |
| 1. Mở PowerShell **với quyền Admin**.            | 1. Mở PowerShell **với quyền Admin**.           |
| 2. Cho phép chạy script:                         | 2. Cho phép chạy script:                        |
| ```powershell                                    | ```powershell                                   |
| Set-ExecutionPolicy Bypass -Scope Process -Force | Set-ExecutionPolicy Bypass -Scope Process -Force|
| ```                                              | ```                                             |
| 3. **Di chuyển đến folder cha** của file script: | 3. **Di chuyển đến folder cha** của file script:|
| setupnbuild_2run_model_oGPU                      | setupnbuild_2run_model_oCPU                     |
| ```                                              | ```                                             |
| 4. Chạy script build GPU:                        | 4. Chạy script build CPU:                       |
| ```powershell                                    | ```powershell                                   |
| .\setupnbuild_2run_model_oGPU.ps1                | .\setupnbuild_2run_model_oCPU.ps1               |
| ```                                              | ```                                             |
| **Script sẽ tự động:**                           | **Script sẽ tự động:**                          |
| - Clone repo llama.cpp                           | - Clone repo llama.cpp                          |
| - Build project với CUDA hỗ trợ GPU              | - Build project cho CPU                         |
| **Chạy mô hình:**                                | **Chạy mô hình:**                               |
|                                                  |                                                 |
| .\llama-server.exe -m model.gguf --n-gpu-layers 32           | .\llama-server.exe -m model.gguf --threads 8                |
| ```                                              | ```                                             |
| **Lưu ý:**                                       | **Lưu ý:**                                      |
| - Điều chỉnh `--n-gpu-layers` theo VRAM (ví dụ: 32). | - Tốc độ chậm hơn đáng kể (khuyến nghị dùng GPU). |
| - Dùng `--threads` để tối ưu đa luồng CPU.       | - Phù hợp cho mô hình nhỏ (dưới 7B).            |

---

### Giải Thích Bổ Sung:  
- **Folder cha của script**: Đảm bảo bạn đang ở **thư mục chứa file script** (ví dụ: nếu script nằm trong thư mục `scripts`, hãy chạy `cd ..` để ra thư mục gốc trước khi chạy script).  
- **Tệp thực thi `main.exe`**: Được tự động tạo ra sau khi build thành công, nằm trong thư mục `build` hoặc `build_cpu`.  
- **Quyền Admin**: Bắt buộc để script có quyền cài đặt các phụ thuộc hệ thống.

---

### Giải Thích Chi Tiết Script:  
- **`setupnbuild_2run_model_oGPU.ps1`** và **`setupnbuild_2run_model_oCPU.ps1`**:  
  - Tự động clone repository llama.cpp từ GitHub.  
  - Build project với cấu hình tối ưu cho GPU (CUDA) hoặc CPU.  
  - Không cần chạy lệnh `cmake` hoặc `git clone` thủ công.  
- **Quyền Admin**: Cần thiết để đảm bảo script có quyền cài đặt các thành phần hệ thống.  

⚠️ **Lỗi thường gặp:**  
- Nếu gặp lỗi *"Script cannot be loaded"*, chạy lệnh sau trước khi thực thi script:  
  ```powershell
  Set-ExecutionPolicy RemoteSigned -Scope CurrentUser  
  ```
---

### 8. Tải Mô Hình và Ví Dụ Lệnh  
• Tải mô hình GGUF từ [HuggingFace Hub](https://huggingface.co/models?search=gguf).  
• Ví dụ chạy trên GPU với mô hình 7B:  
```powershell
.\main -m models\llama-2-7b.gguf --n-gpu-layers 32 --prompt "Xin chào!"
```  
• Ví dụ chạy trên CPU:  
```powershell
.\main -m models\llama-2-7b.gguf --threads 8 --prompt "Xin chào!"
```  

⚠️ **Khuyến nghị:**  
- Trên GPU: Dùng `--n-gpu-layers 999` để đẩy toàn bộ layer lên GPU (nếu đủ VRAM).  
- Trên CPU: Tăng `--threads` theo số lõi CPU (ví dụ: 8 threads cho CPU 4 lõi/8 luồng).
