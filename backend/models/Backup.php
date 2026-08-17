<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/AuditLog.php';

class Backup {
    public static function getAll(): array {
        $pdo = Database::getConnection();
        return $pdo->query("SELECT * FROM backups ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function createBackup(?array $adminUser = null): array {
        $pdo = Database::getConnection();
        $id = 'bkp-' . date('Ymd-His');
        $filename = "balingasag_backup_" . date('Ymd_His') . ".sql";
        $backupDir = __DIR__ . '/../storage/backups';

        if (!is_dir($backupDir)) {
            mkdir($backupDir, 0777, true);
        }

        $tables = [
            'roles', 'users', 'categories', 'authors', 'publishers', 'books',
            'borrowings', 'reservations', 'fines', 'attendance', 'notifications',
            'announcements', 'favorites', 'book_requests', 'activity_logs',
            'audit_logs', 'system_logs', 'recycle_bin', 'system_settings', 'backups'
        ];

        $dump = "-- Balingasag Public Library MySQL Database Backup\n";
        $dump .= "-- Generated at: " . date('Y-m-d H:i:s') . "\n\n";

        foreach ($tables as $t) {
            try {
                $rows = $pdo->query("SELECT * FROM $t")->fetchAll(PDO::FETCH_ASSOC);
                $dump .= "-- Table: $t\n";
                foreach ($rows as $r) {
                    $cols = array_keys($r);
                    $vals = array_map(function($v) use ($pdo) {
                        return ($v === null) ? 'NULL' : $pdo->quote($v);
                    }, array_values($r));
                    $dump .= "INSERT INTO $t (" . implode(', ', $cols) . ") VALUES (" . implode(', ', $vals) . ");\n";
                }
                $dump .= "\n";
            } catch (Exception $e) {}
        }

        $filePath = $backupDir . '/' . $filename;
        file_put_contents($filePath, $dump);
        $fileSize = round(filesize($filePath) / 1024, 2) . ' KB';

        $stmt = $pdo->prepare("INSERT INTO backups (id, filename, file_size, total_tables, status, created_by, created_at)
            VALUES (:id, :fn, :fs, :tt, 'Success', :cb, NOW())");
        $stmt->execute([
            ':id' => $id,
            ':fn' => $filename,
            ':fs' => $fileSize,
            ':tt' => count($tables),
            ':cb' => $adminUser['name'] ?? 'Super Admin',
        ]);

        AuditLog::create([
            'user_id' => $adminUser['id'] ?? 'system',
            'user_name' => $adminUser['name'] ?? 'Super Admin',
            'role' => $adminUser['role'] ?? 'super_admin',
            'action' => 'Backup Database',
            'module' => 'System',
            'target_id' => $filename,
            'description' => "Created full database backup {$filename} ({$fileSize})",
        ]);

        return [
            'id' => $id,
            'filename' => $filename,
            'file_size' => $fileSize,
            'total_tables' => count($tables),
            'status' => 'Success',
            'created_at' => date('Y-m-d H:i:s'),
        ];
    }

    public static function restoreBackup(string $id, ?array $adminUser = null): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM backups WHERE id = :id OR filename = :fn LIMIT 1");
        $stmt->execute([':id' => $id, ':fn' => $id]);
        $backup = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$backup) {
            throw new Exception("Backup record not found.", 404);
        }

        $filePath = __DIR__ . '/../storage/backups/' . $backup['filename'];
        if (file_exists($filePath)) {
            $sql = file_get_contents($filePath);
            if (!empty($sql)) {
                $pdo->exec($sql);
            }
        }

        AuditLog::create([
            'user_id' => $adminUser['id'] ?? 'system',
            'user_name' => $adminUser['name'] ?? 'Super Admin',
            'role' => $adminUser['role'] ?? 'super_admin',
            'action' => 'Restore Database',
            'module' => 'System',
            'target_id' => $backup['filename'],
            'description' => "Restored database from snapshot {$backup['filename']}",
        ]);

        return true;
    }

    public static function deleteBackup(string $id, ?array $adminUser = null): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM backups WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $backup = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($backup) {
            $filePath = __DIR__ . '/../storage/backups/' . $backup['filename'];
            if (file_exists($filePath)) {
                @unlink($filePath);
            }
            $delStmt = $pdo->prepare("DELETE FROM backups WHERE id = :id");
            $delStmt->execute([':id' => $id]);
        }
        return true;
    }
}
