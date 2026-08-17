<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/AuditLog.php';
require_once __DIR__ . '/Notification.php';

class Borrowing {
    public static function getAll(array $filters = []): array {
        $pdo = Database::getConnection();
        $sql = "SELECT b.*, u.name as user_name, u.email as user_email, u.student_id, 
                       bk.title as book_title, bk.author as book_author, bk.isbn as book_isbn, bk.cover_color
                FROM borrowings b
                LEFT JOIN users u ON b.user_id = u.id
                LEFT JOIN books bk ON b.book_id = bk.id
                WHERE 1=1";
        $params = [];

        if (!empty($filters['user_id'])) {
            $sql .= " AND b.user_id = :user_id";
            $params[':user_id'] = $filters['user_id'];
        }
        if (!empty($filters['status'])) {
            $sql .= " AND b.status = :status";
            $params[':status'] = $filters['status'];
        }
        if (!empty($filters['search'])) {
            $sql .= " AND (u.name LIKE :search_name OR bk.title LIKE :search_title)";
            $params[':search_name'] = '%' . $filters['search'] . '%';
            $params[':search_title'] = '%' . $filters['search'] . '%';
        }

        $sql .= " ORDER BY b.created_at DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function getById(string $id): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT b.*, u.name as user_name, u.email as user_email, bk.title as book_title, bk.author as book_author
                               FROM borrowings b
                               LEFT JOIN users u ON b.user_id = u.id
                               LEFT JOIN books bk ON b.book_id = bk.id
                               WHERE b.id = :id");
        $stmt->execute([':id' => $id]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        return $res ?: null;
    }

    public static function create(array $data, ?array $adminUser = null): array {
        $pdo = Database::getConnection();
        $pdo->beginTransaction();
        try {
            $id = $data['id'] ?? ('brw-' . substr(bin2hex(random_bytes(6)), 0, 8));
            $borrowDate = $data['borrow_date'] ?? date('Y-m-d');
            $dueDate = $data['due_date'] ?? date('Y-m-d', strtotime('+7 days'));

            // Check availability and decrement
            $checkStmt = $pdo->prepare("SELECT available, title FROM books WHERE id = :book_id FOR UPDATE");
            $checkStmt->execute([':book_id' => $data['book_id']]);
            $book = $checkStmt->fetch(PDO::FETCH_ASSOC);

            if (!$book) {
                throw new Exception("Book not found.");
            }
            if ($book['available'] <= 0) {
                throw new Exception("No copies of this book are currently available for borrowing.");
            }

            $updateBook = $pdo->prepare("UPDATE books SET available = available - 1 WHERE id = :book_id");
            $updateBook->execute([':book_id' => $data['book_id']]);

            $stmt = $pdo->prepare("INSERT INTO borrowings 
                (id, user_id, book_id, borrow_date, due_date, status, fine_amount, processed_by, created_at, updated_at)
                VALUES (:id, :user_id, :book_id, :borrow_date, :due_date, 'active', 0.00, :processed_by, NOW(), NOW())");
            
            $stmt->execute([
                ':id' => $id,
                ':user_id' => $data['user_id'],
                ':book_id' => $data['book_id'],
                ':borrow_date' => $borrowDate,
                ':due_date' => $dueDate,
                ':processed_by' => $adminUser['id'] ?? null,
            ]);

            // Notify user
            Notification::create([
                'user_id' => $data['user_id'],
                'title' => 'Book Borrowed Successfully',
                'message' => 'You borrowed "' . $book['title'] . '". Due date is ' . $dueDate . '.',
                'type' => 'due',
            ]);

            // Audit log
            AuditLog::create([
                'user_id' => $adminUser['id'] ?? $data['user_id'],
                'user_name' => $adminUser['name'] ?? 'Member',
                'role' => $adminUser['role'] ?? 'member',
                'action' => 'Borrow Book',
                'module' => 'Circulation',
                'target_id' => $id,
                'description' => 'Checked out book ' . $book['title'] . ' to user ID ' . $data['user_id'],
            ]);

            $pdo->commit();
            return self::getById($id);
        } catch (Exception $e) {
            $pdo->rollBack();
            throw $e;
        }
    }

    public static function returnBook(string $id, ?array $adminUser = null): array {
        $pdo = Database::getConnection();
        $pdo->beginTransaction();
        try {
            $borrowing = self::getById($id);
            if (!$borrowing) {
                throw new Exception("Borrowing record not found.");
            }
            if ($borrowing['status'] === 'returned') {
                throw new Exception("Book has already been returned.");
            }

            $returnDate = date('Y-m-d');
            $dueDate = $borrowing['due_date'];
            $fineAmount = 0.00;

            // Check overdue days
            if (strtotime($returnDate) > strtotime($dueDate)) {
                $daysOverdue = (int) ceil((strtotime($returnDate) - strtotime($dueDate)) / 86400);
                $fineRate = 5.00; // PHP 5 per day
                $fineAmount = $daysOverdue * $fineRate;
            }

            // Update borrowing
            $stmt = $pdo->prepare("UPDATE borrowings 
                SET status = 'returned', return_date = :return_date, fine_amount = :fine_amount, updated_at = NOW()
                WHERE id = :id");
            $stmt->execute([
                ':return_date' => $returnDate,
                ':fine_amount' => $fineAmount,
                ':id' => $id,
            ]);

            // Increment book available
            $updateBook = $pdo->prepare("UPDATE books SET available = available + 1 WHERE id = :book_id");
            $updateBook->execute([':book_id' => $borrowing['book_id']]);

            // Record fine if overdue
            if ($fineAmount > 0) {
                $fineStmt = $pdo->prepare("INSERT INTO fines (id, user_id, borrowing_id, amount, reason, status, created_at, updated_at)
                    VALUES (:id, :user_id, :borrowing_id, :amount, :reason, 'pending', NOW(), NOW())");
                $fineStmt->execute([
                    ':id' => 'fine-' . substr(bin2hex(random_bytes(6)), 0, 8),
                    ':user_id' => $borrowing['user_id'],
                    ':borrowing_id' => $id,
                    ':amount' => $fineAmount,
                    ':reason' => 'Overdue book return for ' . $borrowing['book_title'],
                ]);
            }

            // Notify user
            Notification::create([
                'user_id' => $borrowing['user_id'],
                'title' => 'Book Returned',
                'message' => 'Your copy of "' . $borrowing['book_title'] . '" has been returned successfully.',
                'type' => 'success',
            ]);

            // Audit log
            AuditLog::create([
                'user_id' => $adminUser['id'] ?? 'system',
                'user_name' => $adminUser['name'] ?? 'Circulation Desk',
                'role' => $adminUser['role'] ?? 'admin',
                'action' => 'Return Book',
                'module' => 'Circulation',
                'target_id' => $id,
                'description' => 'Processed return of ' . $borrowing['book_title'] . ($fineAmount > 0 ? " (Fine: PHP {$fineAmount})" : ""),
            ]);

            $pdo->commit();
            return self::getById($id);
        } catch (Exception $e) {
            $pdo->rollBack();
            throw $e;
        }
    }

    public static function renew(string $id, ?array $adminUser = null): array {
        $pdo = Database::getConnection();
        $borrowing = self::getById($id);
        if (!$borrowing) {
            throw new Exception("Borrowing record not found.");
        }
        if ($borrowing['status'] !== 'active') {
            throw new Exception("Only active borrowings can be renewed.");
        }
        if ($borrowing['renew_count'] >= 2) {
            throw new Exception("Maximum renewal limit (2 times) reached for this loan.");
        }

        $newDueDate = date('Y-m-d', strtotime($borrowing['due_date'] . ' +7 days'));
        $stmt = $pdo->prepare("UPDATE borrowings 
            SET due_date = :due_date, renew_count = renew_count + 1, status = 'active', updated_at = NOW() 
            WHERE id = :id");
        $stmt->execute([
            ':due_date' => $newDueDate,
            ':id' => $id,
        ]);

        Notification::create([
            'user_id' => $borrowing['user_id'],
            'title' => 'Loan Renewed',
            'message' => 'Loan for "' . $borrowing['book_title'] . '" renewed. New due date is ' . $newDueDate . '.',
            'type' => 'info',
        ]);

        return self::getById($id);
    }
}
