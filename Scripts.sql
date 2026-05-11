-- Tạo cơ sở dữ liệu
CREATE DATABASE IF NOT EXISTS note_mobile_db;
USE note_mobile_db;

-- 1. Bảng Users: Lưu trữ thông tin người dùng đã đăng ký
-- Guests không có bản ghi trong bảng này.
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gmail VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Lưu mật khẩu đã mã hóa
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Notes: Lưu trữ thông tin ghi chú
-- Mỗi ghi chú gắn liền với một user_id (người sở hữu).
CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    user_id INT NOT NULL,
    -- Default là 0 (Private). Khi toggle sang 1 (Public) thì áp dụng logic mời qua Gmail.
    is_public BOOLEAN DEFAULT 0, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Bảng Note_Permissions: Quản lý việc chia sẻ ghi chú qua Gmail
-- Chỉ dùng khi is_public = 1.
CREATE TABLE note_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    note_id INT NOT NULL,
    invited_gmail VARCHAR(255) NOT NULL, -- Email của người được mời
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Đảm bảo một note không mời trùng 1 email 2 lần
    UNIQUE KEY unique_invite (note_id, invited_gmail),
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
);