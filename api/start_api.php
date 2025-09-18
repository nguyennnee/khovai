<?php
/**
 * Lil Sunshine Thrift API Server
 * Development server startup script
 */

echo "🚀 Starting Lil Sunshine Thrift API Server...\n\n";

// Check PHP version
if (version_compare(PHP_VERSION, '7.4.0', '<')) {
    echo "❌ Error: PHP 7.4 or higher is required. Current version: " . PHP_VERSION . "\n";
    exit(1);
}

// Check if required extensions are loaded
$requiredExtensions = ['pdo', 'pdo_mysql', 'json', 'mbstring'];
$missingExtensions = [];

foreach ($requiredExtensions as $ext) {
    if (!extension_loaded($ext)) {
        $missingExtensions[] = $ext;
    }
}

if (!empty($missingExtensions)) {
    echo "❌ Error: Missing required PHP extensions: " . implode(', ', $missingExtensions) . "\n";
    echo "Please install these extensions and try again.\n";
    exit(1);
}

// Check if .env file exists
if (!file_exists(__DIR__ . '/.env')) {
    echo "⚠️  Warning: .env file not found. Using default configuration.\n";
    echo "   Copy env.example to .env and configure your settings.\n\n";
}

// Check if database connection works
try {
    require_once __DIR__ . '/config/database.php';
    echo "✅ Database connection: OK\n";
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
    echo "   Please check your database configuration in .env file.\n";
    exit(1);
}

// Check if upload directories exist
$uploadDirs = [
    __DIR__ . '/uploads',
    __DIR__ . '/uploads/products',
    __DIR__ . '/uploads/blog',
    __DIR__ . '/uploads/temp'
];

foreach ($uploadDirs as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
        echo "📁 Created directory: " . basename($dir) . "\n";
    }
}

echo "✅ Upload directories: OK\n";

// Display server information
echo "\n📋 Server Information:\n";
echo "   PHP Version: " . PHP_VERSION . "\n";
echo "   Server: PHP Built-in Server\n";
echo "   Document Root: " . __DIR__ . "\n";
echo "   API Base URL: http://localhost:8000\n\n";

echo "🔗 Available Endpoints:\n";
echo "   Authentication: POST /auth/login, POST /auth/register\n";
echo "   Products: GET /products/, POST /products/\n";
echo "   Cart: GET /cart/, POST /cart/add\n";
echo "   Orders: GET /orders/, POST /orders/\n";
echo "   Blog: GET /blog/, POST /blog/\n";
echo "   Users: GET /users/ (Admin only)\n";
echo "   Settings: GET /settings/\n\n";

echo "👤 Default Admin Account:\n";
echo "   Email: admin@lilshunshine.com\n";
echo "   Password: password\n\n";

echo "📚 Documentation: README.md\n";
echo "🔧 Configuration: .env file\n\n";

echo "🌐 Starting server on http://localhost:8000\n";
echo "   Press Ctrl+C to stop the server\n\n";

// Start the built-in server
$command = sprintf(
    'php -S %s:%d -t %s',
    'localhost',
    8000,
    __DIR__
);

passthru($command);
?>
