# 🚀 Quick Start Guide

Hướng dẫn nhanh để chạy Lil Sunshine Thrift Shop Full Stack Application.

## ⚡ Bắt đầu trong 5 phút

### 1. Cài đặt dependencies
```bash
npm run setup
```

### 2. Cấu hình database
```bash
# Tạo database MySQL
mysql -u root -p
CREATE DATABASE lilshunshine_thrift;

# Chỉnh sửa api/.env với thông tin database của bạn
# Ví dụ:
# DB_HOST=localhost
# DB_NAME=lilshunshine_thrift
# DB_USERNAME=root
# DB_PASSWORD=your_password
```

### 3. Chạy database migration
```bash
npm run migrate
```

### 4. Khởi động ứng dụng
```bash
npm start
```

## 🌐 Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000

## 👤 Đăng nhập

### Admin Account
- **Email**: admin@lilshunshine.com
- **Password**: password

## 🧪 Test kết nối

```bash
npm test
```

## 📋 Scripts hữu ích

```bash
# Setup toàn bộ project
npm run setup

# Khởi động cả frontend và backend
npm start

# Chỉ khởi động API
npm run start:api

# Chỉ khởi động frontend
npm run start:frontend

# Test kết nối
npm test

# Chạy migration database
npm run migrate
```

## 🔧 Troubleshooting

### API không chạy được
```bash
# Kiểm tra PHP
php --version

# Kiểm tra database connection
cd api
php -r "require 'config/database.php'; echo 'OK';"
```

### Frontend không chạy được
```bash
# Cài đặt dependencies
npm run install:frontend

# Kiểm tra Node.js
node --version
npm --version
```

### Database connection failed
```bash
# Kiểm tra MySQL
mysql --version

# Test connection
mysql -u root -p -e "SHOW DATABASES;"
```

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Tất cả dependencies đã được cài đặt
2. Database đã được tạo và cấu hình đúng
3. Ports 3000 và 8000 không bị chiếm dụng
4. File .env đã được cấu hình đúng

---

**Happy coding! 🎉**
