<?php

require_once __DIR__ . '/../config/database.php';

class QRCodeService {
    public static function generateMemberQRCode(string $userId, string $studentId = ''): string {
        $prefix = "LIB-MEM";
        $cleanId = strtoupper(preg_replace('/[^A-Z0-9]/i', '', $userId));
        $year = date('Y');
        return "{$prefix}-{$cleanId}-{$year}";
    }

    public static function generateMemberQR(string $userId): string {
        return self::generateMemberQRCode($userId);
    }

    public static function generateBookQRCode(string $accessionNumber): string {
        $cleanAcc = strtoupper(trim($accessionNumber));
        return "LIB-BK-{$cleanAcc}";
    }

    public static function generateBookQR(string $accessionNumber): string {
        return self::generateBookQRCode($accessionNumber);
    }

    public static function resolveQRCode(string $qrCode): array {
        $pdo = Database::getConnection();
        $clean = trim($qrCode);

        // 1. Look for user by qr_code, library_card_number, student_id, user_id, or id
        $stmt = $pdo->prepare("SELECT id, name, email, role, status, student_id, qr_code, library_card_number 
                               FROM users 
                               WHERE qr_code = :q OR library_card_number = :q OR student_id = :q OR id = :q OR user_id = :q 
                               LIMIT 1");
        $stmt->execute([':q' => $clean]);
        if ($user = $stmt->fetch(PDO::FETCH_ASSOC)) {
            return ['type' => 'member', 'data' => $user];
        }

        // 2. Look for book by qr_code, accession_number, isbn, book_id, or id
        $bookStmt = $pdo->prepare("SELECT id, title, author, category, publisher, accession_number, isbn, available, quantity, shelf_location, status 
                                   FROM books 
                                   WHERE qr_code = :q OR accession_number = :q OR isbn = :q OR id = :q OR book_id = :q 
                                   LIMIT 1");
        $bookStmt->execute([':q' => $clean]);
        if ($book = $bookStmt->fetch(PDO::FETCH_ASSOC)) {
            return ['type' => 'book', 'data' => $book];
        }

        throw new Exception("QR code '{$clean}' could not be matched to any library member or book record.", 404);
    }
}
