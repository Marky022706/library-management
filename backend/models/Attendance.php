<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/AuditLog.php';

class Attendance {
    public static function getAll(array $filters = []): array {
        $pdo = Database::getConnection();
        $sql = "SELECT a.*, u.name as user_name, u.email as user_email, u.student_id, u.course
                FROM attendance a
                LEFT JOIN users u ON a.user_id = u.id
                WHERE 1=1";
        $params = [];

        if (!empty($filters['user_id'])) {
            $sql .= " AND a.user_id = :user_id";
            $params[':user_id'] = $filters['user_id'];
        }
        if (!empty($filters['date'])) {
            $sql .= " AND a.date = :date";
            $params[':date'] = $filters['date'];
        }
        if (!empty($filters['status'])) {
            $sql .= " AND a.status = :status";
            $params[':status'] = $filters['status'];
        }

        $sql .= " ORDER BY a.date DESC, a.time_in DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function checkIn(string $userId, string $source = 'QR_KIOSK'): array {
        $pdo = Database::getConnection();
        $today = date('Y-m-d');
        $timeIn = date('H:i:s');

        // Check if already checked in and inside today
        $check = $pdo->prepare("SELECT id FROM attendance WHERE user_id = :uid AND date = :dt AND status = 'inside'");
        $check->execute([':uid' => $userId, ':dt' => $today]);
        if ($existing = $check->fetch(PDO::FETCH_ASSOC)) {
            // Already inside, perform check-out instead (toggle behavior)
            return self::checkOut($userId);
        }

        $id = 'att-' . substr(bin2hex(random_bytes(6)), 0, 8);
        $stmt = $pdo->prepare("INSERT INTO attendance (id, user_id, date, time_in, status, source, created_at, updated_at)
            VALUES (:id, :uid, :dt, :tin, 'inside', :src, NOW(), NOW())");
        $stmt->execute([
            ':id' => $id,
            ':uid' => $userId,
            ':dt' => $today,
            ':tin' => $timeIn,
            ':src' => $source,
        ]);

        return [
            'id' => $id,
            'user_id' => $userId,
            'date' => $today,
            'time_in' => $timeIn,
            'status' => 'inside',
            'action' => 'check_in',
            'message' => 'Time-in recorded successfully.',
        ];
    }

    public static function checkOut(string $userId): array {
        $pdo = Database::getConnection();
        $today = date('Y-m-d');
        $timeOut = date('H:i:s');

        $stmt = $pdo->prepare("UPDATE attendance 
            SET time_out = :tout, status = 'left', updated_at = NOW() 
            WHERE user_id = :uid AND date = :dt AND status = 'inside'");
        $stmt->execute([
            ':tout' => $timeOut,
            ':uid' => $userId,
            ':dt' => $today,
        ]);

        return [
            'user_id' => $userId,
            'date' => $today,
            'time_out' => $timeOut,
            'status' => 'left',
            'action' => 'check_out',
            'message' => 'Time-out recorded successfully.',
        ];
    }
}
