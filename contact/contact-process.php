<?php
// ===== ตั้งค่าอีเมลแอดมิน =====
$address = 'YOUR_ADMIN_EMAIL@example.com'; // <-- เปลี่ยนเป็นอีเมลบริษัทที่ต้องการรับข้อความ

if (!defined('PHP_EOL')) define('PHP_EOL', "\r\n");

header('Content-Type: application/json; charset=utf-8');

// ตรวจสอบว่าเป็น POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
    exit;
}

$error   = false;
$missing = [];
$fields  = ['name', 'mail', 'phone', 'message'];

foreach ($fields as $field) {
    if (empty($_POST[$field]) || trim($_POST[$field]) === '') {
        $error   = true;
        $missing[] = $field;
    }
}

if ($error) {
    echo json_encode(['status' => 'error', 'message' => 'Missing fields: ' . implode(', ', $missing)]);
    exit;
}

// Sanitize inputs
$name    = htmlspecialchars(stripslashes(trim($_POST['name'])),    ENT_QUOTES, 'UTF-8');
$mail    = filter_var(trim($_POST['mail']), FILTER_SANITIZE_EMAIL);
$phone   = htmlspecialchars(stripslashes(trim($_POST['phone'])),   ENT_QUOTES, 'UTF-8');
$message = htmlspecialchars(stripslashes(trim($_POST['message'])), ENT_QUOTES, 'UTF-8');

// Validate email
if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address']);
    exit;
}

// Build email
$e_subject = "[Future Next Group] ข้อความติดต่อจาก $name";

$e_body  = "คุณได้รับข้อความติดต่อใหม่จากเว็บไซต์" . PHP_EOL . PHP_EOL;
$e_body .= "ชื่อ     : $name"    . PHP_EOL;
$e_body .= "อีเมล    : $mail"    . PHP_EOL;
$e_body .= "โทรศัพท์ : $phone"   . PHP_EOL;
$e_body .= "ข้อความ  :" . PHP_EOL . $message . PHP_EOL;

$headers  = "From: Future Next Group <noreply@futurenextgroup.com>" . PHP_EOL;
$headers .= "Reply-To: $name <$mail>" . PHP_EOL;
$headers .= "MIME-Version: 1.0" . PHP_EOL;
$headers .= "Content-Type: text/plain; charset=UTF-8" . PHP_EOL;
$headers .= "Content-Transfer-Encoding: 8bit" . PHP_EOL;

if (mail($address, $e_subject, $e_body, $headers)) {
    echo json_encode(['status' => 'success', 'message' => 'ส่งข้อความสำเร็จ']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'ไม่สามารถส่งอีเมลได้ กรุณาลองใหม่อีกครั้ง']);
}
?>