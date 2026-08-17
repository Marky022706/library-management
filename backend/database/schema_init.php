<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Book.php';
require_once __DIR__ . '/../models/Category.php';
require_once __DIR__ . '/../models/Author.php';
require_once __DIR__ . '/../models/Publisher.php';

function initializeDatabaseSchema(): void {
    $pdo = Database::getConnection();
    $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);

    // 1. Roles table
    $pdo->exec("CREATE TABLE IF NOT EXISTS roles (
        id VARCHAR(50) PRIMARY KEY,
        role_name VARCHAR(50) NOT NULL UNIQUE
    )");

    $insertRoleSql = ($driver === 'mysql') 
        ? "INSERT IGNORE INTO roles (id, role_name) VALUES (:id, :name)" 
        : "INSERT OR IGNORE INTO roles (id, role_name) VALUES (:id, :name)";
    $stmt = $pdo->prepare($insertRoleSql);
    $roles = ['super_admin', 'admin', 'member'];
    foreach ($roles as $r) {
        $stmt->execute(['id' => $r, 'name' => $r]);
    }

    // 2. Users table
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50),
        name VARCHAR(150) NOT NULL,
        first_name VARCHAR(100),
        middle_name VARCHAR(100),
        last_name VARCHAR(100),
        email VARCHAR(150) NOT NULL UNIQUE,
        username VARCHAR(100),
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'member',
        status VARCHAR(50) DEFAULT 'pending',
        phone VARCHAR(50),
        address TEXT,
        student_id VARCHAR(50),
        school VARCHAR(255),
        course VARCHAR(255),
        year_level VARCHAR(50),
        qr_code VARCHAR(255),
        library_card_number VARCHAR(100),
        school_id_url TEXT,
        profile_photo_url TEXT,
        registered_at DATE,
        created_at DATETIME,
        updated_at DATETIME
    )");

    // 3. Categories table
    $pdo->exec("CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(50) PRIMARY KEY,
        category_id VARCHAR(50),
        name VARCHAR(150) NOT NULL UNIQUE,
        created_at DATETIME,
        updated_at DATETIME
    )");

    // 4. Authors table
    $pdo->exec("CREATE TABLE IF NOT EXISTS authors (
        id VARCHAR(50) PRIMARY KEY,
        author_id VARCHAR(50),
        name VARCHAR(150) NOT NULL UNIQUE,
        created_at DATETIME,
        updated_at DATETIME
    )");

    // 5. Publishers table
    $pdo->exec("CREATE TABLE IF NOT EXISTS publishers (
        id VARCHAR(50) PRIMARY KEY,
        publisher_id VARCHAR(50),
        name VARCHAR(150) NOT NULL UNIQUE,
        created_at DATETIME,
        updated_at DATETIME
    )");

    // 6. Books table
    $pdo->exec("CREATE TABLE IF NOT EXISTS books (
        id VARCHAR(50) PRIMARY KEY,
        book_id VARCHAR(50),
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255),
        category VARCHAR(150),
        publisher VARCHAR(150),
        publication_year INT,
        accession_number VARCHAR(100) UNIQUE,
        isbn VARCHAR(50),
        shelf_location VARCHAR(100),
        format VARCHAR(50),
        quantity INT DEFAULT 1,
        available INT DEFAULT 1,
        `condition` VARCHAR(50) DEFAULT 'Good',
        status VARCHAR(50) DEFAULT 'active',
        cover_color VARCHAR(50) DEFAULT '#3b82f6',
        qr_code VARCHAR(255),
        created_at DATETIME,
        updated_at DATETIME
    )");

    // 7. Borrowings table
    $pdo->exec("CREATE TABLE IF NOT EXISTS borrowings (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        book_id VARCHAR(50) NOT NULL,
        borrow_date DATE NOT NULL,
        due_date DATE NOT NULL,
        return_date DATE NULL,
        status VARCHAR(50) DEFAULT 'active',
        renew_count INT DEFAULT 0,
        fine_amount DECIMAL(10,2) DEFAULT 0.00,
        processed_by VARCHAR(50),
        created_at DATETIME,
        updated_at DATETIME
    )");

    // 8. Reservations table
    $pdo->exec("CREATE TABLE IF NOT EXISTS reservations (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        book_id VARCHAR(50) NOT NULL,
        reserved_date DATE NOT NULL,
        pickup_deadline DATE NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at DATETIME,
        updated_at DATETIME
    )");

    // 9. Fines table
    $pdo->exec("CREATE TABLE IF NOT EXISTS fines (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        borrowing_id VARCHAR(50) NULL,
        amount DECIMAL(10,2) NOT NULL,
        reason VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        paid_at DATETIME NULL,
        processed_by VARCHAR(50),
        created_at DATETIME,
        updated_at DATETIME
    )");

    // 10. Attendance table
    $pdo->exec("CREATE TABLE IF NOT EXISTS attendance (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        time_in TIME NOT NULL,
        time_out TIME NULL,
        status VARCHAR(50) DEFAULT 'inside',
        source VARCHAR(50) DEFAULT 'QR_KIOSK',
        created_at DATETIME,
        updated_at DATETIME
    )");

    // 11. Notifications table
    $pdo->exec("CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        read_status TINYINT(1) DEFAULT 0,
        created_at DATETIME
    )");

    // 12. Announcements table
    $pdo->exec("CREATE TABLE IF NOT EXISTS announcements (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'published',
        publish_date DATE,
        expiration_date DATE NULL,
        created_by VARCHAR(50),
        created_at DATETIME,
        updated_at DATETIME
    )");

    // 13. Favorites table
    $pdo->exec("CREATE TABLE IF NOT EXISTS favorites (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        book_id VARCHAR(50) NOT NULL,
        created_at DATETIME
    )");

    // 14. Book Requests (Acquisition recommendations & general requests) table
    $pdo->exec("CREATE TABLE IF NOT EXISTS book_requests (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        request_type VARCHAR(50) DEFAULT 'acquisition',
        book_id VARCHAR(50) NULL,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255),
        publisher VARCHAR(150),
        isbn VARCHAR(50),
        reason TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        approver_id VARCHAR(50) NULL,
        remarks TEXT NULL,
        created_at DATETIME,
        updated_at DATETIME
    )");

    // 15. Activity Logs (Member personal log) table
    $pdo->exec("CREATE TABLE IF NOT EXISTS activity_logs (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        action VARCHAR(100) NOT NULL,
        target VARCHAR(255),
        activity_type VARCHAR(50) DEFAULT 'general',
        created_at DATETIME
    )");

    // 16. Audit Logs (Administrative audit trail) table
    $pdo->exec("CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        user_name VARCHAR(150),
        role VARCHAR(50),
        action VARCHAR(100) NOT NULL,
        module VARCHAR(100) NOT NULL,
        target_id VARCHAR(100),
        description TEXT,
        ip_address VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Completed',
        created_at DATETIME
    )");

    // 17. System Logs (System errors & warnings) table
    $pdo->exec("CREATE TABLE IF NOT EXISTS system_logs (
        id VARCHAR(50) PRIMARY KEY,
        level VARCHAR(50) NOT NULL,
        channel VARCHAR(100) DEFAULT 'system',
        message TEXT NOT NULL,
        context TEXT NULL,
        created_at DATETIME
    )");

    // 18. Recycle Bin (Soft deletion recovery) table
    $pdo->exec("CREATE TABLE IF NOT EXISTS recycle_bin (
        id VARCHAR(50) PRIMARY KEY,
        item_id VARCHAR(100) NOT NULL,
        item_type VARCHAR(50) NOT NULL,
        item_name VARCHAR(255),
        deleted_by VARCHAR(50),
        data_payload LONGTEXT,
        deleted_at DATETIME
    )");

    // 19. System Settings table
    $pdo->exec("CREATE TABLE IF NOT EXISTS system_settings (
        id VARCHAR(50) PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT NOT NULL,
        setting_group VARCHAR(50) DEFAULT 'general',
        description VARCHAR(255),
        updated_at DATETIME
    )");

    // 20. Backups table
    $pdo->exec("CREATE TABLE IF NOT EXISTS backups (
        id VARCHAR(50) PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        file_size VARCHAR(50),
        total_tables INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Success',
        created_by VARCHAR(50),
        created_at DATETIME
    )");

    echo "All 20 database tables initialized successfully.\n";
}

if (basename(__FILE__) === basename($_SERVER['SCRIPT_FILENAME'] ?? '')) {
    initializeDatabaseSchema();
}
