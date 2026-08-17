<?php

require_once __DIR__ . '/../config/database.php';

echo "========================================================\n";
echo "BALINGASAG LIBRARY - LARAGON MYSQL SEEDER & DATA LOADER\n";
echo "========================================================\n\n";

try {
    $host = getenv('DB_HOST') ?: '127.0.0.1';
    $port = getenv('DB_PORT') ?: '3306';
    $dbname = getenv('DB_DATABASE') ?: 'library_management';
    $username = getenv('DB_USERNAME') ?: 'root';
    $password = getenv('DB_PASSWORD') ?: '';

    echo "1. Connecting to MySQL on {$host}:{$port}...\n";
    $rootPdo = new PDO("mysql:host={$host};port={$port};charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    echo "2. Ensuring database `{$dbname}` exists...\n";
    $rootPdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbname}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

    $pdo = new PDO("mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    $sqlFile = __DIR__ . '/seed_laragon_all_data.sql';
    if (!file_exists($sqlFile)) {
        throw new Exception("SQL seed file not found at: {$sqlFile}");
    }

    echo "3. Reading SQL script from seed_laragon_all_data.sql...\n";
    $sqlContent = file_get_contents($sqlFile);

    // Split SQL by statements cleanly while preserving multi-lines
    echo "4. Executing database table creation and initial data seeding...\n";
    $pdo->exec($sqlContent);

    echo "\n=== SUMMARY OF INSERTED DATA ===\n";
    $tables = [
        'users' => 'Users / Members',
        'roles' => 'Roles',
        'books' => 'Catalog Books',
        'categories' => 'Book Categories',
        'authors' => 'Authors',
        'publishers' => 'Publishers',
        'borrowings' => 'Borrowing Records',
        'reservations' => 'Book Reservations',
        'fines' => 'Fine Records',
        'attendance' => 'Attendance Logs',
        'announcements' => 'Announcements',
        'notifications' => 'User Notifications',
        'favorites' => 'Book Favorites',
        'book_requests' => 'Member Book Requests',
        'activity_logs' => 'Activity Logs',
        'audit_logs' => 'Audit Trail Logs',
        'system_logs' => 'System Logs',
        'system_settings' => 'System Settings',
        'backups' => 'Database Backups',
    ];

    foreach ($tables as $t => $label) {
        $count = $pdo->query("SELECT COUNT(*) FROM `{$t}`")->fetchColumn();
        echo " - {$label} (`{$t}`): {$count} rows\n";
    }

    echo "\n✔ Database `{$dbname}` was successfully populated in Laragon MySQL!\n";
    echo "========================================================\n";

} catch (Exception $e) {
    echo "\n✖ Error populating MySQL: " . $e->getMessage() . "\n";
    exit(1);
}
