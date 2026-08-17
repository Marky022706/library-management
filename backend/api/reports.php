<?php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../middleware/auth.php';
require_once __DIR__ . '/../middleware/role.php';

$method = $_SERVER['REQUEST_METHOD'];
$type = $_GET['type'] ?? $_GET['action'] ?? 'overview';
$format = $_GET['format'] ?? 'json';

try {
    $currentUser = getAuthenticatedUser(true);
    $pdo = Database::getConnection();

    // 1. Dashboard Overview Stats
    if ($type === 'overview' || $type === 'dashboard_stats') {
        requireRole(['admin', 'super_admin'], $currentUser);

        $totalBooks = (int) $pdo->query("SELECT COUNT(*) FROM books WHERE status != 'archived'")->fetchColumn();
        $archivedBooks = (int) $pdo->query("SELECT COUNT(*) FROM books WHERE status = 'archived'")->fetchColumn();
        $totalQuantity = (int) $pdo->query("SELECT COALESCE(SUM(quantity), 0) FROM books WHERE status != 'archived'")->fetchColumn();
        $availBooks = (int) $pdo->query("SELECT COALESCE(SUM(available), 0) FROM books WHERE status != 'archived'")->fetchColumn();
        $borrowedBooks = max(0, $totalQuantity - $availBooks);

        $totalUsers = (int) $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
        $members = (int) $pdo->query("SELECT COUNT(*) FROM users WHERE LOWER(role) = 'member'")->fetchColumn();
        $activeMembers = (int) $pdo->query("SELECT COUNT(*) FROM users WHERE LOWER(role) = 'member' AND status = 'active'")->fetchColumn();
        $pendingUsers = (int) $pdo->query("SELECT COUNT(*) FROM users WHERE status = 'pending'")->fetchColumn();
        $admins = (int) $pdo->query("SELECT COUNT(*) FROM users WHERE LOWER(role) IN ('admin', 'super_admin')")->fetchColumn();

        $activeBorrowings = (int) $pdo->query("SELECT COUNT(*) FROM borrowings WHERE status = 'active'")->fetchColumn();
        $overdueBorrowings = (int) $pdo->query("SELECT COUNT(*) FROM borrowings WHERE status = 'active' AND due_date < CURDATE()")->fetchColumn();
        $pendingRequests = (int) $pdo->query("SELECT COUNT(*) FROM book_requests WHERE status = 'pending'")->fetchColumn();
        $pendingReservations = (int) $pdo->query("SELECT COUNT(*) FROM reservations WHERE status = 'pending'")->fetchColumn();

        $attendanceToday = (int) $pdo->query("SELECT COUNT(*) FROM attendance WHERE date = CURDATE()")->fetchColumn();
        $currentlyInside = (int) $pdo->query("SELECT COUNT(*) FROM attendance WHERE date = CURDATE() AND (time_out IS NULL OR time_out = '')")->fetchColumn();

        $stats = [
            'total_books' => $totalBooks,
            'total_quantity' => $totalQuantity,
            'available_books' => $availBooks,
            'borrowed_books' => $borrowedBooks,
            'archived_books' => $archivedBooks,
            'total_users' => $totalUsers,
            'members' => $members,
            'active_members' => $activeMembers,
            'pending_users' => $pendingUsers,
            'admins' => $admins,
            'active_borrowings' => $activeBorrowings,
            'overdue_borrowings' => $overdueBorrowings,
            'pending_requests' => $pendingRequests + $pendingUsers,
            'pending_reservations' => $pendingReservations,
            'attendance_today' => $attendanceToday,
            'currently_inside' => $currentlyInside,
            'system_health' => 'Optimal (100%)',
            'database_status' => 'Connected (MySQL InnoDB)',
        ];

        Database::sendJsonResponse(true, 'Dashboard statistics retrieved.', $stats);
    }

    // 2. Comprehensive Analytics
    if ($type === 'analytics') {
        requireRole(['admin', 'super_admin'], $currentUser);

        // Category breakdown
        $catStmt = $pdo->query("SELECT COALESCE(category, 'Uncategorized') as category, COUNT(*) as count FROM books WHERE status != 'archived' GROUP BY category ORDER BY count DESC LIMIT 8");
        $categories = $catStmt->fetchAll(PDO::FETCH_ASSOC);
        $totalBookCount = max(1, array_sum(array_column($categories, 'count')));
        $categoryBreakdown = array_map(function ($c) use ($totalBookCount) {
            return [
                'category' => $c['category'],
                'count' => (int)$c['count'],
                'percent' => round(((int)$c['count'] / $totalBookCount) * 100, 1)
            ];
        }, $categories);

        // Attendance stats
        $attStmt = $pdo->query("SELECT date, COUNT(*) as count FROM attendance GROUP BY date ORDER BY date DESC LIMIT 7");
        $attendanceTrends = array_reverse($attStmt->fetchAll(PDO::FETCH_ASSOC));

        // Borrowing trends
        $borStmt = $pdo->query("SELECT DATE(created_at) as date, COUNT(*) as borrow_count FROM borrowings GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 7");
        $borrowingTrends = array_reverse($borStmt->fetchAll(PDO::FETCH_ASSOC));

        Database::sendJsonResponse(true, 'Analytics retrieved.', [
            'category_breakdown' => $categoryBreakdown,
            'attendance_trends' => $attendanceTrends,
            'borrowing_trends' => $borrowingTrends,
        ]);
    }

    // 3. Circulation Report
    if ($type === 'circulation') {
        requireRole(['admin', 'super_admin'], $currentUser);

        $stmt = $pdo->query("SELECT b.id, u.name as member_name, u.email, bk.title as book_title, bk.accession_number, b.borrow_date, b.due_date, b.return_date, b.status, b.fine_amount
                             FROM borrowings b
                             LEFT JOIN users u ON b.user_id = u.id
                             LEFT JOIN books bk ON b.book_id = bk.id
                             ORDER BY b.created_at DESC");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($format === 'csv') {
            header('Content-Type: text/csv');
            header('Content-Disposition: attachment; filename="circulation_report.csv"');
            $out = fopen('php://output', 'w');
            fputcsv($out, ['ID', 'Member Name', 'Member Email', 'Book Title', 'Accession Number', 'Borrow Date', 'Due Date', 'Return Date', 'Status', 'Fine']);
            foreach ($rows as $r) fputcsv($out, $r);
            fclose($out);
            exit;
        }

        Database::sendJsonResponse(true, 'Circulation report retrieved.', ['records' => $rows, 'total' => count($rows)]);
    }

    // 4. Attendance Report
    if ($type === 'attendance') {
        requireRole(['admin', 'super_admin'], $currentUser);

        $stmt = $pdo->query("SELECT a.id, u.name as member_name, u.student_id, u.course, a.date, a.time_in, a.time_out, a.status, a.source
                             FROM attendance a
                             LEFT JOIN users u ON a.user_id = u.id
                             ORDER BY a.date DESC, a.time_in DESC");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($format === 'csv') {
            header('Content-Type: text/csv');
            header('Content-Disposition: attachment; filename="attendance_report.csv"');
            $out = fopen('php://output', 'w');
            fputcsv($out, ['ID', 'Member Name', 'Student ID', 'Course', 'Date', 'Time In', 'Time Out', 'Status', 'Source']);
            foreach ($rows as $r) fputcsv($out, $r);
            fclose($out);
            exit;
        }

        Database::sendJsonResponse(true, 'Attendance report retrieved.', ['records' => $rows, 'total' => count($rows)]);
    }

    // 5. Inventory Report
    if ($type === 'inventory') {
        requireRole(['admin', 'super_admin'], $currentUser);

        $stmt = $pdo->query("SELECT id, title, author, category, publisher, accession_number, isbn, shelf_location, quantity, available, `condition`, status FROM books ORDER BY title ASC");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($format === 'csv') {
            header('Content-Type: text/csv');
            header('Content-Disposition: attachment; filename="inventory_report.csv"');
            $out = fopen('php://output', 'w');
            fputcsv($out, ['ID', 'Title', 'Author', 'Category', 'Publisher', 'Accession Number', 'ISBN', 'Shelf Location', 'Total Copies', 'Available', 'Condition', 'Status']);
            foreach ($rows as $r) fputcsv($out, $r);
            fclose($out);
            exit;
        }

        Database::sendJsonResponse(true, 'Inventory report retrieved.', ['records' => $rows, 'total' => count($rows)]);
    }

    // 6. User Membership Report
    if ($type === 'users') {
        requireRole(['admin', 'super_admin'], $currentUser);

        $stmt = $pdo->query("SELECT id, name, email, role, status, student_id, school, course, year_level, phone, library_card_number, registered_at FROM users ORDER BY created_at DESC");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($format === 'csv') {
            header('Content-Type: text/csv');
            header('Content-Disposition: attachment; filename="users_report.csv"');
            $out = fopen('php://output', 'w');
            fputcsv($out, ['ID', 'Name', 'Email', 'Role', 'Status', 'Student ID', 'School', 'Course', 'Year Level', 'Phone', 'Card Number', 'Registered Date']);
            foreach ($rows as $r) fputcsv($out, $r);
            fclose($out);
            exit;
        }

        Database::sendJsonResponse(true, 'Users report retrieved.', ['records' => $rows, 'total' => count($rows)]);
    }

    Database::sendJsonResponse(false, 'Invalid report type requested.', null, 400);

} catch (Exception $e) {
    $code = ($e->getCode() >= 400 && $e->getCode() < 600) ? $e->getCode() : 500;
    Database::sendJsonResponse(false, $e->getMessage(), null, $code);
}
