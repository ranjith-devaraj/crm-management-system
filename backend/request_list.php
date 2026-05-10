<?php
require_once "db.php";
require_once "helpers.php";

$email = $_GET['email'] ?? '';

if ($email) {
  // 🔹 CLIENT VIEW (only their requests)
  $stmt = $conn->prepare("
    SELECT id, service, description, status, created_at 
    FROM requests 
    WHERE client_email=? 
    ORDER BY id DESC
  ");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $res = $stmt->get_result();

} else {
  // 🔹 ADMIN / EMPLOYEE VIEW (all requests)
  $res = $conn->query("
    SELECT id, client_email, service, description, status, created_at 
    FROM requests 
    ORDER BY id DESC
  ");
}

$data = [];

while ($row = $res->fetch_assoc()) {
  $data[] = $row;
}

respond([
  "success" => true,
  "data" => $data
]);