<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/QRCodeService.php';

class Book {
    public static function create(array $data): array {
        $pdo = Database::getConnection();

        $title = trim($data['title'] ?? '');
        if (empty($title)) {
            throw new Exception("Book title is required.", 400);
        }

        $author = trim($data['author'] ?? '');
        $category = trim($data['category'] ?? 'General');
        $publisher = trim($data['publisher'] ?? '');
        $isbn = trim($data['isbn'] ?? '');
        $quantity = max(1, (int)($data['quantity'] ?? 1));
        $available = isset($data['available']) ? max(0, (int)$data['available']) : $quantity;
        $condition = trim($data['condition'] ?? 'Good');
        $status = strtolower(trim($data['status'] ?? 'active'));
        $pubYear = !empty($data['publication_year']) ? (int)$data['publication_year'] : (!empty($data['publicationYear']) ? (int)$data['publicationYear'] : null);
        $shelfLocation = trim($data['shelf_location'] ?? $data['shelfLocation'] ?? 'Main Section');
        $format = trim($data['format'] ?? 'Hardcover');
        $coverColor = trim($data['coverColor'] ?? $data['cover_color'] ?? '#3b82f6');

        $bookId = 'bk-' . bin2hex(random_bytes(4));
        $accessionNumber = trim($data['accession_number'] ?? $data['accessionNumber'] ?? ('ACC-' . strtoupper(bin2hex(random_bytes(3)))));

        // Check accession number uniqueness
        $checkStmt = $pdo->prepare("SELECT id FROM books WHERE accession_number = :acc LIMIT 1");
        $checkStmt->execute(['acc' => $accessionNumber]);
        if ($checkStmt->fetch()) {
            throw new Exception("Accession number '{$accessionNumber}' already exists.", 409);
        }

        $qrCode = QRCodeService::generateBookQRCode($accessionNumber);
        $now = date('Y-m-d H:i:s');

        $stmt = $pdo->prepare("INSERT INTO books (
            id, book_id, title, author, category, publisher, publication_year, accession_number, isbn, shelf_location, format, quantity, available, `condition`, status, cover_color, qr_code, created_at, updated_at
        ) VALUES (
            :id, :book_id, :title, :author, :category, :publisher, :publication_year, :accession_number, :isbn, :shelf_location, :format, :quantity, :available, :condition, :status, :cover_color, :qr_code, :created_at, :updated_at
        )");

        $stmt->execute([
            'id' => $bookId,
            'book_id' => $bookId,
            'title' => $title,
            'author' => $author,
            'category' => $category,
            'publisher' => $publisher,
            'publication_year' => $pubYear,
            'accession_number' => $accessionNumber,
            'isbn' => $isbn,
            'shelf_location' => $shelfLocation,
            'format' => $format,
            'quantity' => $quantity,
            'available' => $available,
            'condition' => $condition,
            'status' => $status,
            'cover_color' => $coverColor,
            'qr_code' => $qrCode,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return self::findById($bookId);
    }

    public static function findById(string $id): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM books WHERE id = :id OR book_id = :book_id LIMIT 1");
        $stmt->execute(['id' => $id, 'book_id' => $id]);
        $book = $stmt->fetch();
        if (!$book) return null;

        // Map coverColor field for frontend compatibility
        $book['coverColor'] = $book['cover_color'] ?? '#3b82f6';
        return $book;
    }

    public static function getById(string $id): ?array {
        return self::findById($id);
    }

    public static function getAll(array $filters = []): array {
        $pdo = Database::getConnection();
        $where = [];
        $params = [];

        if (isset($filters['status']) && $filters['status'] !== 'all') {
            $where[] = "status = :status";
            $params['status'] = strtolower($filters['status']);
        } else if (!isset($filters['include_archived'])) {
            // Default to non-archived books unless specified
            $where[] = "status != 'archived'";
        }

        if (!empty($filters['category']) && $filters['category'] !== 'all') {
            $where[] = "LOWER(category) = :category";
            $params['category'] = strtolower($filters['category']);
        }
        if (!empty($filters['author']) && $filters['author'] !== 'all') {
            $where[] = "LOWER(author) = :author";
            $params['author'] = strtolower($filters['author']);
        }
        if (!empty($filters['publisher']) && $filters['publisher'] !== 'all') {
            $where[] = "LOWER(publisher) = :publisher";
            $params['publisher'] = strtolower($filters['publisher']);
        }
        if (isset($filters['available_only']) && $filters['available_only']) {
            $where[] = "available > 0";
        }
        if (!empty($filters['search'])) {
            $q = '%' . strtolower(trim($filters['search'])) . '%';
            $where[] = "(LOWER(title) LIKE :q_title OR LOWER(author) LIKE :q_author OR LOWER(isbn) LIKE :q_isbn OR LOWER(accession_number) LIKE :q_acc)";
            $params['q_title'] = $q;
            $params['q_author'] = $q;
            $params['q_isbn'] = $q;
            $params['q_acc'] = $q;
        }

        $sql = "SELECT * FROM books";
        if (!empty($where)) {
            $sql .= " WHERE " . implode(" AND ", $where);
        }
        $sql .= " ORDER BY created_at DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $books = $stmt->fetchAll();

        return array_map(function ($b) {
            $b['coverColor'] = $b['cover_color'] ?? '#3b82f6';
            return $b;
        }, $books);
    }

    public static function update(string $id, array $data): array {
        $pdo = Database::getConnection();
        $book = self::findById($id);
        if (!$book) {
            throw new Exception("Book not found.", 404);
        }

        $fields = [];
        $params = ['id' => $id, 'book_id' => $id];

        $cols = [
            'title', 'author', 'category', 'publisher', 'isbn', 'quantity', 'available',
            'condition', 'status', 'shelf_location', 'format', 'cover_color'
        ];

        foreach ($cols as $col) {
            if (isset($data[$col])) {
                $fields[] = "`{$col}` = :{$col}";
                $params[$col] = $data[$col];
            }
        }

        if (isset($data['publication_year']) || isset($data['publicationYear'])) {
            $fields[] = "`publication_year` = :publication_year";
            $params['publication_year'] = $data['publication_year'] ?? $data['publicationYear'];
        }

        if (empty($fields)) {
            return $book;
        }

        $fields[] = "`updated_at` = :updated_at";
        $params['updated_at'] = date('Y-m-d H:i:s');

        $sql = "UPDATE books SET " . implode(", ", $fields) . " WHERE id = :id OR book_id = :book_id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        return self::findById($id);
    }

    public static function archive(string $id): bool {
        return self::update($id, ['status' => 'archived']) !== null;
    }

    public static function restore(string $id): bool {
        return self::update($id, ['status' => 'active']) !== null;
    }
}
