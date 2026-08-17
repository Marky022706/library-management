<?php

require_once __DIR__ . '/../config/database.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function parseRequestInputFromString(?string $rawBody, array $fallback = []): array {
    if (is_string($rawBody) && trim($rawBody) !== '') {
        $decoded = json_decode($rawBody, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $decoded;
        }

        parse_str($rawBody, $parsedForm);
        if (!empty($parsedForm)) {
            return $parsedForm;
        }
    }

    return is_array($fallback) ? $fallback : [];
}

function parseRequestInput(array $fallback = []): array {
    $rawBody = file_get_contents('php://input');
    if ($rawBody === false || trim((string)$rawBody) === '') {
        return is_array($fallback) ? $fallback : [];
    }

    $decoded = json_decode($rawBody, true);
    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
        return $decoded;
    }

    parse_str($rawBody, $parsedForm);
    if (!empty($parsedForm)) {
        return $parsedForm;
    }

    return is_array($fallback) ? $fallback : [];
}

function getAuthenticatedUser(bool $required = true): ?array {
    $pdo = Database::getConnection();
    $userId = null;

    // 1. Check Authorization header
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? $_SERVER['HTTP_AUTHORIZATION'] ?? null;
    
    if ($authHeader && preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        $token = trim($matches[1]);
        if (strpos($token, 'usr_token_') === 0) {
            $parts = explode('_', $token);
            $userId = $parts[2] ?? null;
        }
    }

    // 2. Check X-Session-Id header
    if (!$userId && isset($headers['X-Session-Id'])) {
        $userId = trim($headers['X-Session-Id']);
    }

    // 3. Check PHP Session
    if (!$userId && isset($_SESSION['user_id'])) {
        $userId = $_SESSION['user_id'];
    }

    if (!$userId) {
        if ($required) {
            Database::sendJsonResponse(false, 'Unauthorized. Authentication token or session missing.', null, 401);
        }
        return null;
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE user_id = :id OR id = :id_alt LIMIT 1");
    $stmt->execute(['id' => $userId, 'id_alt' => $userId]);
    $user = $stmt->fetch();

    if (!$user) {
        if ($required) {
            Database::sendJsonResponse(false, 'Invalid authentication session or user no longer exists.', null, 401);
        }
        return null;
    }

    // Hide password_hash
    unset($user['password_hash'], $user['password']);
    return $user;
}
