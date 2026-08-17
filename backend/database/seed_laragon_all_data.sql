-- =====================================================================
-- BALINGASAG PUBLIC LIBRARY MANAGEMENT SYSTEM
-- COMPLETE DATABASE IMPORT & ALL INITIAL DATA FOR LARAGON / MYSQL
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `library_management`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `library_management`;

SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- TABLE CLEANUP & RE-CREATION
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `authors`;
DROP TABLE IF EXISTS `publishers`;
DROP TABLE IF EXISTS `books`;
DROP TABLE IF EXISTS `borrowings`;
DROP TABLE IF EXISTS `reservations`;
DROP TABLE IF EXISTS `fines`;
DROP TABLE IF EXISTS `attendance`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `announcements`;
DROP TABLE IF EXISTS `favorites`;
DROP TABLE IF EXISTS `book_requests`;
DROP TABLE IF EXISTS `activity_logs`;
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `system_logs`;
DROP TABLE IF EXISTS `recycle_bin`;
DROP TABLE IF EXISTS `system_settings`;
DROP TABLE IF EXISTS `backups`;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Roles
CREATE TABLE `roles` (
  `id` VARCHAR(50) PRIMARY KEY,
  `role_name` VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`id`, `role_name`) VALUES
  ('super_admin', 'super_admin'),
  ('admin', 'admin'),
  ('member', 'member');

-- 2. Users
CREATE TABLE `users` (
  `id` VARCHAR(50) PRIMARY KEY,
  `user_id` VARCHAR(50),
  `name` VARCHAR(150) NOT NULL,
  `first_name` VARCHAR(100),
  `middle_name` VARCHAR(100),
  `last_name` VARCHAR(100),
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `username` VARCHAR(100),
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'member',
  `status` VARCHAR(50) DEFAULT 'pending',
  `phone` VARCHAR(50),
  `address` TEXT,
  `student_id` VARCHAR(50),
  `school` VARCHAR(255),
  `course` VARCHAR(255),
  `year_level` VARCHAR(50),
  `qr_code` VARCHAR(255),
  `library_card_number` VARCHAR(100),
  `school_id_url` TEXT,
  `profile_photo_url` TEXT,
  `registered_at` DATE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_users_role` (`role`),
  KEY `idx_users_status` (`status`),
  KEY `idx_users_student_id` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default password for super_admin: superadmin123
-- Default password for other seeded users: admin123
INSERT INTO `users` (`id`, `user_id`, `name`, `first_name`, `middle_name`, `last_name`, `email`, `username`, `password_hash`, `role`, `status`, `phone`, `address`, `student_id`, `school`, `course`, `year_level`, `qr_code`, `library_card_number`, `school_id_url`, `registered_at`, `created_at`) VALUES
('u-super', 'u-super', 'Super Administrator', 'Super', 'System', 'Admin', 'superadmin@balingasag.gov.ph', 'superadmin', '$2y$12$SGFgcJyQGjO9yh7rV6nzle4Q6KLCc21nYtUSZjYLrZkR7B2T1V5iu', 'super_admin', 'active', '09170000001', 'Municipal Hall, Balingasag, Misamis Oriental', 'STAFF-001', 'Balingasag Municipal Library', 'Library Administration', 'Staff', 'LIB-MEM-USUPER-2026', 'LIB-USUPER-2026', NULL, '2026-01-01', NOW()),
('u-admin', 'u-admin', 'Elena Santos', 'Elena', 'Maria', 'Santos', 'admin@balingasag.gov.ph', 'admin', '$2y$12$jn/vscioDisB7b3bnqi/eeSlL/VitkXoQEeOhWcek8W0btxnMjl4W', 'admin', 'active', '09171234567', 'Brgy. Waterfall, Balingasag, Misamis Oriental', 'STAFF-002', 'Balingasag Municipal Library', 'Head Librarian', 'Staff', 'LIB-MEM-UADMIN-2026', 'LIB-UADMIN-2026', NULL, '2026-01-05', NOW()),
('u-1', 'u-1', 'Maria Clara de los Santos', 'Maria Clara', 'Alonzo', 'de los Santos', 'maria.clara@balingasag.edu.ph', 'mariaclara', '$2y$12$jn/vscioDisB7b3bnqi/eeSlL/VitkXoQEeOhWcek8W0btxnMjl4W', 'member', 'active', '09181234567', 'Brgy. Poblacion 1, Balingasag, Misamis Oriental', '2026-00101', 'Misamis Oriental Institute of Science and Technology', 'BS Information Technology', '3rd Year', 'LIB-MEM-U1-2026', 'LIB-U1-2026', 'school_id_placeholder.jpg', '2026-01-10', NOW()),
('u-2', 'u-2', 'Crisostomo Ibarra', 'Crisostomo', 'Magsalin', 'Ibarra', 'ibarra@sanroque.edu.ph', 'ibarra', '$2y$12$jn/vscioDisB7b3bnqi/eeSlL/VitkXoQEeOhWcek8W0btxnMjl4W', 'member', 'active', '09191234568', 'Brgy. Hermano, Balingasag, Misamis Oriental', '2026-00102', 'Balingasag National High School', 'STEM Strand', 'Grade 12', 'LIB-MEM-U2-2026', 'LIB-U2-2026', 'school_id_placeholder.jpg', '2026-01-12', NOW()),
('u-3', 'u-3', 'Juan Dela Cruz', 'Juan', 'Bautista', 'Dela Cruz', 'juan.delacruz@balingasag.edu.ph', 'juandelacruz', '$2y$12$jn/vscioDisB7b3bnqi/eeSlL/VitkXoQEeOhWcek8W0btxnMjl4W', 'member', 'active', '09201234569', 'Brgy. Baliwagan, Balingasag, Misamis Oriental', '2026-00103', 'St. Rita College of Balingasag', 'BS Secondary Education', '2nd Year', 'LIB-MEM-U3-2026', 'LIB-U3-2026', 'school_id_placeholder.jpg', '2026-01-15', NOW()),
('u-4', 'u-4', 'Ana Valenzuela', 'Ana', 'Reyes', 'Valenzuela', 'ana.valenzuela@balingasag.edu.ph', 'anavalenzuela', '$2y$12$jn/vscioDisB7b3bnqi/eeSlL/VitkXoQEeOhWcek8W0btxnMjl4W', 'member', 'pending', '09211234570', 'Brgy. Tal-ao, Balingasag, Misamis Oriental', '2026-00104', 'Misamis Oriental State College', 'BS Criminology', '1st Year', 'LIB-MEM-U4-2026', 'LIB-U4-2026', 'school_id_placeholder.jpg', '2026-02-01', NOW()),
('u-5', 'u-5', 'Mark Anthony Reyes', 'Mark Anthony', 'Cruz', 'Reyes', 'mark.reyes@balingasag.edu.ph', 'markreyes', '$2y$12$jn/vscioDisB7b3bnqi/eeSlL/VitkXoQEeOhWcek8W0btxnMjl4W', 'member', 'suspended', '09221234571', 'Brgy. Mandangoa, Balingasag, Misamis Oriental', '2026-00105', 'Balingasag Central School', 'Elementary Education', 'Faculty / Staff', 'LIB-MEM-U5-2026', 'LIB-U5-2026', 'school_id_placeholder.jpg', '2026-01-20', NOW());

-- 3. Categories
CREATE TABLE `categories` (
  `id` VARCHAR(50) PRIMARY KEY,
  `category_id` VARCHAR(50),
  `name` VARCHAR(150) NOT NULL UNIQUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`id`, `category_id`, `name`) VALUES
('cat-1', 'cat-1', 'Philippine Literature'),
('cat-2', 'cat-2', 'Computer Science & IT'),
('cat-3', 'cat-3', 'General Science'),
('cat-4', 'cat-4', 'World History'),
('cat-5', 'cat-5', 'Mathematics'),
('cat-6', 'cat-6', 'Business & Economics'),
('cat-7', 'cat-7', 'Children Books & Fiction'),
('cat-8', 'cat-8', 'Philosophy & Ethics');

-- 4. Authors
CREATE TABLE `authors` (
  `id` VARCHAR(50) PRIMARY KEY,
  `author_id` VARCHAR(50),
  `name` VARCHAR(150) NOT NULL UNIQUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `authors` (`id`, `author_id`, `name`) VALUES
('auth-1', 'auth-1', 'Dr. Jose Rizal'),
('auth-2', 'auth-2', 'Nick Joaquin'),
('auth-3', 'auth-3', 'F. Sionil Jose'),
('auth-4', 'auth-4', 'Robert C. Martin'),
('auth-5', 'auth-5', 'Donald E. Knuth'),
('auth-6', 'auth-6', 'Richard Feynman'),
('auth-7', 'auth-7', 'Stephen Hawking'),
('auth-8', 'auth-8', 'Yuval Noah Harari');

-- 5. Publishers
CREATE TABLE `publishers` (
  `id` VARCHAR(50) PRIMARY KEY,
  `publisher_id` VARCHAR(50),
  `name` VARCHAR(150) NOT NULL UNIQUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `publishers` (`id`, `publisher_id`, `name`) VALUES
('pub-1', 'pub-1', 'Anvil Publishing'),
('pub-2', 'pub-2', 'Rex Book Store'),
('pub-3', 'pub-3', 'Prentice Hall'),
('pub-4', 'pub-4', 'Addison-Wesley Professional'),
('pub-5', 'pub-5', 'O Reilly Media'),
('pub-6', 'pub-6', 'HarperCollins Publishers'),
('pub-7', 'pub-7', 'Bantam Books');

-- 6. Books
CREATE TABLE `books` (
  `id` VARCHAR(50) PRIMARY KEY,
  `book_id` VARCHAR(50),
  `title` VARCHAR(255) NOT NULL,
  `author` VARCHAR(255),
  `category` VARCHAR(150),
  `publisher` VARCHAR(150),
  `publication_year` INT,
  `accession_number` VARCHAR(100) UNIQUE,
  `isbn` VARCHAR(50),
  `shelf_location` VARCHAR(100),
  `format` VARCHAR(50) DEFAULT 'Paperback',
  `quantity` INT DEFAULT 1,
  `available` INT DEFAULT 1,
  `condition` VARCHAR(50) DEFAULT 'Good',
  `status` VARCHAR(50) DEFAULT 'active',
  `cover_color` VARCHAR(50) DEFAULT '#0f766e',
  `qr_code` VARCHAR(255),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_books_title` (`title`),
  KEY `idx_books_status` (`status`),
  KEY `idx_books_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `books` (`id`, `book_id`, `title`, `author`, `category`, `publisher`, `publication_year`, `accession_number`, `isbn`, `shelf_location`, `format`, `quantity`, `available`, `condition`, `status`, `cover_color`, `qr_code`) VALUES
('b-1', 'b-1', 'Noli Me Tangere', 'Dr. Jose Rizal', 'Philippine Literature', 'Anvil Publishing', 1887, 'ACC-2026-0001', '978-9712708305', 'Shelf A-1 (Filipiniana)', 'Hardcover', 5, 4, 'Good', 'active', '#0f766e', 'LIB-BK-ACC-2026-0001'),
('b-2', 'b-2', 'El Filibusterismo', 'Dr. Jose Rizal', 'Philippine Literature', 'Anvil Publishing', 1891, 'ACC-2026-0002', '978-9712708312', 'Shelf A-1 (Filipiniana)', 'Hardcover', 4, 3, 'Good', 'active', '#0d9488', 'LIB-BK-ACC-2026-0002'),
('b-3', 'b-3', 'The Woman Who Had Two Navels', 'Nick Joaquin', 'Philippine Literature', 'Anvil Publishing', 1961, 'ACC-2026-0003', '978-9712701443', 'Shelf A-2 (Fiction)', 'Paperback', 3, 2, 'Fair', 'active', '#b45309', 'LIB-BK-ACC-2026-0003'),
('b-4', 'b-4', 'Clean Code: A Handbook of Agile Software Craftsmanship', 'Robert C. Martin', 'Computer Science & IT', 'Prentice Hall', 2008, 'ACC-2026-0004', '978-0132350884', 'Shelf C-1 (Technology)', 'Paperback', 6, 4, 'New', 'active', '#1e40af', 'LIB-BK-ACC-2026-0004'),
('b-5', 'b-5', 'The Art of Computer Programming, Vol. 1', 'Donald E. Knuth', 'Computer Science & IT', 'Addison-Wesley Professional', 1997, 'ACC-2026-0005', '978-0201896831', 'Shelf C-2 (Algorithms)', 'Hardcover', 2, 2, 'Good', 'active', '#1d4ed8', 'LIB-BK-ACC-2026-0005'),
('b-6', 'b-6', 'Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 'World History', 'HarperCollins Publishers', 2014, 'ACC-2026-0006', '978-0062316097', 'Shelf H-1 (Social Science)', 'Paperback', 5, 3, 'Good', 'active', '#854d0e', 'LIB-BK-ACC-2026-0006'),
('b-7', 'b-7', 'A Brief History of Time', 'Stephen Hawking', 'General Science', 'Bantam Books', 1988, 'ACC-2026-0007', '978-0553380163', 'Shelf S-1 (Physics & Cosmos)', 'Paperback', 4, 3, 'Good', 'active', '#3730a3', 'LIB-BK-ACC-2026-0007'),
('b-8', 'b-8', 'Surely You Are Joking, Mr. Feynman!', 'Richard Feynman', 'General Science', 'Rex Book Store', 1985, 'ACC-2026-0008', '978-0393316049', 'Shelf S-2 (Biographies)', 'Paperback', 3, 2, 'Good', 'active', '#047857', 'LIB-BK-ACC-2026-0008');

-- 7. Borrowings
CREATE TABLE `borrowings` (
  `id` VARCHAR(50) PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `book_id` VARCHAR(50) NOT NULL,
  `borrow_date` DATE NOT NULL,
  `due_date` DATE NOT NULL,
  `return_date` DATE NULL,
  `status` VARCHAR(50) DEFAULT 'active',
  `renew_count` INT DEFAULT 0,
  `fine_amount` DECIMAL(10,2) DEFAULT 0.00,
  `processed_by` VARCHAR(50),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_borrowings_user` (`user_id`),
  KEY `idx_borrowings_book` (`book_id`),
  KEY `idx_borrowings_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `borrowings` (`id`, `user_id`, `book_id`, `borrow_date`, `due_date`, `return_date`, `status`, `renew_count`, `fine_amount`, `processed_by`) VALUES
('brw-1', 'u-1', 'b-1', DATE_SUB(CURRENT_DATE, INTERVAL 4 DAY), DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY), NULL, 'active', 0, 0.00, 'u-admin'),
('brw-2', 'u-2', 'b-4', DATE_SUB(CURRENT_DATE, INTERVAL 6 DAY), DATE_ADD(CURRENT_DATE, INTERVAL 8 DAY), NULL, 'active', 1, 0.00, 'u-admin'),
('brw-3', 'u-3', 'b-6', DATE_SUB(CURRENT_DATE, INTERVAL 20 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 6 DAY), NULL, 'overdue', 0, 30.00, 'u-admin'),
('brw-4', 'u-1', 'b-7', DATE_SUB(CURRENT_DATE, INTERVAL 25 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 11 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 12 DAY), 'returned', 0, 0.00, 'u-admin'),
('brw-5', 'u-2', 'b-2', DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 16 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 15 DAY), 'returned', 0, 5.00, 'u-admin');

-- 8. Reservations
CREATE TABLE `reservations` (
  `id` VARCHAR(50) PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `book_id` VARCHAR(50) NOT NULL,
  `reserved_date` DATE NOT NULL,
  `pickup_deadline` DATE NULL,
  `status` VARCHAR(50) DEFAULT 'pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_reservations_user` (`user_id`),
  KEY `idx_reservations_book` (`book_id`),
  KEY `idx_reservations_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `reservations` (`id`, `user_id`, `book_id`, `reserved_date`, `pickup_deadline`, `status`) VALUES
('res-1', 'u-1', 'b-2', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY), 'pending'),
('res-2', 'u-3', 'b-5', DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY), 'ready_for_pickup'),
('res-3', 'u-2', 'b-3', DATE_SUB(CURRENT_DATE, INTERVAL 10 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY), 'fulfilled');

-- 9. Fines
CREATE TABLE `fines` (
  `id` VARCHAR(50) PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `borrowing_id` VARCHAR(50) NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `reason` VARCHAR(255),
  `status` VARCHAR(50) DEFAULT 'pending',
  `paid_at` DATETIME NULL,
  `processed_by` VARCHAR(50),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_fines_user` (`user_id`),
  KEY `idx_fines_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `fines` (`id`, `user_id`, `borrowing_id`, `amount`, `reason`, `status`, `paid_at`, `processed_by`) VALUES
('fn-1', 'u-3', 'brw-3', 30.00, 'Overdue book return (6 days overdue @ 5.00 PHP/day)', 'pending', NULL, NULL),
('fn-2', 'u-2', 'brw-5', 5.00, 'Overdue book return (1 day overdue)', 'paid', NOW(), 'u-admin'),
('fn-3', 'u-5', NULL, 150.00, 'Lost library book replacement fee', 'pending', NULL, 'u-admin');

-- 10. Attendance
CREATE TABLE `attendance` (
  `id` VARCHAR(50) PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `date` DATE NOT NULL,
  `time_in` TIME NOT NULL,
  `time_out` TIME NULL,
  `status` VARCHAR(50) DEFAULT 'inside',
  `source` VARCHAR(50) DEFAULT 'QR_KIOSK',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_attendance_user_date` (`user_id`, `date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `attendance` (`id`, `user_id`, `date`, `time_in`, `time_out`, `status`, `source`) VALUES
('att-1', 'u-1', CURRENT_DATE, '08:15:00', NULL, 'inside', 'QR_SCAN'),
('att-2', 'u-2', CURRENT_DATE, '09:00:00', '11:30:00', 'completed', 'QR_SCAN'),
('att-3', 'u-3', CURRENT_DATE, '09:45:00', NULL, 'inside', 'MANUAL_ENTRY'),
('att-4', 'u-1', DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), '08:30:00', '12:00:00', 'completed', 'QR_SCAN'),
('att-5', 'u-2', DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), '13:00:00', '16:45:00', 'completed', 'QR_SCAN'),
('att-6', 'u-3', DATE_SUB(CURRENT_DATE, INTERVAL 2 DAY), '10:00:00', '14:30:00', 'completed', 'QR_SCAN');

-- 11. Notifications
CREATE TABLE `notifications` (
  `id` VARCHAR(50) PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `type` VARCHAR(50) DEFAULT 'info',
  `read_status` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_notifications_user` (`user_id`),
  KEY `idx_notifications_read` (`read_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `read_status`, `created_at`) VALUES
('notif-1', 'u-1', 'Book Issued Successfully', 'You have borrowed Noli Me Tangere. Due date is set for 14 days from today.', 'success', 1, DATE_SUB(NOW(), INTERVAL 4 DAY)),
('notif-2', 'u-3', 'Overdue Book Reminder', 'Your borrowed book Sapiens is currently overdue. Please return it to avoid additional late penalties.', 'warning', 0, DATE_SUB(NOW(), INTERVAL 1 DAY)),
('notif-3', 'u-2', 'Reservation Ready for Pickup', 'The Art of Computer Programming is now ready at the library front desk for pickup.', 'info', 0, NOW());

-- 12. Announcements
CREATE TABLE `announcements` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `status` VARCHAR(50) DEFAULT 'published',
  `publish_date` DATE,
  `expiration_date` DATE NULL,
  `created_by` VARCHAR(50),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_announcements_status` (`status`),
  KEY `idx_announcements_publish_date` (`publish_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `announcements` (`id`, `title`, `content`, `status`, `publish_date`, `expiration_date`, `created_by`) VALUES
('ann-1', 'National Book Week Celebration 2026', 'Join us at the Balingasag Municipal Library for book displays, essay writing contests, and reading sessions from November 24-30.', 'published', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY), 'u-admin'),
('ann-2', 'Extended Library Operating Hours', 'Starting this month, the library reading room and computer research station will remain open until 6:30 PM on weekdays.', 'published', DATE_SUB(CURRENT_DATE, INTERVAL 5 DAY), NULL, 'u-admin'),
('ann-3', 'Digital QR Membership Cards Now Available', 'All registered students and residents can now view and download their digital QR membership card directly from the member portal.', 'published', DATE_SUB(CURRENT_DATE, INTERVAL 15 DAY), NULL, 'u-super');

-- 13. Favorites
CREATE TABLE `favorites` (
  `id` VARCHAR(50) PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `book_id` VARCHAR(50) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_favorites_user_book` (`user_id`, `book_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `favorites` (`id`, `user_id`, `book_id`) VALUES
('fav-1', 'u-1', 'b-1'),
('fav-2', 'u-1', 'b-4'),
('fav-3', 'u-2', 'b-5'),
('fav-4', 'u-3', 'b-6');

-- 14. Book Requests
CREATE TABLE `book_requests` (
  `id` VARCHAR(50) PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `request_type` VARCHAR(50) DEFAULT 'acquisition',
  `book_id` VARCHAR(50) NULL,
  `title` VARCHAR(255) NOT NULL,
  `author` VARCHAR(255),
  `publisher` VARCHAR(150),
  `isbn` VARCHAR(50),
  `reason` TEXT,
  `status` VARCHAR(50) DEFAULT 'pending',
  `approver_id` VARCHAR(50) NULL,
  `remarks` TEXT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_book_requests_user` (`user_id`),
  KEY `idx_book_requests_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `book_requests` (`id`, `user_id`, `request_type`, `book_id`, `title`, `author`, `publisher`, `isbn`, `reason`, `status`, `approver_id`, `remarks`) VALUES
('req-1', 'u-1', 'acquisition', NULL, 'Designing Data-Intensive Applications', 'Martin Kleppmann', 'O Reilly Media', '978-1449373320', 'Needed for final year database research and thesis', 'approved', 'u-admin', 'Acquisition request approved for library stock.'),
('req-2', 'u-2', 'acquisition', NULL, 'Introduction to Algorithms (CLRS)', 'Thomas H. Cormen', 'MIT Press', '978-0262033848', 'Reference book for upcoming programming competition', 'pending', NULL, NULL);

-- 15. Activity Logs
CREATE TABLE `activity_logs` (
  `id` VARCHAR(50) PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `target` VARCHAR(255),
  `activity_type` VARCHAR(50) DEFAULT 'general',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_activity_logs_user` (`user_id`),
  KEY `idx_activity_logs_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `activity_logs` (`id`, `user_id`, `action`, `target`, `activity_type`, `created_at`) VALUES
('act-1', 'u-1', 'Checked in via QR Kiosk', 'Balingasag Library Entrance', 'attendance', NOW()),
('act-2', 'u-1', 'Borrowed Book', 'Noli Me Tangere', 'borrowing', DATE_SUB(NOW(), INTERVAL 4 DAY)),
('act-3', 'u-2', 'Reserved Book', 'El Filibusterismo', 'reservation', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('act-4', 'u-admin', 'Approved Registration', 'Juan Dela Cruz (u-3)', 'user_management', DATE_SUB(NOW(), INTERVAL 3 DAY));

-- 16. Audit Logs
CREATE TABLE `audit_logs` (
  `id` VARCHAR(50) PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `user_name` VARCHAR(150),
  `role` VARCHAR(50),
  `action` VARCHAR(100) NOT NULL,
  `module` VARCHAR(100) NOT NULL,
  `target_id` VARCHAR(100),
  `description` TEXT,
  `ip_address` VARCHAR(100),
  `status` VARCHAR(50) DEFAULT 'Completed',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_audit_logs_user` (`user_id`),
  KEY `idx_audit_logs_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `audit_logs` (`id`, `user_id`, `user_name`, `role`, `action`, `module`, `target_id`, `description`, `ip_address`, `status`, `created_at`) VALUES
('aud-1', 'u-super', 'Super Administrator', 'super_admin', 'System Initialized', 'System Core', 'SYSTEM', 'Configured database and seeded production master data.', '127.0.0.1', 'Completed', NOW()),
('aud-2', 'u-admin', 'Elena Santos', 'admin', 'Book Created', 'Book Management', 'b-1', 'Cataloged Noli Me Tangere into Filipiniana collection.', '127.0.0.1', 'Completed', DATE_SUB(NOW(), INTERVAL 20 DAY)),
('aud-3', 'u-admin', 'Elena Santos', 'admin', 'User Approved', 'User Management', 'u-1', 'Approved registration for Maria Clara de los Santos.', '127.0.0.1', 'Completed', DATE_SUB(NOW(), INTERVAL 15 DAY));

-- 17. System Logs
CREATE TABLE `system_logs` (
  `id` VARCHAR(50) PRIMARY KEY,
  `level` VARCHAR(50) NOT NULL,
  `channel` VARCHAR(100) DEFAULT 'system',
  `message` TEXT NOT NULL,
  `context` TEXT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_system_logs_level` (`level`),
  KEY `idx_system_logs_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `system_logs` (`id`, `level`, `channel`, `message`, `context`, `created_at`) VALUES
('sys-1', 'info', 'auth', 'Super admin authenticated from 127.0.0.1', '{\"auth_method\":\"password\"}', NOW()),
('sys-2', 'info', 'scheduler', 'Overdue fine cron calculation processed successfully.', '{\"processed_count\":5}', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
('sys-3', 'info', 'database', 'Database health check OK. Storage engine InnoDB responsive.', '{\"driver\":\"mysql\"}', DATE_SUB(NOW(), INTERVAL 2 HOUR));

-- 18. Recycle Bin
CREATE TABLE `recycle_bin` (
  `id` VARCHAR(50) PRIMARY KEY,
  `item_id` VARCHAR(100) NOT NULL,
  `item_type` VARCHAR(50) NOT NULL,
  `item_name` VARCHAR(255),
  `deleted_by` VARCHAR(50),
  `data_payload` LONGTEXT,
  `deleted_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_recycle_bin_type` (`item_type`),
  KEY `idx_recycle_bin_deleted` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `recycle_bin` (`id`, `item_id`, `item_type`, `item_name`, `deleted_by`, `data_payload`, `deleted_at`) VALUES
('rec-1', 'b-old-99', 'book', 'Old Damaged Encyclopedia 1990', 'u-admin', '{\"id\":\"b-old-99\",\"title\":\"Old Damaged Encyclopedia 1990\",\"author\":\"Various\",\"condition\":\"Damaged\"}', DATE_SUB(NOW(), INTERVAL 2 DAY));

-- 19. System Settings
CREATE TABLE `system_settings` (
  `id` VARCHAR(50) PRIMARY KEY,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT NOT NULL,
  `setting_group` VARCHAR(50) DEFAULT 'general',
  `description` VARCHAR(255),
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `system_settings` (`id`, `setting_key`, `setting_value`, `setting_group`, `description`) VALUES
('st-1', 'library_name', 'Balingasag Municipal Public Library', 'general', 'Official Name of the Library'),
('st-2', 'fine_rate_per_day', '5.00', 'circulation', 'Late fee amount charged per day (in PHP)'),
('st-3', 'max_borrow_days', '14', 'circulation', 'Maximum loan period for members in days'),
('st-4', 'max_borrow_limit', '3', 'circulation', 'Maximum number of concurrent books allowed per member'),
('st-5', 'max_renewals', '2', 'circulation', 'Maximum number of times a loan can be renewed'),
('st-6', 'operating_hours', '8:00 AM - 5:00 PM (Mon-Fri)', 'general', 'Public visiting and library operating hours'),
('st-7', 'contact_email', 'library@balingasag.gov.ph', 'general', 'Public support and contact email'),
('st-8', 'contact_phone', '(088) 333-1234 / 0917-888-0000', 'general', 'Municipal library telephone line');

-- 20. Backups
CREATE TABLE `backups` (
  `id` VARCHAR(50) PRIMARY KEY,
  `filename` VARCHAR(255) NOT NULL,
  `file_size` VARCHAR(50),
  `total_tables` INT DEFAULT 0,
  `status` VARCHAR(50) DEFAULT 'Success',
  `created_by` VARCHAR(50),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_backups_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `backups` (`id`, `filename`, `file_size`, `total_tables`, `status`, `created_by`, `created_at`) VALUES
('bk-1', 'backup_balingasag_library_initial.sql', '45.2 KB', 20, 'Success', 'u-super', NOW());

-- =====================================================================
-- COMPLETED SCRIPT
-- =====================================================================
