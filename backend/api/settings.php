<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/role.php';
require_once __DIR__ . '/../models/SystemSetting.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

try {
    $user = getAuthenticatedUser(true);

    if ($method === 'GET') {
        $settings = SystemSetting::getAll();
        Database::sendJsonResponse(true, 'Settings retrieved.', ['settings' => $settings, 'total' => count($settings)]);
    }

    if ($method === 'PUT' || $method === 'POST') {
        requireRole(['super_admin'], $user);

        if (empty($input['key']) || !isset($input['value'])) {
            Database::sendJsonResponse(false, 'Key and value are required.', null, 400);
        }

        $ok = SystemSetting::update($input['key'], (string) $input['value'], $user);
        Database::sendJsonResponse($ok, 'Setting updated successfully.');
    }

    Database::sendJsonResponse(false, 'Method not allowed.', null, 405);

} catch (Exception $e) {
    $code = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
    Database::sendJsonResponse(false, $e->getMessage(), null, $code);
}
