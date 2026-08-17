<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../models/ActivityLog.php';

try {
    $user = getAuthenticatedUser(true);
    $logs = ActivityLog::getByUser($user['id']);
    Database::sendJsonResponse(true, 'Activity logs retrieved.', ['logs' => $logs, 'total' => count($logs)]);
} catch (Exception $e) {
    $code = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
    Database::sendJsonResponse(false, $e->getMessage(), null, $code);
}
