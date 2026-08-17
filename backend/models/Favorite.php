<?php

require_once __DIR__ . '/../config/database.php';

class Favorite {
    public static function getByUser(string $userId): array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT f.*, bk.title, bk.author, bk.category, bk.isbn, bk.available, bk.cover_color
                               FROM favorites f
                               JOIN books bk ON f.book_id = bk.id
                               WHERE f.user_id = :user_id
                               ORDER BY f.created_at DESC");
        $stmt->execute([':user_id' => $userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function add(string $userId, string $bookId): array {
        $pdo = Database::getConnection();
        $check = $pdo->prepare("SELECT id FROM favorites WHERE user_id = :user_id AND book_id = :book_id");
        $check->execute([':user_id' => $userId, ':book_id' => $bookId]);
        if ($check->fetch()) {
            return ['ok' => true, 'message' => 'Already in favorites.'];
        }

        $id = 'fav-' . substr(bin2hex(random_bytes(6)), 0, 8);
        $stmt = $pdo->prepare("INSERT INTO favorites (id, user_id, book_id, created_at) VALUES (:id, :user_id, :book_id, NOW())");
        $stmt->execute([':id' => $id, ':user_id' => $userId, ':book_id' => $bookId]);
        return ['ok' => true, 'id' => $id];
    }

    public static function remove(string $userId, string $bookId): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM favorites WHERE user_id = :user_id AND (book_id = :book_id OR id = :book_id2)");
        return $stmt->execute([':user_id' => $userId, ':book_id' => $bookId, ':book_id2' => $bookId]);
    }
}
