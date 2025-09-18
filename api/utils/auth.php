<?php
// Authentication utilities

require_once __DIR__ . '/jwt.php';

function getCurrentUser() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    
    if (!$authHeader || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        return null;
    }
    
    $token = $matches[1];
    
    try {
        $payload = JWT::decode($token, JWT_SECRET, [JWT_ALGORITHM]);
        
        // Check if token is expired
        if ($payload->exp < time()) {
            return null;
        }
        
        return $payload;
    } catch (Exception $e) {
        error_log('JWT decode error: ' . $e->getMessage());
        return null;
    }
}

function requireAuth() {
    $user = getCurrentUser();
    if (!$user) {
        sendUnauthorized('Authentication required');
    }
    return $user;
}

function requireAdmin() {
    $user = requireAuth();
    if ($user->role !== 'admin') {
        sendForbidden('Admin access required');
    }
    return $user;
}

function generateJWT($userId, $email, $role) {
    $payload = [
        'user_id' => $userId,
        'email' => $email,
        'role' => $role,
        'iat' => time(),
        'exp' => time() + JWT_EXPIRY
    ];
    
    return JWT::encode($payload, JWT_SECRET, JWT_ALGORITHM);
}

function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

function generateRandomString($length = 32) {
    return bin2hex(random_bytes($length / 2));
}
?>
