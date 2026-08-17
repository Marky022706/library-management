<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/role.php';
require_once __DIR__ . '/../models/SystemLog.php';

try {
    $user = getAuthenticatedUser(true);
    requireRole(['super_admin'], $user);

    $filters = [];
    if (!empty($_GET['level'])) $filters['level'] = $_GET['level'];
    if (!empty($_GET['channel'])) $filters['channel'] = $_GET['channel'];

    $logs = SystemLog::getAll($filters);
    Database::sendJsonResponse(true, 'System logs retrieved.', ['logs' => $logs, 'total' => count($logs)]);
} catch (Exception $e) {
    $code = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
    Database::sendJsonResponse(false, $e->getMessage(), null, $code);
}
