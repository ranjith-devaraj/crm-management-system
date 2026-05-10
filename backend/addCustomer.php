<?php
require_once "db.php";
require_once "helpers.php";

$d = getJSON();

// 🔥 fallback if JSON not sent properly
if (!$d) {
  $d = $_POST;
}

// 🔥 REQUIRED FIELDS
$required = ["company","owner","clientEmail","password"];
foreach ($required as $r) {
  if (empty(trim($d[$r] ?? ""))) {
    respond([
      "success" => false,
      "message" => "$r required"
    ], 400);
  }
}

// 🔥 CLEAN INPUTS
$company = trim($d['company']);
$owner = trim($d['owner']);
$phone = trim($d['phone'] ?? "");
$email = trim($d['email'] ?? "");
$status = trim($d['status'] ?? "New Lead");
$notes = trim($d['notes'] ?? "");
$client_email = trim($d['clientEmail']);
$password = trim($d['password']);

// 🔥 EMAIL VALIDATION
if (!filter_var($client_email, FILTER_VALIDATE_EMAIL)) {
  respond([
    "success" => false,
    "message" => "Invalid client email"
  ], 400);
}

// 🔐 HASH PASSWORD
$hash = password_hash($password, PASSWORD_BCRYPT);

// 🔥 CHECK DUPLICATE CLIENT EMAIL
$chk = $conn->prepare("SELECT id FROM customers WHERE client_email=?");
$chk->bind_param("s", $client_email);
$chk->execute();
$res = $chk->get_result();

if ($res->num_rows > 0) {
  $chk->close();
  respond([
    "success" => false,
    "message" => "Client email already exists"
  ], 409);
}
$chk->close();

// 🔥 INSERT CUSTOMER
$stmt = $conn->prepare(
  "INSERT INTO customers 
  (company, owner, phone, email, status, notes, client_email, password)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
);

$stmt->bind_param(
  "ssssssss",
  $company,
  $owner,
  $phone,
  $email,
  $status,
  $notes,
  $client_email,
  $hash
);

if ($stmt->execute()) {
  $id = $stmt->insert_id;
  $stmt->close();

  respond([
    "success" => true,
    "id" => $id,
    "message" => "Customer created successfully"
  ]);
}

$stmt->close();

// 🔥 ERROR RESPONSE
respond([
  "success" => false,
  "message" => "Insert failed"
], 500);