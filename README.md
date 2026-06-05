# Note-Mobile

## 1. Giới thiệu project

Note-Mobile là ứng dụng ghi chú trên di động, hỗ trợ người dùng tạo, chỉnh sửa, ghim, xoá mềm, khôi phục và chia sẻ ghi chú cho người khác qua email.

Ứng dụng có các chức năng chính:

- Đăng ký, đăng nhập, đăng xuất tài khoản.
- Quản lý ghi chú cá nhân.
- Ghim ghi chú quan trọng.
- Chuyển ghi chú vào thùng rác và khôi phục khi cần.
- Chia sẻ ghi chú công khai cho người dùng khác bằng email.
- Phân quyền người được mời: chỉ xem hoặc được chỉnh sửa.
- Cập nhật nội dung ghi chú theo thời gian thực.
- Tự động lưu nội dung sau khi người dùng ngừng nhập.
- Cập nhật thông tin cá nhân, avatar và ngôn ngữ hiển thị.
- Hỗ trợ giao diện tiếng Việt và tiếng Anh.

## 2. Công nghệ sử dụng

Frontend:

- React Native
- Expo
- React Navigation
- Redux Toolkit
- Axios
- React Native Paper
- Expo Image Picker
- Expo Localization
- i18next và react-i18next
- Socket.IO Client

Backend:

- Node.js
- Express.js
- MySQL
- JWT Authentication
- bcryptjs
- Socket.IO
- EmailJS
- dotenv

Database:

- MySQL
- File khởi tạo database: `Scripts.sql`

## 3. Cài đặt frontend và backend

### 3.1. Tạo database

Mở MySQL và chạy file:

```text
Scripts.sql
```

File này sẽ tạo database mặc định là `note_mobile_db` và các bảng cần thiết.

Nếu database đã tồn tại nhưng thiếu cột mới, hãy cập nhật lại schema bằng các lệnh `ALTER TABLE` phù hợp trong MySQL.

### 3.2. Cài đặt và chạy backend

Di chuyển vào thư mục backend:

```bash
cd backend
```

Cài đặt dependencies:

```bash
npm install
```

Tạo file môi trường từ file mẫu:

```bash
copy .env.example .env
```

Kiểm tra và cập nhật thông tin trong `backend/.env`, ví dụ:

```text
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=note_mobile_db
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=15m
FRONTEND_URL=http://localhost:8081
```

Nếu dùng chức năng gửi email mời ghi chú bằng EmailJS, cần cấu hình thêm:

```text
EMAILJS_SERVICE_ID=service_xxx
EMAILJS_TEMPLATE_ID=template_xxx
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key
```

Template EmailJS cần có các biến:

```text
email
inviter_name
note_title
invite_url
permission
```

Trong EmailJS Dashboard, vào `Account > Security` và bật API requests cho non-browser applications nếu backend báo lỗi liên quan đến API call từ Node.js.

Chạy backend:

```bash
npm run dev
```

Backend mặc định chạy tại:

```text
http://localhost:3000
```

### 3.3. Cài đặt và chạy frontend

Mở terminal khác, di chuyển vào thư mục frontend:

```bash
cd frontend
```

Cài đặt dependencies:

```bash
npm install
```

Chạy Expo:

```bash
npm start
```

Nếu chạy trên web:

```bash
npm run web
```

Nếu chạy trên thiết bị thật bằng Expo Go, cần đổi API URL từ `localhost` sang IP LAN của máy tính trong các file cấu hình frontend, vì điện thoại không truy cập được `localhost` của máy tính.
