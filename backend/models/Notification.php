<?php

require_once __DIR__ . '/../config/database.php';

class Notification {
    public static function getAll(string $userId): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM notifications WHERE user_id = :user_id ORDER BY created_at DESC");
        $stmt->execute([':user_id' => $userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function create(array $data): array {
        $pdo = Database::getConnection();
        $id = $data['id'] ?? ('notif-' . substr(bin2hex(random_bytes(6)), 0, 8));
        $stmt = $pdo->prepare("INSERT INTO notifications (id, user_id, title, message, type, read_status, created_at)
            VALUES (:id, :user_id, :title, :message, :type, 0, NOW())");
        $stmt->execute([
            ':id' => $id,
            ':user_id' => $data['user_id'],
            ':title' => $data['title'],
            ':message' => $data['message'],
            ':type' => $data['type'] ?? 'info',
        ]);
        return [
            'id' => $id,
            'user_id' => $data['user_id'],
            'title' => $data['title'],
            'message' => $data['message'],
            'type' => $data['type'] ?? 'info',
            'read_status' => 0,
            'created_at' => date('Y-m-d H:i:s'),
        ];
    }

    public static function markAsRead(string $id, string $userId): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE notifications SET read_status = 1 WHERE id = :id AND user_id = :user_id");
        return $stmt->execute([':id' => $id, ':user_id' => $userId]);
    }

    public static function markAllAsRead(string $userId): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE notifications SET read_status = 1 WHERE user_id = :user_id");
        return $stmt->execute([':user_id' => $userId]);
    }
}
