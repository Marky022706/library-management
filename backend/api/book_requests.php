<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/role.php';
require_once __DIR__ . '/../models/BookRequest.php';

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
        if (!empty($_GET['request_type'])) {
            $filters['request_type'] = $_GET['request_type'];
        }

        $requests = BookRequest::getAll($filters);
        Database::sendJsonResponse(true, 'Book requests retrieved.', ['requests' => $requests, 'total' => count($requests)]);
    }

    if ($method === 'POST') {
        if (empty($input['title'])) {
            Database::sendJsonResponse(false, 'Book title is required.', null, 400);
        }

        $input['user_id'] = $user['id'];
        $res = BookRequest::create($input);
        Database::sendJsonResponse(true, 'Request submitted successfully.', ['request' => $res], 201);
    }

    if ($method === 'PUT' || $method === 'PATCH') {
        requireRole(['admin', 'super_admin'], $user);
        if (!$id || empty($input['status'])) {
            Database::sendJsonResponse(false, 'Request ID and status are required.', null, 400);
        }

        $res = BookRequest::process($id, $input['status'], $user, $input['remarks'] ?? null);
        Database::sendJsonResponse(true, 'Request processed.', ['request' => $res]);
    }

    Database::sendJsonResponse(false, 'Method not allowed.', null, 405);

} catch (Exception $e) {
    $code = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
    Database::sendJsonResponse(false, $e->getMessage(), null, $code);
}
