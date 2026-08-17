<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/role.php';
require_once __DIR__ . '/../models/Publisher.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

try {
    if ($method === 'GET') {
        if ($id) {
            $publisher = Publisher::findById($id);
            if (!$publisher) Database::sendJsonResponse(false, 'Publisher not found.', null, 404);
            Database::sendJsonResponse(true, 'Publisher retrieved.', ['publisher' => $publisher]);
        } else {
            $publishers = Publisher::getAll(['search' => $_GET['search'] ?? '']);
            Database::sendJsonResponse(true, 'Publishers retrieved.', ['publishers' => $publishers]);
        }
    }

    if ($method === 'POST') {
        $currentUser = getAuthenticatedUser(true);
        requireRole(['admin', 'super_admin'], $currentUser);
        $publisher = Publisher::create($input);
        Database::sendJsonResponse(true, 'Publisher created successfully.', ['publisher' => $publisher], 201);
    }

    if ($method === 'PUT' || $method === 'PATCH') {
        $currentUser = getAuthenticatedUser(true);
        requireRole(['admin', 'super_admin'], $currentUser);
        if (!$id) Database::sendJsonResponse(false, 'Publisher ID required.', null, 400);
        $publisher = Publisher::update($id, $input);
        Database::sendJsonResponse(true, 'Publisher updated successfully.', ['publisher' => $publisher]);
    }

    if ($method === 'DELETE') {
        $currentUser = getAuthenticatedUser(true);
        requireRole(['admin', 'super_admin'], $currentUser);
        if (!$id) Database::sendJsonResponse(false, 'Publisher ID required.', null, 400);
        $success = Publisher::delete($id);
        Database::sendJsonResponse($success, 'Publisher deleted successfully.');
    }

    Database::sendJsonResponse(false, 'Method not allowed.', null, 405);
} catch (Exception $e) {
    $code = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
    Database::sendJsonResponse(false, $e->getMessage(), null, $code);
}
