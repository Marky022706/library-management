-- =====================================================================
-- BALINGASAG MUNICIPAL LIBRARY MANAGEMENT SYSTEM - MySQL/Laragon Schema
-- Finalized for Laragon, MySQL 8+/MariaDB with InnoDB
-- =====================================================================

CREATE DATABASE IF NOT EXISTS balingasag_library
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE balingasag_library;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS fines;
DROP TABLE IF EXISTS password_reset_codes;
DROP TABLE IF EXISTS qr_attendance;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS failed_jobs;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS job_batches;
DROP TABLE IF EXISTS migrations;
DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS personal_access_tokens;
DROP TABLE IF EXISTS sessions;

DROP TABLE IF EXISTS generated_reports;
DROP TABLE IF EXISTS library_policies;
DROP TABLE IF EXISTS book_copy_history;
DROP TABLE IF EXISTS book_archive_requests;
DROP TABLE IF EXISTS member_notes;
DROP TABLE IF EXISTS book_notes;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS announcements;
DROP TABLE IF EXISTS book_requests;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS inventory_scans;
DROP TABLE IF EXISTS inventory_sessions;
DROP TABLE IF EXISTS attendance_logs;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS borrow_transactions;
DROP TABLE IF EXISTS digital_reading_history;
DROP TABLE IF EXISTS digital_books;
DROP TABLE IF EXISTS book_copies;
DROP TABLE IF EXISTS book_categories;
DROP TABLE IF EXISTS book_authors;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS publishers;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS library_cards;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- ---------------------------------------------------------------------
-- 1. AUTHENTICATION & USER MANAGEMENT
-- ---------------------------------------------------------------------

CREATE TABLE roles (
    role_id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    role_name VARCHAR(20) NOT NULL,
    PRIMARY KEY (role_id),
    UNIQUE KEY uq_roles_role_name (role_name),
    CONSTRAINT chk_roles_role_name CHECK (role_name IN ('Super Admin','Admin','Librarian','Member'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE users (
    user_id        INT UNSIGNED NOT NULL AUTO_INCREMENT,
    role_id        INT UNSIGNED NOT NULL,
    school_id      VARCHAR(30) NULL,
    first_name     VARCHAR(50) NOT NULL,
    last_name      VARCHAR(50) NOT NULL,
    email          VARCHAR(100) NOT NULL,
    password_hash  VARCHAR(255) NOT NULL,
    phone_number   VARCHAR(20) NULL,
    account_status VARCHAR(15) NOT NULL DEFAULT 'Active',
    created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    UNIQUE KEY uq_users_school_id (school_id),
    UNIQUE KEY uq_users_email (email),
    KEY idx_users_role_id (role_id),
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(role_id),
    CONSTRAINT chk_users_account_status CHECK (account_status IN ('Active','Suspended','Inactive'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE library_cards (
    card_id       INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id       INT UNSIGNED NOT NULL,
    qr_code_value VARCHAR(100) NOT NULL,
    issued_date   DATE NOT NULL DEFAULT (CURRENT_DATE),
    card_status   VARCHAR(15) NOT NULL DEFAULT 'Active',
    PRIMARY KEY (card_id),
    UNIQUE KEY uq_library_cards_user_id (user_id),
    UNIQUE KEY uq_library_cards_qr_code_value (qr_code_value),
    CONSTRAINT fk_library_cards_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT chk_library_cards_status CHECK (card_status IN ('Active','Lost','Expired','Revoked'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. BOOK & COLLECTION MANAGEMENT
-- ---------------------------------------------------------------------

CREATE TABLE authors (
    author_id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    author_name VARCHAR(150) NOT NULL,
    PRIMARY KEY (author_id),
    UNIQUE KEY uq_authors_author_name (author_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE publishers (
    publisher_id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    publisher_name VARCHAR(150) NOT NULL,
    PRIMARY KEY (publisher_id),
    UNIQUE KEY uq_publishers_publisher_name (publisher_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE categories (
    category_id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL,
    PRIMARY KEY (category_id),
    UNIQUE KEY uq_categories_category_name (category_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE books (
    book_id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
    title             VARCHAR(255) NOT NULL,
    publisher_id      INT UNSIGNED NULL,
    publication_year  SMALLINT UNSIGNED NULL,
    description       TEXT NULL,
    cover_image_url   VARCHAR(255) NULL,
    cataloging_source VARCHAR(10) NOT NULL DEFAULT 'Manual',
    added_by          INT UNSIGNED NOT NULL,
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (book_id),
    KEY idx_books_publisher_id (publisher_id),
    KEY idx_books_added_by (added_by),
    CONSTRAINT fk_books_publisher FOREIGN KEY (publisher_id) REFERENCES publishers(publisher_id),
    CONSTRAINT fk_books_added_by FOREIGN KEY (added_by) REFERENCES users(user_id),
    CONSTRAINT chk_books_publication_year CHECK (publication_year IS NULL OR publication_year > 0),
    CONSTRAINT chk_books_cataloging_source CHECK (cataloging_source IN ('AI','Manual'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE book_authors (
    book_id   INT UNSIGNED NOT NULL,
    author_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (book_id, author_id),
    CONSTRAINT fk_book_authors_book FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    CONSTRAINT fk_book_authors_author FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE book_categories (
    book_id     INT UNSIGNED NOT NULL,
    category_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (book_id, category_id),
    KEY idx_book_categories_category (category_id),
    CONSTRAINT fk_book_categories_book FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    CONSTRAINT fk_book_categories_category FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE book_copies (
    copy_id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
    book_id           INT UNSIGNED NOT NULL,
    accession_number  VARCHAR(30) NOT NULL,
    qr_code_value     VARCHAR(100) NOT NULL,
    shelf_location    VARCHAR(50) NULL,
    copy_status       VARCHAR(20) NOT NULL DEFAULT 'Available',
    acquisition_date  DATE NOT NULL DEFAULT (CURRENT_DATE),
    PRIMARY KEY (copy_id),
    UNIQUE KEY uq_book_copies_accession_number (accession_number),
    UNIQUE KEY uq_book_copies_qr_code_value (qr_code_value),
    KEY idx_book_copies_book_id (book_id),
    KEY idx_book_copies_status (copy_status),
    CONSTRAINT fk_book_copies_book FOREIGN KEY (book_id) REFERENCES books(book_id),
    CONSTRAINT chk_book_copies_status CHECK (copy_status IN ('Available','Borrowed','Reserved','Damaged','Lost','Archived','Under Maintenance'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. DIGITAL LIBRARY MANAGEMENT
-- ---------------------------------------------------------------------

CREATE TABLE digital_books (
    digital_book_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    book_id         INT UNSIGNED NOT NULL,
    file_url        VARCHAR(255) NOT NULL,
    file_format     VARCHAR(10) NOT NULL,
    uploaded_by     INT UNSIGNED NOT NULL,
    uploaded_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (digital_book_id),
    UNIQUE KEY uq_digital_books_book_format (book_id, file_format),
    KEY idx_digital_books_uploaded_by (uploaded_by),
    CONSTRAINT fk_digital_books_book FOREIGN KEY (book_id) REFERENCES books(book_id),
    CONSTRAINT fk_digital_books_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES users(user_id),
    CONSTRAINT chk_digital_books_file_format CHECK (file_format IN ('PDF','ePub'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE digital_reading_history (
    reading_id       INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id          INT UNSIGNED NOT NULL,
    digital_book_id  INT UNSIGNED NOT NULL,
    accessed_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    duration_seconds INT UNSIGNED NULL,
    PRIMARY KEY (reading_id),
    KEY idx_digital_reading_user (user_id),
    KEY idx_digital_reading_book (digital_book_id),
    CONSTRAINT fk_digital_reading_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_digital_reading_book FOREIGN KEY (digital_book_id) REFERENCES digital_books(digital_book_id),
    CONSTRAINT chk_digital_reading_duration CHECK (duration_seconds IS NULL OR duration_seconds >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. CIRCULATION MANAGEMENT
-- ---------------------------------------------------------------------

CREATE TABLE borrow_transactions (
    transaction_id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    copy_id          INT UNSIGNED NOT NULL,
    user_id          INT UNSIGNED NOT NULL,
    id_document_url  VARCHAR(255) NOT NULL,
    request_date     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved_by      INT UNSIGNED NULL,
    approval_date    TIMESTAMP NULL DEFAULT NULL,
    borrow_date      DATE NULL,
    due_date         DATE NULL,
    return_date      DATE NULL,
    renewal_count    SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    status           VARCHAR(15) NOT NULL DEFAULT 'Pending',
    PRIMARY KEY (transaction_id),
    KEY idx_borrow_user_status (user_id, status),
    KEY idx_borrow_copy_status (copy_id, status),
    KEY idx_borrow_approved_by (approved_by),
    CONSTRAINT fk_borrow_copy FOREIGN KEY (copy_id) REFERENCES book_copies(copy_id),
    CONSTRAINT fk_borrow_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_borrow_approved_by FOREIGN KEY (approved_by) REFERENCES users(user_id),
    CONSTRAINT chk_borrow_status CHECK (status IN ('Pending','Approved','Rejected','Returned','Overdue')),
    CONSTRAINT chk_borrow_due_date CHECK (due_date IS NULL OR borrow_date IS NULL OR due_date >= borrow_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE reservations (
    reservation_id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
    book_id                     INT UNSIGNED NOT NULL,
    user_id                     INT UNSIGNED NOT NULL,
    reservation_date            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiry_date                 DATE NULL,
    status                      VARCHAR(15) NOT NULL DEFAULT 'Pending',
    fulfilled_by_transaction_id INT UNSIGNED NULL,
    PRIMARY KEY (reservation_id),
    UNIQUE KEY uq_reservations_fulfilled_transaction (fulfilled_by_transaction_id),
    KEY idx_reservations_book_status (book_id, status),
    KEY idx_reservations_user_id (user_id),
    CONSTRAINT fk_reservations_book FOREIGN KEY (book_id) REFERENCES books(book_id),
    CONSTRAINT fk_reservations_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_reservations_transaction FOREIGN KEY (fulfilled_by_transaction_id) REFERENCES borrow_transactions(transaction_id),
    CONSTRAINT chk_reservations_status CHECK (status IN ('Pending','Fulfilled','Cancelled','Expired'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. ATTENDANCE
-- ---------------------------------------------------------------------

CREATE TABLE attendance_logs (
    attendance_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id       INT UNSIGNED NOT NULL,
    time_in       TIMESTAMP NOT NULL,
    time_out      TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (attendance_id),
    KEY idx_attendance_user_date (user_id, time_in),
    CONSTRAINT fk_attendance_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT chk_attendance_time_out CHECK (time_out IS NULL OR time_out > time_in)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. INVENTORY MANAGEMENT
-- ---------------------------------------------------------------------

CREATE TABLE inventory_sessions (
    session_id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    conducted_by INT UNSIGNED NOT NULL,
    start_date   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date     TIMESTAMP NULL DEFAULT NULL,
    status       VARCHAR(15) NOT NULL DEFAULT 'In Progress',
    PRIMARY KEY (session_id),
    KEY idx_inventory_sessions_conducted_by (conducted_by),
    CONSTRAINT fk_inventory_sessions_conducted_by FOREIGN KEY (conducted_by) REFERENCES users(user_id),
    CONSTRAINT chk_inventory_sessions_status CHECK (status IN ('In Progress','Completed','Cancelled')),
    CONSTRAINT chk_inventory_sessions_dates CHECK (end_date IS NULL OR end_date >= start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE inventory_scans (
    scan_id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    session_id      INT UNSIGNED NOT NULL,
    copy_id         INT UNSIGNED NOT NULL,
    expected_status VARCHAR(20) NOT NULL,
    found_status    VARCHAR(20) NOT NULL,
    is_discrepancy  TINYINT(1) NOT NULL DEFAULT 0,
    scanned_by      INT UNSIGNED NOT NULL,
    scanned_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (scan_id),
    UNIQUE KEY uq_inventory_scans_session_copy (session_id, copy_id),
    KEY idx_inventory_scans_session (session_id),
    KEY idx_inventory_scans_copy_id (copy_id),
    KEY idx_inventory_scans_scanned_by (scanned_by),
    CONSTRAINT fk_inventory_scans_session FOREIGN KEY (session_id) REFERENCES inventory_sessions(session_id),
    CONSTRAINT fk_inventory_scans_copy FOREIGN KEY (copy_id) REFERENCES book_copies(copy_id),
    CONSTRAINT fk_inventory_scans_scanned_by FOREIGN KEY (scanned_by) REFERENCES users(user_id),
    CONSTRAINT chk_inventory_scans_expected_status CHECK (expected_status IN ('Available','Borrowed','Reserved','Damaged','Lost','Archived','Under Maintenance')),
    CONSTRAINT chk_inventory_scans_found_status CHECK (found_status IN ('Available','Borrowed','Reserved','Damaged','Lost','Archived','Under Maintenance'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. SEARCH, DISCOVERY & MEMBER SERVICES
-- ---------------------------------------------------------------------

CREATE TABLE favorites (
    user_id  INT UNSIGNED NOT NULL,
    book_id  INT UNSIGNED NOT NULL,
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, book_id),
    CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_favorites_book FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE book_requests (
    request_id       INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id          INT UNSIGNED NOT NULL,
    requested_title  VARCHAR(255) NOT NULL,
    requested_author VARCHAR(150) NULL,
    reason           TEXT NULL,
    request_date     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status           VARCHAR(15) NOT NULL DEFAULT 'Pending',
    acquired_book_id INT UNSIGNED NULL,
    PRIMARY KEY (request_id),
    KEY idx_book_requests_user_id (user_id),
    KEY idx_book_requests_acquired_book_id (acquired_book_id),
    CONSTRAINT fk_book_requests_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_book_requests_acquired_book FOREIGN KEY (acquired_book_id) REFERENCES books(book_id),
    CONSTRAINT chk_book_requests_status CHECK (status IN ('Pending','Approved','Rejected','Acquired'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. ANNOUNCEMENTS & NOTIFICATIONS
-- ---------------------------------------------------------------------

CREATE TABLE announcements (
    announcement_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    created_by      INT UNSIGNED NOT NULL,
    title           VARCHAR(150) NOT NULL,
    content         TEXT NOT NULL,
    publish_date    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiry_date     TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (announcement_id),
    KEY idx_announcements_created_by (created_by),
    CONSTRAINT fk_announcements_created_by FOREIGN KEY (created_by) REFERENCES users(user_id),
    CONSTRAINT chk_announcements_expiry CHECK (expiry_date IS NULL OR expiry_date > publish_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notifications (
    notification_id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id                 INT UNSIGNED NOT NULL,
    notification_type       VARCHAR(20) NOT NULL,
    message                 VARCHAR(255) NOT NULL,
    related_transaction_id  INT UNSIGNED NULL,
    related_reservation_id  INT UNSIGNED NULL,
    related_announcement_id INT UNSIGNED NULL,
    is_read                 TINYINT(1) NOT NULL DEFAULT 0,
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (notification_id),
    KEY idx_notifications_user_read (user_id, is_read),
    KEY idx_notifications_transaction (related_transaction_id),
    KEY idx_notifications_reservation (related_reservation_id),
    KEY idx_notifications_announcement (related_announcement_id),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_notifications_transaction FOREIGN KEY (related_transaction_id) REFERENCES borrow_transactions(transaction_id),
    CONSTRAINT fk_notifications_reservation FOREIGN KEY (related_reservation_id) REFERENCES reservations(reservation_id),
    CONSTRAINT fk_notifications_announcement FOREIGN KEY (related_announcement_id) REFERENCES announcements(announcement_id),
    CONSTRAINT chk_notifications_type CHECK (notification_type IN ('Due Date','Reservation','Announcement','Account','Approval')),
    CONSTRAINT chk_notifications_one_relation CHECK (
        ((related_transaction_id IS NOT NULL) +
         (related_reservation_id IS NOT NULL) +
         (related_announcement_id IS NOT NULL)) <= 1
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 9. ADMINISTRATIVE MANAGEMENT
-- ---------------------------------------------------------------------

CREATE TABLE audit_logs (
    log_id       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id      INT UNSIGNED NULL,
    action_type  VARCHAR(50) NOT NULL,
    entity_type  VARCHAR(50) NOT NULL,
    entity_id    INT UNSIGNED NULL,
    description  VARCHAR(500) NULL,
    ip_address   VARCHAR(45) NULL,
    performed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (log_id),
    KEY idx_audit_entity (entity_type, entity_id),
    KEY idx_audit_user_id (user_id),
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE book_notes (
    note_id    INT UNSIGNED NOT NULL AUTO_INCREMENT,
    book_id    INT UNSIGNED NOT NULL,
    created_by INT UNSIGNED NOT NULL,
    note_text  TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (note_id),
    KEY idx_book_notes_book_id (book_id),
    KEY idx_book_notes_created_by (created_by),
    CONSTRAINT fk_book_notes_book FOREIGN KEY (book_id) REFERENCES books(book_id),
    CONSTRAINT fk_book_notes_created_by FOREIGN KEY (created_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE member_notes (
    note_id    INT UNSIGNED NOT NULL AUTO_INCREMENT,
    member_id  INT UNSIGNED NOT NULL,
    created_by INT UNSIGNED NOT NULL,
    note_text  TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (note_id),
    KEY idx_member_notes_member_id (member_id),
    KEY idx_member_notes_created_by (created_by),
    CONSTRAINT fk_member_notes_member FOREIGN KEY (member_id) REFERENCES users(user_id),
    CONSTRAINT fk_member_notes_created_by FOREIGN KEY (created_by) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE book_archive_requests (
    request_id   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    copy_id      INT UNSIGNED NOT NULL,
    requested_by INT UNSIGNED NOT NULL,
    reason       VARCHAR(500) NOT NULL,
    request_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_by  INT UNSIGNED NULL,
    review_date  TIMESTAMP NULL DEFAULT NULL,
    status       VARCHAR(15) NOT NULL DEFAULT 'Pending',
    PRIMARY KEY (request_id),
    KEY idx_book_archive_copy_id (copy_id),
    KEY idx_book_archive_requested_by (requested_by),
    KEY idx_book_archive_reviewed_by (reviewed_by),
    CONSTRAINT fk_book_archive_copy FOREIGN KEY (copy_id) REFERENCES book_copies(copy_id),
    CONSTRAINT fk_book_archive_requested_by FOREIGN KEY (requested_by) REFERENCES users(user_id),
    CONSTRAINT fk_book_archive_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES users(user_id),
    CONSTRAINT chk_book_archive_status CHECK (status IN ('Pending','Approved','Rejected'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE book_copy_history (
    history_id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    copy_id            INT UNSIGNED NOT NULL,
    event_type         VARCHAR(20) NOT NULL,
    old_value          VARCHAR(100) NULL,
    new_value          VARCHAR(100) NULL,
    performed_by       INT UNSIGNED NULL,
    archive_request_id INT UNSIGNED NULL,
    event_date         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes              VARCHAR(500) NULL,
    PRIMARY KEY (history_id),
    KEY idx_book_copy_history_copy_id (copy_id),
    KEY idx_book_copy_history_performed_by (performed_by),
    KEY idx_book_copy_history_archive_request (archive_request_id),
    CONSTRAINT fk_book_copy_history_copy FOREIGN KEY (copy_id) REFERENCES book_copies(copy_id),
    CONSTRAINT fk_book_copy_history_performed_by FOREIGN KEY (performed_by) REFERENCES users(user_id),
    CONSTRAINT fk_book_copy_history_archive_request FOREIGN KEY (archive_request_id) REFERENCES book_archive_requests(request_id),
    CONSTRAINT chk_book_copy_history_event CHECK (event_type IN ('Borrowed','Returned','Repaired','Relocated','Status Updated','Archived','Restored'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE library_policies (
    policy_id                INT UNSIGNED NOT NULL AUTO_INCREMENT,
    max_books_per_member     INT UNSIGNED NOT NULL DEFAULT 3,
    loan_duration_days       INT UNSIGNED NOT NULL DEFAULT 7,
    reservation_period_days  INT UNSIGNED NOT NULL DEFAULT 3,
    max_renewals             INT UNSIGNED NOT NULL DEFAULT 1,
    opening_time             TIME NOT NULL DEFAULT '08:00:00',
    closing_time             TIME NOT NULL DEFAULT '17:00:00',
    updated_by               INT UNSIGNED NULL,
    updated_at               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (policy_id),
    KEY idx_library_policies_updated_by (updated_by),
    CONSTRAINT fk_library_policies_updated_by FOREIGN KEY (updated_by) REFERENCES users(user_id),
    CONSTRAINT chk_library_policies_max_books CHECK (max_books_per_member > 0),
    CONSTRAINT chk_library_policies_loan_duration CHECK (loan_duration_days > 0),
    CONSTRAINT chk_library_policies_reservation_days CHECK (reservation_period_days > 0),
    CONSTRAINT chk_library_policies_max_renewals CHECK (max_renewals >= 0),
    CONSTRAINT chk_library_policies_hours CHECK (closing_time > opening_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 10. REPORTS
-- ---------------------------------------------------------------------

CREATE TABLE generated_reports (
    report_id    INT UNSIGNED NOT NULL AUTO_INCREMENT,
    generated_by INT UNSIGNED NOT NULL,
    report_type  VARCHAR(50) NOT NULL,
    file_format  VARCHAR(10) NOT NULL,
    file_url     VARCHAR(255) NOT NULL,
    generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (report_id),
    KEY idx_generated_reports_generated_by (generated_by),
    CONSTRAINT fk_generated_reports_generated_by FOREIGN KEY (generated_by) REFERENCES users(user_id),
    CONSTRAINT chk_generated_reports_format CHECK (file_format IN ('PDF','Excel'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- RECOMMENDED INDEXES
-- ---------------------------------------------------------------------
CREATE INDEX idx_books_title ON books(title);

-- ---------------------------------------------------------------------
-- STARTER DATA
-- Password for all starter accounts: password123
-- ---------------------------------------------------------------------

INSERT INTO roles (role_name) VALUES
('Super Admin'),
('Admin'),
('Librarian'),
('Member');

INSERT INTO users (role_id, school_id, first_name, last_name, email, password_hash, phone_number, account_status) VALUES
((SELECT role_id FROM roles WHERE role_name = 'Super Admin'), 'SA-2026-0001', 'System', 'SuperAdmin', 'superadmin@balingasag.gov.ph', '$2y$12$yhgTrh5yqoebQE0.PWoAbO38MRxSudfX5bVagR6ZRTt.KJTArNx6q', '09170000001', 'Active'),
((SELECT role_id FROM roles WHERE role_name = 'Admin'), 'ADM-2026-0002', 'Library', 'Admin', 'admin@balingasag.gov.ph', '$2y$12$yhgTrh5yqoebQE0.PWoAbO38MRxSudfX5bVagR6ZRTt.KJTArNx6q', '09170000002', 'Active'),
((SELECT role_id FROM roles WHERE role_name = 'Librarian'), 'LIB-2026-0003', 'Maria', 'Librarian', 'librarian@balingasag.gov.ph', '$2y$12$yhgTrh5yqoebQE0.PWoAbO38MRxSudfX5bVagR6ZRTt.KJTArNx6q', '09170000003', 'Active'),
((SELECT role_id FROM roles WHERE role_name = 'Member'), 'DEMO-2026-0005', 'Demo', 'Member', 'demo@balingasag.gov.ph', '$2y$12$yhgTrh5yqoebQE0.PWoAbO38MRxSudfX5bVagR6ZRTt.KJTArNx6q', '09170000005', 'Active');

INSERT INTO library_cards (user_id, qr_code_value, issued_date, card_status)
SELECT user_id, CONCAT('BPL-CARD-', UPPER(SUBSTRING(MD5(CONCAT(email, NOW())), 1, 10))), CURRENT_DATE, 'Active'
FROM users;

INSERT INTO library_policies (max_books_per_member, loan_duration_days, reservation_period_days, max_renewals, opening_time, closing_time, updated_by)
VALUES (3, 7, 3, 1, '08:00:00', '17:00:00', (SELECT user_id FROM users WHERE email = 'admin@balingasag.gov.ph'));

SET FOREIGN_KEY_CHECKS = 1;

-- Demo login:
-- Email: demo@balingasag.gov.ph
-- Password: password123

