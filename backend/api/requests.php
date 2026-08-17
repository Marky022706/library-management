<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/role.php';
require_once __DIR__ . '/../models/BookRequest.php';
require_once __DIR__ . '/../models/Reservation.php';
require_once __DIR__ . '/../models/Borrowing.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    $user = getAuthenticatedUser(true);
    requireRole(['admin', 'super_admin'], $user);

    if ($method === 'GET') {
        $pdo = Database::getConnection();

        // Summary counts directly from database
        $borrowPending = (int) $pdo->query("SELECT COUNT(*) FROM book_requests WHERE request_type = 'borrowing' AND status = 'pending'")->fetchColumn();
        $archivePending = (int) $pdo->query("SELECT COUNT(*) FROM book_requests WHERE request_type = 'archive' AND status = 'pending'")->fetchColumn();
        $acqPending = (int) $pdo->query("SELECT COUNT(*) FROM book_requests WHERE request_type = 'acquisition' AND status = 'pending'")->fetchColumn();
        $totalPending = $borrowPending + $archivePending + $acqPending;

        $requests = BookRequest::getAll();

        Database::sendJsonResponse(true, 'Requests retrieved.', [
            'summary' => [
                'borrowing' => $borrowPending,
                'archive' => $archivePending,
                'acquisition' => $acqPending,
                'total_pending' => $totalPending,
            ],
            'requests' => $requests,
        ]);
    }

    Database::sendJsonResponse(false, 'Method not allowed.', null, 405);

} catch (Exception $e) {
    $code = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
    Database::sendJsonResponse(false, $e->getMessage(), null, $code);
}
