<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/Notification.php';
require_once __DIR__ . '/AuditLog.php';

class Reservation {
    public static function getAll(array $filters = []): array {
        $pdo = Database::getConnection();
        $sql = "SELECT r.*, u.name as user_name, u.email as user_email, u.student_id, 
                       bk.title as book_title, bk.author as book_author, bk.cover_color
                FROM reservations r
                LEFT JOIN users u ON r.user_id = u.id
                LEFT JOIN books bk ON r.book_id = bk.id
                WHERE 1=1";
        $params = [];

        if (!empty($filters['user_id'])) {
            $sql .= " AND r.user_id = :user_id";
            $params[':user_id'] = $filters['user_id'];
        }
        if (!empty($filters['status'])) {
            $sql .= " AND r.status = :status";
            $params[':status'] = $filters['status'];
        }
        if (!empty($filters['book_id'])) {
            $sql .= " AND r.book_id = :book_id";
            $params[':book_id'] = $filters['book_id'];
        }

        $sql .= " ORDER BY r.created_at DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function getById(string $id): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT r.*, u.name as user_name, bk.title as book_title
                               FROM reservations r
                               LEFT JOIN users u ON r.user_id = u.id
                               LEFT JOIN books bk ON r.book_id = bk.id
                               WHERE r.id = :id");
        $stmt->execute([':id' => $id]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        return $res ?: null;
    }

    public static function create(array $data, ?array $currentUser = null): array {
        $pdo = Database::getConnection();
        $id = $data['id'] ?? ('res-' . substr(bin2hex(random_bytes(6)), 0, 8));
        $reservedDate = $data['reserved_date'] ?? date('Y-m-d');

        // Prevent duplicate active reservation for same user and book
        $check = $pdo->prepare("SELECT id FROM reservations WHERE user_id = :user_id AND book_id = :book_id AND status IN ('pending', 'ready_for_pickup')");
        $check->execute([':user_id' => $data['user_id'], ':book_id' => $data['book_id']]);
        if ($check->fetch()) {
            throw new Exception("You already have an active reservation hold for this title.");
        }

        $stmt = $pdo->prepare("INSERT INTO reservations (id, user_id, book_id, reserved_date, status, created_at, updated_at)
            VALUES (:id, :user_id, :book_id, :reserved_date, 'pending', NOW(), NOW())");
        $stmt->execute([
            ':id' => $id,
            ':user_id' => $data['user_id'],
            ':book_id' => $data['book_id'],
            ':reserved_date' => $reservedDate,
        ]);

        Notification::create([
            'user_id' => $data['user_id'],
            'title' => 'Reservation Hold Placed',
            'message' => 'Your reservation hold has been queued. You will be notified when a copy becomes available for pickup.',
            'type' => 'reservation',
        ]);

        return self::getById($id);
    }

    public static function updateStatus(string $id, string $status, ?string $pickupDeadline = null): array {
        $pdo = Database::getConnection();
        $res = self::getById($id);
        if (!$res) {
            throw new Exception("Reservation not found.");
        }

        $stmt = $pdo->prepare("UPDATE reservations SET status = :status, pickup_deadline = :deadline, updated_at = NOW() WHERE id = :id");
        $stmt->execute([
            ':status' => $status,
            ':deadline' => $pickupDeadline,
            ':id' => $id,
        ]);

        if ($status === 'ready_for_pickup') {
            Notification::create([
                'user_id' => $res['user_id'],
                'title' => 'Reservation Ready for Pickup',
                'message' => 'Your copy of "' . $res['book_title'] . '" is now ready at the circulation counter' . ($pickupDeadline ? " until {$pickupDeadline}." : "."),
                'type' => 'reservation',
            ]);
        }

        return self::getById($id);
    }

    public static function cancel(string $id, string $userId): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE reservations SET status = 'cancelled', updated_at = NOW() WHERE id = :id AND (user_id = :user_id OR :is_admin = 1)");
        return $stmt->execute([':id' => $id, ':user_id' => $userId, ':is_admin' => 1]);
    }
}
