# Gugugaga

## 📌 Giới thiệu

Dự án website dùng FastAPI để xây dựng API cho chatbot với llama.cpp, hỗ trợ GPU và CPU. Dưới đây là hướng dẫn cài đặt và danh sách các thư viện cần thiết.

---

## 📌 Công Nghệ Sử Dụng

- **FastAPI**: Xây dựng API cho chatbot.
- **llama.cpp**: Xử lý mô hình AI.
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
├──📄your_model.gguf
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

---

# Hướng Dẫn Sử Dụng và Điều Chỉnh Tham Số API của Llama.cpp

Chào mừng bạn đến với dự án **Chatbot API**! Tài liệu này sẽ hướng dẫn bạn cách điều chỉnh các tham số truyền vào API của **llama.cpp** để tối ưu hóa hiệu suất và chất lượng phản hồi của chatbot. API này được tích hợp trong dự án để xử lý các yêu cầu trò chuyện, và bạn có thể tùy chỉnh các tham số để phù hợp với nhu cầu của mình.

---

## Tổng Quan Về API Llama.cpp

API của **llama.cpp** được gọi trong hàm `call_llama` để tạo phản hồi từ mô hình ngôn ngữ. Các tham số được truyền vào API thông qua một payload JSON, và bạn có thể điều chỉnh chúng để kiểm soát hành vi của mô hình, từ độ dài phản hồi, mức độ sáng tạo, đến hiệu suất tính toán.

Dưới đây là đoạn mã hiện tại trong file `chatbot_api.py` gọi API của **llama.cpp**:

```python
LLAMA_API_URL = "http://127.0.0.1:8080/completion"

def call_llama(prompt: str) -> str:
    payload = {
        "prompt": prompt,
        "n_predict": 400,          # Số token dự đoán, có thể điều chỉnh nếu cần
        "temperature": 0.6,        # Giảm nhiệt độ để giảm tính ngẫu nhiên, phản hồi ổn định hơn
        "top_k": 40,               # Số lựa chọn từ phía trên, giữ nguyên nếu cần sự đa dạng vừa đủ
        "top_p": 0.95,             # Tăng top_p để cho phép một phạm vi từ rộng hơn, nhưng vẫn kiểm soát được sự đa dạng
        "repeat_last_n": 128,      # Giảm số token cuối để hạn chế lặp lại
        "repeat_penalty": 1.1,     # Tăng nhẹ repeat_penalty để hạn chế lặp lại
        "stream": False,
    }
    try:
        resp = requests.post(LLAMA_API_URL, json=payload, timeout=30)
        return resp.json().get("content", "No response")
    except Exception as e:
        print(f"Error calling llama.cpp: {e}")
        return "Error calling AI"
```

---

## Các Tham Số Chính và Cách Điều Chỉnh

Dưới đây là danh sách các tham số chính trong payload của API **llama.cpp**, cùng với giải thích và gợi ý điều chỉnh:

### 1. **`prompt`**
- **Ý nghĩa**: Chuỗi văn bản đầu vào mà mô hình sử dụng để tạo phản hồi.
- **Cách điều chỉnh**: Tham số này được tạo tự động từ hàm `create_prompt` trong mã nguồn. Bạn không cần chỉnh trực tiếp, nhưng có thể kiểm tra hàm `create_prompt` để đảm bảo prompt được tạo phù hợp với nhu cầu.

### 2. **`n_predict`**
- **Ý nghĩa**: Số lượng token tối đa mà mô hình sẽ tạo ra trong phản hồi.
- **Giá trị mặc định**: 400
- **Cách điều chỉnh**:
  - Tăng lên (ví dụ: 600) nếu bạn muốn phản hồi dài hơn.
  - Giảm xuống (ví dụ: 200) nếu bạn muốn phản hồi ngắn gọn hơn.
- **Ví dụ**:
  ```json
  "n_predict": 200  // Giới hạn phản hồi tối đa 200 token
  ```

### 3. **`temperature`**
- **Ý nghĩa**: Điều chỉnh mức độ ngẫu nhiên của phản hồi. Giá trị thấp làm phản hồi ổn định hơn, giá trị cao tăng tính sáng tạo.
- **Giá trị mặc định**: 0.6
- **Cách điều chỉnh**:
  - Giảm xuống (ví dụ: 0.3) để phản hồi logic và ít ngẫu nhiên hơn.
  - Tăng lên (ví dụ: 1.0) để phản hồi sáng tạo hơn, nhưng có thể kém mạch lạc.
- **Ví dụ**:
  ```json
  "temperature": 0.3  // Phản hồi ổn định, ít ngẫu nhiên
  ```

### 4. **`top_k`**
- **Ý nghĩa**: Giới hạn số lượng token có xác suất cao nhất mà mô hình xem xét ở mỗi bước.
- **Giá trị mặc định**: 40
- **Cách điều chỉnh**:
  - Giảm xuống (ví dụ: 20) để giảm sự đa dạng, tập trung vào các token có xác suất cao hơn.
  - Tăng lên (ví dụ: 60) để tăng sự đa dạng, nhưng có thể làm phản hồi kém chính xác.
- **Ví dụ**:
  ```json
  "top_k": 20  // Chỉ xem xét 20 token có xác suất cao nhất
  ```

### 5. **`top_p`**
- **Ý nghĩa**: Sử dụng phương pháp lấy mẫu nucleus, chọn các token có tổng xác suất tích lũy vượt ngưỡng.
- **Giá trị mặc định**: 0.95
- **Cách điều chỉnh**:
  - Giảm xuống (ví dụ: 0.8) để phản hồi tập trung hơn, ít đa dạng hơn.
  - Tăng lên (ví dụ: 1.0) để tăng sự đa dạng, nhưng có thể làm phản hồi lan man.
- **Ví dụ**:
  ```json
  "top_p": 0.8  // Chỉ lấy các token có tổng xác suất tích lũy 80%
  ```

### 6. **`repeat_last_n`**
- **Ý nghĩa**: Số lượng token gần đây được xem xét để áp dụng hình phạt lặp lại.
- **Giá trị mặc định**: 128
- **Cách điều chỉnh**:
  - Giảm xuống (ví dụ: 64) để giảm phạm vi kiểm tra lặp lại, phù hợp với phản hồi ngắn.
  - Tăng lên (ví dụ: 256) để kiểm tra lặp lại trên phạm vi dài hơn.
- **Ví dụ**:
  ```json
  "repeat_last_n": 64  // Kiểm tra lặp lại trong 64 token gần nhất
  ```

### 7. **`repeat_penalty`**
- **Ý nghĩa**: Áp dụng hình phạt cho các token đã xuất hiện để giảm lặp lại.
- **Giá trị mặc định**: 1.1
- **Cách điều chỉnh**:
  - Tăng lên (ví dụ: 1.2) để giảm lặp lại mạnh hơn.
  - Giảm xuống (ví dụ: 1.0) để cho phép lặp lại tự nhiên hơn.
- **Ví dụ**:
  ```json
  "repeat_penalty": 1.2  // Tăng hình phạt lặp lại
  ```

### 8. **`stream`**
- **Ý nghĩa**: Kiểm soát việc truyền phản hồi theo thời gian thực (streaming) hay trả về toàn bộ cùng lúc.
- **Giá trị mặc định**: `false`
- **Cách điều chỉnh**:
  - Đặt thành `true` nếu bạn muốn nhận phản hồi từng token (hữu ích cho giao diện người dùng thời gian thực).
  - Giữ `false` nếu bạn muốn nhận toàn bộ phản hồi cùng lúc.
- **Ví dụ**:
  ```json
  "stream": true  // Bật streaming
  ```

---

## Các Tham Số Nâng Cao (Các bạn nên tham khảo ở tài liệu tham khảo phía dưới)

---

## Cách Sửa Tham Số

1. **Mở file `chatbot_api.py`**:
   - Tìm hàm `call_llama` trong mã nguồn.

2. **Sửa payload**:
   - Điều chỉnh các giá trị trong dictionary `payload` theo nhu cầu của bạn.
   - Ví dụ: Nếu bạn muốn phản hồi ngắn hơn và ít ngẫu nhiên hơn, bạn có thể sửa như sau:
     ```python
     payload = {
         "prompt": prompt,
         "n_predict": 200,      # Giảm số token tối đa
         "temperature": 0.3,    # Giảm ngẫu nhiên
         "top_k": 20,           # Giảm sự đa dạng
         "top_p": 0.8,          # Tập trung hơn
         "repeat_last_n": 64,   # Giảm phạm vi kiểm tra lặp lại
         "repeat_penalty": 1.2, # Tăng hình phạt lặp lại
         "stream": False,
     }
     ```

3. **Lưu và chạy lại server**:
   - Sau khi sửa, lưu file và chạy lại server bằng lệnh:
     ```bash
     python chatbot_api.py
     ```
   - chatbot_api.py sẽ khởi chạy server FastAPI trên cổng 4000.
   - llama.cpp của bạn được khởi chạy trên cổng 8080.
---

## Ví Dụ Minh Họa

### Trường hợp 1: Phản hồi ngắn gọn, ít ngẫu nhiên
Nếu bạn muốn chatbot trả lời ngắn gọn và tập trung, hãy thử cấu hình sau:
```json
{
    "prompt": "Hello, how are you?",
    "n_predict": 100,
    "temperature": 0.3,
    "top_k": 20,
    "top_p": 0.8,
    "repeat_last_n": 64,
    "repeat_penalty": 1.2,
    "stream": false
}
```
**Kết quả dự kiến**: Phản hồi sẽ ngắn, logic và ít lặp lại, ví dụ:  
*"Hi! I'm here to help. How can I assist you today? 😊"*

### Trường hợp 2: Phản hồi sáng tạo, dài hơn
Nếu bạn muốn chatbot sáng tạo hơn và trả lời dài hơn:
```json
{
    "prompt": "Tell me a story",
    "n_predict": 600,
    "temperature": 1.0,
    "top_k": 60,
    "top_p": 1.0,
    "repeat_last_n": 256,
    "repeat_penalty": 1.0,
    "stream": false
}
```
**Kết quả dự kiến**: Phản hồi sẽ dài, sáng tạo hơn, ví dụ:  
*"Once upon a time, in a magical forest far away, there lived a curious little fox named Fira. 🦊✨ Fira loved exploring..."*

---

## Lưu Ý Quan Trọng

- **Hiệu suất**: Các tham số như `n_predict` lớn hoặc `logits_all: true` có thể làm tăng mức sử dụng CPU/GPU và bộ nhớ. Hãy thử nghiệm trên thiết bị của bạn để tìm cấu hình tối ưu.
- **Tương thích**: Một số tham số (như `mul_mat_q`) phụ thuộc vào phiên bản **llama.cpp** và phần cứng. Nếu gặp lỗi, hãy kiểm tra tài liệu chính thức của **llama.cpp**.
- **Debug**: Nếu phản hồi không như mong muốn, hãy in `payload` trước khi gửi để kiểm tra:
  ```python
  print("Payload gửi đến llama.cpp:", payload)
  ```

---

## Tài Nguyên Tham Khảo

- [Tài liệu chính thức của llama.cpp](https://github.com/ggerganov/llama.cpp)
- [Hướng dẫn lượng tử hóa mô hình](https://github.com/ggerganov/llama.cpp#quantization)
- [Diễn đàn cộng đồng](https://github.com/ggerganov/llama.cpp/discussions)

Nếu bạn có thắc mắc hoặc cần hỗ trợ thêm, hãy mở một issue trên GitHub hoặc liên hệ với nhóm phát triển. Chúc bạn thành công! 🚀

--- 



