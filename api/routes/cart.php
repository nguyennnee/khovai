<?php
// Cart routes with thrift shop hold logic

function handleGetCart() {
    global $pdo;
    
    $user = requireAuth();
    
    try {
        // Clean expired cart items first
        cleanExpiredCartItems();
        
        // Get cart items with product details
        $sql = "
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
            ORDER BY ci.added_at DESC
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user->user_id]);
        $cartItems = $stmt->fetchAll();
        
        // Format cart items
        $items = array_map('formatCartItem', $cartItems);
        
        // Calculate totals
        $totalItems = array_sum(array_column($items, 'quantity'));
        $totalAmount = array_sum(array_map(function($item) {
            return $item['quantity'] * $item['product_price'];
        }, $items));
        
        // Calculate shipping
        $shippingFee = $totalAmount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
        
        // Get minimum expiry time
        $expiresInMinutes = 0;
        if (!empty($items)) {
            $minExpiry = min(array_column($items, 'expires_at'));
            $expiresInMinutes = max(0, (strtotime($minExpiry) - time()) / 60);
        }
        
        $cart = [
            'items' => $items,
            'total_items' => $totalItems,
            'total_amount' => $totalAmount,
            'shipping_fee' => $shippingFee,
            'free_shipping_threshold' => FREE_SHIPPING_THRESHOLD,
            'expires_in_minutes' => round($expiresInMinutes)
        ];
        
        sendSuccess('Cart retrieved', $cart);
        
    } catch (Exception $e) {
        error_log('Get cart error: ' . $e->getMessage());
        sendInternalError('Failed to get cart');
    }
}

function handleAddToCart() {
    global $pdo;
    
    $user = requireAuth();
    $data = getRequestBody();
    
    // Validate input
    $rules = [
        'product_id' => ['required', ['integer', 1]],
        'quantity' => [['integer', 1, 10]]
    ];
    
    $errors = validateData($data, $rules);
    if (!empty($errors)) {
        sendValidationError($errors);
    }
    
    $productId = $data['product_id'];
    $quantity = $data['quantity'] ?? 1;
    
    try {
        // Check if product exists and is available
        $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ? AND status = 'available'");
        $stmt->execute([$productId]);
        $product = $stmt->fetch();
        
        if (!$product) {
            sendError('Product not available', 400);
        }
        
        // Check if product is already in cart
        $stmt = $pdo->prepare("
            SELECT * FROM cart_items 
            WHERE user_id = ? AND product_id = ? AND expires_at > NOW()
        ");
        $stmt->execute([$user->user_id, $productId]);
        $existingItem = $stmt->fetch();
        
        if ($existingItem) {
            // Update quantity
            $newQuantity = $existingItem['quantity'] + $quantity;
            $stmt = $pdo->prepare("
                UPDATE cart_items 
                SET quantity = ?, expires_at = DATE_ADD(NOW(), INTERVAL ? MINUTE)
                WHERE id = ?
            ");
            $stmt->execute([$newQuantity, CART_HOLD_MINUTES, $existingItem['id']]);
        } else {
            // Add new item
            $stmt = $pdo->prepare("
                INSERT INTO cart_items (user_id, product_id, quantity, expires_at)
                VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE))
            ");
            $stmt->execute([$user->user_id, $productId, $quantity, CART_HOLD_MINUTES]);
        }
        
        sendSuccess('Item added to cart');
        
    } catch (Exception $e) {
        error_log('Add to cart error: ' . $e->getMessage());
        sendInternalError('Failed to add item to cart');
    }
}

function handleUpdateCartItem($itemId) {
    global $pdo;
    
    $user = requireAuth();
    $quantity = $_GET['quantity'] ?? null;
    
    if ($quantity === null) {
        sendError('Quantity parameter is required', 400);
    }
    
    $quantity = intval($quantity);
    if ($quantity < 1 || $quantity > 10) {
        sendError('Quantity must be between 1 and 10', 400);
    }
    
    try {
        // Check if cart item exists and belongs to user
        $stmt = $pdo->prepare("
            SELECT * FROM cart_items 
            WHERE id = ? AND user_id = ? AND expires_at > NOW()
        ");
        $stmt->execute([$itemId, $user->user_id]);
        $cartItem = $stmt->fetch();
        
        if (!$cartItem) {
            sendError('Cart item not found or expired', 404);
        }
        
        // Update quantity and extend expiry
        $stmt = $pdo->prepare("
            UPDATE cart_items 
            SET quantity = ?, expires_at = DATE_ADD(NOW(), INTERVAL ? MINUTE)
            WHERE id = ?
        ");
        $stmt->execute([$quantity, CART_HOLD_MINUTES, $itemId]);
        
        sendSuccess('Cart item updated');
        
    } catch (Exception $e) {
        error_log('Update cart item error: ' . $e->getMessage());
        sendInternalError('Failed to update cart item');
    }
}

function handleRemoveFromCart($itemId) {
    global $pdo;
    
    $user = requireAuth();
    
    try {
        // Check if cart item exists and belongs to user
        $stmt = $pdo->prepare("
            SELECT * FROM cart_items 
            WHERE id = ? AND user_id = ?
        ");
        $stmt->execute([$itemId, $user->user_id]);
        $cartItem = $stmt->fetch();
        
        if (!$cartItem) {
            sendError('Cart item not found', 404);
        }
        
        // Remove item
        $stmt = $pdo->prepare("DELETE FROM cart_items WHERE id = ?");
        $stmt->execute([$itemId]);
        
        sendSuccess('Item removed from cart');
        
    } catch (Exception $e) {
        error_log('Remove from cart error: ' . $e->getMessage());
        sendInternalError('Failed to remove item from cart');
    }
}

function handleClearCart() {
    global $pdo;
    
    $user = requireAuth();
    
    try {
        $stmt = $pdo->prepare("DELETE FROM cart_items WHERE user_id = ?");
        $stmt->execute([$user->user_id]);
        
        sendSuccess('Cart cleared');
        
    } catch (Exception $e) {
        error_log('Clear cart error: ' . $e->getMessage());
        sendInternalError('Failed to clear cart');
    }
}

function handleExtendCartHold() {
    global $pdo;
    
    $user = requireAuth();
    
    try {
        // Check if user has any cart items
        $stmt = $pdo->prepare("
            SELECT COUNT(*) as count FROM cart_items 
            WHERE user_id = ? AND expires_at > NOW()
        ");
        $stmt->execute([$user->user_id]);
        $result = $stmt->fetch();
        
        if ($result['count'] == 0) {
            sendError('No items in cart to extend', 400);
        }
        
        // Extend expiry time for all cart items
        $stmt = $pdo->prepare("
            UPDATE cart_items 
            SET expires_at = DATE_ADD(expires_at, INTERVAL ? MINUTE)
            WHERE user_id = ? AND expires_at > NOW()
        ");
        $stmt->execute([CART_EXTEND_MINUTES, $user->user_id]);
        
        sendSuccess('Cart hold extended successfully');
        
    } catch (Exception $e) {
        error_log('Extend cart hold error: ' . $e->getMessage());
        sendInternalError('Failed to extend cart hold');
    }
}

function handleGetCartHoldStatus() {
    global $pdo;
    
    $user = requireAuth();
    
    try {
        // Get cart items with expiry info
        $stmt = $pdo->prepare("
            SELECT 
                expires_at,
                (UNIX_TIMESTAMP(expires_at) - UNIX_TIMESTAMP(NOW())) / 60 as minutes_remaining
            FROM cart_items 
            WHERE user_id = ? AND expires_at > NOW()
            ORDER BY expires_at ASC
            LIMIT 1
        ");
        $stmt->execute([$user->user_id]);
        $result = $stmt->fetch();
        
        if (!$result) {
            sendSuccess('Cart hold status', [
                'has_items' => false,
                'expires_at' => null,
                'minutes_remaining' => 0,
                'can_extend' => false
            ]);
        }
        
        $minutesRemaining = max(0, round($result['minutes_remaining']));
        $canExtend = $minutesRemaining > 0;
        
        sendSuccess('Cart hold status', [
            'has_items' => true,
            'expires_at' => $result['expires_at'],
            'minutes_remaining' => $minutesRemaining,
            'can_extend' => $canExtend
        ]);
        
    } catch (Exception $e) {
        error_log('Get cart hold status error: ' . $e->getMessage());
        sendInternalError('Failed to get cart hold status');
    }
}

function cleanExpiredCartItems() {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("DELETE FROM cart_items WHERE expires_at <= NOW()");
        $stmt->execute();
    } catch (Exception $e) {
        error_log('Clean expired cart items error: ' . $e->getMessage());
    }
}

function formatCartItem($item) {
    $images = json_decode($item['product_images'], true) ?: [];
    $firstImage = !empty($images) ? $images[0] : null;
    
    return [
        'id' => (int)$item['id'],
        'product_id' => (int)$item['product_id'],
        'quantity' => (int)$item['quantity'],
        'product_name' => $item['product_name'],
        'product_brand' => $item['product_brand'],
        'product_size' => $item['product_size'],
        'product_condition' => $item['product_condition'],
        'product_price' => (float)$item['product_price'],
        'product_image' => $firstImage,
        'added_at' => $item['added_at'],
        'expires_at' => $item['expires_at']
    ];
}
?>
