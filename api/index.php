<?php
// API Entry Point
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load environment variables
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/utils/response.php';
require_once __DIR__ . '/utils/auth.php';
require_once __DIR__ . '/utils/validation.php';

// Get request method and URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = str_replace('/api', '', $uri);

// Remove trailing slash
$uri = rtrim($uri, '/');

// Route the request
try {
    switch ($uri) {
        case '/auth/login':
            if ($method === 'POST') {
                require_once __DIR__ . '/routes/auth.php';
                handleLogin();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case '/auth/register':
            if ($method === 'POST') {
                require_once __DIR__ . '/routes/auth.php';
                handleRegister();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case '/auth/me':
            if ($method === 'GET') {
                require_once __DIR__ . '/routes/auth.php';
                handleGetMe();
            } elseif ($method === 'PUT') {
                require_once __DIR__ . '/routes/auth.php';
                handleUpdateProfile();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case (preg_match('/^\/products\/?$/', $uri) ? true : false):
            if ($method === 'GET') {
                require_once __DIR__ . '/routes/products.php';
                handleGetProducts();
            } elseif ($method === 'POST') {
                require_once __DIR__ . '/routes/products.php';
                handleCreateProduct();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case (preg_match('/^\/products\/featured\/?$/', $uri) ? true : false):
            if ($method === 'GET') {
                require_once __DIR__ . '/routes/products.php';
                handleGetFeaturedProducts();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case (preg_match('/^\/products\/categories\/?$/', $uri) ? true : false):
            if ($method === 'GET') {
                require_once __DIR__ . '/routes/products.php';
                handleGetCategories();
            } elseif ($method === 'POST') {
                require_once __DIR__ . '/routes/products.php';
                handleCreateCategory();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case (preg_match('/^\/products\/(\d+)\/?$/', $uri, $matches) ? true : false):
            $productId = $matches[1];
            if ($method === 'GET') {
                require_once __DIR__ . '/routes/products.php';
                handleGetProduct($productId);
            } elseif ($method === 'PUT') {
                require_once __DIR__ . '/routes/products.php';
                handleUpdateProduct($productId);
            } elseif ($method === 'DELETE') {
                require_once __DIR__ . '/routes/products.php';
                handleDeleteProduct($productId);
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case (preg_match('/^\/products\/(\d+)\/upload\/?$/', $uri, $matches) ? true : false):
            if ($method === 'POST') {
                $productId = $matches[1];
                require_once __DIR__ . '/routes/products.php';
                handleUploadProductImages($productId);
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case (preg_match('/^\/products\/(\d+)\/images\/(\d+)\/?$/', $uri, $matches) ? true : false):
            if ($method === 'DELETE') {
                $productId = $matches[1];
                $imageIndex = $matches[2];
                require_once __DIR__ . '/routes/products.php';
                handleDeleteProductImage($productId, $imageIndex);
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case '/cart/':
            if ($method === 'GET') {
                require_once __DIR__ . '/routes/cart.php';
                handleGetCart();
            } elseif ($method === 'DELETE') {
                require_once __DIR__ . '/routes/cart.php';
                handleClearCart();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case '/cart/add':
            if ($method === 'POST') {
                require_once __DIR__ . '/routes/cart.php';
                handleAddToCart();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case (preg_match('/^\/cart\/update\/(\d+)\/?$/', $uri, $matches) ? true : false):
            if ($method === 'PUT') {
                $itemId = $matches[1];
                require_once __DIR__ . '/routes/cart.php';
                handleUpdateCartItem($itemId);
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case (preg_match('/^\/cart\/remove\/(\d+)\/?$/', $uri, $matches) ? true : false):
            if ($method === 'DELETE') {
                $itemId = $matches[1];
                require_once __DIR__ . '/routes/cart.php';
                handleRemoveFromCart($itemId);
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case '/cart/extend-hold':
            if ($method === 'POST') {
                require_once __DIR__ . '/routes/cart.php';
                handleExtendCartHold();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case '/cart/hold-status':
            if ($method === 'GET') {
                require_once __DIR__ . '/routes/cart.php';
                handleGetCartHoldStatus();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case (preg_match('/^\/orders\/?$/', $uri) ? true : false):
            if ($method === 'GET') {
                require_once __DIR__ . '/routes/orders.php';
                handleGetOrders();
            } elseif ($method === 'POST') {
                require_once __DIR__ . '/routes/orders.php';
                handleCreateOrder();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case (preg_match('/^\/orders\/(\d+)\/?$/', $uri, $matches) ? true : false):
            $orderId = $matches[1];
            if ($method === 'GET') {
                require_once __DIR__ . '/routes/orders.php';
                handleGetOrder($orderId);
            } elseif ($method === 'PUT') {
                require_once __DIR__ . '/routes/orders.php';
                handleUpdateOrder($orderId);
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case '/orders/stats/summary':
            if ($method === 'GET') {
                require_once __DIR__ . '/routes/orders.php';
                handleGetOrderStats();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case (preg_match('/^\/users\/?$/', $uri) ? true : false):
            if ($method === 'GET') {
                require_once __DIR__ . '/routes/users.php';
                handleGetUsers();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case (preg_match('/^\/users\/(\d+)\/?$/', $uri, $matches) ? true : false):
            $userId = $matches[1];
            if ($method === 'GET') {
                require_once __DIR__ . '/routes/users.php';
                handleGetUser($userId);
            } elseif ($method === 'PUT') {
                require_once __DIR__ . '/routes/users.php';
                handleUpdateUser($userId);
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case (preg_match('/^\/users\/(\d+)\/role\/?$/', $uri, $matches) ? true : false):
            if ($method === 'PUT') {
                $userId = $matches[1];
                require_once __DIR__ . '/routes/users.php';
                handleChangeUserRole($userId);
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case (preg_match('/^\/users\/(\d+)\/(activate|deactivate)\/?$/', $uri, $matches) ? true : false):
            if ($method === 'PUT') {
                $userId = $matches[1];
                $action = $matches[2];
                require_once __DIR__ . '/routes/users.php';
                if ($action === 'activate') {
                    handleActivateUser($userId);
                } else {
                    handleDeactivateUser($userId);
                }
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case '/users/stats/summary':
            if ($method === 'GET') {
                require_once __DIR__ . '/routes/users.php';
                handleGetUserStats();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case (preg_match('/^\/blog\/?$/', $uri) ? true : false):
            if ($method === 'GET') {
                require_once __DIR__ . '/routes/blog.php';
                handleGetBlogPosts();
            } elseif ($method === 'POST') {
                require_once __DIR__ . '/routes/blog.php';
                handleCreateBlogPost();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case '/blog/featured':
            if ($method === 'GET') {
                require_once __DIR__ . '/routes/blog.php';
                handleGetFeaturedPosts();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case (preg_match('/^\/blog\/(\d+)\/?$/', $uri, $matches) ? true : false):
            $postId = $matches[1];
            if ($method === 'GET') {
                require_once __DIR__ . '/routes/blog.php';
                handleGetBlogPost($postId);
            } elseif ($method === 'PUT') {
                require_once __DIR__ . '/routes/blog.php';
                handleUpdateBlogPost($postId);
            } elseif ($method === 'DELETE') {
                require_once __DIR__ . '/routes/blog.php';
                handleDeleteBlogPost($postId);
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case (preg_match('/^\/blog\/slug\/([^\/]+)\/?$/', $uri, $matches) ? true : false):
            if ($method === 'GET') {
                $slug = $matches[1];
                require_once __DIR__ . '/routes/blog.php';
                handleGetBlogPostBySlug($slug);
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case (preg_match('/^\/blog\/(\d+)\/featured-image\/?$/', $uri, $matches) ? true : false):
            if ($method === 'POST') {
                $postId = $matches[1];
                require_once __DIR__ . '/routes/blog.php';
                handleUploadFeaturedImage($postId);
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case '/blog/categories/list':
            if ($method === 'GET') {
                require_once __DIR__ . '/routes/blog.php';
                handleGetBlogCategories();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case '/blog/stats/summary':
            if ($method === 'GET') {
                require_once __DIR__ . '/routes/blog.php';
                handleGetBlogStats();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case (preg_match('/^\/notifications\/?$/', $uri) ? true : false):
            if ($method === 'GET') {
                require_once __DIR__ . '/routes/notifications.php';
                handleGetNotifications();
            } elseif ($method === 'POST') {
                require_once __DIR__ . '/routes/notifications.php';
                handleCreateNotification();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case '/notifications/user':
            if ($method === 'GET') {
                require_once __DIR__ . '/routes/notifications.php';
                handleGetUserNotifications();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case '/notifications/send-email':
            if ($method === 'POST') {
                require_once __DIR__ . '/routes/notifications.php';
                handleSendEmailNotification();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case '/notifications/stats/summary':
            if ($method === 'GET') {
                require_once __DIR__ . '/routes/notifications.php';
                handleGetNotificationStats();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case '/notifications/subscribe':
            if ($method === 'POST') {
                require_once __DIR__ . '/routes/notifications.php';
                handleSubscribeToNotifications();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case (preg_match('/^\/settings\/?$/', $uri) ? true : false):
            if ($method === 'GET') {
                require_once __DIR__ . '/routes/settings.php';
                handleGetSettings();
            } elseif ($method === 'PUT') {
                require_once __DIR__ . '/routes/settings.php';
                handleUpdateSettings();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case '/settings/reset':
            if ($method === 'POST') {
                require_once __DIR__ . '/routes/settings.php';
                handleResetSettings();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case '/settings/export':
            if ($method === 'GET') {
                require_once __DIR__ . '/routes/settings.php';
                handleExportSettings();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        case '/settings/import':
            if ($method === 'POST') {
                require_once __DIR__ . '/routes/settings.php';
                handleImportSettings();
            } else {
                sendError('Method not allowed', 405);
            }
            break;

        default:
            sendError('Endpoint not found', 404);
            break;
    }
} catch (Exception $e) {
    error_log('API Error: ' . $e->getMessage());
    sendError('Internal server error', 500);
}
?>
