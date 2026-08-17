<?php
require 'config/database.php';

$pdo = Database::getConnection();
$stmt = $pdo->query('DESC books');
$cols = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "Books table schema (relevant columns):\n";
foreach ($cols as $col) {
    if (in_array($col['Field'], ['title', 'author', 'accession_number', 'isbn', 'pages', 'category'])) {
        echo $col['Field'] . ' - ' . $col['Type'] . "\n";
    }
}
