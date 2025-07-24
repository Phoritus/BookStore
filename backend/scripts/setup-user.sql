-- Setup database and user with proper permissions
CREATE DATABASE IF NOT EXISTS book_cafe CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user if not exists
CREATE USER IF NOT EXISTS 'book_cafe_user'@'localhost' IDENTIFIED BY 'secure_password_123';

-- Grant all privileges on book_cafe database
GRANT ALL PRIVILEGES ON book_cafe.* TO 'book_cafe_user'@'localhost';

-- Refresh privileges
FLUSH PRIVILEGES;

-- Show grants to verify
SHOW GRANTS FOR 'book_cafe_user'@'localhost';
