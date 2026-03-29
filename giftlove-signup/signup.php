<?php
// ── Database config ───────────────────────────────────────────────────────────
// Fill these in with the values from SiteGround cPanel → MySQL Databases
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database_name');   // e.g. username_giflove
define('DB_USER', 'your_database_user');   // e.g. username_giflove
define('DB_PASS', 'your_database_password');

// ── Only accept POST requests ─────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method not allowed');
}

// ── Collect and sanitise inputs ───────────────────────────────────────────────
$name  = trim(strip_tags($_POST['name']  ?? ''));
$email = trim(strip_tags($_POST['email'] ?? ''));
$ip    = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? null;

// Basic validation
if (empty($name) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid name or email.']);
    exit;
}

// ── Connect to MySQL ──────────────────────────────────────────────────────────
try {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Database connection failed.']);
    exit;
}

// ── Insert signup ─────────────────────────────────────────────────────────────
try {
    $stmt = $pdo->prepare(
        'INSERT INTO signups (name, email, ip_address) VALUES (:name, :email, :ip)'
    );
    $stmt->execute([
        ':name'  => $name,
        ':email' => $email,
        ':ip'    => $ip,
    ]);

    echo json_encode(['ok' => true]);

} catch (PDOException $e) {
    // Duplicate email — treat as success so the user isn't confused
    if ($e->getCode() === '23000') {
        echo json_encode(['ok' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'Could not save signup.']);
    }
}
