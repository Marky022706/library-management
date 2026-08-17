<?php

require_once __DIR__ . '/../config/database.php';

class AuditLog {
    public static function getAll(array $filters = []): array {
        $pdo = Database::getConnection();
        $sql = "SELECT * FROM audit_logs WHERE 1=1";
        $params = [];

        if (!empty($filters['user_id'])) {
            $sql .= " AND user_id = :user_id";
            $params[':user_id'] = $filters['user_id'];
        }
        if (!empty($filters['module'])) {
            $sql .= " AND module = :module";
            $params[':module'] = $filters['module'];
        }
        if (!empty($filters['search'])) {
            $sql .= " AND (action LIKE :search_act OR description LIKE :search_desc OR user_name LIKE :search_user)";
            $params[':search_act'] = '%' . $filters['search'] . '%';
            $params[':search_desc'] = '%' . $filters['search'] . '%';
            $params[':search_user'] = '%' . $filters['search'] . '%';
        }

        $sql .= " ORDER BY created_at DESC LIMIT 100";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function create(array $data): array {
        $pdo = Database::getConnection();
        $id = $data['id'] ?? ('aud-' . substr(bin2hex(random_bytes(6)), 0, 8));
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

        $stmt = $pdo->prepare("INSERT INTO audit_logs 
            (id, user_id, user_name, role, action, module, target_id, description, ip_address, status, created_at)
            VALUES (:id, :user_id, :user_name, :role, :action, :module, :target_id, :description, :ip, :status, NOW())");
        
        $stmt->execute([
            ':id' => $id,
            ':user_id' => $data['user_id'] ?? 'system',
            ':user_name' => $data['user_name'] ?? 'System Process',
            ':role' => $data['role'] ?? 'system',
            ':action' => $data['action'],
            ':module' => $data['module'] ?? 'General',
            ':target_id' => $data['target_id'] ?? null,
            ':description' => $data['description'] ?? '',
            ':ip' => $ip,
            ':status' => $data['status'] ?? 'Completed',
        ]);

        return ['id' => $id, 'action' => $data['action']];
    }
}
