<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/role.php';
require_once __DIR__ . '/../models/Announcement.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

try {
    if ($method === 'GET') {
        $onlyPublished = !isset($_GET['all']) && !isset($_GET['status']);
        $announcements = Announcement::getAll($onlyPublished);
        Database::sendJsonResponse(true, 'Announcements retrieved.', ['announcements' => $announcements, 'total' => count($announcements)]);
    }

    $user = getAuthenticatedUser(true);
    requireRole(['admin', 'super_admin'], $user);

    if ($method === 'POST') {
        if (empty($input['title']) || empty($input['content'])) {
            Database::sendJsonResponse(false, 'Title and content are required.', null, 400);
        }

        $res = Announcement::create($input, $user);
        Database::sendJsonResponse(true, 'Announcement created successfully.', ['announcement' => $res], 201);
    }

    if ($method === 'PUT' || $method === 'PATCH') {
        if (!$id) {
            Database::sendJsonResponse(false, 'Announcement ID is required for update.', null, 400);
        }

        $res = Announcement::update($id, $input);
        Database::sendJsonResponse(true, 'Announcement updated successfully.', ['announcement' => $res]);
    }

    if ($method === 'DELETE') {
        if (!$id) {
            Database::sendJsonResponse(false, 'Announcement ID is required for deletion.', null, 400);
        }

        $ok = Announcement::delete($id);
        Database::sendJsonResponse($ok, 'Announcement deleted successfully.');
    }

    Database::sendJsonResponse(false, 'Method not allowed.', null, 405);

} catch (Exception $e) {
    $code = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
    Database::sendJsonResponse(false, $e->getMessage(), null, $code);
}
