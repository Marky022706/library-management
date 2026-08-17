<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/role.php';
require_once __DIR__ . '/../models/Borrowing.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$id = $_GET['id'] ?? null;
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

try {
    $user = getAuthenticatedUser(true);

    if ($method === 'GET') {
        $filters = [];
        if ($user['role'] === 'member') {
            $filters['user_id'] = $user['id'];
        } elseif (!empty($_GET['user_id'])) {
            $filters['user_id'] = $_GET['user_id'];
        }
        if (!empty($_GET['status'])) {
            $filters['status'] = $_GET['status'];
        }
        if (!empty($_GET['search'])) {
            $filters['search'] = $_GET['search'];
        }

        if ($id) {
            $record = Borrowing::getById($id);
            if (!$record) {
                Database::sendJsonResponse(false, 'Borrowing record not found.', null, 404);
            }
            Database::sendJsonResponse(true, 'Borrowing retrieved.', ['borrowing' => $record]);
        }

        $borrowings = Borrowing::getAll($filters);
        Database::sendJsonResponse(true, 'Borrowing records retrieved.', ['borrowings' => $borrowings, 'total' => count($borrowings)]);
    }

    if ($method === 'POST') {
        if ($action === 'return') {
            requireRole(['admin', 'super_admin'], $user);
            $borrowId = $input['id'] ?? $input['borrowing_id'] ?? $id;
            if (!$borrowId) {
                Database::sendJsonResponse(false, 'Borrowing ID is required for return processing.', null, 400);
            }

            $record = Borrowing::returnBook($borrowId, $user);
            Database::sendJsonResponse(true, 'Book return processed successfully.', ['borrowing' => $record]);
        }

        if ($action === 'renew') {
            $borrowId = $input['id'] ?? $input['borrowing_id'] ?? $id;
            if (!$borrowId) {
                Database::sendJsonResponse(false, 'Borrowing ID is required for renewal.', null, 400);
            }

            $record = Borrowing::renew($borrowId, $user);
            Database::sendJsonResponse(true, 'Loan renewed successfully.', ['borrowing' => $record]);
        }

        // Default: borrow checkout
        $targetUserId = ($user['role'] === 'member') ? $user['id'] : ($input['user_id'] ?? $user['id']);
        if (empty($input['book_id'])) {
            Database::sendJsonResponse(false, 'Book ID is required for borrowing.', null, 400);
        }

        $record = Borrowing::create([
            'user_id' => $targetUserId,
            'book_id' => $input['book_id'],
            'borrow_date' => $input['borrow_date'] ?? date('Y-m-d'),
            'due_date' => $input['due_date'] ?? date('Y-m-d', strtotime('+7 days')),
        ], $user);

        Database::sendJsonResponse(true, 'Book checked out successfully.', ['borrowing' => $record], 201);
    }

    Database::sendJsonResponse(false, 'Method not allowed.', null, 405);

} catch (Exception $e) {
    $code = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
    Database::sendJsonResponse(false, $e->getMessage(), null, $code);
}
