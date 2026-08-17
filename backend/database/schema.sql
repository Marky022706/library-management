-- Balingasag Public Library Management System
-- MySQL 8+ / MariaDB schema for the active PHP API.

CREATE DATABASE IF NOT EXISTS library_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE library_management;

CREATE TABLE IF NOT EXISTS roles (
  id VARCHAR(50) PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO roles (id, role_name) VALUES
  ('super_admin', 'super_admin'),
  ('admin', 'admin'),
  ('member', 'member');

CREATE TABLE IF NOT EXISTS users (
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
  updated_at DATETIME,
  KEY idx_users_role (role),
  KEY idx_users_status (status),
  KEY idx_users_student_id (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  category_id VARCHAR(50),
  name VARCHAR(150) NOT NULL UNIQUE,
  created_at DATETIME,
  updated_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS authors (
  id VARCHAR(50) PRIMARY KEY,
  author_id VARCHAR(50),
  name VARCHAR(150) NOT NULL UNIQUE,
  created_at DATETIME,
  updated_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS publishers (
  id VARCHAR(50) PRIMARY KEY,
  publisher_id VARCHAR(50),
  name VARCHAR(150) NOT NULL UNIQUE,
  created_at DATETIME,
  updated_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS books (
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
  updated_at DATETIME,
  KEY idx_books_title (title),
  KEY idx_books_status (status),
  KEY idx_books_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS borrowings (
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
  updated_at DATETIME,
  KEY idx_borrowings_user (user_id),
  KEY idx_borrowings_book (book_id),
  KEY idx_borrowings_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reservations (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  book_id VARCHAR(50) NOT NULL,
  reserved_date DATE NOT NULL,
  pickup_deadline DATE NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at DATETIME,
  updated_at DATETIME,
  KEY idx_reservations_user (user_id),
  KEY idx_reservations_book (book_id),
  KEY idx_reservations_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS fines (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  borrowing_id VARCHAR(50) NULL,
  amount DECIMAL(10,2) NOT NULL,
  reason VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  paid_at DATETIME NULL,
  processed_by VARCHAR(50),
  created_at DATETIME,
  updated_at DATETIME,
  KEY idx_fines_user (user_id),
  KEY idx_fines_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS attendance (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  time_in TIME NOT NULL,
  time_out TIME NULL,
  status VARCHAR(50) DEFAULT 'inside',
  source VARCHAR(50) DEFAULT 'QR_KIOSK',
  created_at DATETIME,
  updated_at DATETIME,
  KEY idx_attendance_user_date (user_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  read_status TINYINT(1) DEFAULT 0,
  created_at DATETIME,
  KEY idx_notifications_user (user_id),
  KEY idx_notifications_read (read_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS announcements (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'published',
  publish_date DATE,
  expiration_date DATE NULL,
  created_by VARCHAR(50),
  created_at DATETIME,
  updated_at DATETIME,
  KEY idx_announcements_status (status),
  KEY idx_announcements_publish_date (publish_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS favorites (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  book_id VARCHAR(50) NOT NULL,
  created_at DATETIME,
  UNIQUE KEY uq_favorites_user_book (user_id, book_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS book_requests (
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
  updated_at DATETIME,
  KEY idx_book_requests_user (user_id),
  KEY idx_book_requests_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS activity_logs (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  action VARCHAR(100) NOT NULL,
  target VARCHAR(255),
  activity_type VARCHAR(50) DEFAULT 'general',
  created_at DATETIME,
  KEY idx_activity_logs_user (user_id),
  KEY idx_activity_logs_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_logs (
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
  created_at DATETIME,
  KEY idx_audit_logs_user (user_id),
  KEY idx_audit_logs_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS system_logs (
  id VARCHAR(50) PRIMARY KEY,
  level VARCHAR(50) NOT NULL,
  channel VARCHAR(100) DEFAULT 'system',
  message TEXT NOT NULL,
  context TEXT NULL,
  created_at DATETIME,
  KEY idx_system_logs_level (level),
  KEY idx_system_logs_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS recycle_bin (
  id VARCHAR(50) PRIMARY KEY,
  item_id VARCHAR(100) NOT NULL,
  item_type VARCHAR(50) NOT NULL,
  item_name VARCHAR(255),
  deleted_by VARCHAR(50),
  data_payload LONGTEXT,
  deleted_at DATETIME,
  KEY idx_recycle_bin_type (item_type),
  KEY idx_recycle_bin_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS system_settings (
  id VARCHAR(50) PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  setting_group VARCHAR(50) DEFAULT 'general',
  description VARCHAR(255),
  updated_at DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS backups (
  id VARCHAR(50) PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  file_size VARCHAR(50),
  total_tables INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Success',
  created_by VARCHAR(50),
  created_at DATETIME,
  KEY idx_backups_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
