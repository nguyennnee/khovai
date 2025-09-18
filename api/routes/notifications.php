<?php
// Notifications routes

function handleGetNotifications() {
    global $pdo;
    
    requireAdmin();
    
    $params = getQueryParams();
    $pagination = getPaginationParams();
    
    try {
        // Get notifications
        $sql = "
            SELECT 
                n.*,
                u.full_name as user_name,
                u.email as user_email
            FROM notifications n
            LEFT JOIN users u ON n.user_id = u.id
            ORDER BY n.created_at DESC
            LIMIT ? OFFSET ?
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$pagination['per_page'], $pagination['skip']]);
        $notifications = $stmt->fetchAll();
        
        // Count total
        $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM notifications");
        $stmt->execute();
        $total = $stmt->fetch()['total'];
        
        // Format notifications
        $formattedNotifications = array_map('formatNotification', $notifications);
        
        $response = formatPaginationResponse(
            $formattedNotifications,
            $total,
            $pagination['page'],
            $pagination['per_page']
        );
        
        sendSuccess('Notifications retrieved', $response);
        
    } catch (Exception $e) {
        error_log('Get notifications error: ' . $e->getMessage());
        sendInternalError('Failed to get notifications');
    }
}

function handleGetUserNotifications() {
    global $pdo;
    
    $user = requireAuth();
    $params = getQueryParams();
    $pagination = getPaginationParams();
    
    try {
        // Get user notifications
        $sql = "
            SELECT * FROM notifications 
            WHERE user_id = ? OR user_id IS NULL
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user->user_id, $pagination['per_page'], $pagination['skip']]);
        $notifications = $stmt->fetchAll();
        
        // Count total
        $stmt = $pdo->prepare("
            SELECT COUNT(*) as total FROM notifications 
            WHERE user_id = ? OR user_id IS NULL
        ");
        $stmt->execute([$user->user_id]);
        $total = $stmt->fetch()['total'];
        
        // Format notifications
        $formattedNotifications = array_map('formatNotification', $notifications);
        
        $response = formatPaginationResponse(
            $formattedNotifications,
            $total,
            $pagination['page'],
            $pagination['per_page']
        );
        
        sendSuccess('User notifications retrieved', $response);
        
    } catch (Exception $e) {
        error_log('Get user notifications error: ' . $e->getMessage());
        sendInternalError('Failed to get user notifications');
    }
}

function handleCreateNotification() {
    global $pdo;
    
    requireAdmin();
    
    $data = getRequestBody();
    
    // Validate input
    $rules = [
        'title' => ['required', ['string', 1, 255]],
        'message' => ['required', ['string', 1, 1000]],
        'type' => [['in', ['info', 'success', 'warning', 'error']]],
        'user_id' => [['integer', 1]],
        'send_email' => [['in', [0, 1, true, false]]]
    ];
    
    $errors = validateData($data, $rules);
    if (!empty($errors)) {
        sendValidationError($errors);
    }
    
    try {
        $type = $data['type'] ?? 'info';
        $userId = $data['user_id'] ?? null;
        $sendEmail = isset($data['send_email']) ? (bool)$data['send_email'] : false;
        
        // Validate user exists if specified
        if ($userId) {
            $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
            $stmt->execute([$userId]);
            if (!$stmt->fetch()) {
                sendError('User not found', 400);
            }
        }
        
        // Create notification
        $stmt = $pdo->prepare("
            INSERT INTO notifications (user_id, title, message, type)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$userId, $data['title'], $data['message'], $type]);
        
        $notificationId = $pdo->lastInsertId();
        
        // Send email if requested
        if ($sendEmail && $userId) {
            // Here you would implement email sending logic
            // For now, we'll just log it
            error_log("Email notification sent to user $userId: " . $data['title']);
        }
        
        // Get created notification
        $stmt = $pdo->prepare("
            SELECT 
                n.*,
                u.full_name as user_name,
                u.email as user_email
            FROM notifications n
            LEFT JOIN users u ON n.user_id = u.id
            WHERE n.id = ?
        ");
        $stmt->execute([$notificationId]);
        $notification = $stmt->fetch();
        
        sendSuccess('Notification created successfully', formatNotification($notification), 201);
        
    } catch (Exception $e) {
        error_log('Create notification error: ' . $e->getMessage());
        sendInternalError('Failed to create notification');
    }
}

function handleSendEmailNotification() {
    global $pdo;
    
    requireAdmin();
    
    $data = getRequestBody();
    
    // Validate input
    $rules = [
        'title' => ['required', ['string', 1, 255]],
        'message' => ['required', ['string', 1, 1000]],
        'recipients' => ['array']
    ];
    
    $errors = validateData($data, $rules);
    if (!empty($errors)) {
        sendValidationError($errors);
    }
    
    try {
        $recipients = $data['recipients'] ?? [];
        
        // If no recipients specified, send to all active users
        if (empty($recipients)) {
            $stmt = $pdo->prepare("SELECT email, full_name FROM users WHERE is_active = 1");
            $stmt->execute();
            $users = $stmt->fetchAll();
            $recipients = array_column($users, 'email');
        }
        
        // Here you would implement actual email sending logic
        // For now, we'll just log the emails that would be sent
        foreach ($recipients as $email) {
            error_log("Email sent to $email: " . $data['title']);
        }
        
        sendSuccess('Email notifications sent successfully', [
            'recipients_count' => count($recipients),
            'title' => $data['title']
        ]);
        
    } catch (Exception $e) {
        error_log('Send email notification error: ' . $e->getMessage());
        sendInternalError('Failed to send email notifications');
    }
}

function handleGetNotificationStats() {
    global $pdo;
    
    requireAdmin();
    
    try {
        // Get notification statistics
        $sql = "
            SELECT 
                COUNT(*) as total_notifications,
                SUM(CASE WHEN type = 'info' THEN 1 ELSE 0 END) as info_notifications,
                SUM(CASE WHEN type = 'success' THEN 1 ELSE 0 END) as success_notifications,
                SUM(CASE WHEN type = 'warning' THEN 1 ELSE 0 END) as warning_notifications,
                SUM(CASE WHEN type = 'error' THEN 1 ELSE 0 END) as error_notifications,
                SUM(CASE WHEN is_read = 1 THEN 1 ELSE 0 END) as read_notifications,
                SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) as unread_notifications,
                SUM(CASE WHEN user_id IS NULL THEN 1 ELSE 0 END) as global_notifications,
                SUM(CASE WHEN user_id IS NOT NULL THEN 1 ELSE 0 END) as user_notifications
            FROM notifications
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $stats = $stmt->fetch();
        
        // Get recent notifications
        $sql = "
            SELECT 
                n.*,
                u.full_name as user_name
            FROM notifications n
            LEFT JOIN users u ON n.user_id = u.id
            ORDER BY n.created_at DESC
            LIMIT 10
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $recentNotifications = $stmt->fetchAll();
        
        $response = [
            'summary' => [
                'total_notifications' => (int)$stats['total_notifications'],
                'info_notifications' => (int)$stats['info_notifications'],
                'success_notifications' => (int)$stats['success_notifications'],
                'warning_notifications' => (int)$stats['warning_notifications'],
                'error_notifications' => (int)$stats['error_notifications'],
                'read_notifications' => (int)$stats['read_notifications'],
                'unread_notifications' => (int)$stats['unread_notifications'],
                'global_notifications' => (int)$stats['global_notifications'],
                'user_notifications' => (int)$stats['user_notifications']
            ],
            'recent_notifications' => array_map('formatNotification', $recentNotifications)
        ];
        
        sendSuccess('Notification statistics retrieved', $response);
        
    } catch (Exception $e) {
        error_log('Get notification stats error: ' . $e->getMessage());
        sendInternalError('Failed to get notification statistics');
    }
}

function handleSubscribeToNotifications() {
    global $pdo;
    
    $data = getRequestBody();
    
    // Validate input
    $rules = [
        'email' => ['required', 'email'],
        'categories' => ['array']
    ];
    
    $errors = validateData($data, $rules);
    if (!empty($errors)) {
        sendValidationError($errors);
    }
    
    try {
        $email = $data['email'];
        $categories = $data['categories'] ?? [];
        
        // Check if email already exists
        $stmt = $pdo->prepare("SELECT id FROM newsletter_subscribers WHERE email = ?");
        $stmt->execute([$email]);
        $existing = $stmt->fetch();
        
        if ($existing) {
            // Update existing subscription
            $stmt = $pdo->prepare("
                UPDATE newsletter_subscribers 
                SET categories = ?, is_active = 1 
                WHERE email = ?
            ");
            $stmt->execute([json_encode($categories), $email]);
        } else {
            // Create new subscription
            $stmt = $pdo->prepare("
                INSERT INTO newsletter_subscribers (email, categories, is_active)
                VALUES (?, ?, 1)
            ");
            $stmt->execute([$email, json_encode($categories)]);
        }
        
        sendSuccess('Successfully subscribed to notifications', [
            'email' => $email,
            'categories' => $categories
        ]);
        
    } catch (Exception $e) {
        error_log('Subscribe to notifications error: ' . $e->getMessage());
        sendInternalError('Failed to subscribe to notifications');
    }
}

function formatNotification($notification) {
    return [
        'id' => (int)$notification['id'],
        'title' => $notification['title'],
        'message' => $notification['message'],
        'type' => $notification['type'],
        'is_read' => (bool)$notification['is_read'],
        'created_at' => $notification['created_at'],
        'user_name' => $notification['user_name'] ?? null,
        'user_email' => $notification['user_email'] ?? null
    ];
}
?>
