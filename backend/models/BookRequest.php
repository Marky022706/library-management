<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/Notification.php';
require_once __DIR__ . '/AuditLog.php';

class BookRequest {
    public static function getAll(array $filters = []): array {
        $pdo = Database::getConnection();
        $sql = "SELECT r.*, u.name as user_name, u.email as user_email, u.student_id,
                       app.name as approver_name
                FROM book_requests r
                LEFT JOIN users u ON r.user_id = u.id
                LEFT JOIN users app ON r.approver_id = app.id
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
        if (!empty($filters['request_type'])) {
            $sql .= " AND r.request_type = :type";
            $params[':type'] = $filters['request_type'];
        }

        $sql .= " ORDER BY r.created_at DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function create(array $data): array {
        $pdo = Database::getConnection();
        $id = $data['id'] ?? ('req-' . substr(bin2hex(random_bytes(6)), 0, 8));
        $stmt = $pdo->prepare("INSERT INTO book_requests 
            (id, user_id, request_type, book_id, title, author, publisher, isbn, reason, status, created_at, updated_at)
            VALUES (:id, :user_id, :type, :book_id, :title, :author, :publisher, :isbn, :reason, 'pending', NOW(), NOW())");
        
        $stmt->execute([
            ':id' => $id,
            ':user_id' => $data['user_id'],
            ':type' => $data['request_type'] ?? 'acquisition',
            ':book_id' => $data['book_id'] ?? null,
            ':title' => $data['title'],
            ':author' => $data['author'] ?? null,
            ':publisher' => $data['publisher'] ?? null,
            ':isbn' => $data['isbn'] ?? null,
            ':reason' => $data['reason'] ?? null,
        ]);

        return ['id' => $id, 'title' => $data['title'], 'status' => 'pending'];
    }

    public static function process(string $id, string $status, ?array $adminUser = null, ?string $remarks = null): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE book_requests 
            SET status = :status, approver_id = :approver, remarks = :remarks, updated_at = NOW() 
            WHERE id = :id");
        $stmt->execute([
            ':status' => $status,
            ':approver' => $adminUser['id'] ?? null,
            ':remarks' => $remarks,
            ':id' => $id,
        ]);

        $req = $pdo->query("SELECT * FROM book_requests WHERE id = '$id'")->fetch(PDO::FETCH_ASSOC);
        if ($req) {
            Notification::create([
                'user_id' => $req['user_id'],
                'title' => 'Book Request ' . ucfirst($status),
                'message' => 'Your ' . $req['request_type'] . ' request for "' . $req['title'] . '" was ' . $status . ($remarks ? ": {$remarks}" : "."),
                'type' => $status === 'approved' ? 'success' : 'warning',
            ]);

            AuditLog::create([
                'user_id' => $adminUser['id'] ?? 'system',
                'user_name' => $adminUser['name'] ?? 'Admin',
                'role' => $adminUser['role'] ?? 'admin',
                'action' => ucfirst($status) . ' Request',
                'module' => 'Requests',
                'target_id' => $id,
                'description' => ucfirst($status) . ' ' . $req['request_type'] . ' request for ' . $req['title'],
            ]);
        }

        return $req ?: ['id' => $id, 'status' => $status];
    }
}
