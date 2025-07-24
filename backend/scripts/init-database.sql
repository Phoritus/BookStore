-- Create Book Café Database Schema
-- Execute this script in MySQL to set up all required tables

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS book_cafe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE book_cafe;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    national_id VARCHAR(13) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    address TEXT,
    profile_image VARCHAR(255),
    membership_type ENUM('standard', 'premium', 'vip') DEFAULT 'standard',
    points INT DEFAULT 0,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Room types table
CREATE TABLE IF NOT EXISTS room_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    capacity INT NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL,
    amenities JSON,
    image_url VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(10) UNIQUE NOT NULL,
    room_type_id INT NOT NULL,
    floor INT NOT NULL,
    status ENUM('available', 'occupied', 'maintenance', 'reserved') DEFAULT 'available',
    features JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_type_id) REFERENCES room_types(id)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours DECIMAL(3,1) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    booking_status ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show') DEFAULT 'pending',
    special_requests TEXT,
    qr_code VARCHAR(255),
    check_in_time TIMESTAMP NULL,
    check_out_time TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    INDEX idx_booking_date (booking_date),
    INDEX idx_user_bookings (user_id, booking_date)
);

-- Promotions table
CREATE TABLE IF NOT EXISTS promotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    discount_type ENUM('percentage', 'fixed_amount') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    min_booking_amount DECIMAL(10,2) DEFAULT 0,
    max_discount_amount DECIMAL(10,2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    membership_required ENUM('standard', 'premium', 'vip'),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User promotions (usage tracking)
CREATE TABLE IF NOT EXISTS user_promotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    promotion_id INT NOT NULL,
    booking_id INT,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (promotion_id) REFERENCES promotions(id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    UNIQUE KEY unique_user_promotion_booking (user_id, promotion_id, booking_id)
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    isbn VARCHAR(20) UNIQUE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    publisher VARCHAR(255),
    publication_year YEAR,
    genre VARCHAR(100),
    language VARCHAR(50) DEFAULT 'Thai',
    pages INT,
    description TEXT,
    cover_image VARCHAR(255),
    location VARCHAR(100),
    total_copies INT DEFAULT 1,
    available_copies INT DEFAULT 1,
    status ENUM('available', 'unavailable', 'removed') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_title (title),
    INDEX idx_author (author),
    INDEX idx_genre (genre)
);

-- Book lending cards table
CREATE TABLE IF NOT EXISTS book_lending_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    borrow_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE NULL,
    status ENUM('borrowed', 'returned', 'overdue', 'lost') DEFAULT 'borrowed',
    fine_amount DECIMAL(8,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id),
    INDEX idx_user_borrow (user_id, borrow_date),
    INDEX idx_book_status (book_id, status)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('booking_confirmation', 'booking_reminder', 'payment_due', 'promotion', 'system') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    related_booking_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (related_booking_id) REFERENCES bookings(id),
    INDEX idx_user_notifications (user_id, is_read, created_at)
);

-- System settings table
CREATE TABLE IF NOT EXISTS system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Payment transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('cash', 'credit_card', 'bank_transfer', 'digital_wallet') NOT NULL,
    transaction_id VARCHAR(255) UNIQUE,
    payment_status ENUM('pending', 'completed', 'failed', 'cancelled', 'refunded') DEFAULT 'pending',
    payment_gateway VARCHAR(100),
    gateway_response TEXT,
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_transaction_status (payment_status, created_at)
);

-- Insert sample room types
INSERT INTO room_types (name, description, capacity, base_price, hourly_rate, amenities) VALUES
('Study Room Small', 'ห้องอ่านหนังสือส่วนตัวขนาดเล็ก เหมาะสำหรับการอ่านหนังสือคนเดียว', 1, 50.00, 25.00, '["โต๊ะอ่านหนังสือ", "เก้าอี้ergonomic", "โคมไฟอ่านหนังสือ", "ปลั๊กไฟ", "WiFi"]'),
('Study Room Medium', 'ห้องอ่านหนังสือขนาดกลาง เหมาะสำหรับกลุ่มเล็ก 2-4 คน', 4, 80.00, 40.00, '["โต๊ะทำงานใหญ่", "เก้าอี้ 4 ตัว", "โคมไฟอ่านหนังสือ", "whiteboard", "ปลั๊กไฟ", "WiFi", "เครื่องปรับอากาศ"]'),
('Meeting Room', 'ห้องประชุมสำหรับการทำงานกลุ่มหรือการนำเสนอ', 8, 150.00, 75.00, '["โต๊ะประชุม", "เก้าอี้ 8 ตัว", "projector", "whiteboard", "ปลั๊กไฟ", "WiFi", "เครื่องปรับอากาศ", "ลำโพง"]'),
('Private Reading Pod', 'พื้นที่อ่านหนังสือส่วนตัวแบบพิเศษ บรรยากาศเงียบสงบ', 1, 40.00, 20.00, '["เก้าอี้นุ่ม", "โต๊ะข้าง", "โคมไฟอุ่น", "หูฟัง noise-canceling", "ปลั๊กไฟ", "WiFi"]');

-- Insert sample rooms
INSERT INTO rooms (room_number, room_type_id, floor) VALUES
('A101', 1, 1), ('A102', 1, 1), ('A103', 1, 1),
('A201', 2, 2), ('A202', 2, 2), ('A203', 2, 2),
('B101', 3, 1), ('B102', 3, 1),
('C101', 4, 1), ('C102', 4, 1), ('C103', 4, 1), ('C104', 4, 1);

-- Insert sample books
INSERT INTO books (isbn, title, author, publisher, publication_year, genre, description) VALUES
('9786164830708', 'ปรัชญาของความสุข', 'อลิน เดอ โบต็อง', 'นานมีบุ๊คส์', 2020, 'Philosophy', 'หนังสือปรัชญาที่นำเสนอแนวคิดเกี่ยวกับการมองหาความสุขในชีวิต'),
('9786168048429', 'Atomic Habits', 'James Clear', 'วีเลิร์น', 2019, 'Self-Help', 'คู่มือสร้างนิสัยดีและเลิกนิสัยเสียอย่างมีประสิทธิภาพ'),
('9786164820142', 'คิดเป็น เป็นได้', 'วิทยา นันทิโยธิน', 'วีเลิร์น', 2021, 'Business', 'หนังสือเกี่ยวกับการพัฒนาการคิดเชิงธุรกิจและการลงทุน'),
('9786169428442', 'มินิมอลไลฟ์', 'ซาซากิ ฟุมิโอะ', 'อมรินทร์ บุ๊ค', 2018, 'Lifestyle', 'การใช้ชีวิตแบบมินิมอลสำหรับคนยุคใหม่');

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('cafe_name', 'Book Café', 'ชื่อร้านกาแฟ'),
('opening_hours', '{"monday": "08:00-22:00", "tuesday": "08:00-22:00", "wednesday": "08:00-22:00", "thursday": "08:00-22:00", "friday": "08:00-23:00", "saturday": "09:00-23:00", "sunday": "09:00-21:00"}', 'เวลาเปิด-ปิดร้าน'),
('booking_advance_days', '30', 'จำนวนวันที่สามารถจองล่วงหน้าได้'),
('cancellation_hours', '2', 'จำนวนชั่วโมงที่สามารถยกเลิกการจองได้'),
('default_booking_duration', '2', 'ระยะเวลาการจองมาตรฐาน (ชั่วโมง)');

-- Insert a test user (password is 'admin123' hashed with bcrypt)
INSERT INTO users (email, password, phone, national_id, first_name, last_name) VALUES
('admin@bookcafe.com', '$2a$10$rGHQqY8p7FQGHoY1hq5D6.XwSf8vP2NxVPqHRQ8GFGYnGQ1XYZ3Ym', '0812345678', '1234567890123', 'Admin', 'User');
