<?php
ini_set('display_errors', '0');
error_reporting(E_ALL);

function handleCorsHeaders(): void {
    if (session_status() === PHP_SESSION_NONE) {
        $tempDir = sys_get_temp_dir();
        if (is_dir($tempDir) && is_writable($tempDir)) {
            @session_save_path($tempDir);
        }
        @session_start();
    }

    if (isset($_SERVER['HTTP_ORIGIN'])) {
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');
    } else {
        header("Access-Control-Allow-Origin: *");
    }

    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
            header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
        }
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
        } else {
            header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Session-Id");
        }
        http_response_code(200);
        exit(0);
    }
}

handleCorsHeaders();
