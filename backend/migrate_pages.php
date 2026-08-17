<?php
require 'config/database.php';

$pdo = Database::getConnection();

try {
    $pdo->exec('ALTER TABLE books ADD COLUMN pages INT DEFAULT NULL');
    echo "Pages column added successfully.\n";
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate column') !== false) {
        echo "Pages column already exists.\n";
    } else {
        echo "Error: " . $e->getMessage() . "\n";
        exit(1);
    }
}
