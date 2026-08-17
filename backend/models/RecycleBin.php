<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/AuditLog.php';

class RecycleBin {
    public static function getAll(): array {
        $pdo = Database::getConnection();
        return $pdo->query("SELECT * FROM recycle_bin ORDER BY deleted_at DESC")->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function moveToBin(string $itemId, string $itemType, string $itemName, ?array $payload, string $deletedBy): string {
        $pdo = Database::getConnection();
        $id = 'bin-' . substr(bin2hex(random_bytes(6)), 0, 8);
        $stmt = $pdo->prepare("INSERT INTO recycle_bin (id, item_id, item_type, item_name, deleted_by, data_payload, deleted_at)
            VALUES (:id, :item_id, :type, :name, :by, :payload, NOW())");
        $stmt->execute([
            ':id' => $id,
            ':item_id' => $itemId,
            ':type' => $itemType,
            ':name' => $itemName,
            ':by' => $deletedBy,
            ':payload' => $payload ? json_encode($payload) : null,
        ]);
        return $id;
    }

    public static function restore(string $binId, ?array $adminUser = null): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM recycle_bin WHERE id = :id");
        $stmt->execute([':id' => $binId]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$item) return false;

        $type = $item['item_type'];
        $itemId = $item['item_id'];

        if ($type === 'book') {
            $pdo->prepare("UPDATE books SET status = 'active' WHERE id = :id")->execute([':id' => $itemId]);
        } elseif ($type === 'user') {
            $pdo->prepare("UPDATE users SET status = 'active' WHERE id = :id")->execute([':id' => $itemId]);
        }

        $pdo->prepare("DELETE FROM recycle_bin WHERE id = :id")->execute([':id' => $binId]);

        AuditLog::create([
            'user_id' => $adminUser['id'] ?? 'system',
            'user_name' => $adminUser['name'] ?? 'Super Admin',
            'role' => $adminUser['role'] ?? 'super_admin',
            'action' => 'Restore Item',
            'module' => 'Recycle Bin',
            'target_id' => $itemId,
            'description' => 'Restored ' . $type . ' ' . $item['item_name'] . ' from Recycle Bin',
        ]);

        return true;
    }

    public static function purge(string $binId, ?array $adminUser = null): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM recycle_bin WHERE id = :id");
        $stmt->execute([':id' => $binId]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$item) return false;

        $type = $item['item_type'];
        $itemId = $item['item_id'];

        if ($type === 'book') {
            $pdo->prepare("DELETE FROM books WHERE id = :id")->execute([':id' => $itemId]);
        } elseif ($type === 'user') {
            $pdo->prepare("DELETE FROM users WHERE id = :id")->execute([':id' => $itemId]);
        }

        $pdo->prepare("DELETE FROM recycle_bin WHERE id = :id")->execute([':id' => $binId]);

        AuditLog::create([
            'user_id' => $adminUser['id'] ?? 'system',
            'user_name' => $adminUser['name'] ?? 'Super Admin',
            'role' => $adminUser['role'] ?? 'super_admin',
            'action' => 'Purge Record Permanently',
            'module' => 'Recycle Bin',
            'target_id' => $itemId,
            'description' => 'Permanently purged ' . $type . ' ' . $item['item_name'] . ' from database',
        ]);

        return true;
    }
}
