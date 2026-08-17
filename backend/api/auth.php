<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/ActivityLog.php';
require_once __DIR__ . '/../models/AuditLog.php';

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
if (!empty($input['action'])) {
    $action = $input['action'];
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($action === 'login' && $method === 'POST') {
        $email = trim($input['email'] ?? $input['username'] ?? '');
        $password = $input['password'] ?? '';

        if (empty($email) || empty($password)) {
            Database::sendJsonResponse(false, 'Email/username and password are required.', null, 400);
        }

        $user = User::findByEmail($email);
        if (!$user) {
            // Check username if email match fails
            $pdo = Database::getConnection();
            $stmt = $pdo->prepare("SELECT * FROM users WHERE LOWER(username) = :u LIMIT 1");
            $stmt->execute(['u' => strtolower($email)]);
            $user = $stmt->fetch();
        }

        if (!$user) {
            Database::sendJsonResponse(false, 'No account found with that email or username.', null, 401);
        }

        if (!password_verify($password, $user['password_hash'] ?? '')) {
            Database::sendJsonResponse(false, 'Invalid credentials. Password incorrect.', null, 401);
        }

        $status = strtolower($user['status'] ?? 'pending');
        if ($status === 'pending') {
            Database::sendJsonResponse(false, 'This account is still pending approval. An administrator must approve your application before you can sign in.', null, 403);
        }
        if (in_array($status, ['suspended', 'inactive', 'deactivated'], true)) {
            Database::sendJsonResponse(false, 'This account has been ' . $status . '. Please contact a library administrator.', null, 403);
        }

        // Create authentication session & token
        if (session_status() === PHP_SESSION_NONE) session_start();
        $_SESSION['user_id'] = $user['id'];

        $token = 'usr_token_' . $user['id'];
        unset($user['password_hash'], $user['password']);

        Database::sendJsonResponse(true, 'Login successful.', [
            'user' => $user,
            'token' => $token,
            'role' => $user['role'],
        ]);
    }

    if ($action === 'change_password' && $method === 'POST') {
        $currentUser = getAuthenticatedUser(true);
        $oldPassword = $input['old_password'] ?? $input['current_password'] ?? '';
        $newPassword = $input['new_password'] ?? $input['password'] ?? '';

        if (empty($newPassword) || strlen($newPassword) < 8) {
            Database::sendJsonResponse(false, 'New password must be at least 8 characters long.', null, 400);
        }

        // Fetch user with password hash
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id OR user_id = :user_id LIMIT 1");
        $stmt->execute(['id' => $currentUser['id'], 'user_id' => $currentUser['id']]);
        $userRow = $stmt->fetch();

        if (!$userRow || !password_verify($oldPassword, $userRow['password_hash'] ?? '')) {
            Database::sendJsonResponse(false, 'Current password is incorrect.', null, 400);
        }

        $newHash = password_hash($newPassword, PASSWORD_BCRYPT);
        $upStmt = $pdo->prepare("UPDATE users SET password_hash = :h, updated_at = NOW() WHERE id = :id OR user_id = :user_id");
        $upStmt->execute(['h' => $newHash, 'id' => $currentUser['id'], 'user_id' => $currentUser['id']]);

        ActivityLog::record($currentUser['id'], 'Password changed', 'Account security', 'security');
        AuditLog::create([
            'user_id' => $currentUser['id'],
            'user_name' => $currentUser['name'],
            'role' => $currentUser['role'],
            'action' => 'Password Change',
            'module' => 'Authentication',
            'description' => 'User changed account password'
        ]);

        Database::sendJsonResponse(true, 'Password updated successfully.');
    }

    if ($action === 'forgot_password' && $method === 'POST') {
        $email = strtolower(trim($input['email'] ?? ''));
        if (empty($email)) {
            Database::sendJsonResponse(false, 'Email is required.', null, 400);
        }

        $user = User::findByEmail($email);
        if (!$user) {
            // Return success anyway to avoid user enumeration
            Database::sendJsonResponse(true, 'If the email exists in our system, a password reset link has been dispatched.', ['email' => $email]);
        }

        // Generate 6-digit reset code
        $resetCode = str_pad((string)random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
        $resetToken = bin2hex(random_bytes(16));

        Database::sendJsonResponse(true, 'Password reset instructions have been generated.', [
            'email' => $email,
            'reset_code' => $resetCode,
            'reset_token' => $resetToken,
            'expires_in' => '15 minutes'
        ]);
    }

    if ($action === 'reset_password' && $method === 'POST') {
        $email = strtolower(trim($input['email'] ?? ''));
        $newPassword = $input['new_password'] ?? $input['password'] ?? '';

        if (empty($email) || empty($newPassword) || strlen($newPassword) < 8) {
            Database::sendJsonResponse(false, 'Valid email and new password (min 8 chars) required.', null, 400);
        }

        $user = User::findByEmail($email);
        if (!$user) {
            Database::sendJsonResponse(false, 'User not found.', null, 404);
        }

        $pdo = Database::getConnection();
        $newHash = password_hash($newPassword, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("UPDATE users SET password_hash = :h, updated_at = NOW() WHERE LOWER(email) = :email");
        $stmt->execute(['h' => $newHash, 'email' => $email]);

        Database::sendJsonResponse(true, 'Password has been successfully reset. You can now log in.');
    }

    if ($action === 'register' && $method === 'POST') {
        $user = User::create($input);
        ActivityLog::record($user['id'], 'Member Registered', 'Registration Application', 'account');
        AuditLog::create([
            'user_id' => $user['id'],
            'user_name' => $user['name'],
            'role' => $user['role'],
            'action' => 'Member Registration',
            'module' => 'User Management',
            'description' => "New member registered with email {$user['email']}"
        ]);
        Database::sendJsonResponse(true, 'Registration submitted. Account is pending administrator approval.', [
            'user' => $user
        ], 201);
    }

    if ($action === 'logout' && $method === 'POST') {
        if (session_status() === PHP_SESSION_NONE) session_start();
        $user = getAuthenticatedUser(false);
        if ($user) {
            ActivityLog::record($user['id'], 'Logged out', 'Session terminated', 'auth');
        }
        session_destroy();
        Database::sendJsonResponse(true, 'Logged out successfully.');
    }

    if (($action === 'me' || empty($action)) && $method === 'GET') {
        $user = getAuthenticatedUser(true);
        Database::sendJsonResponse(true, 'User authenticated.', ['user' => $user]);
    }

    Database::sendJsonResponse(false, 'Invalid auth endpoint or action.', null, 400);

} catch (Exception $e) {
    $code = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
    Database::sendJsonResponse(false, $e->getMessage(), null, $code);
}
