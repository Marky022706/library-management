<?php

require_once __DIR__ . '/../config/database.php';

class ActivityLog {
    public static function getByUser(string $userId): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM activity_logs WHERE user_id = :uid ORDER BY created_at DESC LIMIT 50");
        $stmt->execute([':uid' => $userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function record(string $userId, string $action, ?string $target = null, string $type = 'general'): void {
        try {
            $pdo = Database::getConnection();
            $id = 'act-' . substr(bin2hex(random_bytes(6)), 0, 8);
            $stmt = $pdo->prepare("INSERT INTO activity_logs (id, user_id, action, target, activity_type, created_at)
                VALUES (:id, :uid, :act, :tgt, :typ, NOW())");
            $stmt->execute([
                ':id' => $id,
                ':uid' => $userId,
                ':act' => $action,
                ':tgt' => $target,
                ':typ' => $type,
            ]);
        } catch (Exception $e) {}
    }
}
