<?php
// Products routes

function handleGetProducts() {
    global $pdo;
    
    $params = getQueryParams();
    $pagination = getPaginationParams();
    
    // Build WHERE clause
    $whereConditions = ['p.status = "available"'];
    $queryParams = [];
    
    if (!empty($params['category'])) {
        $whereConditions[] = 'c.name = ?';
        $queryParams[] = $params['category'];
    }
    
    if (!empty($params['brand'])) {
        $whereConditions[] = 'p.brand = ?';
        $queryParams[] = $params['brand'];
    }
    
    if (!empty($params['condition'])) {
        $whereConditions[] = 'p.condition = ?';
        $queryParams[] = $params['condition'];
    }
    
    if (!empty($params['min_price'])) {
        $whereConditions[] = 'p.price >= ?';
        $queryParams[] = $params['min_price'];
    }
    
    if (!empty($params['max_price'])) {
        $whereConditions[] = 'p.price <= ?';
        $queryParams[] = $params['max_price'];
    }
    
    if (!empty($params['size'])) {
        $whereConditions[] = 'p.size = ?';
        $queryParams[] = $params['size'];
    }
    
    if (!empty($params['search'])) {
        $whereConditions[] = '(p.name LIKE ? OR p.brand LIKE ? OR p.description LIKE ?)';
        $searchTerm = '%' . $params['search'] . '%';
        $queryParams[] = $searchTerm;
        $queryParams[] = $searchTerm;
        $queryParams[] = $searchTerm;
    }
    
    if (isset($params['is_featured']) && $params['is_featured'] === 'true') {
        $whereConditions[] = 'p.is_featured = 1';
    }
    
    $whereClause = implode(' AND ', $whereConditions);
    
    // Count total
    $countSql = "
        SELECT COUNT(*) as total 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE $whereClause
    ";
    $stmt = $pdo->prepare($countSql);
    $stmt->execute($queryParams);
    $total = $stmt->fetch()['total'];
    
    // Get products
    $sql = "
        SELECT 
            p.*,
            c.name as category_name,
            c.description as category_description
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE $whereClause
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
    ";
    
    $queryParams[] = $pagination['per_page'];
    $queryParams[] = $pagination['skip'];
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($queryParams);
    $products = $stmt->fetchAll();
    
    // Format products
    $formattedProducts = array_map('formatProduct', $products);
    
    $response = formatPaginationResponse(
        $formattedProducts,
        $total,
        $pagination['page'],
        $pagination['per_page']
    );
    
    sendSuccess('Products retrieved', $response);
}

function handleGetFeaturedProducts() {
    global $pdo;
    
    $sql = "
        SELECT 
            p.*,
            c.name as category_name,
            c.description as category_description
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE p.is_featured = 1 AND p.status = 'available'
        ORDER BY p.created_at DESC
        LIMIT 10
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $products = $stmt->fetchAll();
    
    $formattedProducts = array_map('formatProduct', $products);
    
    sendSuccess('Featured products retrieved', $formattedProducts);
}

function handleGetProduct($id) {
    global $pdo;
    
    $sql = "
        SELECT 
            p.*,
            c.name as category_name,
            c.description as category_description
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE p.id = ?
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id]);
    $product = $stmt->fetch();
    
    if (!$product) {
        sendNotFound('Product not found');
    }
    
    sendSuccess('Product retrieved', formatProduct($product));
}

function handleCreateProduct() {
    global $pdo;
    
    requireAdmin();
    
    $data = getRequestBody();
    
    // Validate input
    $rules = [
        'name' => ['required', ['string', 1, 255]],
        'brand' => ['required', ['string', 1, 255]],
        'size' => ['required', ['string', 1, 50]],
        'condition' => ['required', ['in', ['new', 'like_new', 'good', 'fair']]],
        'price' => ['required', ['number', 0]],
        'original_price' => [['number', 0]],
        'category_id' => [['integer', 1]],
        'description' => [['string', 0, 1000]],
        'tags' => ['array'],
        'is_featured' => [['in', [0, 1, true, false]]]
    ];
    
    $errors = validateData($data, $rules);
    if (!empty($errors)) {
        sendValidationError($errors);
    }
    
    try {
        // Validate category exists
        if (!empty($data['category_id'])) {
            $stmt = $pdo->prepare("SELECT id FROM categories WHERE id = ?");
            $stmt->execute([$data['category_id']]);
            if (!$stmt->fetch()) {
                sendError('Category not found', 400);
            }
        }
        
        // Prepare data
        $tags = !empty($data['tags']) ? json_encode($data['tags']) : null;
        $images = json_encode([]);
        $isFeatured = isset($data['is_featured']) ? (int)$data['is_featured'] : 0;
        
        $sql = "
            INSERT INTO products (
                name, brand, size, condition, description, price, original_price,
                category_id, tags, images, status, is_featured
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available', ?)
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data['name'],
            $data['brand'],
            $data['size'],
            $data['condition'],
            $data['description'] ?? null,
            $data['price'],
            $data['original_price'] ?? null,
            $data['category_id'] ?? null,
            $tags,
            $images,
            $isFeatured
        ]);
        
        $productId = $pdo->lastInsertId();
        
        // Get created product
        $stmt = $pdo->prepare("
            SELECT 
                p.*,
                c.name as category_name,
                c.description as category_description
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.id = ?
        ");
        $stmt->execute([$productId]);
        $product = $stmt->fetch();
        
        sendSuccess('Product created successfully', formatProduct($product), 201);
        
    } catch (Exception $e) {
        error_log('Create product error: ' . $e->getMessage());
        sendInternalError('Failed to create product');
    }
}

function handleUpdateProduct($id) {
    global $pdo;
    
    requireAdmin();
    
    $data = getRequestBody();
    
    // Validate input
    $rules = [
        'name' => [['string', 1, 255]],
        'brand' => [['string', 1, 255]],
        'size' => [['string', 1, 50]],
        'condition' => [['in', ['new', 'like_new', 'good', 'fair']]],
        'price' => [['number', 0]],
        'original_price' => [['number', 0]],
        'category_id' => [['integer', 1]],
        'description' => [['string', 0, 1000]],
        'tags' => ['array'],
        'status' => [['in', ['available', 'reserved', 'sold']]],
        'is_featured' => [['in', [0, 1, true, false]]]
    ];
    
    $errors = validateData($data, $rules);
    if (!empty($errors)) {
        sendValidationError($errors);
    }
    
    try {
        // Check if product exists
        $stmt = $pdo->prepare("SELECT id FROM products WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            sendNotFound('Product not found');
        }
        
        // Validate category exists
        if (!empty($data['category_id'])) {
            $stmt = $pdo->prepare("SELECT id FROM categories WHERE id = ?");
            $stmt->execute([$data['category_id']]);
            if (!$stmt->fetch()) {
                sendError('Category not found', 400);
            }
        }
        
        // Build update query
        $updateFields = [];
        $params = [];
        
        if (isset($data['name'])) {
            $updateFields[] = 'name = ?';
            $params[] = $data['name'];
        }
        
        if (isset($data['brand'])) {
            $updateFields[] = 'brand = ?';
            $params[] = $data['brand'];
        }
        
        if (isset($data['size'])) {
            $updateFields[] = 'size = ?';
            $params[] = $data['size'];
        }
        
        if (isset($data['condition'])) {
            $updateFields[] = 'condition = ?';
            $params[] = $data['condition'];
        }
        
        if (isset($data['price'])) {
            $updateFields[] = 'price = ?';
            $params[] = $data['price'];
        }
        
        if (isset($data['original_price'])) {
            $updateFields[] = 'original_price = ?';
            $params[] = $data['original_price'];
        }
        
        if (isset($data['category_id'])) {
            $updateFields[] = 'category_id = ?';
            $params[] = $data['category_id'];
        }
        
        if (isset($data['description'])) {
            $updateFields[] = 'description = ?';
            $params[] = $data['description'];
        }
        
        if (isset($data['tags'])) {
            $updateFields[] = 'tags = ?';
            $params[] = json_encode($data['tags']);
        }
        
        if (isset($data['status'])) {
            $updateFields[] = 'status = ?';
            $params[] = $data['status'];
        }
        
        if (isset($data['is_featured'])) {
            $updateFields[] = 'is_featured = ?';
            $params[] = (int)$data['is_featured'];
        }
        
        if (empty($updateFields)) {
            sendError('No fields to update', 400);
        }
        
        $updateFields[] = 'updated_at = NOW()';
        $params[] = $id;
        
        $sql = "UPDATE products SET " . implode(', ', $updateFields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        // Get updated product
        $stmt = $pdo->prepare("
            SELECT 
                p.*,
                c.name as category_name,
                c.description as category_description
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.id = ?
        ");
        $stmt->execute([$id]);
        $product = $stmt->fetch();
        
        sendSuccess('Product updated successfully', formatProduct($product));
        
    } catch (Exception $e) {
        error_log('Update product error: ' . $e->getMessage());
        sendInternalError('Failed to update product');
    }
}

function handleDeleteProduct($id) {
    global $pdo;
    
    requireAdmin();
    
    try {
        // Check if product exists
        $stmt = $pdo->prepare("SELECT id FROM products WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            sendNotFound('Product not found');
        }
        
        // Delete product
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        
        sendSuccess('Product deleted successfully');
        
    } catch (Exception $e) {
        error_log('Delete product error: ' . $e->getMessage());
        sendInternalError('Failed to delete product');
    }
}

function handleGetCategories() {
    global $pdo;
    
    $sql = "
        SELECT 
            c.*,
            COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id AND p.status = 'available'
        GROUP BY c.id
        ORDER BY c.name
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $categories = $stmt->fetchAll();
    
    $formattedCategories = array_map(function($category) {
        return [
            'id' => (int)$category['id'],
            'name' => $category['name'],
            'description' => $category['description'],
            'product_count' => (int)$category['product_count']
        ];
    }, $categories);
    
    sendSuccess('Categories retrieved', $formattedCategories);
}

function handleCreateCategory() {
    global $pdo;
    
    requireAdmin();
    
    $data = getRequestBody();
    
    // Validate input
    $rules = [
        'name' => ['required', ['string', 1, 255]],
        'description' => [['string', 0, 500]]
    ];
    
    $errors = validateData($data, $rules);
    if (!empty($errors)) {
        sendValidationError($errors);
    }
    
    try {
        // Check if category name already exists
        $stmt = $pdo->prepare("SELECT id FROM categories WHERE name = ?");
        $stmt->execute([$data['name']]);
        if ($stmt->fetch()) {
            sendError('Category name already exists', 400);
        }
        
        $sql = "INSERT INTO categories (name, description) VALUES (?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$data['name'], $data['description'] ?? null]);
        
        $categoryId = $pdo->lastInsertId();
        
        // Get created category
        $stmt = $pdo->prepare("SELECT * FROM categories WHERE id = ?");
        $stmt->execute([$categoryId]);
        $category = $stmt->fetch();
        
        $response = [
            'id' => (int)$category['id'],
            'name' => $category['name'],
            'description' => $category['description'],
            'product_count' => 0
        ];
        
        sendSuccess('Category created successfully', $response, 201);
        
    } catch (Exception $e) {
        error_log('Create category error: ' . $e->getMessage());
        sendInternalError('Failed to create category');
    }
}

function handleUploadProductImages($productId) {
    global $pdo;
    
    requireAdmin();
    
    try {
        // Check if product exists
        $stmt = $pdo->prepare("SELECT id, images FROM products WHERE id = ?");
        $stmt->execute([$productId]);
        $product = $stmt->fetch();
        
        if (!$product) {
            sendNotFound('Product not found');
        }
        
        if (!isset($_FILES['images']) || empty($_FILES['images']['name'][0])) {
            sendError('No images uploaded', 400);
        }
        
        $uploadedImages = [];
        $currentImages = json_decode($product['images'], true) ?: [];
        
        foreach ($_FILES['images']['name'] as $key => $filename) {
            $file = [
                'name' => $_FILES['images']['name'][$key],
                'type' => $_FILES['images']['type'][$key],
                'tmp_name' => $_FILES['images']['tmp_name'][$key],
                'error' => $_FILES['images']['error'][$key],
                'size' => $_FILES['images']['size'][$key]
            ];
            
            $error = validateFile($file, 'image', ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE);
            if ($error) {
                sendError($error, 400);
            }
            
            // Generate unique filename
            $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
            $newFilename = uniqid() . '_' . time() . '.' . $extension;
            $uploadPath = UPLOAD_DIR . 'products/' . $newFilename;
            
            if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
                sendError('Failed to upload image', 500);
            }
            
            $uploadedImages[] = '/uploads/products/' . $newFilename;
        }
        
        // Update product images
        $allImages = array_merge($currentImages, $uploadedImages);
        $stmt = $pdo->prepare("UPDATE products SET images = ? WHERE id = ?");
        $stmt->execute([json_encode($allImages), $productId]);
        
        sendSuccess('Images uploaded successfully', [
            'uploaded_images' => $uploadedImages,
            'all_images' => $allImages
        ]);
        
    } catch (Exception $e) {
        error_log('Upload images error: ' . $e->getMessage());
        sendInternalError('Failed to upload images');
    }
}

function handleDeleteProductImage($productId, $imageIndex) {
    global $pdo;
    
    requireAdmin();
    
    try {
        // Check if product exists
        $stmt = $pdo->prepare("SELECT id, images FROM products WHERE id = ?");
        $stmt->execute([$productId]);
        $product = $stmt->fetch();
        
        if (!$product) {
            sendNotFound('Product not found');
        }
        
        $images = json_decode($product['images'], true) ?: [];
        
        if (!isset($images[$imageIndex])) {
            sendError('Image not found', 404);
        }
        
        // Delete file from filesystem
        $imagePath = $images[$imageIndex];
        if (strpos($imagePath, '/uploads/') === 0) {
            $fullPath = __DIR__ . '/..' . $imagePath;
            if (file_exists($fullPath)) {
                unlink($fullPath);
            }
        }
        
        // Remove from array
        array_splice($images, $imageIndex, 1);
        
        // Update product
        $stmt = $pdo->prepare("UPDATE products SET images = ? WHERE id = ?");
        $stmt->execute([json_encode($images), $productId]);
        
        sendSuccess('Image deleted successfully', ['images' => $images]);
        
    } catch (Exception $e) {
        error_log('Delete image error: ' . $e->getMessage());
        sendInternalError('Failed to delete image');
    }
}

function formatProduct($product) {
    $images = json_decode($product['images'], true) ?: [];
    $tags = json_decode($product['tags'], true) ?: [];
    
    return [
        'id' => (int)$product['id'],
        'name' => $product['name'],
        'brand' => $product['brand'],
        'size' => $product['size'],
        'condition' => $product['condition'],
        'description' => $product['description'],
        'price' => (float)$product['price'],
        'original_price' => $product['original_price'] ? (float)$product['original_price'] : null,
        'category_id' => $product['category_id'] ? (int)$product['category_id'] : null,
        'category' => $product['category_name'] ? [
            'id' => (int)$product['category_id'],
            'name' => $product['category_name'],
            'description' => $product['category_description']
        ] : null,
        'tags' => $tags,
        'images' => $images,
        'status' => $product['status'],
        'is_featured' => (bool)$product['is_featured'],
        'created_at' => $product['created_at'],
        'updated_at' => $product['updated_at']
    ];
}
?>
