<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/role.php';
require_once __DIR__ . '/../models/User.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

try {
    if ($method === 'GET') {
        $currentUser = getAuthenticatedUser(true);

        if ($id) {
            // Member can only view their own user account unless admin
            if (!isAdmin($currentUser) && $currentUser['id'] !== $id && $currentUser['user_id'] !== $id) {
                Database::sendJsonResponse(false, 'Forbidden. Members can only view their own account details.', null, 403);
            }
            $user = User::findById($id);
            if (!$user) {
                Database::sendJsonResponse(false, 'User not found.', null, 404);
            }
            Database::sendJsonResponse(true, 'User details retrieved.', ['user' => $user]);
        } else {
            // Admin or Super Admin lists users
            requireRole(['admin', 'super_admin'], $currentUser);
            $users = User::getAll([
                'role' => $_GET['role'] ?? 'all',
                'status' => $_GET['status'] ?? 'all',
                'search' => $_GET['search'] ?? '',
            ]);
            Database::sendJsonResponse(true, 'Users retrieved successfully.', ['users' => $users, 'total' => count($users)]);
        }
    }

    if ($method === 'POST') {
        $currentUser = getAuthenticatedUser(false);
        // Public sign-up creates pending member; Admin can create users directly
        if (!empty($input['role']) && strtolower($input['role']) !== 'member') {
            if (!$currentUser) {
                Database::sendJsonResponse(false, 'Unauthorized. Login required to assign administrative roles.', null, 401);
            }
            requireRole(['super_admin'], $currentUser);
        }

        $user = User::create($input);
        require_once __DIR__ . '/../models/AuditLog.php';
        AuditLog::create([
            'user_id' => $currentUser ? $currentUser['id'] : $user['id'],
            'user_name' => $currentUser ? $currentUser['name'] : $user['name'],
            'role' => $currentUser ? $currentUser['role'] : $user['role'],
            'action' => 'User Created',
            'module' => 'User Management',
            'target_id' => $user['id'],
            'description' => "Created account for {$user['name']} ({$user['email']}) with role {$user['role']}"
        ]);
        Database::sendJsonResponse(true, 'User created successfully.', ['user' => $user], 201);
    }

    if ($method === 'PUT' || $method === 'PATCH') {
        $currentUser = getAuthenticatedUser(true);
        if (!$id) {
            Database::sendJsonResponse(false, 'User ID is required for update.', null, 400);
        }

        // Member cannot edit another user's profile
        if (!isAdmin($currentUser) && $currentUser['id'] !== $id && $currentUser['user_id'] !== $id) {
            Database::sendJsonResponse(false, 'Forbidden. Members can only update their own profile.', null, 403);
        }

        // Member cannot change their own role or status
        if (!isAdmin($currentUser)) {
            unset($input['role'], $input['status']);
        }

        // Only super_admin can assign super_admin or admin roles
        if (isset($input['role']) && !isSuperAdmin($currentUser)) {
            unset($input['role']);
        }

        $updatedUser = User::update($id, $input);
        require_once __DIR__ . '/../models/AuditLog.php';
        AuditLog::create([
            'user_id' => $currentUser['id'],
            'user_name' => $currentUser['name'],
            'role' => $currentUser['role'],
            'action' => 'User Updated',
            'module' => 'User Management',
            'target_id' => $id,
            'description' => "Updated user profile / status for {$updatedUser['name']} ({$updatedUser['email']})"
        ]);
        Database::sendJsonResponse(true, 'User updated successfully.', ['user' => $updatedUser]);
    }

    if ($method === 'DELETE') {
        $currentUser = getAuthenticatedUser(true);
        requireRole(['admin', 'super_admin'], $currentUser);

        if (!$id) {
            Database::sendJsonResponse(false, 'User ID is required for deactivation.', null, 400);
        }

        $isPermanent = !empty($_GET['permanent']) && isSuperAdmin($currentUser);
        require_once __DIR__ . '/../models/AuditLog.php';

        if ($isPermanent) {
            $success = User::deletePermanent($id);
            AuditLog::create([
                'user_id' => $currentUser['id'],
                'user_name' => $currentUser['name'],
                'role' => $currentUser['role'],
                'action' => 'User Permanently Deleted',
                'module' => 'User Management',
                'target_id' => $id,
                'description' => "Permanently deleted user record ID {$id}"
            ]);
            Database::sendJsonResponse($success, 'User account permanently deleted.');
        } else {
            $success = User::softDelete($id);
            AuditLog::create([
                'user_id' => $currentUser['id'],
                'user_name' => $currentUser['name'],
                'role' => $currentUser['role'],
                'action' => 'User Deactivated',
                'module' => 'User Management',
                'target_id' => $id,
                'description' => "Deactivated user account ID {$id}"
            ]);
            Database::sendJsonResponse($success, 'User account deactivated successfully.');
        }
    }

    Database::sendJsonResponse(false, 'Method not allowed.', null, 405);

} catch (Exception $e) {
    $code = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
    Database::sendJsonResponse(false, $e->getMessage(), null, $code);
}
