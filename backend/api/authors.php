<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/role.php';
require_once __DIR__ . '/../models/Author.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

try {
    if ($method === 'GET') {
        if ($id) {
            $author = Author::findById($id);
            if (!$author) Database::sendJsonResponse(false, 'Author not found.', null, 404);
            Database::sendJsonResponse(true, 'Author retrieved.', ['author' => $author]);
        } else {
            $authors = Author::getAll(['search' => $_GET['search'] ?? '']);
            Database::sendJsonResponse(true, 'Authors retrieved.', ['authors' => $authors]);
        }
    }

    if ($method === 'POST') {
        $currentUser = getAuthenticatedUser(true);
        requireRole(['admin', 'super_admin'], $currentUser);
        $author = Author::create($input);
        Database::sendJsonResponse(true, 'Author created successfully.', ['author' => $author], 201);
    }

    if ($method === 'PUT' || $method === 'PATCH') {
        $currentUser = getAuthenticatedUser(true);
        requireRole(['admin', 'super_admin'], $currentUser);
        if (!$id) Database::sendJsonResponse(false, 'Author ID required.', null, 400);
        $author = Author::update($id, $input);
        Database::sendJsonResponse(true, 'Author updated successfully.', ['author' => $author]);
    }

    if ($method === 'DELETE') {
        $currentUser = getAuthenticatedUser(true);
        requireRole(['admin', 'super_admin'], $currentUser);
        if (!$id) Database::sendJsonResponse(false, 'Author ID required.', null, 400);
        $success = Author::delete($id);
        Database::sendJsonResponse($success, 'Author deleted successfully.');
    }

    Database::sendJsonResponse(false, 'Method not allowed.', null, 405);
} catch (Exception $e) {
    $code = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
    Database::sendJsonResponse(false, $e->getMessage(), null, $code);
}
