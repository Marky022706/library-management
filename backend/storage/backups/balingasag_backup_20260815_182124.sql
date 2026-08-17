-- Balingasag Public Library MySQL Database Backup
-- Generated at: 2026-08-15 18:21:24

-- Table: roles
INSERT INTO roles (id, role_name) VALUES ('admin', 'admin');
INSERT INTO roles (id, role_name) VALUES ('member', 'member');
INSERT INTO roles (id, role_name) VALUES ('super_admin', 'super_admin');

-- Table: users
INSERT INTO users (id, user_id, name, first_name, middle_name, last_name, email, username, password_hash, role, status, phone, address, student_id, school, course, year_level, qr_code, school_id_url, profile_photo_url, registered_at, created_at, updated_at) VALUES ('u-293d62ed', 'u-293d62ed', 'Maria Santos', 'Maria', '', 'Santos', 'member@library.test', 'member', '$2y$12$A7BlNhneBwuV.83IyfLnZO6NqHBQ.Ni8xWmHWGoTlsT83U0dB6Cgu', 'member', 'active', '09171234567', '', '2024-01092', 'State University Institute of Technology', 'BS Computer Science', '3rd Year', 'LIB-MEM-U293D62ED-2026', NULL, NULL, NULL, '2026-08-15 17:20:10', '2026-08-15 17:20:10');
INSERT INTO users (id, user_id, name, first_name, middle_name, last_name, email, username, password_hash, role, status, phone, address, student_id, school, course, year_level, qr_code, school_id_url, profile_photo_url, registered_at, created_at, updated_at) VALUES ('u-747134a4', 'u-747134a4', 'John Doe', 'John', '', 'Doe', 'testmember_1786814671@library.test', 'testmember_1786814671', '$2y$12$B2Hq7Bz/1G3872RlcolaN./w6.PGsTVJHAXBCS8StMm0Rl5OZnATC', 'member', 'pending', '', '', '2026-TEST999', 'Balingasag High School', 'Grade 11', '', 'LIB-MEM-U747134A4-2026', NULL, NULL, NULL, '2026-08-15 17:24:32', '2026-08-15 17:24:32');
INSERT INTO users (id, user_id, name, first_name, middle_name, last_name, email, username, password_hash, role, status, phone, address, student_id, school, course, year_level, qr_code, school_id_url, profile_photo_url, registered_at, created_at, updated_at) VALUES ('u-87c5ae6f', 'u-87c5ae6f', 'John Doe', 'John', '', 'Doe', 'testmember_1786814689@library.test', 'testmember_1786814689', '$2y$12$.XLqHlprD8gFlc0U79lG/.62eD7fis0zjsrGZAYLmSUa/VEmupMV.', 'member', 'active', '', '', '2026-TEST999', 'Balingasag High School', 'Grade 11', '', 'LIB-MEM-U87C5AE6F-2026', NULL, NULL, NULL, '2026-08-15 17:24:49', '2026-08-15 17:24:49');
INSERT INTO users (id, user_id, name, first_name, middle_name, last_name, email, username, password_hash, role, status, phone, address, student_id, school, course, year_level, qr_code, school_id_url, profile_photo_url, registered_at, created_at, updated_at) VALUES ('u-8f771a19', 'u-8f771a19', 'Jose Reyes', 'Jose', '', 'Reyes', 'admin@library.test', 'admin', '$2y$12$nF6uP2k5D6N949LP.zv1UeLM3VSQ6xy5gmOYreb1qP27xiRxXYjL.', 'admin', 'active', '', '', '', '', '', '', 'LIB-MEM-U8F771A19-2026', NULL, NULL, NULL, '2026-08-15 17:20:10', '2026-08-15 17:20:10');
INSERT INTO users (id, user_id, name, first_name, middle_name, last_name, email, username, password_hash, role, status, phone, address, student_id, school, course, year_level, qr_code, school_id_url, profile_photo_url, registered_at, created_at, updated_at) VALUES ('u-a11b41fb', 'u-a11b41fb', 'Ana Gonzales', 'Ana', '', 'Gonzales', 'ana@library.test', 'ana', '$2y$12$0CvF4oai5/Abz24wq0QoA.kQiIQAcF4MCK/IvvKodjIygas7k7v7i', 'member', 'pending', '', '', '2024-04812', 'Balingasag College of Education', 'BS Information Technology', '2nd Year', 'LIB-MEM-UA11B41FB-2026', NULL, NULL, NULL, '2026-08-15 17:20:10', '2026-08-15 17:20:10');
INSERT INTO users (id, user_id, name, first_name, middle_name, last_name, email, username, password_hash, role, status, phone, address, student_id, school, course, year_level, qr_code, school_id_url, profile_photo_url, registered_at, created_at, updated_at) VALUES ('u-e586c11f', 'u-e586c11f', 'Elena Cruz', 'Elena', '', 'Cruz', 'superadmin@library.test', 'superadmin', '$2y$12$o82zbEqMGaVw/c5W8Nc9OOtH/8538IWCzTHMoZdcj94soBRRw92W.', 'super_admin', 'active', '', '', '', '', '', '', 'LIB-MEM-UE586C11F-2026', NULL, NULL, NULL, '2026-08-15 17:20:09', '2026-08-15 17:20:09');

-- Table: categories
INSERT INTO categories (id, category_id, name, created_at, updated_at) VALUES ('cat-1b95fb20', NULL, 'Science', '2026-08-15 17:20:10', '2026-08-15 17:20:10');
INSERT INTO categories (id, category_id, name, created_at, updated_at) VALUES ('cat-377a87dc', NULL, 'Robotics & AI 1786814689', '2026-08-15 17:24:49', '2026-08-15 17:24:49');
INSERT INTO categories (id, category_id, name, created_at, updated_at) VALUES ('cat-69c4cdf7', NULL, 'Robotics & AI 1786814672', '2026-08-15 17:24:32', '2026-08-15 17:24:32');
INSERT INTO categories (id, category_id, name, created_at, updated_at) VALUES ('cat-80b2190d', NULL, 'Fiction', '2026-08-15 17:20:10', '2026-08-15 17:20:10');
INSERT INTO categories (id, category_id, name, created_at, updated_at) VALUES ('cat-8ef68c4d', NULL, 'Mathematics', '2026-08-15 17:20:10', '2026-08-15 17:20:10');
INSERT INTO categories (id, category_id, name, created_at, updated_at) VALUES ('cat-c1f8f28b', NULL, 'History', '2026-08-15 17:20:10', '2026-08-15 17:20:10');
INSERT INTO categories (id, category_id, name, created_at, updated_at) VALUES ('cat-ec0bee77', NULL, 'Computer Science', '2026-08-15 17:20:10', '2026-08-15 17:20:10');
INSERT INTO categories (id, category_id, name, created_at, updated_at) VALUES ('cat-fc2d5967', NULL, 'Literature', '2026-08-15 17:20:10', '2026-08-15 17:20:10');

-- Table: authors
INSERT INTO authors (id, author_id, name, created_at, updated_at) VALUES ('aut-117b47b6', NULL, 'Jane Austen', '2026-08-15 17:20:10', '2026-08-15 17:20:10');
INSERT INTO authors (id, author_id, name, created_at, updated_at) VALUES ('aut-68b3b2d9', NULL, 'Robert C. Martin', '2026-08-15 17:20:10', '2026-08-15 17:20:10');
INSERT INTO authors (id, author_id, name, created_at, updated_at) VALUES ('aut-a522260a', NULL, 'Ada Lovelace 1786814689', '2026-08-15 17:24:49', '2026-08-15 17:24:49');
INSERT INTO authors (id, author_id, name, created_at, updated_at) VALUES ('aut-b7bd47b8', NULL, 'Ada Lovelace 1786814672', '2026-08-15 17:24:32', '2026-08-15 17:24:32');
INSERT INTO authors (id, author_id, name, created_at, updated_at) VALUES ('aut-bb5fa413', NULL, 'Yuval Noah Harari', '2026-08-15 17:20:10', '2026-08-15 17:20:10');
INSERT INTO authors (id, author_id, name, created_at, updated_at) VALUES ('aut-ebfdb732', NULL, 'George Orwell', '2026-08-15 17:20:10', '2026-08-15 17:20:10');
INSERT INTO authors (id, author_id, name, created_at, updated_at) VALUES ('aut-fe4a4261', NULL, 'Harper Lee', '2026-08-15 17:20:10', '2026-08-15 17:20:10');

-- Table: publishers
INSERT INTO publishers (id, publisher_id, name, created_at, updated_at) VALUES ('pub-0bf5d0de', NULL, 'Tech Publishing Co 1786814689', '2026-08-15 17:24:49', '2026-08-15 17:24:49');
INSERT INTO publishers (id, publisher_id, name, created_at, updated_at) VALUES ('pub-3ca6f46c', NULL, 'Tech Publishing Co 1786814672', '2026-08-15 17:24:32', '2026-08-15 17:24:32');
INSERT INTO publishers (id, publisher_id, name, created_at, updated_at) VALUES ('pub-588fbd2e', NULL, 'Prentice Hall', '2026-08-15 17:20:10', '2026-08-15 17:20:10');
INSERT INTO publishers (id, publisher_id, name, created_at, updated_at) VALUES ('pub-58b3dd22', NULL, 'J.B. Lippincott & Co.', '2026-08-15 17:20:10', '2026-08-15 17:20:10');
INSERT INTO publishers (id, publisher_id, name, created_at, updated_at) VALUES ('pub-b7712cf8', NULL, 'Secker & Warburg', '2026-08-15 17:20:10', '2026-08-15 17:20:10');
INSERT INTO publishers (id, publisher_id, name, created_at, updated_at) VALUES ('pub-c376e276', NULL, 'HarperCollins', '2026-08-15 17:20:10', '2026-08-15 17:20:10');
INSERT INTO publishers (id, publisher_id, name, created_at, updated_at) VALUES ('pub-fff24d33', NULL, 'Penguin Books', '2026-08-15 17:20:10', '2026-08-15 17:20:10');

-- Table: books
INSERT INTO books (id, book_id, title, author, category, publisher, publication_year, accession_number, isbn, shelf_location, format, quantity, available, condition, status, cover_color, qr_code, created_at, updated_at) VALUES ('bk-464a4c24', 'bk-464a4c24', 'Florante at Laura', 'Francisco Balagtas', 'Filipino Literature', '', NULL, 'ACC-5C0F2E', '978-971-27-1234-0', 'Main Section', 'Hardcover', '2', '2', 'Excellent', 'archived', '#b45309', 'LIB-BK-ACC-5C0F2E', '2026-08-15 17:30:23', '2026-08-15 17:30:34');
INSERT INTO books (id, book_id, title, author, category, publisher, publication_year, accession_number, isbn, shelf_location, format, quantity, available, condition, status, cover_color, qr_code, created_at, updated_at) VALUES ('bk-6b443826', 'bk-6b443826', 'Design Patterns: Elements of Reusable Object-Oriented Software', 'Erich Gamma', 'Computer Science', 'Addison-Wesley', '1994', 'ACC-DP-1786814689', '', 'Main Section', 'Hardcover', '3', '2', 'Good', 'active', '#3b82f6', 'LIB-BK-ACC-DP-1786814689', '2026-08-15 17:24:49', '2026-08-15 17:24:49');
INSERT INTO books (id, book_id, title, author, category, publisher, publication_year, accession_number, isbn, shelf_location, format, quantity, available, condition, status, cover_color, qr_code, created_at, updated_at) VALUES ('bk-99dc5f40', 'bk-99dc5f40', 'Clean Code: A Handbook of Agile Software Craftsmanship', 'Robert C. Martin', 'Computer Science', 'Prentice Hall', '2008', 'ACC-001', '978-0132350884', 'Main Section', 'Hardcover', '5', '4', 'Excellent', 'active', '#2563eb', 'LIB-BK-ACC-001', '2026-08-15 17:20:10', '2026-08-15 17:20:10');
INSERT INTO books (id, book_id, title, author, category, publisher, publication_year, accession_number, isbn, shelf_location, format, quantity, available, condition, status, cover_color, qr_code, created_at, updated_at) VALUES ('bk-b8214abb', 'bk-b8214abb', 'Design Patterns: Elements of Reusable Object-Oriented Software', 'Erich Gamma', 'Computer Science', 'Addison-Wesley', '1994', 'ACC-DP-1786814672', '', 'Main Section', 'Hardcover', '3', '3', 'Good', 'active', '#3b82f6', 'LIB-BK-ACC-DP-1786814672', '2026-08-15 17:24:32', '2026-08-15 17:24:32');

-- Table: borrowings
INSERT INTO borrowings (id, user_id, book_id, borrow_date, due_date, return_date, status, renew_count, fine_amount, processed_by, created_at, updated_at) VALUES ('brw-075db1a6', 'u-293d62ed', 'bk-6b443826', '2026-08-15', '2026-08-29', '2026-08-15', 'returned', '1', '0.00', 'u-8f771a19', '2026-08-16 02:21:24', '2026-08-16 02:21:24');
INSERT INTO borrowings (id, user_id, book_id, borrow_date, due_date, return_date, status, renew_count, fine_amount, processed_by, created_at, updated_at) VALUES ('brw-c0f88571', 'u-293d62ed', 'bk-6b443826', '2026-08-15', '2026-08-22', NULL, 'active', '0', '0.00', 'u-8f771a19', '2026-08-16 02:20:36', '2026-08-16 02:20:36');

-- Table: reservations
INSERT INTO reservations (id, user_id, book_id, reserved_date, pickup_deadline, status, created_at, updated_at) VALUES ('res-49a16bfa', 'u-293d62ed', 'bk-6b443826', '2026-08-15', '2026-08-18', 'cancelled', '2026-08-16 02:21:24', '2026-08-16 02:21:24');

-- Table: fines

-- Table: attendance
INSERT INTO attendance (id, user_id, date, time_in, time_out, status, source, created_at, updated_at) VALUES ('att-895fd840', 'u-293d62ed', '2026-08-15', '18:21:24', '18:21:24', 'left', 'QR_KIOSK', '2026-08-16 02:21:24', '2026-08-16 02:21:24');

-- Table: notifications
INSERT INTO notifications (id, user_id, title, message, type, read_status, created_at) VALUES ('notif-0778694c', 'u-293d62ed', 'Test Alert', 'Your integration test notification is live.', 'info', '1', '2026-08-16 02:21:24');
INSERT INTO notifications (id, user_id, title, message, type, read_status, created_at) VALUES ('notif-0a64ce3e', 'u-293d62ed', 'Loan Renewed', 'Loan for \"Design Patterns: Elements of Reusable Object-Oriented Software\" renewed. New due date is 2026-08-29.', 'info', '0', '2026-08-16 02:21:24');
INSERT INTO notifications (id, user_id, title, message, type, read_status, created_at) VALUES ('notif-1ff0562b', 'u-293d62ed', 'Book Borrowed Successfully', 'You borrowed \"Design Patterns: Elements of Reusable Object-Oriented Software\". Due date is 2026-08-22.', 'due', '0', '2026-08-16 02:20:36');
INSERT INTO notifications (id, user_id, title, message, type, read_status, created_at) VALUES ('notif-b4c0d27d', 'u-293d62ed', 'Book Request Approved', 'Your acquisition request for \"Designing Data-Intensive Applications\" was approved: Approved for library purchase', 'success', '0', '2026-08-16 02:21:24');
INSERT INTO notifications (id, user_id, title, message, type, read_status, created_at) VALUES ('notif-d36393c4', 'u-293d62ed', 'Book Borrowed Successfully', 'You borrowed \"Design Patterns: Elements of Reusable Object-Oriented Software\". Due date is 2026-08-22.', 'due', '0', '2026-08-16 02:21:24');
INSERT INTO notifications (id, user_id, title, message, type, read_status, created_at) VALUES ('notif-e1da3ebe', 'u-293d62ed', 'Reservation Ready for Pickup', 'Your copy of \"Design Patterns: Elements of Reusable Object-Oriented Software\" is now ready at the circulation counter until 2026-08-18.', 'reservation', '0', '2026-08-16 02:21:24');
INSERT INTO notifications (id, user_id, title, message, type, read_status, created_at) VALUES ('notif-e7277079', 'u-293d62ed', 'Book Returned', 'Your copy of \"Design Patterns: Elements of Reusable Object-Oriented Software\" has been returned successfully.', 'success', '0', '2026-08-16 02:21:24');
INSERT INTO notifications (id, user_id, title, message, type, read_status, created_at) VALUES ('notif-e997c340', 'u-293d62ed', 'Reservation Hold Placed', 'Your reservation hold has been queued. You will be notified when a copy becomes available for pickup.', 'reservation', '0', '2026-08-16 02:21:24');

-- Table: announcements

-- Table: favorites

-- Table: book_requests
INSERT INTO book_requests (id, user_id, request_type, book_id, title, author, publisher, isbn, reason, status, approver_id, remarks, created_at, updated_at) VALUES ('req-c042bb63', 'u-293d62ed', 'acquisition', NULL, 'Designing Data-Intensive Applications', 'Martin Kleppmann', NULL, NULL, 'Database research', 'approved', 'u-8f771a19', 'Approved for library purchase', '2026-08-16 02:21:24', '2026-08-16 02:21:24');

-- Table: activity_logs

-- Table: audit_logs
INSERT INTO audit_logs (id, user_id, user_name, role, action, module, target_id, description, ip_address, status, created_at) VALUES ('aud-2dacf639', 'u-8f771a19', 'Jose Reyes', 'admin', 'Return Book', 'Circulation', 'brw-075db1a6', 'Processed return of Design Patterns: Elements of Reusable Object-Oriented Software', '127.0.0.1', 'Completed', '2026-08-16 02:21:24');
INSERT INTO audit_logs (id, user_id, user_name, role, action, module, target_id, description, ip_address, status, created_at) VALUES ('aud-79d3bfd0', 'u-8f771a19', 'Jose Reyes', 'admin', 'Approved Request', 'Requests', 'req-c042bb63', 'Approved acquisition request for Designing Data-Intensive Applications', '127.0.0.1', 'Completed', '2026-08-16 02:21:24');
INSERT INTO audit_logs (id, user_id, user_name, role, action, module, target_id, description, ip_address, status, created_at) VALUES ('aud-8e4cf3ca', 'u-8f771a19', 'Jose Reyes', 'admin', 'Borrow Book', 'Circulation', 'brw-c0f88571', 'Checked out book Design Patterns: Elements of Reusable Object-Oriented Software to user ID u-293d62ed', '127.0.0.1', 'Completed', '2026-08-16 02:20:36');
INSERT INTO audit_logs (id, user_id, user_name, role, action, module, target_id, description, ip_address, status, created_at) VALUES ('aud-9f11dd97', 'u-e586c11f', 'Elena Cruz', 'super_admin', 'Run Integration Test', 'Testing', NULL, 'Integration test executed successfully', '127.0.0.1', 'Completed', '2026-08-16 02:21:24');
INSERT INTO audit_logs (id, user_id, user_name, role, action, module, target_id, description, ip_address, status, created_at) VALUES ('aud-bc4a1f2c', 'u-8f771a19', 'Jose Reyes', 'admin', 'Borrow Book', 'Circulation', 'brw-075db1a6', 'Checked out book Design Patterns: Elements of Reusable Object-Oriented Software to user ID u-293d62ed', '127.0.0.1', 'Completed', '2026-08-16 02:21:24');

-- Table: system_logs
INSERT INTO system_logs (id, level, channel, message, context, created_at) VALUES ('syslog-2aeb2dcc', 'info', 'system', 'Integration test pipeline health check passed', NULL, '2026-08-16 02:21:24');

-- Table: recycle_bin

-- Table: system_settings

-- Table: backups

