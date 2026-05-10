<?php
require_once "db.php";
require_once "helpers.php";

$data = getJSON();

if (!$data) {
  respond([
    "success" => false,
    "message" => "No JSON received",
    "raw" => file_get_contents("php://input")
  ], 400);
}


$data = getJSON();
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (!$email || !$password) {
  respond(["success" => false, "message" => "Missing credentials"], 400);
}

// Client login from DB
$stmt = $conn->prepare("SELECT client_email, password FROM customers WHERE client_email=? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$res = $stmt->get_result();

if ($row = $res->fetch_assoc()) {
  if (password_verify($password, $row['password'])) {
    respond(["success" => true, "role" => "client", "email" => $email]);
  } else {
    respond(["success" => false, "message" => "Invalid password"], 401);
  }
}

// Owner / Employee (you can move these to DB later)
if ($email === "owner@gmail.com" && $password === "owner123") {
  respond(["success" => true, "role" => "owner", "email" => $email]);
}
if ($email === "emp@gmail.com" && $password === "emp123") {
  respond(["success" => true, "role" => "employee", "email" => $email]);
}

respond(["success" => false, "message" => "User not found"], 404);