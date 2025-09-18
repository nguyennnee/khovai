<?php
// Database migration script
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/config.php';

try {
    // Read and execute schema
    $schema = file_get_contents(__DIR__ . '/schema.sql');
    
    // Split by semicolon and execute each statement
    $statements = array_filter(array_map('trim', explode(';', $schema)));
    
    foreach ($statements as $statement) {
        if (!empty($statement) && !preg_match('/^(--|#)/', $statement)) {
            $pdo->exec($statement);
        }
    }
    
    echo "Database migration completed successfully!\n";
    echo "Default admin user created: admin@lilshunshine.com / password\n";
    echo "Please change the default password after first login.\n";
    
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
?>
