<?php
// Application Configuration

// Environment
define('APP_ENV', $_ENV['APP_ENV'] ?? 'development');
define('APP_DEBUG', $_ENV['APP_DEBUG'] ?? true);

// JWT Configuration
define('JWT_SECRET', $_ENV['JWT_SECRET'] ?? 'your-secret-key-change-this-in-production');
define('JWT_ALGORITHM', 'HS256');
define('JWT_EXPIRY', 3600 * 24 * 7); // 7 days

// File Upload Configuration
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB
define('ALLOWED_IMAGE_TYPES', ['jpg', 'jpeg', 'png', 'gif', 'webp']);

// Cart Configuration (Thrift Shop specific)
define('CART_HOLD_MINUTES', 30); // Items held in cart for 30 minutes
define('CART_EXTEND_MINUTES', 15); // Can extend hold by 15 minutes
define('FREE_SHIPPING_THRESHOLD', 500000); // 500k VND
define('SHIPPING_FEE', 30000); // 30k VND

// Pagination
define('DEFAULT_PAGE_SIZE', 20);
define('MAX_PAGE_SIZE', 100);

// Email Configuration
define('SMTP_HOST', $_ENV['SMTP_HOST'] ?? 'smtp.gmail.com');
define('SMTP_PORT', $_ENV['SMTP_PORT'] ?? 587);
define('SMTP_USERNAME', $_ENV['SMTP_USERNAME'] ?? '');
define('SMTP_PASSWORD', $_ENV['SMTP_PASSWORD'] ?? '');
define('SMTP_FROM_EMAIL', $_ENV['SMTP_FROM_EMAIL'] ?? 'noreply@lilshunshine.com');
define('SMTP_FROM_NAME', $_ENV['SMTP_FROM_NAME'] ?? 'Lil Sunshine Thrift');

// Create upload directories if they don't exist
$uploadDirs = [
    UPLOAD_DIR,
    UPLOAD_DIR . 'products/',
    UPLOAD_DIR . 'blog/',
    UPLOAD_DIR . 'temp/'
];

foreach ($uploadDirs as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

// Error reporting
if (APP_DEBUG) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// Timezone
date_default_timezone_set('Asia/Ho_Chi_Minh');

// Set memory limit for file uploads
ini_set('memory_limit', '256M');
ini_set('upload_max_filesize', '5M');
ini_set('post_max_size', '10M');
?>
