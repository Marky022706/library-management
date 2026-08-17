<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/role.php';
require_once __DIR__ . '/../models/AuditLog.php';

try {
    $user = getAuthenticatedUser(true);
    requireRole(['admin', 'super_admin'], $user);

    $filters = [];
    if (!empty($_GET['module'])) $filters['module'] = $_GET['module'];
    if (!empty($_GET['search'])) $filters['search'] = $_GET['search'];

    $logs = AuditLog::getAll($filters);
    Database::sendJsonResponse(true, 'Audit logs retrieved.', ['logs' => $logs, 'total' => count($logs)]);
} catch (Exception $e) {
    $code = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
    Database::sendJsonResponse(false, $e->getMessage(), null, $code);
}
