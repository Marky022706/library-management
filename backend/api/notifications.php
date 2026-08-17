<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../models/Notification.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'read';
$id = $_GET['id'] ?? null;
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

try {
    $user = getAuthenticatedUser(true);

    if ($method === 'GET') {
        $notifications = Notification::getAll($user['id']);
        Database::sendJsonResponse(true, 'Notifications retrieved.', ['notifications' => $notifications, 'total' => count($notifications)]);
    }

    if ($method === 'POST') {
        if ($action === 'read_all') {
            $ok = Notification::markAllAsRead($user['id']);
            Database::sendJsonResponse($ok, 'All notifications marked as read.');
        }

        if ($action === 'read') {
            $notifId = $input['id'] ?? $input['notification_id'] ?? $id;
            if (!$notifId) {
                Database::sendJsonResponse(false, 'Notification ID required.', null, 400);
            }
            $ok = Notification::markAsRead($notifId, $user['id']);
            Database::sendJsonResponse($ok, 'Notification marked as read.');
        }

        Database::sendJsonResponse(false, 'Invalid notification action.', null, 400);
    }

    Database::sendJsonResponse(false, 'Method not allowed.', null, 405);

} catch (Exception $e) {
    $code = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
    Database::sendJsonResponse(false, $e->getMessage(), null, $code);
}
