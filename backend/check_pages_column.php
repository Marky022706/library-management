<?php
require 'config/database.php';

$pdo = Database::getConnection();

// Check if pages column exists
$stmt = $pdo->query('SHOW COLUMNS FROM books WHERE Field="pages"');
$col = $stmt->fetch(PDO::FETCH_ASSOC);

if ($col) {
    echo "Pages column exists:\n";
    var_dump($col);
} else {
    echo "ERROR: Pages column does not exist!\n";
    echo "\nCurrent books table columns:\n";
    $stmt = $pdo->query('SHOW COLUMNS FROM books');
    $cols = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($cols as $c) {
        echo "  - " . $c['Field'] . " (" . $c['Type'] . ")\n";
    }
}
