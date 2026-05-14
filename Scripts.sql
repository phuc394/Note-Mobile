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
    INDEX idx_invited_gmail (invited_gmail),
    INDEX idx_note_id (note_id)
);

