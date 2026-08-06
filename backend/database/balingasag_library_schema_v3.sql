-- =====================================================================
-- BALINGASAG PUBLIC LIBRARY MANAGEMENT SYSTEM — SCHEMA v3
-- Normalized to 3NF / BCNF
-- Changes from v2 marked -- [FIX #n]
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. AUTHENTICATION & USER MANAGEMENT
-- ---------------------------------------------------------------------

-- [FIX A] 'Librarian' added to role set
CREATE TABLE roles (
    role_id      SERIAL PRIMARY KEY,
    role_name    VARCHAR(20) NOT NULL UNIQUE
                 CHECK (role_name IN ('Super Admin','Admin','Librarian','Member'))
);

CREATE TABLE users (
    user_id        SERIAL PRIMARY KEY,
    role_id        INT NOT NULL REFERENCES roles(role_id),
    school_id      VARCHAR(30) UNIQUE,
    first_name     VARCHAR(50) NOT NULL,
    last_name      VARCHAR(50) NOT NULL,
    email          VARCHAR(100) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    phone_number   VARCHAR(20),
    account_status VARCHAR(15) NOT NULL DEFAULT 'Active'
                   CHECK (account_status IN ('Active','Suspended','Inactive')),
    created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP
);

CREATE TABLE library_cards (
    card_id       SERIAL PRIMARY KEY,
    user_id       INT NOT NULL UNIQUE REFERENCES users(user_id),
    qr_code_value VARCHAR(100) NOT NULL UNIQUE,
    issued_date   DATE NOT NULL DEFAULT CURRENT_DATE,
    card_status   VARCHAR(15) NOT NULL DEFAULT 'Active'
                  CHECK (card_status IN ('Active','Lost','Expired','Revoked'))
);


-- ---------------------------------------------------------------------
-- 2. BOOK & COLLECTION MANAGEMENT
-- ---------------------------------------------------------------------

CREATE TABLE authors (
    author_id   SERIAL PRIMARY KEY,
    author_name VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE publishers (
    publisher_id   SERIAL PRIMARY KEY,
    publisher_name VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE categories (
    category_id   SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE books (
    book_id           SERIAL PRIMARY KEY,
    title             VARCHAR(255) NOT NULL,
    publisher_id      INT REFERENCES publishers(publisher_id),
    publication_year  SMALLINT CHECK (publication_year > 0),
    description       TEXT,
    cover_image_url   VARCHAR(255),
    cataloging_source VARCHAR(10) NOT NULL DEFAULT 'Manual'
                      CHECK (cataloging_source IN ('AI','Manual')),
    added_by          INT NOT NULL REFERENCES users(user_id),
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE book_authors (
    book_id   INT NOT NULL REFERENCES books(book_id)   ON DELETE CASCADE,
    author_id INT NOT NULL REFERENCES authors(author_id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, author_id)
);

CREATE TABLE book_categories (
    book_id     INT NOT NULL REFERENCES books(book_id)         ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, category_id)
);

-- [FIX B] condition_status + copy_status MERGED into one authoritative
-- status field — matches the requirement's single enumerated list and
-- removes the possibility of the two fields contradicting each other.
-- [FIX C] qr_code_value added — explicit, generated per physical copy.
CREATE TABLE book_copies (
    copy_id           SERIAL PRIMARY KEY,
    book_id           INT NOT NULL REFERENCES books(book_id),
    accession_number  VARCHAR(30) NOT NULL UNIQUE,
    qr_code_value     VARCHAR(100) NOT NULL UNIQUE,
    shelf_location    VARCHAR(50),
    copy_status       VARCHAR(20) NOT NULL DEFAULT 'Available'
                      CHECK (copy_status IN
                        ('Available','Borrowed','Reserved','Damaged',
                         'Lost','Archived','Under Maintenance')),
    acquisition_date  DATE NOT NULL DEFAULT CURRENT_DATE
);


-- ---------------------------------------------------------------------
-- 3. DIGITAL LIBRARY MANAGEMENT
-- ---------------------------------------------------------------------

CREATE TABLE digital_books (
    digital_book_id SERIAL PRIMARY KEY,
    book_id         INT NOT NULL REFERENCES books(book_id),
    file_url        VARCHAR(255) NOT NULL,
    file_format     VARCHAR(10) NOT NULL CHECK (file_format IN ('PDF','ePub')),
    uploaded_by     INT NOT NULL REFERENCES users(user_id),
    uploaded_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (book_id, file_format)
);

CREATE TABLE digital_reading_history (
    reading_id       SERIAL PRIMARY KEY,
    user_id          INT NOT NULL REFERENCES users(user_id),
    digital_book_id  INT NOT NULL REFERENCES digital_books(digital_book_id),
    accessed_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    duration_seconds INT CHECK (duration_seconds >= 0)
);


-- ---------------------------------------------------------------------
-- 4. CIRCULATION MANAGEMENT
-- ---------------------------------------------------------------------

CREATE TABLE borrow_transactions (
    transaction_id   SERIAL PRIMARY KEY,
    copy_id          INT NOT NULL REFERENCES book_copies(copy_id),
    user_id          INT NOT NULL REFERENCES users(user_id),
    id_document_url  VARCHAR(255) NOT NULL,
    request_date     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved_by      INT REFERENCES users(user_id),
    approval_date    TIMESTAMP,
    borrow_date      DATE,
    due_date         DATE,
    return_date      DATE,
    renewal_count    SMALLINT NOT NULL DEFAULT 0 CHECK (renewal_count >= 0),
    status           VARCHAR(15) NOT NULL DEFAULT 'Pending'
                     CHECK (status IN
                       ('Pending','Approved','Rejected','Returned','Overdue')),
    CHECK (due_date IS NULL OR borrow_date IS NULL OR due_date >= borrow_date)
);

CREATE TABLE reservations (
    reservation_id              SERIAL PRIMARY KEY,
    book_id                     INT NOT NULL REFERENCES books(book_id),
    user_id                     INT NOT NULL REFERENCES users(user_id),
    reservation_date            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiry_date                 DATE,
    status                      VARCHAR(15) NOT NULL DEFAULT 'Pending'
                                CHECK (status IN
                                  ('Pending','Fulfilled','Cancelled','Expired')),
    fulfilled_by_transaction_id INT UNIQUE REFERENCES borrow_transactions(transaction_id)
);
-- Queue position is NOT stored — derive via
-- ORDER BY reservation_date for a given book_id WHERE status='Pending'.
-- Storing rank would require renumbering every time an earlier
-- reservation is fulfilled or cancelled: a derivable-data violation.


-- ---------------------------------------------------------------------
-- 5. ATTENDANCE
-- ---------------------------------------------------------------------

CREATE TABLE attendance_logs (
    attendance_id SERIAL PRIMARY KEY,
    user_id       INT NOT NULL REFERENCES users(user_id),
    time_in       TIMESTAMP NOT NULL,
    time_out      TIMESTAMP,
    CHECK (time_out IS NULL OR time_out > time_in)
);


-- ---------------------------------------------------------------------
-- 6. INVENTORY MANAGEMENT (QR-based stocktake)
-- ---------------------------------------------------------------------

-- [FIX D] new — a discrete stocktake event
CREATE TABLE inventory_sessions (
    session_id   SERIAL PRIMARY KEY,
    conducted_by INT NOT NULL REFERENCES users(user_id),
    start_date   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date     TIMESTAMP,
    status       VARCHAR(15) NOT NULL DEFAULT 'In Progress'
                 CHECK (status IN ('In Progress','Completed','Cancelled')),
    CHECK (end_date IS NULL OR end_date >= start_date)
);

-- [FIX D] new — each copy scanned during a session, expected vs. found
CREATE TABLE inventory_scans (
    scan_id          BIGSERIAL PRIMARY KEY,
    session_id       INT NOT NULL REFERENCES inventory_sessions(session_id),
    copy_id          INT NOT NULL REFERENCES book_copies(copy_id),
    expected_status  VARCHAR(20) NOT NULL,
    found_status     VARCHAR(20) NOT NULL
                     CHECK (found_status IN
                       ('Available','Borrowed','Reserved','Damaged',
                        'Lost','Archived','Under Maintenance')),
    is_discrepancy   BOOLEAN NOT NULL DEFAULT FALSE,
    scanned_by       INT NOT NULL REFERENCES users(user_id),
    scanned_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (session_id, copy_id)
);


-- ---------------------------------------------------------------------
-- 7. SEARCH, DISCOVERY & MEMBER SERVICES
-- ---------------------------------------------------------------------

CREATE TABLE favorites (
    user_id  INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    book_id  INT NOT NULL REFERENCES books(book_id) ON DELETE CASCADE,
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, book_id)
);

CREATE TABLE book_requests (
    request_id       SERIAL PRIMARY KEY,
    user_id          INT NOT NULL REFERENCES users(user_id),
    requested_title  VARCHAR(255) NOT NULL,
    requested_author VARCHAR(150),
    reason           TEXT,
    request_date     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status           VARCHAR(15) NOT NULL DEFAULT 'Pending'
                     CHECK (status IN ('Pending','Approved','Rejected','Acquired')),
    acquired_book_id INT REFERENCES books(book_id)
);


-- ---------------------------------------------------------------------
-- 8. ANNOUNCEMENTS & NOTIFICATIONS
-- ---------------------------------------------------------------------

CREATE TABLE announcements (
    announcement_id SERIAL PRIMARY KEY,
    created_by      INT NOT NULL REFERENCES users(user_id),
    title           VARCHAR(150) NOT NULL,
    content         TEXT NOT NULL,
    publish_date    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiry_date     TIMESTAMP,
    CHECK (expiry_date IS NULL OR expiry_date > publish_date)
);

CREATE TABLE notifications (
    notification_id         SERIAL PRIMARY KEY,
    user_id                 INT NOT NULL REFERENCES users(user_id),
    notification_type       VARCHAR(20) NOT NULL
                            CHECK (notification_type IN
                              ('Due Date','Reservation','Announcement','Account','Approval')),
    message                 VARCHAR(255) NOT NULL,
    related_transaction_id  INT REFERENCES borrow_transactions(transaction_id),
    related_reservation_id  INT REFERENCES reservations(reservation_id),
    related_announcement_id INT REFERENCES announcements(announcement_id),
    is_read                 BOOLEAN NOT NULL DEFAULT FALSE,
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (CASE WHEN related_transaction_id  IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN related_reservation_id  IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN related_announcement_id IS NOT NULL THEN 1 ELSE 0 END) <= 1
    )
);


-- ---------------------------------------------------------------------
-- 9. ADMINISTRATIVE MANAGEMENT
-- ---------------------------------------------------------------------

CREATE TABLE audit_logs (
    log_id       BIGSERIAL PRIMARY KEY,
    user_id      INT REFERENCES users(user_id),
    action_type  VARCHAR(50) NOT NULL,
    entity_type  VARCHAR(50) NOT NULL,
    entity_id    INT,
    description  VARCHAR(500),
    ip_address   VARCHAR(45),
    performed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE book_notes (
    note_id    SERIAL PRIMARY KEY,
    book_id    INT NOT NULL REFERENCES books(book_id),
    created_by INT NOT NULL REFERENCES users(user_id),
    note_text  TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE member_notes (
    note_id    SERIAL PRIMARY KEY,
    member_id  INT NOT NULL REFERENCES users(user_id),
    created_by INT NOT NULL REFERENCES users(user_id),
    note_text  TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE book_archive_requests (
    request_id   SERIAL PRIMARY KEY,
    copy_id      INT NOT NULL REFERENCES book_copies(copy_id),
    requested_by INT NOT NULL REFERENCES users(user_id),
    reason       VARCHAR(500) NOT NULL,
    request_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_by  INT REFERENCES users(user_id),
    review_date  TIMESTAMP,
    status       VARCHAR(15) NOT NULL DEFAULT 'Pending'
                 CHECK (status IN ('Pending','Approved','Rejected'))
);

CREATE TABLE book_copy_history (
    history_id        BIGSERIAL PRIMARY KEY,
    copy_id           INT NOT NULL REFERENCES book_copies(copy_id),
    event_type        VARCHAR(20) NOT NULL
                      CHECK (event_type IN
                        ('Borrowed','Returned','Repaired','Relocated',
                         'Status Updated','Archived','Restored')),
    old_value         VARCHAR(100),
    new_value         VARCHAR(100),
    performed_by       INT REFERENCES users(user_id),
    archive_request_id INT REFERENCES book_archive_requests(request_id),
    event_date          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes                VARCHAR(500)
);

CREATE TABLE library_policies (
    policy_id                SERIAL PRIMARY KEY,
    max_books_per_member     INT NOT NULL DEFAULT 3 CHECK (max_books_per_member > 0),
    loan_duration_days       INT NOT NULL DEFAULT 7 CHECK (loan_duration_days > 0),
    reservation_period_days  INT NOT NULL DEFAULT 3 CHECK (reservation_period_days > 0),
    max_renewals             INT NOT NULL DEFAULT 1 CHECK (max_renewals >= 0),
    opening_time             TIME NOT NULL DEFAULT '08:00',
    closing_time             TIME NOT NULL DEFAULT '17:00',
    updated_by               INT REFERENCES users(user_id),
    updated_at               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (closing_time > opening_time)
);


-- ---------------------------------------------------------------------
-- 10. REPORTS
-- ---------------------------------------------------------------------

CREATE TABLE generated_reports (
    report_id    SERIAL PRIMARY KEY,
    generated_by INT NOT NULL REFERENCES users(user_id),
    report_type  VARCHAR(50) NOT NULL,
    file_format  VARCHAR(10) NOT NULL CHECK (file_format IN ('PDF','Excel')),
    file_url     VARCHAR(255) NOT NULL,
    generated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =====================================================================
-- RECOMMENDED INDEXES
-- =====================================================================
CREATE INDEX idx_books_title              ON books(title);
CREATE INDEX idx_book_copies_book_id      ON book_copies(book_id);
CREATE INDEX idx_book_copies_status       ON book_copies(copy_status);
CREATE INDEX idx_book_categories_category ON book_categories(category_id);
CREATE INDEX idx_borrow_user_status       ON borrow_transactions(user_id, status);
CREATE INDEX idx_borrow_copy_status       ON borrow_transactions(copy_id, status);
CREATE INDEX idx_reservations_book_status ON reservations(book_id, status);
CREATE INDEX idx_inventory_scans_session  ON inventory_scans(session_id);
CREATE INDEX idx_audit_entity             ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_notifications_user_read  ON notifications(user_id, is_read);
CREATE INDEX idx_attendance_user_date     ON attendance_logs(user_id, time_in);
