# Lil Sunshine Thrift API

API backend cho ứng dụng thời trang vintage và thrift shop được xây dựng bằng PHP.

## Tính năng chính

- **Authentication**: Đăng nhập, đăng ký với JWT
- **Products Management**: Quản lý sản phẩm, danh mục, upload hình ảnh
- **Cart System**: Giỏ hàng với logic hold time đặc biệt cho thrift shop
- **Orders Management**: Quản lý đơn hàng và trạng thái
- **User Management**: Quản lý người dùng và phân quyền
- **Blog System**: Hệ thống blog và content management
- **Notifications**: Thông báo và email notifications
- **Settings**: Cấu hình hệ thống

## Cài đặt

### Yêu cầu hệ thống

- PHP 7.4 hoặc cao hơn
- MySQL 5.7 hoặc cao hơn
- Web server (Apache/Nginx)

### Cài đặt

1. **Clone repository**
```bash
git clone <repository-url>
cd api
```

2. **Cài đặt dependencies**
```bash
# Không cần composer vì sử dụng PHP thuần
```

3. **Cấu hình database**
```bash
# Tạo database
mysql -u root -p
CREATE DATABASE lilshunshine_thrift;
```

4. **Cấu hình environment**
```bash
cp env.example .env
# Chỉnh sửa file .env với thông tin database của bạn
```

5. **Chạy migration**
```bash
php database/migrate.php
```

6. **Cấu hình web server**

**Apache (.htaccess)**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
```

**Nginx**
```nginx
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```

## API Endpoints

### Authentication
- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `GET /auth/me` - Lấy thông tin user hiện tại
- `PUT /auth/me` - Cập nhật profile

### Products
- `GET /products/` - Lấy danh sách sản phẩm
- `GET /products/featured` - Lấy sản phẩm nổi bật
- `GET /products/{id}` - Lấy chi tiết sản phẩm
- `POST /products/` - Tạo sản phẩm mới (Admin)
- `PUT /products/{id}` - Cập nhật sản phẩm (Admin)
- `DELETE /products/{id}` - Xóa sản phẩm (Admin)
- `POST /products/{id}/upload` - Upload hình ảnh (Admin)
- `DELETE /products/{id}/images/{index}` - Xóa hình ảnh (Admin)
- `GET /products/categories` - Lấy danh mục
- `POST /products/categories` - Tạo danh mục mới (Admin)

### Cart (Thrift Shop Logic)
- `GET /cart/` - Lấy giỏ hàng
- `POST /cart/add` - Thêm vào giỏ hàng
- `PUT /cart/update/{itemId}` - Cập nhật số lượng
- `DELETE /cart/remove/{itemId}` - Xóa khỏi giỏ hàng
- `DELETE /cart/clear` - Xóa toàn bộ giỏ hàng
- `POST /cart/extend-hold` - Gia hạn thời gian giữ
- `GET /cart/hold-status` - Kiểm tra trạng thái giữ

### Orders
- `GET /orders/` - Lấy danh sách đơn hàng
- `GET /orders/{id}` - Lấy chi tiết đơn hàng
- `POST /orders/` - Tạo đơn hàng mới
- `PUT /orders/{id}` - Cập nhật đơn hàng (Admin)
- `GET /orders/stats/summary` - Thống kê đơn hàng (Admin)

### Users Management (Admin)
- `GET /users/` - Lấy danh sách users
- `GET /users/{id}` - Lấy chi tiết user
- `PUT /users/{id}` - Cập nhật user
- `PUT /users/{id}/role` - Thay đổi role
- `PUT /users/{id}/activate` - Kích hoạt user
- `PUT /users/{id}/deactivate` - Vô hiệu hóa user
- `GET /users/stats/summary` - Thống kê users

### Blog
- `GET /blog/` - Lấy danh sách bài viết
- `GET /blog/featured` - Lấy bài viết nổi bật
- `GET /blog/{id}` - Lấy chi tiết bài viết
- `GET /blog/slug/{slug}` - Lấy bài viết theo slug
- `POST /blog/` - Tạo bài viết mới (Admin)
- `PUT /blog/{id}` - Cập nhật bài viết (Admin)
- `DELETE /blog/{id}` - Xóa bài viết (Admin)
- `POST /blog/{id}/featured-image` - Upload hình đại diện (Admin)
- `GET /blog/categories/list` - Lấy danh mục blog
- `GET /blog/stats/summary` - Thống kê blog (Admin)

### Notifications
- `GET /notifications/` - Lấy danh sách thông báo (Admin)
- `GET /notifications/user` - Lấy thông báo của user
- `POST /notifications/` - Tạo thông báo mới (Admin)
- `POST /notifications/send-email` - Gửi email thông báo (Admin)
- `GET /notifications/stats/summary` - Thống kê thông báo (Admin)
- `POST /notifications/subscribe` - Đăng ký nhận thông báo

### Settings
- `GET /settings/` - Lấy cài đặt
- `PUT /settings/` - Cập nhật cài đặt (Admin)
- `POST /settings/reset` - Reset về mặc định (Admin)
- `GET /settings/export` - Export cài đặt (Admin)
- `POST /settings/import` - Import cài đặt (Admin)

## Đặc điểm Thrift Shop

### Cart Hold Logic
- Sản phẩm được giữ trong giỏ hàng 30 phút
- Có thể gia hạn thêm 15 phút
- Tự động xóa khi hết hạn
- Phí ship miễn phí từ 500k VND

### Product Status
- `available`: Có sẵn
- `reserved`: Đã được đặt (trong giỏ hàng hoặc đơn hàng)
- `sold`: Đã bán

## Authentication

API sử dụng JWT (JSON Web Token) cho authentication:

```bash
# Login
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=password"

# Sử dụng token
curl -X GET http://localhost/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## File Upload

Hỗ trợ upload hình ảnh cho sản phẩm và blog:

```bash
# Upload product images
curl -X POST http://localhost/api/products/1/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "images[]=@image1.jpg" \
  -F "images[]=@image2.jpg"
```

## Error Handling

API trả về lỗi theo format chuẩn:

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": "Field error message"
  }
}
```

## Cấu hình

Các cấu hình quan trọng trong file `.env`:

- `JWT_SECRET`: Secret key cho JWT (thay đổi trong production)
- `CART_HOLD_MINUTES`: Thời gian giữ giỏ hàng (phút)
- `FREE_SHIPPING_THRESHOLD`: Ngưỡng miễn phí ship (VND)
- `MAX_FILE_SIZE`: Kích thước file upload tối đa (bytes)

## Development

### Chạy local development server

```bash
# Sử dụng PHP built-in server
php -S localhost:8000 -t .

# Hoặc cấu hình với Apache/Nginx
```

### Testing

```bash
# Test database connection
php -r "require 'config/database.php'; echo 'Database connected successfully';"

# Test migration
php database/migrate.php
```

## Production Deployment

1. **Cấu hình production**
   - Đặt `APP_ENV=production`
   - Đặt `APP_DEBUG=false`
   - Thay đổi `JWT_SECRET` thành giá trị bảo mật

2. **Cấu hình web server**
   - Cấu hình SSL/HTTPS
   - Cấu hình CORS nếu cần
   - Cấu hình rate limiting

3. **Database**
   - Backup database thường xuyên
   - Cấu hình connection pooling

4. **File uploads**
   - Cấu hình CDN cho static files
   - Backup uploads directory

## License

MIT License
