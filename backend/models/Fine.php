<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/AuditLog.php';
require_once __DIR__ . '/Notification.php';

class Fine {
    public static function getAll(array $filters = []): array {
        $pdo = Database::getConnection();
        $sql = "SELECT f.*, u.name as user_name, u.email as user_email, u.student_id,
                       bk.title as book_title
                FROM fines f
                LEFT JOIN users u ON f.user_id = u.id
                LEFT JOIN borrowings b ON f.borrowing_id = b.id
                LEFT JOIN books bk ON b.book_id = bk.id
                WHERE 1=1";
        $params = [];

        if (!empty($filters['user_id'])) {
            $sql .= " AND f.user_id = :user_id";
            $params[':user_id'] = $filters['user_id'];
        }
        if (!empty($filters['status'])) {
            $sql .= " AND f.status = :status";
            $params[':status'] = $filters['status'];
        }

        $sql .= " ORDER BY f.created_at DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function pay(string $id, ?array $adminUser = null): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE fines SET status = 'paid', paid_at = NOW(), processed_by = :proc, updated_at = NOW() WHERE id = :id");
        $stmt->execute([':proc' => $adminUser['id'] ?? null, ':id' => $id]);

        $fine = $pdo->query("SELECT f.*, u.name as user_name FROM fines f LEFT JOIN users u ON f.user_id = u.id WHERE f.id = '$id'")->fetch(PDO::FETCH_ASSOC);
        
        Notification::create([
            'user_id' => $fine['user_id'],
            'title' => 'Fine Payment Settled',
            'message' => 'Your fine payment of PHP ' . number_format($fine['amount'], 2) . ' has been recorded.',
            'type' => 'success',
        ]);

        AuditLog::create([
            'user_id' => $adminUser['id'] ?? 'system',
            'user_name' => $adminUser['name'] ?? 'Admin',
            'role' => $adminUser['role'] ?? 'admin',
            'action' => 'Collect Fine',
            'module' => 'Fines',
            'target_id' => $id,
            'description' => 'Marked fine PHP ' . $fine['amount'] . ' as paid for ' . ($fine['user_name'] ?? 'member'),
        ]);

        return $fine;
    }

    public static function waive(string $id, ?array $adminUser = null): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE fines SET status = 'waived', processed_by = :proc, updated_at = NOW() WHERE id = :id");
        $stmt->execute([':proc' => $adminUser['id'] ?? null, ':id' => $id]);

        $fine = $pdo->query("SELECT f.*, u.name as user_name FROM fines f LEFT JOIN users u ON f.user_id = u.id WHERE f.id = '$id'")->fetch(PDO::FETCH_ASSOC);

        AuditLog::create([
            'user_id' => $adminUser['id'] ?? 'system',
            'user_name' => $adminUser['name'] ?? 'Admin',
            'role' => $adminUser['role'] ?? 'admin',
            'action' => 'Waive Fine',
            'module' => 'Fines',
            'target_id' => $id,
            'description' => 'Waived fine PHP ' . $fine['amount'] . ' for ' . ($fine['user_name'] ?? 'member'),
        ]);

        return $fine;
    }
}
