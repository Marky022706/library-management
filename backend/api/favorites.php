<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../models/Favorite.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

try {
    $user = getAuthenticatedUser(true);

    if ($method === 'GET') {
        $favorites = Favorite::getByUser($user['id']);
        Database::sendJsonResponse(true, 'Favorites retrieved.', ['favorites' => $favorites, 'total' => count($favorites)]);
    }

    if ($method === 'POST') {
        $bookId = $input['book_id'] ?? $_GET['book_id'] ?? null;
        if (empty($bookId)) {
            Database::sendJsonResponse(false, 'Book ID is required to add favorite.', null, 400);
        }

        $res = Favorite::add($user['id'], $bookId);
        Database::sendJsonResponse(true, 'Added to favorites.', ['favorite' => $res], 201);
    }

    if ($method === 'DELETE') {
        $bookId = $_GET['book_id'] ?? $_GET['id'] ?? $input['book_id'] ?? null;
        if (!$bookId) {
            Database::sendJsonResponse(false, 'Book ID is required to remove favorite.', null, 400);
        }

        $ok = Favorite::remove($user['id'], $bookId);
        Database::sendJsonResponse($ok, $ok ? 'Removed from favorites.' : 'Failed to remove favorite.');
    }

    Database::sendJsonResponse(false, 'Method not allowed.', null, 405);

} catch (Exception $e) {
    $code = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
    Database::sendJsonResponse(false, $e->getMessage(), null, $code);
}
