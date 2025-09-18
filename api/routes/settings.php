<?php
// Settings routes

function handleGetSettings() {
    global $pdo;
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM settings ORDER BY key");
        $stmt->execute();
        $settings = $stmt->fetchAll();
        
        $formattedSettings = [];
        foreach ($settings as $setting) {
            $value = $setting['value'];
            
            // Convert value based on type
            switch ($setting['type']) {
                case 'number':
                    $value = is_numeric($value) ? (float)$value : $value;
                    break;
                case 'boolean':
                    $value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
                    break;
                case 'json':
                    $value = json_decode($value, true);
                    break;
            }
            
            $formattedSettings[$setting['key']] = [
                'value' => $value,
                'type' => $setting['type'],
                'description' => $setting['description']
            ];
        }
        
        sendSuccess('Settings retrieved', $formattedSettings);
        
    } catch (Exception $e) {
        error_log('Get settings error: ' . $e->getMessage());
        sendInternalError('Failed to get settings');
    }
}

function handleUpdateSettings() {
    global $pdo;
    
    requireAdmin();
    
    $data = getRequestBody();
    
    if (!isset($data['settings']) || !is_array($data['settings'])) {
        sendError('Settings data is required', 400);
    }
    
    try {
        $pdo->beginTransaction();
        
        foreach ($data['settings'] as $key => $value) {
            // Get setting info
            $stmt = $pdo->prepare("SELECT type FROM settings WHERE key = ?");
            $stmt->execute([$key]);
            $setting = $stmt->fetch();
            
            if (!$setting) {
                continue; // Skip unknown settings
            }
            
            // Convert value based on type
            $formattedValue = $value;
            switch ($setting['type']) {
                case 'number':
                    $formattedValue = is_numeric($value) ? (string)$value : $value;
                    break;
                case 'boolean':
                    $formattedValue = $value ? '1' : '0';
                    break;
                case 'json':
                    $formattedValue = is_array($value) ? json_encode($value) : $value;
                    break;
                default:
                    $formattedValue = (string)$value;
                    break;
            }
            
            // Update setting
            $stmt = $pdo->prepare("
                UPDATE settings 
                SET value = ?, updated_at = NOW() 
                WHERE key = ?
            ");
            $stmt->execute([$formattedValue, $key]);
        }
        
        $pdo->commit();
        
        sendSuccess('Settings updated successfully');
        
    } catch (Exception $e) {
        $pdo->rollBack();
        error_log('Update settings error: ' . $e->getMessage());
        sendInternalError('Failed to update settings');
    }
}

function handleResetSettings() {
    global $pdo;
    
    requireAdmin();
    
    try {
        // Reset to default values
        $defaultSettings = [
            'site_name' => 'Lil Sunshine Thrift',
            'site_description' => 'Cửa hàng thời trang vintage và thrift',
            'contact_email' => 'contact@lilshunshine.com',
            'contact_phone' => '+84 123 456 789',
            'shipping_fee' => '30000',
            'free_shipping_threshold' => '500000',
            'cart_hold_minutes' => '30',
            'max_upload_size' => '5242880'
        ];
        
        $pdo->beginTransaction();
        
        foreach ($defaultSettings as $key => $value) {
            $stmt = $pdo->prepare("
                UPDATE settings 
                SET value = ?, updated_at = NOW() 
                WHERE key = ?
            ");
            $stmt->execute([$value, $key]);
        }
        
        $pdo->commit();
        
        sendSuccess('Settings reset to default values');
        
    } catch (Exception $e) {
        $pdo->rollBack();
        error_log('Reset settings error: ' . $e->getMessage());
        sendInternalError('Failed to reset settings');
    }
}

function handleExportSettings() {
    global $pdo;
    
    requireAdmin();
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM settings ORDER BY key");
        $stmt->execute();
        $settings = $stmt->fetchAll();
        
        $exportData = [
            'exported_at' => date('Y-m-d H:i:s'),
            'settings' => []
        ];
        
        foreach ($settings as $setting) {
            $value = $setting['value'];
            
            // Convert value based on type
            switch ($setting['type']) {
                case 'number':
                    $value = is_numeric($value) ? (float)$value : $value;
                    break;
                case 'boolean':
                    $value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
                    break;
                case 'json':
                    $value = json_decode($value, true);
                    break;
            }
            
            $exportData['settings'][$setting['key']] = [
                'value' => $value,
                'type' => $setting['type'],
                'description' => $setting['description']
            ];
        }
        
        sendSuccess('Settings exported successfully', $exportData);
        
    } catch (Exception $e) {
        error_log('Export settings error: ' . $e->getMessage());
        sendInternalError('Failed to export settings');
    }
}

function handleImportSettings() {
    global $pdo;
    
    requireAdmin();
    
    $data = getRequestBody();
    
    if (!isset($data['settings']) || !is_array($data['settings'])) {
        sendError('Settings data is required', 400);
    }
    
    try {
        $pdo->beginTransaction();
        
        $importedCount = 0;
        $skippedCount = 0;
        
        foreach ($data['settings'] as $key => $settingData) {
            // Check if setting exists
            $stmt = $pdo->prepare("SELECT id, type FROM settings WHERE key = ?");
            $stmt->execute([$key]);
            $existingSetting = $stmt->fetch();
            
            if (!$existingSetting) {
                $skippedCount++;
                continue; // Skip unknown settings
            }
            
            $value = $settingData['value'] ?? $settingData;
            $type = $settingData['type'] ?? $existingSetting['type'];
            
            // Convert value based on type
            $formattedValue = $value;
            switch ($type) {
                case 'number':
                    $formattedValue = is_numeric($value) ? (string)$value : $value;
                    break;
                case 'boolean':
                    $formattedValue = $value ? '1' : '0';
                    break;
                case 'json':
                    $formattedValue = is_array($value) ? json_encode($value) : $value;
                    break;
                default:
                    $formattedValue = (string)$value;
                    break;
            }
            
            // Update setting
            $stmt = $pdo->prepare("
                UPDATE settings 
                SET value = ?, type = ?, updated_at = NOW() 
                WHERE key = ?
            ");
            $stmt->execute([$formattedValue, $type, $key]);
            $importedCount++;
        }
        
        $pdo->commit();
        
        sendSuccess('Settings imported successfully', [
            'imported_count' => $importedCount,
            'skipped_count' => $skippedCount
        ]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        error_log('Import settings error: ' . $e->getMessage());
        sendInternalError('Failed to import settings');
    }
}
?>
