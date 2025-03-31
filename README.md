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

#### 🔸 **Bảng So Sánh GPU vs CPU**  

| **GPU** (Tối ưu tốc độ)                           | **CPU** (Dành cho thử nghiệm)                    |
|---------------------------------------------------|---------------------------------------------------|
| **Yêu cầu:**                                      | **Yêu cầu:**                                      |
| - Card NVIDIA hỗ trợ CUDA                         | - Không cần card NVIDIA                          |
| - Đã cài CUDA Toolkit và driver NVIDIA            |                                                  |
| **Cài đặt:**                                      | **Cài đặt:**                                      |
| 1. Mở PowerShell (Admin):                         | 1. Mở PowerShell (Admin):                        |
| ```powershell                                     | ```powershell                                     |
| Set-ExecutionPolicy -Scope Process Bypass         | Set-ExecutionPolicy -Scope Process Bypass        |
| ```                                               | ```                                               |
| 2. Clone repo và chạy script GPU:                 | 2. Clone repo và chạy script CPU:                |
| ```powershell                                     | ```powershell                                     |
| git clone https://github.com/ggerganov/llama.cpp  | git clone https://github.com/ggerganov/llama.cpp  |
| cd llama.cpp                                      | cd llama.cpp                                      |
| .\setupnbuild_2run_model_oGPU.ps1                 | .\setupnbuild_2run_model_oCPU.ps1                |
| ```                                               | ```                                               |
| **Chạy mô hình:**                                 | **Chạy mô hình:**                                 |
| ```powershell                                     | ```powershell                                     |
| .\main -m model.gguf --n-gpu-layers 32            | .\main -m model.gguf --threads 8                 |
| ```                                               | ```                                               |
| **Lưu ý:**                                        | **Lưu ý:**                                        |
| - Điều chỉnh `--n-gpu-layers` theo VRAM (ví dụ: 32). | - Tốc độ chậm hơn 10-50x so với GPU.             |
| - Sử dụng `--threads` để tận dụng đa luồng CPU.   | - Chỉ phù hợp với mô hình nhỏ (dưới 7B).          |

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
