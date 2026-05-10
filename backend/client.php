<?php
require_once "db.php";

$email = $_GET['email'] ?? '';
if (!$email) {
  http_response_code(400);
  echo json_encode(["success"=>false,"message"=>"email required"]);
  exit();
}

$stmt = $conn->prepare("SELECT company, status, notes FROM customers WHERE client_email=? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$res = $stmt->get_result();

if ($row = $res->fetch_assoc()) {
  echo json_encode(["success"=>true, "data"=>$row]);
} else {
  echo json_encode(["success"=>false, "data"=>null]);
}