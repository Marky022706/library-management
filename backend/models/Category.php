<?php

require_once __DIR__ . '/../config/database.php';

class Category {
    public static function create(array $data): array {
        $pdo = Database::getConnection();
        $name = trim($data['name'] ?? $data['category_name'] ?? '');
        if (empty($name)) {
            throw new Exception("Category name is required.", 400);
        }

        $checkStmt = $pdo->prepare("SELECT id FROM categories WHERE LOWER(name) = :name LIMIT 1");
        $checkStmt->execute(['name' => strtolower($name)]);
        if ($checkStmt->fetch()) {
            throw new Exception("Category with that name already exists.", 409);
        }

        $id = 'cat-' . bin2hex(random_bytes(4));
        $now = date('Y-m-d H:i:s');
        $stmt = $pdo->prepare("INSERT INTO categories (id, name, created_at, updated_at) VALUES (:id, :name, :created_at, :updated_at)");
        $stmt->execute(['id' => $id, 'name' => $name, 'created_at' => $now, 'updated_at' => $now]);

        return self::findById($id);
    }

    public static function findById(string $id): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM categories WHERE id = :id OR category_id = :cat_id LIMIT 1");
        $stmt->execute(['id' => $id, 'cat_id' => $id]);
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

        $sql = "SELECT * FROM categories";
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
        $name = trim($data['name'] ?? $data['category_name'] ?? '');
        if (empty($name)) {
            throw new Exception("Category name is required.", 400);
        }

        $stmt = $pdo->prepare("UPDATE categories SET name = :name, updated_at = :updated_at WHERE id = :id");
        $stmt->execute(['id' => $id, 'name' => $name, 'updated_at' => date('Y-m-d H:i:s')]);
        return self::findById($id);
    }

    public static function delete(string $id): bool {
        $pdo = Database::getConnection();
        
        // Check if books depend on this category
        $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM books WHERE category = (SELECT name FROM categories WHERE id = :id)");
        $checkStmt->execute(['id' => $id]);
        if ((int)$checkStmt->fetchColumn() > 0) {
            throw new Exception("Cannot delete category because books are assigned to it.", 409);
        }

        $stmt = $pdo->prepare("DELETE FROM categories WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }
}
