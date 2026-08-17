<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/role.php';
require_once __DIR__ . '/../models/Attendance.php';
require_once __DIR__ . '/../services/QRCodeService.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'scan';
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

try {
    $user = getAuthenticatedUser(true);

    if ($method === 'GET') {
        $filters = [];
        if ($user['role'] === 'member') {
            $filters['user_id'] = $user['id'];
        } elseif (!empty($_GET['user_id'])) {
            $filters['user_id'] = $_GET['user_id'];
        }
        if (!empty($_GET['date'])) {
            $filters['date'] = $_GET['date'];
        }
        if (!empty($_GET['status'])) {
            $filters['status'] = $_GET['status'];
        }

        $records = Attendance::getAll($filters);
        Database::sendJsonResponse(true, 'Attendance records retrieved.', ['attendance' => $records, 'total' => count($records)]);
    }

    if ($method === 'POST') {
        $targetUserId = ($user['role'] === 'member') ? $user['id'] : ($input['user_id'] ?? $user['id']);

        // Handle QR scan resolution if a raw qr_code was scanned
        if (!empty($input['qr_code'])) {
            $resolved = QRCodeService::resolveQRCode($input['qr_code']);
            if ($resolved['type'] === 'member') {
                $targetUserId = $resolved['data']['id'];
            }
        }

        if ($action === 'scan' || $action === 'checkin') {
            $res = Attendance::checkIn($targetUserId, $input['source'] ?? 'QR_KIOSK');
            Database::sendJsonResponse(true, $res['message'], ['record' => $res]);
        }

        if ($action === 'checkout') {
            $res = Attendance::checkOut($targetUserId);
            Database::sendJsonResponse(true, $res['message'], ['record' => $res]);
        }

        Database::sendJsonResponse(false, 'Invalid attendance action.', null, 400);
    }

    Database::sendJsonResponse(false, 'Method not allowed.', null, 405);

} catch (Exception $e) {
    $code = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
    Database::sendJsonResponse(false, $e->getMessage(), null, $code);
}
