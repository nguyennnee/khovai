# Lil Sunshine Thrift Shop - Full Stack Application

Ứng dụng thương mại điện tử cho cửa hàng thời trang vintage và thrift, được xây dựng với Next.js frontend và PHP API backend.

## 🎯 Tính năng chính

### Frontend (Next.js)
- 🛍️ **Cửa hàng trực tuyến** với giao diện hiện đại
- 🔍 **Tìm kiếm và lọc sản phẩm** theo danh mục, thương hiệu, tình trạng
- 🛒 **Giỏ hàng thông minh** với logic hold time cho thrift shop
- 👤 **Hệ thống người dùng** với đăng ký/đăng nhập
- 📱 **Responsive design** tối ưu cho mọi thiết bị
- 📝 **Blog và tin tức** về thời trang vintage
- 🔔 **Thông báo real-time**

### Backend (PHP API)
- 🔐 **Authentication** với JWT
- 📦 **Quản lý sản phẩm** với upload hình ảnh
- 🛒 **Cart system** với logic đặc biệt cho thrift shop
- 📋 **Quản lý đơn hàng** và tracking
- 👥 **User management** với phân quyền admin
- 📰 **Blog system** với SEO-friendly URLs
- 🔔 **Notifications** và email system
- ⚙️ **Settings management**

### Đặc điểm Thrift Shop
- ⏰ **Cart hold time**: Sản phẩm được giữ trong giỏ 30 phút
- 🔄 **Extend hold**: Có thể gia hạn thêm 15 phút
- 🚚 **Free shipping**: Miễn phí ship từ 500k VND
- 📊 **Product status**: available/reserved/sold
- 🇻🇳 **Vietnamese support**: Hỗ trợ tiếng Việt đầy đủ

## 🚀 Cài đặt nhanh

### Yêu cầu hệ thống
- **Node.js** >= 16.0.0
- **npm** >= 8.0.0
- **PHP** >= 7.4
- **MySQL** >= 5.7

### 1. Clone repository
```bash
git clone <repository-url>
cd lil-shunshine-thrift-frontend
```

### 2. Setup tự động
```bash
npm run setup
```

### 3. Cấu hình database
```bash
# Tạo database MySQL
mysql -u root -p
CREATE DATABASE lilshunshine_thrift;

# Chỉnh sửa file api/.env với thông tin database
# Chạy migration
npm run migrate
```

### 4. Khởi động ứng dụng
```bash
npm start
```

## 📁 Cấu trúc project

```
lil-shunshine-thrift-frontend/
├── lil-shunshine-thrift-frontend/     # Next.js Frontend
│   ├── src/
│   │   ├── app/                      # App Router pages
│   │   ├── components/               # React components
│   │   ├── lib/                      # Utilities và API calls
│   │   ├── types/                    # TypeScript types
│   │   └── contexts/                 # React contexts
│   ├── public/                       # Static files
│   └── package.json
├── api/                              # PHP API Backend
│   ├── routes/                       # API endpoints
│   ├── config/                       # Configuration
│   ├── utils/                        # Utilities
│   ├── database/                     # Database schema
│   └── uploads/                      # File uploads
├── start_fullstack.js               # Full stack startup script
├── setup_fullstack.js               # Setup script
└── package.json                     # Root package.json
```

## 🔧 Scripts có sẵn

```bash
# Setup toàn bộ project
npm run setup

# Khởi động cả frontend và backend
npm start

# Chỉ khởi động API
npm run start:api

# Chỉ khởi động frontend
npm run start:frontend

# Chạy database migration
npm run migrate

# Cài đặt dependencies cho frontend
npm run install:frontend

# Build frontend cho production
npm run build:frontend
```

## 🌐 URLs

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000
- **API Documentation**: Xem file `api/README.md`

## 👤 Tài khoản mặc định

### Admin Account
- **Email**: admin@lilshunshine.com
- **Password**: password

## 📚 API Documentation

### Authentication
```bash
# Login
POST /auth/login
Content-Type: application/x-www-form-urlencoded
username=user@example.com&password=password

# Register
POST /auth/register
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password",
  "full_name": "User Name"
}
```

### Products
```bash
# Get products
GET /products/?category=áo&brand=nike&min_price=100000

# Get featured products
GET /products/featured

# Get product details
GET /products/1
```

### Cart (Thrift Shop Logic)
```bash
# Get cart
GET /cart/

# Add to cart
POST /cart/add
{
  "product_id": 1,
  "quantity": 1
}

# Extend hold time
POST /cart/extend-hold
```

### Orders
```bash
# Create order
POST /orders/
{
  "shipping_address": "123 Main St",
  "shipping_phone": "0123456789",
  "shipping_name": "John Doe",
  "payment_method": "cod",
  "items": [{"id": 1}]
}
```

## 🛠️ Development

### Frontend Development
```bash
cd lil-shunshine-thrift-frontend
npm run dev
```

### API Development
```bash
cd api
php start_api.php
```

### Database Management
```bash
# Reset database
cd api
php database/migrate.php
```

## 🚀 Production Deployment

### Frontend (Vercel/Netlify)
```bash
cd lil-shunshine-thrift-frontend
npm run build
# Deploy dist folder
```

### API (Shared Hosting/VPS)
```bash
# Upload api folder to server
# Configure .env file
# Set up database
# Configure web server (Apache/Nginx)
```

## 🔒 Security

- JWT authentication
- Password hashing với bcrypt
- CORS configuration
- Input validation
- SQL injection protection
- XSS protection

## 📱 Mobile Support

- Responsive design
- Touch-friendly interface
- Mobile-optimized cart
- Progressive Web App ready

## 🌍 Internationalization

- Vietnamese language support
- Vietnamese phone number validation
- Vietnamese slug generation
- Currency formatting (VND)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: support@lilshunshine.com
- **Website**: https://lilshunshine.com
- **Issues**: [GitHub Issues](https://github.com/lilshunshine/thrift-shop/issues)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- PHP community for robust backend solutions
- Tailwind CSS for beautiful styling
- All contributors and supporters

---

Made with ❤️ by Lil Sunshine Team
