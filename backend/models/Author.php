<?php

require_once __DIR__ . '/../config/database.php';

class Author {
    public static function create(array $data): array {
        $pdo = Database::getConnection();
        $name = trim($data['name'] ?? $data['author_name'] ?? '');
        if (empty($name)) {
            throw new Exception("Author name is required.", 400);
        }

        $checkStmt = $pdo->prepare("SELECT id FROM authors WHERE LOWER(name) = :name LIMIT 1");
        $checkStmt->execute(['name' => strtolower($name)]);
        if ($checkStmt->fetch()) {
            throw new Exception("Author already exists.", 409);
        }

        $id = 'aut-' . bin2hex(random_bytes(4));
        $now = date('Y-m-d H:i:s');
        $stmt = $pdo->prepare("INSERT INTO authors (id, name, created_at, updated_at) VALUES (:id, :name, :created_at, :updated_at)");
        $stmt->execute(['id' => $id, 'name' => $name, 'created_at' => $now, 'updated_at' => $now]);

        return self::findById($id);
    }

    public static function findById(string $id): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM authors WHERE id = :id OR author_id = :aut_id LIMIT 1");
        $stmt->execute(['id' => $id, 'aut_id' => $id]);
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

        $sql = "SELECT * FROM authors";
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
        $name = trim($data['name'] ?? $data['author_name'] ?? '');
        if (empty($name)) {
            throw new Exception("Author name is required.", 400);
        }

        $stmt = $pdo->prepare("UPDATE authors SET name = :name, updated_at = :updated_at WHERE id = :id");
        $stmt->execute(['id' => $id, 'name' => $name, 'updated_at' => date('Y-m-d H:i:s')]);
        return self::findById($id);
    }

    public static function delete(string $id): bool {
        $pdo = Database::getConnection();
        $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM books WHERE author = (SELECT name FROM authors WHERE id = :id)");
        $checkStmt->execute(['id' => $id]);
        if ((int)$checkStmt->fetchColumn() > 0) {
            throw new Exception("Cannot delete author because books are assigned to them.", 409);
        }

        $stmt = $pdo->prepare("DELETE FROM authors WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
