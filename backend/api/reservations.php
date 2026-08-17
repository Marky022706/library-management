<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/role.php';
require_once __DIR__ . '/../models/Reservation.php';

$method = $_SERVER['REQUEST_METHOD'];
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

        if ($id) {
            $record = Reservation::getById($id);
            if (!$record) {
                Database::sendJsonResponse(false, 'Reservation not found.', null, 404);
            }
            Database::sendJsonResponse(true, 'Reservation retrieved.', ['reservation' => $record]);
        }

        $reservations = Reservation::getAll($filters);
        Database::sendJsonResponse(true, 'Reservations retrieved.', ['reservations' => $reservations, 'total' => count($reservations)]);
    }

    if ($method === 'POST') {
        $targetUserId = ($user['role'] === 'member') ? $user['id'] : ($input['user_id'] ?? $user['id']);

        if (empty($input['book_id'])) {
            Database::sendJsonResponse(false, 'Book ID is required for reservation.', null, 400);
        }

        $res = Reservation::create([
            'user_id' => $targetUserId,
            'book_id' => $input['book_id'],
        ], $user);

        Database::sendJsonResponse(true, 'Hold placed successfully.', ['reservation' => $res], 201);
    }

    if ($method === 'PUT' || $method === 'PATCH') {
        requireRole(['admin', 'super_admin'], $user);
        if (!$id || empty($input['status'])) {
            Database::sendJsonResponse(false, 'Reservation ID and status are required.', null, 400);
        }

        $res = Reservation::updateStatus($id, $input['status'], $input['pickup_deadline'] ?? null);
        Database::sendJsonResponse(true, 'Reservation status updated.', ['reservation' => $res]);
    }

    if ($method === 'DELETE') {
        if (!$id) {
            Database::sendJsonResponse(false, 'Reservation ID is required for cancellation.', null, 400);
        }

        $ok = Reservation::cancel($id, $user['id']);
        Database::sendJsonResponse($ok, $ok ? 'Reservation cancelled successfully.' : 'Failed to cancel reservation.');
    }

    Database::sendJsonResponse(false, 'Method not allowed.', null, 405);

} catch (Exception $e) {
    $code = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
    Database::sendJsonResponse(false, $e->getMessage(), null, $code);
}
