# Chatbox LLM
## Mô Tả
Dịch vụ chatbox AI web cho phép người sử dụng có thể tự tổ chức local LLM để tổ chức dịch vụ
## Các Công Nghệ Sử Dụng:
- Frontend:  
    + Ngôn ngữ lập trình: JavaScript  
    + Vite: triển khai dịch vụ web một cách nhanh chóng và cho phép sửa đổi ngay cả khi host[hot fix]  
    + React: Thư viện mã nguồn JavaScript được phát triển bởi Meta( Facebook) được sử dụng để xây dựng giao diện UI/UX phía người sử dụng  
    + Node.js: là ứng dụng mã nguồn mở, cross-platform môi trường thực thi của JavaScript cho phép ngôn ngữ lập trình JavaScript chạy trên các môi trường bên ngoài web browser 
    + Dependencies: là các gói npm package được ghi nhận trong file packages.json 
- Backend:
    + Ngôn ngữ lập trình: Python
    + Dependencies: là các thư viện Python được ghi nhận trong file requirements.txt  
- Database:
    + Google Firebase
## Các Dịch Vụ Cung Cấp
- Authentication: dịch vụ đăng ký/ đăng nhập cho tài khoản người sử dụng, lưu trữ thông tin người sử dụng đảm bảo mọi cuộc trò chuyện đã được lưu trước đó
- Chatbox LLM: dịch vụ chatting với LLM Ollama

Dịch vụ Authentication, nhận các cuộc trò chuyện được cung cấp trực tiếp bởi Firebase( BaaS) tích hợp trong FE
Dịch vụ sinh văn bản và lưu các cuộc trò chuyện được cung cấp bởi BE  

Demo dịch vụ cung cấp:  

https://github.com/user-attachments/assets/7b72d9fd-7698-4187-a0e2-df9867ad5057

<u>**Lưu ý:**</u> các cài đặt dịch vụ chỉ được hoạt động ở cho phép tổ chức localhost và chưa có khả năng triển khai dịch vụ ra bên ngoài thiết bị host. Người sử dụng có nhu cầu tổ chức thiết bị qua mạng thì cần phải tunneling hoặc các công nghệ cho phép tổ chức dịch vụ tương tự  
## Hướng dẫn tổ chức dịch vụ
Trước khi tổ chức dịch vụ, phải đảm bảo thiết bị sử dụng đã cài đặt và cấu hình system enviroment variables Node.js nhằm sử dụng lệnh npm( node package manager) và cài đặt các gói npm package  

Clone dự án lại thông qua lệnh: ```git clone https://github.com/ReallyEzyGame/ai-streaming-web.git```  

Mở cmd ở đường dẫn thư mục gốc của dự án  

Tải xuống các Depedencies:  
- Đối với các thư viện Python:  
    ```cmd
    # Dẫn đường dẫn tới backend thông qua lệnh: 
    cd .\backend  

    # Tải các thư viện cần thiết:  
    pip install -r requirements.txt  
    # Nếu đường dẫn của Python chưa được thêm vào hệ thống thì sử dụng 
    python -m pip install -r requirements.txt
    ```  
- Đối với các gói npm:
    ```cmd
    Dẫn đường dẫn tới frontend thông qua lệnh:
    cd .\frontend  
    Tải các gói npm cần thiết:  
    npm install
    ```
- Dịch vụ Ollama: model được sử dụng trong là gemma3:1b( vì mục đích tiện và gọn nhẹ) người sử dụng có thể lựa chọn lại model trong file .env
        hãy đảm bảo bạn đã có tải Ollama và cấu hình path cho Ollama và tải model thông qua lệnh
    ```cmd
    # tải model cần sử dụng
    ollama pull <Tên Model>
    # ví dụ
    ollama pull gemma3:1b

    
    ```
Chuẩn bị các key từ firebase:
- Frontend: điền các firebase key( dạng public key được sử dụng phía Client Side) cho quá trình xác thực:
    + Tạo file .env bằng cách copy các trường trong file .env.example
    + Điền các firebase key thích hợp  
<u>**Lưu ý:**</u> mặc dù firebase key này là dạng public key nhưng người quản lý nên thắt chặt quyền chỉnh sửa( thêm xóa ghi) trong firestore vì người sử dụng khi có các key này nếu không được quản lý thì hoàn toàn có thể sử dụng nó tùy tiện

- Backend: điền firebasae admin key( dạng khóa private được sử dụng để xác thực admin, cần phải được bảo mật):
    + Tạo file .json chứa các trường dữ liệu của firebase admin trong phần Service Account
    + Đổi tên file nhận được lại thành 'firebase_admin_sdk.json'
    + Tạo thư mục 'firebase/' ở thư mục 'backend/' và cho file vừa được đổi tên vào  
<u>**Lưu ý:**</u> các key này là Private key có liên quan tới đăng nhập vào firebase, firestore người sử dụng khi nắm được các key này hoàn toàn có thể thu thập toàn bộ dữ liệu từ firebase của bạn. Cần phải bảo vệ nó hết sức cẩn trọng

Chạy dịch vụ:
- Frontend:
    Ở thư mục gốc của đồ án:
    ```cmd
    cd .\frontend
    npm run dev
    ```
    Chúng ta sẽ có UI/UX của web chạy ở cổng mặc định của vite là http://localhost:5173  

- Backend:
    Ở thư mục gốc của đồ án:  
    ```cmd
    cd .\backend  
    python main.py
    ```
    Chúng ta sẽ thu được dịch vụ Backend chạy ở http://localhost:8000  

- Firebase: đảm bảo cài đặt firebase và tích hợp lên dịch vụ google cloud  
