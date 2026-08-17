<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/role.php';
require_once __DIR__ . '/../models/Category.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

try {
    if ($method === 'GET') {
        if ($id) {
            $category = Category::findById($id);
            if (!$category) Database::sendJsonResponse(false, 'Category not found.', null, 404);
            Database::sendJsonResponse(true, 'Category retrieved.', ['category' => $category]);
        } else {
            $categories = Category::getAll(['search' => $_GET['search'] ?? '']);
            Database::sendJsonResponse(true, 'Categories retrieved.', ['categories' => $categories]);
        }
    }

    if ($method === 'POST') {
        $currentUser = getAuthenticatedUser(true);
        requireRole(['admin', 'super_admin'], $currentUser);
        $category = Category::create($input);
        Database::sendJsonResponse(true, 'Category created successfully.', ['category' => $category], 201);
    }

    if ($method === 'PUT' || $method === 'PATCH') {
        $currentUser = getAuthenticatedUser(true);
        requireRole(['admin', 'super_admin'], $currentUser);
        if (!$id) Database::sendJsonResponse(false, 'Category ID required.', null, 400);
        $category = Category::update($id, $input);
        Database::sendJsonResponse(true, 'Category updated successfully.', ['category' => $category]);
    }

    if ($method === 'DELETE') {
        $currentUser = getAuthenticatedUser(true);
        requireRole(['admin', 'super_admin'], $currentUser);
        if (!$id) Database::sendJsonResponse(false, 'Category ID required.', null, 400);
        $success = Category::delete($id);
        Database::sendJsonResponse($success, 'Category deleted successfully.');
    }

    Database::sendJsonResponse(false, 'Method not allowed.', null, 405);
} catch (Exception $e) {
    $code = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
    Database::sendJsonResponse(false, $e->getMessage(), null, $code);
}
