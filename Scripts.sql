CREATE DATABASE IF NOT EXISTS note_mobile_db;
USE note_mobile_db;

-- 1. Bảng Users: Lưu trữ thông tin người dùng đã đăng ký
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    gmail VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username)
);



-- 2. Bảng Notes: Lưu trữ thông tin ghi chú
CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    user_id INT NOT NULL,
    is_public BOOLEAN DEFAULT 0 COMMENT '0: private, 1: public',
    is_pinned BOOLEAN DEFAULT 0 COMMENT '0: không ghim, 1: đã ghim',
    is_deleted BOOLEAN DEFAULT 0 COMMENT '0: bình thường, 1: trong thùng rác',
    deleted_at TIMESTAMP NULL COMMENT 'Thời gian xóa vào thùng rác',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_deleted (is_deleted),
    INDEX idx_is_pinned (is_pinned)
);

-- 3. Bảng Shared_Notes: Quản lý ghi chú được chia sẻ với người dùng khác
CREATE TABLE shared_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    note_id INT NOT NULL,
    invited_gmail VARCHAR(255) NOT NULL COMMENT 'Email của người được chia sẻ',
    can_edit BOOLEAN DEFAULT 0 COMMENT '1: có thể chỉnh sửa, 0: chỉ xem',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_invite (note_id, invited_gmail),
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    INDEX idx_invited_gmail (invited_gmail),users
    INDEX idx_note_id (note_id)
);
INSERT INTO users (username, gmail, password_hash, phone, avatar_url) VALUES
('hoangtran', 'hoangtran@gmail.com', '123456', '0901234567', 'https://example.com/avatar/hoang.png'),
('minhnguyen', 'minhnguyen@gmail.com', '123456', '0912345678', 'https://example.com/avatar/minh.png'),
('lanpham', 'lanpham@gmail.com', '123456', '0923456789', 'https://example.com/avatar/lan.png'),
('anle', 'anle@gmail.com', '123456', '0934567890', 'https://example.com/avatar/an.png'),
('thuyvo', 'thuyvo@gmail.com', '123456', '0945678901', 'https://example.com/avatar/thuy.png');

INSERT INTO notes 
(title, content, user_id, is_public, is_pinned, is_deleted, deleted_at) 
VALUES
('Ghi chú công việc hôm nay', 
 'Hoàn thành báo cáo tuần, họp nhóm lúc 14h, gửi email cho khách hàng.', 
 1, 0, 1, 0, NULL),

('Công thức nấu ăn', 
 'Phở bò: xương ống, thịt bò, hành, gừng, quế, hồi, thảo quả. Ninh xương trong 3-4 tiếng.', 
 1, 1, 0, 0, NULL),

('Kế hoạch học React Native', 
 'Ôn lại component, props, state, useEffect, navigation và kết nối API bằng axios.', 
 1, 0, 1, 0, NULL),

('Danh sách việc cần làm', 
 'Mua sách, dọn phòng, hoàn thành bài tập backend, kiểm tra lại database.', 
 1, 0, 0, 0, NULL),

('Ý tưởng app ghi chú', 
 'Thêm chức năng tìm kiếm, ghim ghi chú, chia sẻ ghi chú, thùng rác và đổi avatar.', 
 1, 1, 1, 0, NULL),

('Ghi chú đã xóa thử nghiệm', 
 'Đây là ghi chú đã được chuyển vào thùng rác để test chức năng deleted notes.', 
 1, 0, 0, 1, CURRENT_TIMESTAMP),

('Lịch học tuần này', 
 'Thứ 2 học JavaScript, thứ 3 học SQL, thứ 4 làm React Native, thứ 5 ôn backend.', 
 2, 0, 1, 0, NULL),

('Tài liệu SQL cơ bản', 
 'SELECT, INSERT, UPDATE, DELETE, JOIN, GROUP BY, ORDER BY là các câu lệnh quan trọng.', 
 2, 1, 0, 0, NULL),

('Kế hoạch đi chơi', 
 'Cuối tuần đi cà phê, xem phim và ăn tối cùng bạn bè.', 
 2, 0, 0, 0, NULL),

('Ghi chú dự án nhóm', 
 'Phân chia công việc: frontend, backend, database, test API và viết báo cáo.', 
 3, 1, 1, 0, NULL),

('Ý tưởng thiết kế UI', 
 'Dùng màu nhẹ, font dễ đọc, card bo góc, icon rõ ràng và có dark mode.', 
 3, 0, 0, 0, NULL),

('Bài tập về nhà', 
 'Làm bài tập Redux Toolkit, tìm hiểu asyncThunk và extraReducers.', 
 3, 0, 1, 0, NULL),

('Ghi chú cá nhân', 
 'Những mục tiêu nhỏ trong tháng: học đều hơn, ngủ sớm hơn, quản lý thời gian tốt hơn.', 
 4, 0, 0, 0, NULL),

('Checklist backend', 
 'Tạo route, controller, service, kết nối database, test bằng Postman.', 
 4, 1, 1, 0, NULL),

('Nội dung cần tìm kiếm', 
 'Ghi chú này dùng để test chức năng search theo title và content trong app Note Mobile.', 
 5, 1, 0, 0, NULL),

('Todo hôm nay', 
 'Code chức năng search, sửa lỗi API, push code lên GitHub bằng pull request.', 
 5, 0, 1, 0, NULL);


 
 INSERT INTO shared_notes 
(note_id, invited_gmail, can_edit) 
VALUES
(1, 'minhnguyen@gmail.com', 1),
(1, 'lanpham@gmail.com', 0),
(2, 'anle@gmail.com', 0),
(3, 'thuyvo@gmail.com', 1),
(5, 'minhnguyen@gmail.com', 1),
(8, 'hoangtran@gmail.com', 0),
(10, 'thuyvo@gmail.com', 1),
(14, 'lanpham@gmail.com', 0),
(15, 'anle@gmail.com', 1);

UPDATE users
SET password_hash = '$2a$10$KLjc5KOiQyXU3WF0aVsN6upsQucXWLemT/3EKsSc46CSxo5NsP.QK'
