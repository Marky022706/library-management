<?php

require_once __DIR__ . '/../config/database.php';

class SystemLog {
    public static function getAll(array $filters = []): array {
        $pdo = Database::getConnection();
        $sql = "SELECT * FROM system_logs WHERE 1=1";
        $params = [];

        if (!empty($filters['level'])) {
            $sql .= " AND level = :level";
            $params[':level'] = $filters['level'];
        }
        if (!empty($filters['channel'])) {
            $sql .= " AND channel = :channel";
            $params[':channel'] = $filters['channel'];
        }

        $sql .= " ORDER BY created_at DESC LIMIT 150";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function log(string $level, string $message, string $channel = 'system', ?array $context = null): void {
        try {
            $pdo = Database::getConnection();
            $id = 'syslog-' . substr(bin2hex(random_bytes(6)), 0, 8);
            $stmt = $pdo->prepare("INSERT INTO system_logs (id, level, channel, message, context, created_at)
                VALUES (:id, :level, :channel, :msg, :ctx, NOW())");
            $stmt->execute([
                ':id' => $id,
                ':level' => $level,
                ':channel' => $channel,
                ':msg' => $message,
                ':ctx' => $context ? json_encode($context) : null,
            ]);
        } catch (Exception $e) {
            // Failsafe: avoid infinite logging loops
        }
    }
}
