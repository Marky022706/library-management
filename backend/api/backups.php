<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/role.php';
require_once __DIR__ . '/../models/Backup.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';
$id = $_GET['id'] ?? null;
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

try {
    $user = getAuthenticatedUser(true);
    requireRole(['super_admin'], $user);

    if ($method === 'GET') {
        $backups = Backup::getAll();
        Database::sendJsonResponse(true, 'Backups retrieved.', ['backups' => $backups, 'total' => count($backups)]);
    }

    if ($method === 'POST') {
        if ($action === 'restore') {
            $backupId = $input['id'] ?? $id;
            if (!$backupId) {
                Database::sendJsonResponse(false, 'Backup ID is required for restore.', null, 400);
            }
            $ok = Backup::restoreBackup($backupId, $user);
            Database::sendJsonResponse($ok, 'Database restored successfully from snapshot.');
        }

        // Default: Create snapshot
        $backup = Backup::createBackup($user);
        Database::sendJsonResponse(true, 'Database snapshot created successfully.', ['backup' => $backup], 201);
    }

    if ($method === 'DELETE') {
        if (!$id) {
            Database::sendJsonResponse(false, 'Backup ID is required.', null, 400);
        }
        $ok = Backup::deleteBackup($id, $user);
        Database::sendJsonResponse($ok, 'Backup deleted successfully.');
    }

    Database::sendJsonResponse(false, 'Method not allowed.', null, 405);

} catch (Exception $e) {
    $code = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
    Database::sendJsonResponse(false, $e->getMessage(), null, $code);
}
