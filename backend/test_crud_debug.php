<?php
require 'config/database.php';
require 'models/Book_debug.php';

echo "=== Book Management CRUD Test (DEBUG) ===\n\n";

// Test 1: Create
echo "1. Testing CREATE:\n";
try {
    $newBook = Book::create([
        'title' => 'Test Book CRUD',
        'author' => 'Test Author',
        'accession_number' => 'TEST-' . uniqid(),
        'publisher' => 'Test Publisher',
        'publication_year' => 2024,
        'pages' => 350,
        'quantity' => 5,
        'condition' => 'Good',
    ]);
    echo "✓ Book created: ID = {$newBook['id']}\n";
    $bookId = $newBook['id'];
} catch (PDOException $e) {
    echo "✗ Database Error: " . $e->getMessage() . "\n";
    exit(1);
} catch (Exception $e) {
    echo "✗ Failed: " . $e->getMessage() . "\n";
    exit(1);
}
