<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/AuditLog.php';

class Announcement {
    public static function getAll(bool $onlyPublished = false): array {
        $pdo = Database::getConnection();
        $count = (int) $pdo->query("SELECT COUNT(*) FROM announcements")->fetchColumn();
        if ($count === 0) {
            self::create([
                'id' => 'ann-1',
                'title' => 'Welcome to the Balingasag Public Library System',
                'content' => 'Students and faculty can now browse the book catalog, manage hold reservations, check attendance, and view digital library cards online.',
                'status' => 'published',
            ]);
        }

        $sql = "SELECT a.*, u.name as author_name FROM announcements a LEFT JOIN users u ON a.created_by = u.id WHERE 1=1";
        if ($onlyPublished) {
            $sql .= " AND a.status = 'published'";
        }
        $sql .= " ORDER BY a.publish_date DESC, a.created_at DESC";
        return $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function create(array $data, ?array $adminUser = null): array {
        $pdo = Database::getConnection();
        $id = $data['id'] ?? ('ann-' . substr(bin2hex(random_bytes(6)), 0, 8));
        $stmt = $pdo->prepare("INSERT INTO announcements (id, title, content, status, publish_date, expiration_date, created_by, created_at, updated_at)
            VALUES (:id, :title, :content, :status, :pdate, :edate, :cby, NOW(), NOW())");
        $stmt->execute([
            ':id' => $id,
            ':title' => $data['title'],
            ':content' => $data['content'],
            ':status' => $data['status'] ?? 'published',
            ':pdate' => $data['publish_date'] ?? date('Y-m-d'),
            ':edate' => $data['expiration_date'] ?? null,
            ':cby' => $adminUser['id'] ?? null,
        ]);
        return ['id' => $id, 'title' => $data['title']];
    }

    public static function update(string $id, array $data): bool {
        $pdo = Database::getConnection();
        $fields = [];
        $params = [':id' => $id];
        foreach (['title', 'content', 'status', 'publish_date', 'expiration_date'] as $col) {
            if (isset($data[$col])) {
                $fields[] = "$col = :$col";
                $params[":$col"] = $data[$col];
            }
        }
        if (empty($fields)) return true;
        $sql = "UPDATE announcements SET " . implode(', ', $fields) . ", updated_at = NOW() WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        return $stmt->execute($params);
    }

    public static function delete(string $id): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM announcements WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
}
