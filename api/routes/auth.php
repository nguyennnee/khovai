<?php
// Authentication routes

function handleLogin() {
    global $pdo;
    
    // Get form data
    $email = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        sendError('Email and password are required', 400);
    }
    
    if (!validateEmail($email)) {
        sendError('Invalid email format', 400);
    }
    
    try {
        // Find user by email
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND is_active = 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if (!$user || !verifyPassword($password, $user['password_hash'])) {
            sendError('Invalid email or password', 401);
        }
        
        // Update last login
        $stmt = $pdo->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
        $stmt->execute([$user['id']]);
        
        // Generate JWT token
        $token = generateJWT($user['id'], $user['email'], $user['role']);
        
        // Return user data and token
        $userData = [
            'id' => $user['id'],
            'email' => $user['email'],
            'full_name' => $user['full_name'],
            'phone' => $user['phone'],
            'address' => $user['address'],
            'role' => $user['role'],
            'is_active' => (bool)$user['is_active'],
            'created_at' => $user['created_at'],
            'last_login' => $user['last_login']
        ];
        
        sendSuccess('Login successful', [
            'user' => $userData,
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => JWT_EXPIRY
        ]);
        
    } catch (Exception $e) {
        error_log('Login error: ' . $e->getMessage());
        sendInternalError('Login failed');
    }
}

function handleRegister() {
    global $pdo;
    
    $data = getRequestBody();
    
    // Validate input
    $rules = [
        'email' => ['required', 'email'],
        'password' => ['required', 'password'],
        'full_name' => ['required', ['string', 2, 255]],
        'phone' => ['phone'],
        'address' => [['string', 0, 500]]
    ];
    
    $errors = validateData($data, $rules);
    if (!empty($errors)) {
        sendValidationError($errors);
    }
    
    try {
        // Check if email already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$data['email']]);
        if ($stmt->fetch()) {
            sendError('Email already exists', 400);
        }
        
        // Hash password
        $passwordHash = hashPassword($data['password']);
        
        // Insert new user
        $stmt = $pdo->prepare("
            INSERT INTO users (email, password_hash, full_name, phone, address, role, is_active) 
            VALUES (?, ?, ?, ?, ?, 'user', 1)
        ");
        
        $stmt->execute([
            $data['email'],
            $passwordHash,
            $data['full_name'],
            $data['phone'] ?? null,
            $data['address'] ?? null
        ]);
        
        $userId = $pdo->lastInsertId();
        
        // Generate JWT token
        $token = generateJWT($userId, $data['email'], 'user');
        
        // Get created user
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        
        $userData = [
            'id' => $user['id'],
            'email' => $user['email'],
            'full_name' => $user['full_name'],
            'phone' => $user['phone'],
            'address' => $user['address'],
            'role' => $user['role'],
            'is_active' => (bool)$user['is_active'],
            'created_at' => $user['created_at']
        ];
        
        sendSuccess('Registration successful', [
            'user' => $userData,
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => JWT_EXPIRY
        ], 201);
        
    } catch (Exception $e) {
        error_log('Registration error: ' . $e->getMessage());
        sendInternalError('Registration failed');
    }
}

function handleGetMe() {
    global $pdo;
    
    $user = requireAuth();
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$user->user_id]);
        $userData = $stmt->fetch();
        
        if (!$userData) {
            sendNotFound('User not found');
        }
        
        $response = [
            'id' => $userData['id'],
            'email' => $userData['email'],
            'full_name' => $userData['full_name'],
            'phone' => $userData['phone'],
            'address' => $userData['address'],
            'role' => $userData['role'],
            'is_active' => (bool)$userData['is_active'],
            'created_at' => $userData['created_at'],
            'last_login' => $userData['last_login']
        ];
        
        sendSuccess('User data retrieved', $response);
        
    } catch (Exception $e) {
        error_log('Get me error: ' . $e->getMessage());
        sendInternalError('Failed to get user data');
    }
}

function handleUpdateProfile() {
    global $pdo;
    
    $user = requireAuth();
    $data = getRequestBody();
    
    // Validate input
    $rules = [
        'full_name' => [['string', 2, 255]],
        'phone' => ['phone'],
        'address' => [['string', 0, 500]]
    ];
    
    $errors = validateData($data, $rules);
    if (!empty($errors)) {
        sendValidationError($errors);
    }
    
    try {
        // Build update query
        $updateFields = [];
        $params = [];
        
        if (isset($data['full_name'])) {
            $updateFields[] = 'full_name = ?';
            $params[] = $data['full_name'];
        }
        
        if (isset($data['phone'])) {
            $updateFields[] = 'phone = ?';
            $params[] = $data['phone'];
        }
        
        if (isset($data['address'])) {
            $updateFields[] = 'address = ?';
            $params[] = $data['address'];
        }
        
        if (empty($updateFields)) {
            sendError('No fields to update', 400);
        }
        
        $updateFields[] = 'updated_at = NOW()';
        $params[] = $user->user_id;
        
        $sql = "UPDATE users SET " . implode(', ', $updateFields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        // Get updated user
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$user->user_id]);
        $userData = $stmt->fetch();
        
        $response = [
            'id' => $userData['id'],
            'email' => $userData['email'],
            'full_name' => $userData['full_name'],
            'phone' => $userData['phone'],
            'address' => $userData['address'],
            'role' => $userData['role'],
            'is_active' => (bool)$userData['is_active'],
            'created_at' => $userData['created_at'],
            'last_login' => $userData['last_login']
        ];
        
        sendSuccess('Profile updated successfully', $response);
        
    } catch (Exception $e) {
        error_log('Update profile error: ' . $e->getMessage());
        sendInternalError('Failed to update profile');
    }
}
?>
