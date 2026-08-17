<?php

require_once __DIR__ . '/../config/database.php';

class Publisher {
    public static function create(array $data): array {
        $pdo = Database::getConnection();
        $name = trim($data['name'] ?? $data['publisher_name'] ?? '');
        if (empty($name)) {
            throw new Exception("Publisher name is required.", 400);
        }

        $checkStmt = $pdo->prepare("SELECT id FROM publishers WHERE LOWER(name) = :name LIMIT 1");
        $checkStmt->execute(['name' => strtolower($name)]);
        if ($checkStmt->fetch()) {
            throw new Exception("Publisher already exists.", 409);
        }

        $id = 'pub-' . bin2hex(random_bytes(4));
        $now = date('Y-m-d H:i:s');
        $stmt = $pdo->prepare("INSERT INTO publishers (id, name, created_at, updated_at) VALUES (:id, :name, :created_at, :updated_at)");
        $stmt->execute(['id' => $id, 'name' => $name, 'created_at' => $now, 'updated_at' => $now]);

        return self::findById($id);
    }

    public static function findById(string $id): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM publishers WHERE id = :id OR publisher_id = :pub_id LIMIT 1");
        $stmt->execute(['id' => $id, 'pub_id' => $id]);
        return $stmt->fetch() ?: null;
    }

    public static function getAll(array $filters = []): array {
        $pdo = Database::getConnection();
        $where = [];
        $params = [];

        if (!empty($filters['search'])) {
            $where[] = "LOWER(name) LIKE :q";
            $params['q'] = '%' . strtolower(trim($filters['search'])) . '%';
        }

        $sql = "SELECT * FROM publishers";
        if (!empty($where)) {
            $sql .= " WHERE " . implode(" AND ", $where);
        }
        $sql .= " ORDER BY name ASC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function update(string $id, array $data): array {
        $pdo = Database::getConnection();
        $name = trim($data['name'] ?? $data['publisher_name'] ?? '');
        if (empty($name)) {
            throw new Exception("Publisher name is required.", 400);
        }

        $stmt = $pdo->prepare("UPDATE publishers SET name = :name, updated_at = :updated_at WHERE id = :id");
        $stmt->execute(['id' => $id, 'name' => $name, 'updated_at' => date('Y-m-d H:i:s')]);
        return self::findById($id);
    }

    public static function delete(string $id): bool {
        $pdo = Database::getConnection();
        $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM books WHERE publisher = (SELECT name FROM publishers WHERE id = :id)");
        $checkStmt->execute(['id' => $id]);
        if ((int)$checkStmt->fetchColumn() > 0) {
            throw new Exception("Cannot delete publisher because books are assigned to them.", 409);
        }

        $stmt = $pdo->prepare("DELETE FROM publishers WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
