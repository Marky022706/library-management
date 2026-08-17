<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/QRCodeService.php';

class User {
    public static function create(array $data): array {
        $pdo = Database::getConnection();

        $email = strtolower(trim($data['email'] ?? ''));
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception("A valid email address is required.", 400);
        }

        // Check duplicate email
        $checkStmt = $pdo->prepare("SELECT id FROM users WHERE LOWER(email) = :email LIMIT 1");
        $checkStmt->execute(['email' => $email]);
        if ($checkStmt->fetch()) {
            throw new Exception("An account with that email address already exists.", 409);
        }

        $password = $data['password'] ?? '';
        if (empty($password) || strlen($password) < 8) {
            throw new Exception("Password must be at least 8 characters long.", 400);
        }

        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        $role = strtolower($data['role'] ?? 'member');
        $status = strtolower($data['status'] ?? 'pending');
        $firstName = trim($data['first_name'] ?? $data['firstName'] ?? '');
        $middleName = trim($data['middle_name'] ?? $data['middleName'] ?? '');
        $lastName = trim($data['last_name'] ?? $data['lastName'] ?? '');
        $fullName = trim($data['name'] ?? trim("{$firstName} {$middleName} {$lastName}"));

        if (empty($fullName)) {
            throw new Exception("Full Name or First and Last name are required.", 400);
        }

        $userId = 'u-' . bin2hex(random_bytes(4));
        $studentId = trim($data['student_id'] ?? $data['studentId'] ?? '');
        $school = trim($data['school'] ?? '');
        $course = trim($data['course'] ?? '');
        $yearLevel = trim($data['year_level'] ?? $data['yearLevel'] ?? '');
        $phone = trim($data['phone'] ?? $data['contactNumber'] ?? '');
        $address = trim($data['address'] ?? '');
        $username = trim($data['username'] ?? stristr($email, '@', true));
        $qrCode = QRCodeService::generateMemberQRCode($userId, $studentId);

        $now = date('Y-m-d H:i:s');

        $stmt = $pdo->prepare("INSERT INTO users (
            id, user_id, name, first_name, middle_name, last_name, email, username, password_hash, role, status, phone, address, student_id, school, course, year_level, qr_code, created_at, updated_at
        ) VALUES (
            :id, :user_id, :name, :first_name, :middle_name, :last_name, :email, :username, :password_hash, :role, :status, :phone, :address, :student_id, :school, :course, :year_level, :qr_code, :created_at, :updated_at
        )");

        $stmt->execute([
            'id' => $userId,
            'user_id' => $userId,
            'name' => $fullName,
            'first_name' => $firstName,
            'middle_name' => $middleName,
            'last_name' => $lastName,
            'email' => $email,
            'username' => $username,
            'password_hash' => $passwordHash,
            'role' => $role,
            'status' => $status,
            'phone' => $phone,
            'address' => $address,
            'student_id' => $studentId,
            'school' => $school,
            'course' => $course,
            'year_level' => $yearLevel,
            'qr_code' => $qrCode,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return self::findById($userId);
    }

    public static function findById(string $id): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id OR user_id = :user_id LIMIT 1");
        $stmt->execute(['id' => $id, 'user_id' => $id]);
        $user = $stmt->fetch();

        if (!$user) return null;
        unset($user['password_hash'], $user['password']);
        return $user;
    }

    public static function findByEmail(string $email): ?array {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT * FROM users WHERE LOWER(email) = :email LIMIT 1");
        $stmt->execute(['email' => strtolower(trim($email))]);
        return $stmt->fetch() ?: null;
    }

    public static function getAll(array $filters = []): array {
        $pdo = Database::getConnection();
        $where = [];
        $params = [];

        if (!empty($filters['role']) && $filters['role'] !== 'all') {
            $where[] = "role = :role";
            $params['role'] = strtolower($filters['role']);
        }
        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $where[] = "status = :status";
            $params['status'] = strtolower($filters['status']);
        }
        if (!empty($filters['search'])) {
            $q = '%' . strtolower(trim($filters['search'])) . '%';
            $where[] = "(LOWER(name) LIKE :q OR LOWER(email) LIKE :q OR LOWER(student_id) LIKE :q)";
            $params['q'] = $q;
        }

        $sql = "SELECT * FROM users";
        if (!empty($where)) {
            $sql .= " WHERE " . implode(" AND ", $where);
        }
        $sql .= " ORDER BY created_at DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $users = $stmt->fetchAll();

        return array_map(function ($u) {
            unset($u['password_hash'], $u['password']);
            return $u;
        }, $users);
    }

    public static function update(string $id, array $data): array {
        $pdo = Database::getConnection();
        $user = self::findById($id);
        if (!$user) {
            throw new Exception("User not found.", 404);
        }

        $fields = [];
        $params = ['id' => $id];

        $updatable = [
            'name', 'first_name', 'middle_name', 'last_name', 'phone', 'address',
            'student_id', 'school', 'course', 'year_level', 'status', 'role',
            'username', 'library_card_number', 'school_id_url', 'profile_photo_url'
        ];

        foreach ($updatable as $col) {
            if (isset($data[$col])) {
                $fields[] = "`{$col}` = :{$col}";
                $params[$col] = $data[$col];
            }
        }

        if (isset($data['password']) && !empty($data['password'])) {
            $fields[] = "`password_hash` = :password_hash";
            $params['password_hash'] = password_hash($data['password'], PASSWORD_BCRYPT);
        }

        // On activation / approval
        if (!empty($data['status']) && strtolower($data['status']) === 'active') {
            if (empty($user['qr_code'])) {
                $qrCode = QRCodeService::generateMemberQRCode($id, $user['student_id'] ?? '');
                $fields[] = "`qr_code` = :qr_code";
                $params['qr_code'] = $qrCode;
            }
            if (empty($user['library_card_number'])) {
                $libCard = 'LIB-CARD-' . strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $id), -6)) . '-' . date('Y');
                $fields[] = "`library_card_number` = :library_card_number";
                $params['library_card_number'] = $libCard;
            }
            
            // Notify user of membership approval
            require_once __DIR__ . '/Notification.php';
            Notification::create([
                'user_id' => $id,
                'title' => 'Membership Application Approved!',
                'message' => 'Congratulations! Your library membership application has been approved. Your digital Library Card and QR Code are now active.',
                'type' => 'success'
            ]);
        } elseif (!empty($data['status']) && strtolower($data['status']) === 'rejected') {
            require_once __DIR__ . '/Notification.php';
            Notification::create([
                'user_id' => $id,
                'title' => 'Membership Application Update',
                'message' => 'Your membership application could not be approved at this time. Please contact the library administrator.',
                'type' => 'warning'
            ]);
        }

        if (empty($fields)) {
            return $user;
        }

        $fields[] = "`updated_at` = :updated_at";
        $params['updated_at'] = date('Y-m-d H:i:s');

        $sql = "UPDATE users SET " . implode(", ", $fields) . " WHERE id = :id OR user_id = :user_id";
        $params['user_id'] = $id;
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        return self::findById($id);
    }

    public static function softDelete(string $id): bool {
        return self::update($id, ['status' => 'deactivated']) !== null;
    }

    public static function deletePermanent(string $id): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = :id OR user_id = :user_id");
        return $stmt->execute(['id' => $id, 'user_id' => $id]);
    }
}
