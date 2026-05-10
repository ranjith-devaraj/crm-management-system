<?php
require_once "config.php";

// 🔥 ADD PORT 3307 HERE
$conn = new mysqli("localhost", "root", "", "crm", 3307);

if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "DB connection failed: " . $conn->connect_error
  ]);
  exit();
}

$conn->set_charset("utf8mb4");
?>