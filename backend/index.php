<?php

require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/database.php';

try {
    $pdo = Database::getConnection();
    $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
    
    Database::sendJsonResponse(true, 'Balingasag Public Library System API is operational.', [
        'system' => 'Balingasag Public Library Management System',
        'status' => 'online',
        'database_driver' => $driver,
        'phase' => 'Phase 1 - Core CRUD & Auth',
        'version' => '1.0.0',
        'endpoints' => [
            '/api/auth.php' => 'POST login, register, logout; GET me',
            '/api/users.php' => 'GET, POST, PUT, DELETE user management & member approval',
            '/api/books.php' => 'GET, POST, PUT, DELETE book catalog & archiving',
            '/api/categories.php' => 'GET, POST, PUT, DELETE category CRUD',
            '/api/authors.php' => 'GET, POST, PUT, DELETE author CRUD',
            '/api/publishers.php' => 'GET, POST, PUT, DELETE publisher CRUD',
        ]
    ]);
} catch (Exception $e) {
    Database::sendJsonResponse(false, 'Backend error: ' . $e->getMessage(), null, 500);
}
