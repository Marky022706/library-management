<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/role.php';
require_once __DIR__ . '/../models/Book.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;
$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

try {
    if ($method === 'GET') {
        if ($id) {
            $book = Book::findById($id);
            if (!$book) {
                Database::sendJsonResponse(false, 'Book not found.', null, 404);
            }
            Database::sendJsonResponse(true, 'Book details retrieved.', ['book' => $book]);
        } else {
            $books = Book::getAll([
                'category' => $_GET['category'] ?? 'all',
                'author' => $_GET['author'] ?? 'all',
                'publisher' => $_GET['publisher'] ?? 'all',
                'status' => $_GET['status'] ?? 'active',
                'search' => $_GET['search'] ?? '',
                'available_only' => isset($_GET['available_only']) ? filter_var($_GET['available_only'], FILTER_VALIDATE_BOOLEAN) : false,
            ]);
            Database::sendJsonResponse(true, 'Book catalog retrieved successfully.', ['books' => $books, 'total' => count($books)]);
        }
    }

    if ($method === 'POST') {
        $currentUser = getAuthenticatedUser(true);
        require_once __DIR__ . '/../models/AuditLog.php';
        
        if ($action === 'restore' && $id) {
            requireRole(['super_admin'], $currentUser);
            $success = Book::restore($id);
            AuditLog::create([
                'user_id' => $currentUser['id'],
                'user_name' => $currentUser['name'],
                'role' => $currentUser['role'],
                'action' => 'Book Restored',
                'module' => 'Book Management',
                'target_id' => $id,
                'description' => "Restored archived book ID {$id}"
            ]);
            Database::sendJsonResponse($success, 'Book restored from archives successfully.');
        }

        requireRole(['admin', 'super_admin'], $currentUser);
        $book = Book::create($input);
        AuditLog::create([
            'user_id' => $currentUser['id'],
            'user_name' => $currentUser['name'],
            'role' => $currentUser['role'],
            'action' => 'Book Created',
            'module' => 'Book Management',
            'target_id' => $book['id'],
            'description' => "Added book '{$book['title']}' to catalog"
        ]);
        Database::sendJsonResponse(true, 'Book added to catalog successfully.', ['book' => $book], 201);
    }

    if ($method === 'PUT' || $method === 'PATCH') {
        $currentUser = getAuthenticatedUser(true);
        requireRole(['admin', 'super_admin'], $currentUser);

        if (!$id) {
            Database::sendJsonResponse(false, 'Book ID is required for update.', null, 400);
        }

        $updatedBook = Book::update($id, $input);
        require_once __DIR__ . '/../models/AuditLog.php';
        AuditLog::create([
            'user_id' => $currentUser['id'],
            'user_name' => $currentUser['name'],
            'role' => $currentUser['role'],
            'action' => 'Book Updated',
            'module' => 'Book Management',
            'target_id' => $id,
            'description' => "Updated book details for '{$updatedBook['title']}'"
        ]);
        Database::sendJsonResponse(true, 'Book details updated successfully.', ['book' => $updatedBook]);
    }

    if ($method === 'DELETE') {
        $currentUser = getAuthenticatedUser(true);
        requireRole(['admin', 'super_admin'], $currentUser);

        if (!$id) {
            Database::sendJsonResponse(false, 'Book ID is required for archiving.', null, 400);
        }

        $success = Book::archive($id);
        require_once __DIR__ . '/../models/AuditLog.php';
        AuditLog::create([
            'user_id' => $currentUser['id'],
            'user_name' => $currentUser['name'],
            'role' => $currentUser['role'],
            'action' => 'Book Archived',
            'module' => 'Book Management',
            'target_id' => $id,
            'description' => "Archived book ID {$id}"
        ]);
        Database::sendJsonResponse($success, 'Book archived successfully.');
    }

    Database::sendJsonResponse(false, 'Method not allowed.', null, 405);

} catch (Exception $e) {
    $code = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
    Database::sendJsonResponse(false, $e->getMessage(), null, $code);
}
