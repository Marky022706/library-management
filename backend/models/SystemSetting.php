<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/AuditLog.php';

class SystemSetting {
    public static function getAll(): array {
        $pdo = Database::getConnection();
        self::ensureDefaults($pdo);
        return $pdo->query("SELECT * FROM system_settings ORDER BY setting_group, setting_key")->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function get(string $key, $default = null) {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT setting_value FROM system_settings WHERE setting_key = :k");
        $stmt->execute([':k' => $key]);
        $val = $stmt->fetchColumn();
        return ($val !== false) ? $val : $default;
    }

    public static function update(string $key, string $value, ?array $adminUser = null): bool {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO system_settings (id, setting_key, setting_value, setting_group, description, updated_at)
                               VALUES (:id, :k, :v, 'general', 'Configurable library parameter', NOW())
                               ON DUPLICATE KEY UPDATE setting_value = :v_dup, updated_at = NOW()");
        $id = 'set-' . substr(bin2hex(random_bytes(6)), 0, 8);
        $res = $stmt->execute([':id' => $id, ':k' => $key, ':v' => $value, ':v_dup' => $value]);

        AuditLog::create([
            'user_id' => $adminUser['id'] ?? 'system',
            'user_name' => $adminUser['name'] ?? 'Super Admin',
            'role' => $adminUser['role'] ?? 'super_admin',
            'action' => 'Update Setting',
            'module' => 'Settings',
            'target_id' => $key,
            'description' => "Updated setting {$key} to {$value}",
        ]);

        return $res;
    }

    public static function ensureDefaults(PDO $pdo): void {
        $count = (int) $pdo->query("SELECT COUNT(*) FROM system_settings")->fetchColumn();
        if ($count === 0) {
            $defaults = [
                ['set-1', 'borrowing_limit', '3', 'circulation', 'Maximum books a member can borrow concurrently'],
                ['set-2', 'loan_duration_days', '7', 'circulation', 'Standard loan duration in days'],
                ['set-3', 'renewal_limit', '2', 'circulation', 'Maximum allowed loan renewals per book'],
                ['set-4', 'fine_rate_per_day', '5.00', 'circulation', 'Daily overdue penalty in PHP'],
                ['set-5', 'reservation_expiry_days', '3', 'circulation', 'Hold pickup window in days'],
                ['set-6', 'operating_hours', '8:00 AM - 5:00 PM', 'general', 'Official library operating hours'],
                ['set-7', 'library_name', 'Balingasag Public Library', 'general', 'Official Library Name'],
                ['set-8', 'library_email', 'library@balingasag.gov.ph', 'general', 'Official Library Contact Email'],
            ];

            $stmt = $pdo->prepare("INSERT IGNORE INTO system_settings (id, setting_key, setting_value, setting_group, description, updated_at) VALUES (?, ?, ?, ?, ?, NOW())");
            foreach ($defaults as $row) {
                $stmt->execute($row);
            }
        }
    }
}
