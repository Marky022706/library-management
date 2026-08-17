<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../services/QRCodeService.php';

$method = $_SERVER['REQUEST_METHOD'];
$type = $_GET['type'] ?? 'member';
$id = $_GET['id'] ?? null;
$qrCode = $_GET['code'] ?? $_GET['qr'] ?? null;

try {
    $user = getAuthenticatedUser(true);

    if ($qrCode) {
        $resolved = QRCodeService::resolveQRCode($qrCode);
        Database::sendJsonResponse(true, 'QR Code resolved.', $resolved);
    }

    $targetId = $id ?? $user['id'];

    if ($type === 'member') {
        $qrData = QRCodeService::generateMemberQR($targetId);
        Database::sendJsonResponse(true, 'Member QR generated.', ['qr_code' => $qrData, 'user_id' => $targetId]);
    }

    if ($type === 'book') {
        $qrData = QRCodeService::generateBookQR($targetId);
        Database::sendJsonResponse(true, 'Book QR generated.', ['qr_code' => $qrData, 'accession_number' => $targetId]);
    }

    Database::sendJsonResponse(false, 'Invalid QR request type.', null, 400);

} catch (Exception $e) {
    $code = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
    Database::sendJsonResponse(false, $e->getMessage(), null, $code);
}
