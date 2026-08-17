<?php
require 'config/database.php';
require 'models/Book.php';

echo "=== Book Management CRUD Test ===\n\n";

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
    echo "  Title: {$newBook['title']}\n";
    echo "  Pages: {$newBook['pages']}\n";
    echo "  Quantity: {$newBook['quantity']}\n";
    $bookId = $newBook['id'];
} catch (PDOException $e) {
    echo "✗ Database Error: " . $e->getMessage() . "\n";
    echo "  Error Code: " . $e->getCode() . "\n";
    echo "  SQL State: " . $e->errorInfo[0] . "\n";
    exit(1);
} catch (Exception $e) {
    echo "✗ Failed: " . $e->getMessage() . "\n";
    exit(1);
}

// Test 2: Read
echo "\n2. Testing READ:\n";
try {
    $book = Book::findById($bookId);
    if ($book) {
        echo "✓ Book retrieved: {$book['title']}\n";
        echo "  Pages: {$book['pages']}\n";
        echo "  Accession Number: {$book['accession_number']}\n";
    } else {
        echo "✗ Book not found\n";
        exit(1);
    }
} catch (Exception $e) {
    echo "✗ Failed: " . $e->getMessage() . "\n";
    exit(1);
}

// Test 3: Update
echo "\n3. Testing UPDATE:\n";
try {
    $updated = Book::update($bookId, [
        'pages' => 400,
        'quantity' => 10,
        'publisher' => 'Updated Publisher'
    ]);
    echo "✓ Book updated\n";
    echo "  Pages: {$updated['pages']} (was 350)\n";
    echo "  Quantity: {$updated['quantity']} (was 5)\n";
    echo "  Publisher: {$updated['publisher']}\n";
} catch (Exception $e) {
    echo "✗ Failed: " . $e->getMessage() . "\n";
    exit(1);
}

// Test 4: List/Read All
echo "\n4. Testing LIST (Read All):\n";
try {
    $books = Book::getAll(['status' => 'active']);
    echo "✓ Retrieved " . count($books) . " active books\n";
    $testBook = array_filter($books, fn($b) => $b['id'] === $bookId);
    if ($testBook) {
        echo "  ✓ Test book found in list\n";
    }
} catch (Exception $e) {
    echo "✗ Failed: " . $e->getMessage() . "\n";
    exit(1);
}

// Test 5: Archive (Soft Delete)
echo "\n5. Testing ARCHIVE (Status Update):\n";
try {
    $success = Book::archive($bookId);
    $archived = Book::findById($bookId);
    if ($archived['status'] === 'archived') {
        echo "✓ Book archived successfully\n";
        echo "  Status: {$archived['status']}\n";
    } else {
        echo "✗ Failed to archive\n";
        exit(1);
    }
} catch (Exception $e) {
    echo "✗ Failed: " . $e->getMessage() . "\n";
    exit(1);
}

// Test 6: Restore
echo "\n6. Testing RESTORE:\n";
try {
    $success = Book::restore($bookId);
    $restored = Book::findById($bookId);
    if ($restored['status'] === 'active') {
        echo "✓ Book restored successfully\n";
        echo "  Status: {$restored['status']}\n";
    } else {
        echo "✗ Failed to restore\n";
        exit(1);
    }
} catch (Exception $e) {
    echo "✗ Failed: " . $e->getMessage() . "\n";
    exit(1);
}

echo "\n=== All CRUD Tests Passed! ===\n";
echo "The backend database connection and CRUD operations are working correctly.\n";
