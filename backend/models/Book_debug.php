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
        $pages = !empty($data['pages']) ? (int)$data['pages'] : null;
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

        echo "[LOG] Created IDs: bookId=$bookId, accessionNumber=$accessionNumber\n";

        // Check accession number uniqueness
        echo "[LOG] Checking accession number uniqueness...\n";
        $checkStmt = $pdo->prepare("SELECT id FROM books WHERE accession_number = :acc LIMIT 1");
        $checkStmt->execute(['acc' => $accessionNumber]);
        if ($checkStmt->fetch()) {
            throw new Exception("Accession number '{$accessionNumber}' already exists.", 409);
        }
        echo "[LOG] Accession number is unique.\n";

        $qrCode = QRCodeService::generateBookQRCode($accessionNumber);
        echo "[LOG] Generated QR code: $qrCode\n";
        
        $now = date('Y-m-d H:i:s');

        // Auto-register category if not existing
        if (!empty($category)) {
            echo "[LOG] Checking category: $category\n";
            $catStmt = $pdo->prepare("SELECT id FROM categories WHERE LOWER(name) = :name LIMIT 1");
            $catStmt->execute(['name' => strtolower($category)]);
            if (!$catStmt->fetch()) {
                echo "[LOG] Category not found, creating new category\n";
                $catId = 'cat-' . bin2hex(random_bytes(4));
                $insCat = $pdo->prepare("INSERT INTO categories (id, category_id, name, created_at, updated_at) VALUES (:id, :id, :name, :now, :now)");
                $insCat->execute(['id' => $catId, 'name' => $category, 'now' => $now]);
            }
        }

        // Auto-register author if not existing
        if (!empty($author)) {
            echo "[LOG] Checking author: $author\n";
            $authStmt = $pdo->prepare("SELECT id FROM authors WHERE LOWER(name) = :name LIMIT 1");
            $authStmt->execute(['name' => strtolower($author)]);
            if (!$authStmt->fetch()) {
                echo "[LOG] Author not found, creating new author\n";
                $authId = 'auth-' . bin2hex(random_bytes(4));
                $insAuth = $pdo->prepare("INSERT INTO authors (id, author_id, name, created_at, updated_at) VALUES (:id, :id, :name, :now, :now)");
                $insAuth->execute(['id' => $authId, 'name' => $author, 'now' => $now]);
            }
        }

        // Auto-register publisher if not existing
        if (!empty($publisher)) {
            echo "[LOG] Checking publisher: $publisher\n";
            $pubStmt = $pdo->prepare("SELECT id FROM publishers WHERE LOWER(name) = :name LIMIT 1");
            $pubStmt->execute(['name' => strtolower($publisher)]);
            if (!$pubStmt->fetch()) {
                echo "[LOG] Publisher not found, creating new publisher\n";
                $pubId = 'pub-' . bin2hex(random_bytes(4));
                $insPub = $pdo->prepare("INSERT INTO publishers (id, publisher_id, name, created_at, updated_at) VALUES (:id, :id, :name, :now, :now)");
                $insPub->execute(['id' => $pubId, 'name' => $publisher, 'now' => $now]);
            }
        }

        echo "[LOG] About to execute INSERT statement with parameters:\n";
        echo "  id=$bookId, title=$title, author=$author, pages=$pages\n";
        
        $stmt = $pdo->prepare("INSERT INTO books (
            id, book_id, title, author, category, publisher, publication_year, accession_number, isbn, pages, shelf_location, format, quantity, available, `condition`, status, cover_color, qr_code, created_at, updated_at
        ) VALUES (
            :id, :book_id, :title, :author, :category, :publisher, :publication_year, :accession_number, :isbn, :pages, :shelf_location, :format, :quantity, :available, :condition, :status, :cover_color, :qr_code, :created_at, :updated_at
        )");

        echo "[LOG] Executing INSERT...\n";
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
            'pages' => $pages,
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

        echo "[LOG] INSERT successful, retrieving created book...\n";
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
        $status = $filters['status'] ?? 'active';
        $search = $filters['search'] ?? '';
        $category = $filters['category'] ?? 'all';
        $author = $filters['author'] ?? 'all';
        $publisher = $filters['publisher'] ?? 'all';

        $query = "SELECT * FROM books WHERE status = :status";
        $params = ['status' => $status];

        if (!empty($search)) {
            $query .= " AND (title LIKE :search OR author LIKE :search OR isbn LIKE :search)";
            $params['search'] = "%{$search}%";
        }

        if ($category !== 'all') {
            $query .= " AND category = :category";
            $params['category'] = $category;
        }

        if ($author !== 'all') {
            $query .= " AND author = :author";
            $params['author'] = $author;
        }

        if ($publisher !== 'all') {
            $query .= " AND publisher = :publisher";
            $params['publisher'] = $publisher;
        }

        $query .= " ORDER BY created_at DESC";
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $books = $stmt->fetchAll();

        // Map coverColor field for frontend compatibility
        return array_map(function ($book) {
            $book['coverColor'] = $book['cover_color'] ?? '#3b82f6';
            return $book;
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
            'title', 'author', 'category', 'publisher', 'isbn', 'pages', 'quantity', 'available',
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
