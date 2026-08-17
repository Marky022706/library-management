<?php
require 'config/database.php';

$pdo = Database::getConnection();

// Check categories table schema
echo "Categories table columns:\n";
$stmt = $pdo->query('SHOW COLUMNS FROM categories');
$cols = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($cols as $col) {
    echo "  - " . $col['Field'] . " (" . $col['Type'] . ")\n";
}

echo "\nTrying to insert a test category...\n";
try {
    $sql = "INSERT INTO categories (id, category_id, name, created_at, updated_at) VALUES (:id, :id, :name, :now, :now)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'id' => 'cat-test-' . uniqid(),
        'name' => 'Test Category',
        'now' => date('Y-m-d H:i:s')
    ]);
    echo "✓ Category inserted successfully\n";
} catch (PDOException $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    echo "  SQL: $sql\n";
}
