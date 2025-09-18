<?php
// Users management routes

function handleGetUsers() {
    global $pdo;
    
    requireAdmin();
    
    $params = getQueryParams();
    $pagination = getPaginationParams();
    
    try {
        // Build WHERE clause
        $whereConditions = [];
        $queryParams = [];
        
        if (!empty($params['role'])) {
            $whereConditions[] = 'role = ?';
            $queryParams[] = $params['role'];
        }
        
        if (isset($params['is_active'])) {
            $whereConditions[] = 'is_active = ?';
            $queryParams[] = $params['is_active'] === 'true' ? 1 : 0;
        }
        
        if (!empty($params['search'])) {
            $whereConditions[] = '(full_name LIKE ? OR email LIKE ?)';
            $searchTerm = '%' . $params['search'] . '%';
            $queryParams[] = $searchTerm;
            $queryParams[] = $searchTerm;
        }
        
        $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
        
        // Count total
        $countSql = "SELECT COUNT(*) as total FROM users $whereClause";
        $stmt = $pdo->prepare($countSql);
        $stmt->execute($queryParams);
        $total = $stmt->fetch()['total'];
        
        // Get users
        $sql = "
            SELECT 
                id, email, full_name, phone, address, role, is_active, 
                created_at, last_login
            FROM users 
            $whereClause
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        ";
        
        $queryParams[] = $pagination['per_page'];
        $queryParams[] = $pagination['skip'];
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($queryParams);
        $users = $stmt->fetchAll();
        
        // Format users
        $formattedUsers = array_map('formatUser', $users);
        
        $response = formatPaginationResponse(
            $formattedUsers,
            $total,
            $pagination['page'],
            $pagination['per_page']
        );
        
        sendSuccess('Users retrieved', $response);
        
    } catch (Exception $e) {
        error_log('Get users error: ' . $e->getMessage());
        sendInternalError('Failed to get users');
    }
}

function handleGetUser($id) {
    global $pdo;
    
    requireAdmin();
    
    try {
        $stmt = $pdo->prepare("
            SELECT 
                id, email, full_name, phone, address, role, is_active, 
                created_at, last_login
            FROM users 
            WHERE id = ?
        ");
        $stmt->execute([$id]);
        $user = $stmt->fetch();
        
        if (!$user) {
            sendNotFound('User not found');
        }
        
        sendSuccess('User retrieved', formatUser($user));
        
    } catch (Exception $e) {
        error_log('Get user error: ' . $e->getMessage());
        sendInternalError('Failed to get user');
    }
}

function handleUpdateUser($id) {
    global $pdo;
    
    requireAdmin();
    
    $data = getRequestBody();
    
    // Validate input
    $rules = [
        'full_name' => [['string', 2, 255]],
        'phone' => ['phone'],
        'address' => [['string', 0, 500]],
        'is_active' => [['in', [0, 1, true, false]]]
    ];
    
    $errors = validateData($data, $rules);
    if (!empty($errors)) {
        sendValidationError($errors);
    }
    
    try {
        // Check if user exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            sendNotFound('User not found');
        }
        
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
        
        if (isset($data['is_active'])) {
            $updateFields[] = 'is_active = ?';
            $params[] = (int)$data['is_active'];
        }
        
        if (empty($updateFields)) {
            sendError('No fields to update', 400);
        }
        
        $updateFields[] = 'updated_at = NOW()';
        $params[] = $id;
        
        $sql = "UPDATE users SET " . implode(', ', $updateFields) . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        
        // Get updated user
        $stmt = $pdo->prepare("
            SELECT 
                id, email, full_name, phone, address, role, is_active, 
                created_at, last_login
            FROM users 
            WHERE id = ?
        ");
        $stmt->execute([$id]);
        $user = $stmt->fetch();
        
        sendSuccess('User updated successfully', formatUser($user));
        
    } catch (Exception $e) {
        error_log('Update user error: ' . $e->getMessage());
        sendInternalError('Failed to update user');
    }
}

function handleChangeUserRole($id) {
    global $pdo;
    
    requireAdmin();
    
    $newRole = $_GET['new_role'] ?? null;
    
    if (!$newRole || !in_array($newRole, ['admin', 'user'])) {
        sendError('Invalid role. Must be admin or user', 400);
    }
    
    try {
        // Check if user exists
        $stmt = $pdo->prepare("SELECT id, role FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch();
        
        if (!$user) {
            sendNotFound('User not found');
        }
        
        if ($user['role'] === $newRole) {
            sendError('User already has this role', 400);
        }
        
        // Update role
        $stmt = $pdo->prepare("UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$newRole, $id]);
        
        sendSuccess('User role updated successfully');
        
    } catch (Exception $e) {
        error_log('Change user role error: ' . $e->getMessage());
        sendInternalError('Failed to change user role');
    }
}

function handleActivateUser($id) {
    global $pdo;
    
    requireAdmin();
    
    try {
        // Check if user exists
        $stmt = $pdo->prepare("SELECT id, is_active FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch();
        
        if (!$user) {
            sendNotFound('User not found');
        }
        
        if ($user['is_active']) {
            sendError('User is already active', 400);
        }
        
        // Activate user
        $stmt = $pdo->prepare("UPDATE users SET is_active = 1, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$id]);
        
        sendSuccess('User activated successfully');
        
    } catch (Exception $e) {
        error_log('Activate user error: ' . $e->getMessage());
        sendInternalError('Failed to activate user');
    }
}

function handleDeactivateUser($id) {
    global $pdo;
    
    requireAdmin();
    
    try {
        // Check if user exists
        $stmt = $pdo->prepare("SELECT id, is_active FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch();
        
        if (!$user) {
            sendNotFound('User not found');
        }
        
        if (!$user['is_active']) {
            sendError('User is already inactive', 400);
        }
        
        // Deactivate user
        $stmt = $pdo->prepare("UPDATE users SET is_active = 0, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$id]);
        
        sendSuccess('User deactivated successfully');
        
    } catch (Exception $e) {
        error_log('Deactivate user error: ' . $e->getMessage());
        sendInternalError('Failed to deactivate user');
    }
}

function handleGetUserStats() {
    global $pdo;
    
    requireAdmin();
    
    try {
        // Get user statistics
        $sql = "
            SELECT 
                COUNT(*) as total_users,
                SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_users,
                SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as regular_users,
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_users,
                SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive_users,
                SUM(CASE WHEN last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as recent_users
            FROM users
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $stats = $stmt->fetch();
        
        // Get recent users
        $sql = "
            SELECT 
                id, email, full_name, role, is_active, created_at, last_login
            FROM users 
            ORDER BY created_at DESC
            LIMIT 10
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $recentUsers = $stmt->fetchAll();
        
        $response = [
            'summary' => [
                'total_users' => (int)$stats['total_users'],
                'admin_users' => (int)$stats['admin_users'],
                'regular_users' => (int)$stats['regular_users'],
                'active_users' => (int)$stats['active_users'],
                'inactive_users' => (int)$stats['inactive_users'],
                'recent_users' => (int)$stats['recent_users']
            ],
            'recent_users' => array_map('formatUser', $recentUsers)
        ];
        
        sendSuccess('User statistics retrieved', $response);
        
    } catch (Exception $e) {
        error_log('Get user stats error: ' . $e->getMessage());
        sendInternalError('Failed to get user statistics');
    }
}

function formatUser($user) {
    return [
        'id' => (int)$user['id'],
        'email' => $user['email'],
        'full_name' => $user['full_name'],
        'phone' => $user['phone'],
        'address' => $user['address'],
        'role' => $user['role'],
        'is_active' => (bool)$user['is_active'],
        'created_at' => $user['created_at'],
        'last_login' => $user['last_login']
    ];
}
?>
