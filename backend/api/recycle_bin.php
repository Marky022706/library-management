<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/role.php';
require_once __DIR__ . '/../models/RecycleBin.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'restore';
$id = $_GET['id'] ?? null;
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

try {
    $user = getAuthenticatedUser(true);
    requireRole(['super_admin'], $user);

    if ($method === 'GET') {
        $items = RecycleBin::getAll();
        Database::sendJsonResponse(true, 'Recycle bin items retrieved.', ['items' => $items, 'total' => count($items)]);
    }

    if ($method === 'POST') {
        $binId = $input['id'] ?? $id;
        if (!$binId) {
            Database::sendJsonResponse(false, 'Recycle Bin item ID is required.', null, 400);
        }

        if ($action === 'restore') {
            $ok = RecycleBin::restore($binId, $user);
            Database::sendJsonResponse($ok, $ok ? 'Item restored successfully.' : 'Failed to restore item.');
        }

        if ($action === 'purge') {
            $ok = RecycleBin::purge($binId, $user);
            Database::sendJsonResponse($ok, $ok ? 'Item permanently purged.' : 'Failed to purge item.');
        }

        Database::sendJsonResponse(false, 'Invalid recycle bin action.', null, 400);
    }

    Database::sendJsonResponse(false, 'Method not allowed.', null, 405);

} catch (Exception $e) {
    $code = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
    Database::sendJsonResponse(false, $e->getMessage(), null, $code);
}
