<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Book.php';
require_once __DIR__ . '/../models/Borrowing.php';
require_once __DIR__ . '/../models/Reservation.php';
require_once __DIR__ . '/../models/Fine.php';
require_once __DIR__ . '/../models/Attendance.php';
require_once __DIR__ . '/../models/Notification.php';
require_once __DIR__ . '/../models/Announcement.php';
require_once __DIR__ . '/../models/Favorite.php';
require_once __DIR__ . '/../models/BookRequest.php';
require_once __DIR__ . '/../models/AuditLog.php';
require_once __DIR__ . '/../models/SystemLog.php';
require_once __DIR__ . '/../models/RecycleBin.php';
require_once __DIR__ . '/../models/SystemSetting.php';
require_once __DIR__ . '/../models/Backup.php';

function runFullIntegrationTests() {
    echo "====================================================\n";
    echo "BALINGASAG PUBLIC LIBRARY — FULL INTEGRATION TEST SUITE\n";
    echo "====================================================\n\n";

    $passed = 0;
    $failed = 0;

    function assertCondition($cond, $label, &$passed, &$failed) {
        if ($cond) {
            echo " [PASS] $label\n";
            $passed++;
        } else {
            echo " [FAIL] $label\n";
            $failed++;
        }
    }

    // 1. Users & Authentication
    echo "--- 1. Testing Users & Authentication ---\n";
    $admin = User::findByEmail('admin@library.test');
    assertCondition($admin !== null && $admin['role'] === 'admin', 'Admin user exists in database', $passed, $failed);
    $superAdmin = User::findByEmail('superadmin@library.test');
    assertCondition($superAdmin !== null && ($superAdmin['role'] === 'super_admin' || $superAdmin['role'] === 'superadmin'), 'Super Admin user exists in database', $passed, $failed);
    $member = User::findByEmail('member@library.test');
    assertCondition($member !== null && $member['role'] === 'member', 'Member user exists in database', $passed, $failed);

    // 2. Books & Catalog
    echo "\n--- 2. Testing Books & Catalog ---\n";
    $books = Book::getAll();
    assertCondition(count($books) >= 3, 'Book catalog returned active records (' . count($books) . ' books)', $passed, $failed);
    $firstBook = $books[0];

    // 3. Borrowing Flow
    echo "\n--- 3. Testing Borrowing & Inventory Decrement ---\n";
    $initAvail = $firstBook['available'];
    $borrowRecord = Borrowing::create([
        'user_id' => $member['id'],
        'book_id' => $firstBook['id'],
    ], $admin);
    assertCondition($borrowRecord !== null && $borrowRecord['status'] === 'active', 'Borrowing checkout transaction created', $passed, $failed);

    $updatedBook = Book::getById($firstBook['id']);
    assertCondition($updatedBook['available'] === ($initAvail - 1), 'Book available count correctly decremented from ' . $initAvail . ' to ' . $updatedBook['available'], $passed, $failed);

    // 4. Loan Renewal Flow
    echo "\n--- 4. Testing Loan Renewal ---\n";
    $renewed = Borrowing::renew($borrowRecord['id'], $member);
    assertCondition($renewed['renew_count'] == 1, 'Loan renewal count incremented to 1', $passed, $failed);

    // 5. Returning Flow
    echo "\n--- 5. Testing Returning & Inventory Increment ---\n";
    $returned = Borrowing::returnBook($borrowRecord['id'], $admin);
    assertCondition($returned['status'] === 'returned', 'Borrowing status updated to returned', $passed, $failed);
    $bookAfterReturn = Book::getById($firstBook['id']);
    assertCondition($bookAfterReturn['available'] === $initAvail, 'Book available count restored to ' . $initAvail, $passed, $failed);

    // 6. Reservation Flow
    echo "\n--- 6. Testing Reservations ---\n";
    $res = Reservation::create([
        'user_id' => $member['id'],
        'book_id' => $firstBook['id'],
    ]);
    assertCondition($res['status'] === 'pending', 'Reservation hold queued with pending status', $passed, $failed);
    $resUpdated = Reservation::updateStatus($res['id'], 'ready_for_pickup', date('Y-m-d', strtotime('+3 days')));
    assertCondition($resUpdated['status'] === 'ready_for_pickup', 'Reservation transitioned to ready_for_pickup', $passed, $failed);
    Reservation::cancel($res['id'], $member['id']);

    // 7. Attendance Flow
    echo "\n--- 7. Testing QR Kiosk Attendance ---\n";
    $timeIn = Attendance::checkIn($member['id'], 'QR_KIOSK');
    assertCondition($timeIn['status'] === 'inside', 'Attendance check-in (time-in) successfully recorded', $passed, $failed);
    $timeOut = Attendance::checkOut($member['id']);
    assertCondition($timeOut['status'] === 'left', 'Attendance check-out (time-out) successfully recorded', $passed, $failed);

    // 8. Notifications Flow
    echo "\n--- 8. Testing Notifications ---\n";
    $notif = Notification::create([
        'user_id' => $member['id'],
        'title' => 'Test Alert',
        'message' => 'Your integration test notification is live.',
        'type' => 'info',
    ]);
    $userNotifs = Notification::getAll($member['id']);
    assertCondition(count($userNotifs) > 0, 'Member retrieved notifications feed (' . count($userNotifs) . ' items)', $passed, $failed);
    Notification::markAsRead($notif['id'], $member['id']);

    // 9. Favorites Flow
    echo "\n--- 9. Testing Favorites ---\n";
    Favorite::add($member['id'], $firstBook['id']);
    $favs = Favorite::getByUser($member['id']);
    assertCondition(count($favs) > 0, 'Member added book to personal reading favorites', $passed, $failed);
    Favorite::remove($member['id'], $firstBook['id']);

    // 10. Book Acquisition Requests Flow
    echo "\n--- 10. Testing Book Acquisition Requests ---\n";
    $req = BookRequest::create([
        'user_id' => $member['id'],
        'title' => 'Designing Data-Intensive Applications',
        'author' => 'Martin Kleppmann',
        'reason' => 'Database research',
    ]);
    assertCondition($req['status'] === 'pending', 'Acquisition recommendation submitted', $passed, $failed);
    $processed = BookRequest::process($req['id'], 'approved', $admin, 'Approved for library purchase');
    assertCondition($processed['status'] === 'approved', 'Acquisition request reviewed & approved by Admin', $passed, $failed);

    // 11. Announcements Flow
    echo "\n--- 11. Testing Announcements ---\n";
    $announcements = Announcement::getAll(true);
    assertCondition(count($announcements) > 0, 'Public announcements retrieved (' . count($announcements) . ' active)', $passed, $failed);

    // 12. Audit Trail & System Logs
    echo "\n--- 12. Testing Audit Trail & System Logs ---\n";
    AuditLog::create([
        'user_id' => $superAdmin['id'],
        'user_name' => $superAdmin['name'],
        'role' => 'super_admin',
        'action' => 'Run Integration Test',
        'module' => 'Testing',
        'description' => 'Integration test executed successfully',
    ]);
    $auditLogs = AuditLog::getAll();
    assertCondition(count($auditLogs) > 0, 'Audit trail logged actions (' . count($auditLogs) . ' total entries)', $passed, $failed);

    SystemLog::log('info', 'Integration test pipeline health check passed', 'system');
    $sysLogs = SystemLog::getAll();
    assertCondition(count($sysLogs) > 0, 'System error & warning logs recorded', $passed, $failed);

    // 13. System Settings
    echo "\n--- 13. Testing System Settings ---\n";
    $borrowLimit = SystemSetting::get('borrow_limit', '5');
    assertCondition($borrowLimit == '5', 'System setting borrow_limit read (' . $borrowLimit . ')', $passed, $failed);

    // 14. Database Backups
    echo "\n--- 14. Testing Database Backup Generator ---\n";
    $backupResult = Backup::createBackup($superAdmin);
    assertCondition($backupResult['status'] === 'Success', 'Full MySQL database snapshot generated (' . $backupResult['filename'] . ' / ' . $backupResult['file_size'] . ')', $passed, $failed);

    echo "\n====================================================\n";
    echo "TEST RESULTS: $passed PASSED, $failed FAILED\n";
    echo "====================================================\n";

    return $failed === 0;
}

runFullIntegrationTests();
