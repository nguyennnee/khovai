<?php
// Orders routes

function handleGetOrders() {
    global $pdo;
    
    $user = requireAuth();
    $params = getQueryParams();
    $pagination = getPaginationParams();
    
    // Check if user is admin
    $isAdmin = $user->role === 'admin';
    
    try {
        // Build WHERE clause
        $whereConditions = [];
        $queryParams = [];
        
        if (!$isAdmin) {
            $whereConditions[] = 'o.user_id = ?';
            $queryParams[] = $user->user_id;
        }
        
        if (!empty($params['status'])) {
            $whereConditions[] = 'o.status = ?';
            $queryParams[] = $params['status'];
        }
        
        if ($isAdmin && !empty($params['user_id'])) {
            $whereConditions[] = 'o.user_id = ?';
            $queryParams[] = $params['user_id'];
        }
        
        $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
        
        // Count total
        $countSql = "SELECT COUNT(*) as total FROM orders o $whereClause";
        $stmt = $pdo->prepare($countSql);
        $stmt->execute($queryParams);
        $total = $stmt->fetch()['total'];
        
        // Get orders
        $sql = "
            SELECT 
                o.*,
                u.full_name as user_name,
                u.email as user_email
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            $whereClause
            ORDER BY o.created_at DESC
            LIMIT ? OFFSET ?
        ";
        
        $queryParams[] = $pagination['per_page'];
        $queryParams[] = $pagination['skip'];
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($queryParams);
        $orders = $stmt->fetchAll();
        
        // Get order items for each order
        $formattedOrders = [];
        foreach ($orders as $order) {
            $orderItems = getOrderItems($order['id']);
            $formattedOrders[] = formatOrder($order, $orderItems);
        }
        
        $response = formatPaginationResponse(
            $formattedOrders,
            $total,
            $pagination['page'],
            $pagination['per_page']
        );
        
        sendSuccess('Orders retrieved', $response);
        
    } catch (Exception $e) {
        error_log('Get orders error: ' . $e->getMessage());
        sendInternalError('Failed to get orders');
    }
}

function handleGetOrder($id) {
    global $pdo;
    
    $user = requireAuth();
    
    try {
        // Check if user can access this order
        $sql = "
            SELECT 
                o.*,
                u.full_name as user_name,
                u.email as user_email
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.id = ?
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $order = $stmt->fetch();
        
        if (!$order) {
            sendNotFound('Order not found');
        }
        
        // Check permissions
        if ($user->role !== 'admin' && $order['user_id'] != $user->user_id) {
            sendForbidden('Access denied');
        }
        
        $orderItems = getOrderItems($id);
        $formattedOrder = formatOrder($order, $orderItems);
        
        sendSuccess('Order retrieved', $formattedOrder);
        
    } catch (Exception $e) {
        error_log('Get order error: ' . $e->getMessage());
        sendInternalError('Failed to get order');
    }
}

function handleCreateOrder() {
    global $pdo;
    
    $user = requireAuth();
    $data = getRequestBody();
    
    // Validate input
    $rules = [
        'shipping_address' => ['required', ['string', 10, 500]],
        'shipping_phone' => ['required', 'phone'],
        'shipping_name' => ['required', ['string', 2, 255]],
        'payment_method' => ['required', ['string', 1, 100]],
        'notes' => [['string', 0, 1000]],
        'items' => ['required', 'array']
    ];
    
    $errors = validateData($data, $rules);
    if (!empty($errors)) {
        sendValidationError($errors);
    }
    
    // Validate items
    if (empty($data['items'])) {
        sendError('Order must contain at least one item', 400);
    }
    
    try {
        $pdo->beginTransaction();
        
        // Get cart items
        $stmt = $pdo->prepare("
            SELECT 
                ci.*,
                p.name as product_name,
                p.brand as product_brand,
                p.size as product_size,
                p.condition as product_condition,
                p.price as product_price,
                p.images as product_images
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = ? AND ci.expires_at > NOW()
        ");
        $stmt->execute([$user->user_id]);
        $cartItems = $stmt->fetchAll();
        
        if (empty($cartItems)) {
            sendError('No items in cart or cart has expired', 400);
        }
        
        // Validate items match cart
        $cartItemIds = array_column($cartItems, 'id');
        $requestItemIds = array_column($data['items'], 'id');
        
        if (array_diff($requestItemIds, $cartItemIds)) {
            sendError('Invalid items in order', 400);
        }
        
        // Calculate totals
        $totalAmount = 0;
        $orderItems = [];
        
        foreach ($data['items'] as $item) {
            $cartItem = array_filter($cartItems, function($ci) use ($item) {
                return $ci['id'] == $item['id'];
            });
            $cartItem = reset($cartItem);
            
            if (!$cartItem) {
                throw new Exception('Cart item not found');
            }
            
            $itemTotal = $cartItem['quantity'] * $cartItem['product_price'];
            $totalAmount += $itemTotal;
            
            $orderItems[] = [
                'product_id' => $cartItem['product_id'],
                'quantity' => $cartItem['quantity'],
                'price' => $cartItem['product_price'],
                'product_name' => $cartItem['product_name'],
                'product_brand' => $cartItem['product_brand'],
                'product_size' => $cartItem['product_size'],
                'product_condition' => $cartItem['product_condition'],
                'product_images' => $cartItem['product_images']
            ];
        }
        
        // Calculate shipping
        $shippingFee = $totalAmount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
        
        // Create order
        $stmt = $pdo->prepare("
            INSERT INTO orders (
                user_id, total_amount, shipping_fee, payment_method,
                shipping_address, shipping_phone, shipping_name, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            $user->user_id,
            $totalAmount,
            $shippingFee,
            $data['payment_method'],
            $data['shipping_address'],
            $data['shipping_phone'],
            $data['shipping_name'],
            $data['notes'] ?? null
        ]);
        
        $orderId = $pdo->lastInsertId();
        
        // Create order items
        foreach ($orderItems as $item) {
            $stmt = $pdo->prepare("
                INSERT INTO order_items (order_id, product_id, quantity, price)
                VALUES (?, ?, ?, ?)
            ");
            $stmt->execute([$orderId, $item['product_id'], $item['quantity'], $item['price']]);
            
            // Update product status to reserved
            $stmt = $pdo->prepare("UPDATE products SET status = 'reserved' WHERE id = ?");
            $stmt->execute([$item['product_id']]);
        }
        
        // Clear cart
        $stmt = $pdo->prepare("DELETE FROM cart_items WHERE user_id = ?");
        $stmt->execute([$user->user_id]);
        
        $pdo->commit();
        
        // Get created order
        $stmt = $pdo->prepare("
            SELECT 
                o.*,
                u.full_name as user_name,
                u.email as user_email
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.id = ?
        ");
        $stmt->execute([$orderId]);
        $order = $stmt->fetch();
        
        $orderItems = getOrderItems($orderId);
        $formattedOrder = formatOrder($order, $orderItems);
        
        sendSuccess('Order created successfully', $formattedOrder, 201);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        error_log('Create order error: ' . $e->getMessage());
        sendInternalError('Failed to create order');
    }
}

function handleUpdateOrder($id) {
    global $pdo;
    
    requireAdmin();
    
    $data = getRequestBody();
    
    // Validate input
    $rules = [
        'status' => [['in', ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']]],
        'tracking_number' => [['string', 0, 100]],
        'notes' => [['string', 0, 1000]]
    ];
    
    $errors = validateData($data, $rules);
    if (!empty($errors)) {
        sendValidationError($errors);
    }
    
    try {
        // Check if order exists
        $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = ?");
        $stmt->execute([$id]);
        $order = $stmt->fetch();
        
        if (!$order) {
            sendNotFound('Order not found');
        }
        
        // Build update query
        $updateFields = [];
        $params = [];
        
        if (isset($data['status'])) {
            $updateFields[] = 'status = ?';
            $params[] = $data['status'];
        }
        
        if (isset($data['tracking_number'])) {
            $updateFields[] = 'tracking_number = ?';
            $params[] = $data['tracking_number'];
        }
        
        if (isset($data['notes'])) {
            $updateFields[] = 'notes = ?';
            $params[] = $data['notes'];
        }
        
        if (empty($updateFields)) {
            sendError('No fields to update', 400);
        }
        
        $updateFields[] = 'updated_at = NOW()';
        $params[] = $id;
        
        $sql = "UPDATE orders SET " . implode(', ', $updateFields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        // Get updated order
        $stmt = $pdo->prepare("
            SELECT 
                o.*,
                u.full_name as user_name,
                u.email as user_email
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.id = ?
        ");
        $stmt->execute([$id]);
        $order = $stmt->fetch();
        
        $orderItems = getOrderItems($id);
        $formattedOrder = formatOrder($order, $orderItems);
        
        sendSuccess('Order updated successfully', $formattedOrder);
        
    } catch (Exception $e) {
        error_log('Update order error: ' . $e->getMessage());
        sendInternalError('Failed to update order');
    }
}

function handleGetOrderStats() {
    global $pdo;
    
    requireAdmin();
    
    try {
        // Get order statistics
        $sql = "
            SELECT 
                COUNT(*) as total_orders,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
                SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_orders,
                SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing_orders,
                SUM(CASE WHEN status = 'shipped' THEN 1 ELSE 0 END) as shipped_orders,
                SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
                SUM(total_amount) as total_revenue,
                AVG(total_amount) as average_order_value
            FROM orders
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $stats = $stmt->fetch();
        
        // Get recent orders
        $sql = "
            SELECT 
                o.*,
                u.full_name as user_name
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
            LIMIT 10
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $recentOrders = $stmt->fetchAll();
        
        $response = [
            'summary' => [
                'total_orders' => (int)$stats['total_orders'],
                'pending_orders' => (int)$stats['pending_orders'],
                'confirmed_orders' => (int)$stats['confirmed_orders'],
                'processing_orders' => (int)$stats['processing_orders'],
                'shipped_orders' => (int)$stats['shipped_orders'],
                'delivered_orders' => (int)$stats['delivered_orders'],
                'cancelled_orders' => (int)$stats['cancelled_orders'],
                'total_revenue' => (float)$stats['total_revenue'],
                'average_order_value' => (float)$stats['average_order_value']
            ],
            'recent_orders' => array_map(function($order) {
                return [
                    'id' => (int)$order['id'],
                    'user_name' => $order['user_name'],
                    'total_amount' => (float)$order['total_amount'],
                    'status' => $order['status'],
                    'created_at' => $order['created_at']
                ];
            }, $recentOrders)
        ];
        
        sendSuccess('Order statistics retrieved', $response);
        
    } catch (Exception $e) {
        error_log('Get order stats error: ' . $e->getMessage());
        sendInternalError('Failed to get order statistics');
    }
}

function getOrderItems($orderId) {
    global $pdo;
    
    $sql = "
        SELECT 
            oi.*,
            p.name as product_name,
            p.brand as product_brand,
            p.size as product_size,
            p.condition as product_condition,
            p.images as product_images
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$orderId]);
    return $stmt->fetchAll();
}

function formatOrder($order, $orderItems) {
    $items = array_map(function($item) {
        $images = json_decode($item['product_images'], true) ?: [];
        $firstImage = !empty($images) ? $images[0] : null;
        
        return [
            'id' => (int)$item['id'],
            'product_id' => (int)$item['product_id'],
            'quantity' => (int)$item['quantity'],
            'price' => (float)$item['price'],
            'product_name' => $item['product_name'],
            'product_brand' => $item['product_brand'],
            'product_size' => $item['product_size'],
            'product_condition' => $item['product_condition'],
            'product_image' => $firstImage
        ];
    }, $orderItems);
    
    return [
        'id' => (int)$order['id'],
        'user_id' => (int)$order['user_id'],
        'total_amount' => (float)$order['total_amount'],
        'shipping_fee' => (float)$order['shipping_fee'],
        'status' => $order['status'],
        'payment_method' => $order['payment_method'],
        'shipping_address' => $order['shipping_address'],
        'shipping_phone' => $order['shipping_phone'],
        'shipping_name' => $order['shipping_name'],
        'notes' => $order['notes'],
        'tracking_number' => $order['tracking_number'],
        'created_at' => $order['created_at'],
        'updated_at' => $order['updated_at'],
        'items' => $items
    ];
}
?>
