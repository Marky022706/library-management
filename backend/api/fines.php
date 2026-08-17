<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/role.php';
require_once __DIR__ . '/../models/Fine.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'pay';
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

        $fines = Fine::getAll($filters);
        Database::sendJsonResponse(true, 'Fines retrieved.', ['fines' => $fines, 'total' => count($fines)]);
    }

    if ($method === 'POST') {
        requireRole(['admin', 'super_admin'], $user);
        $fineId = $input['id'] ?? $input['fine_id'] ?? $id;

        if (!$fineId) {
            Database::sendJsonResponse(false, 'Fine ID is required.', null, 400);
        }

        if ($action === 'pay') {
            $res = Fine::pay($fineId, $user);
            Database::sendJsonResponse(true, 'Fine marked as paid.', ['fine' => $res]);
        }

        if ($action === 'waive') {
            $res = Fine::waive($fineId, $user);
            Database::sendJsonResponse(true, 'Fine waived successfully.', ['fine' => $res]);
        }

        Database::sendJsonResponse(false, 'Invalid fine action.', null, 400);
    }

    Database::sendJsonResponse(false, 'Method not allowed.', null, 405);

} catch (Exception $e) {
    $code = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
    Database::sendJsonResponse(false, $e->getMessage(), null, $code);
}
