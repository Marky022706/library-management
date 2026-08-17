<?php

require_once __DIR__ . '/../config/database.php';

function normalizeRole(string $role): string {
    $r = strtolower(trim($role));
    if ($r === 'superadmin' || $r === 'super_admin') return 'super_admin';
    if ($r === 'admin') return 'admin';
    return 'member';
}

function requireRole(array $allowedRoles, array $user): void {
    $userRole = normalizeRole($user['role'] ?? 'member');
    $normalizedAllowed = array_map('normalizeRole', $allowedRoles);

    if (!in_array($userRole, $normalizedAllowed, true)) {
        Database::sendJsonResponse(
            false,
            'Forbidden. You do not have permission to perform this action.',
            null,
            403
        );
    }
}

function isSuperAdmin(array $user): bool {
    return normalizeRole($user['role'] ?? '') === 'super_admin';
}

function isAdmin(array $user): bool {
    $r = normalizeRole($user['role'] ?? '');
    return $r === 'admin' || $r === 'super_admin';
}
