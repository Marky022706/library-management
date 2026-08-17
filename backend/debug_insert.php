<?php
require 'config/database.php';

$pdo = Database::getConnection();

$sql = "INSERT INTO books (
    id, book_id, title, author, category, publisher, publication_year, accession_number, isbn, pages, shelf_location, format, quantity, available, `condition`, status, cover_color, qr_code, created_at, updated_at
) VALUES (
    :id, :book_id, :title, :author, :category, :publisher, :publication_year, :accession_number, :isbn, :pages, :shelf_location, :format, :quantity, :available, :condition, :status, :cover_color, :qr_code, :created_at, :updated_at
)";

echo "SQL Statement:\n";
echo $sql . "\n\n";

echo "Preparing statement...\n";
try {
    $stmt = $pdo->prepare($sql);
    echo "✓ Statement prepared successfully\n\n";
    
    $params = [
        'id' => 'bk-test-001',
        'book_id' => 'bk-test-001',
        'title' => 'Test Book',
        'author' => 'Test Author',
        'category' => 'General',
        'publisher' => 'Test Publisher',
        'publication_year' => 2024,
        'accession_number' => 'TEST-123',
        'isbn' => '123456',
        'pages' => 350,
        'shelf_location' => 'Main',
        'format' => 'Hardcover',
        'quantity' => 5,
        'available' => 5,
        'condition' => 'Good',
        'status' => 'active',
        'cover_color' => '#3b82f6',
        'qr_code' => 'qr-test',
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s'),
    ];
    
    echo "Executing with " . count($params) . " parameters:\n";
    foreach ($params as $key => $val) {
        echo "  :$key = $val\n";
    }
    echo "\n";
    
    $stmt->execute($params);
    echo "✓ Statement executed successfully\n";
    
} catch (PDOException $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    echo "  Code: " . $e->errorInfo[0] . "\n";
    var_dump($e);
}
