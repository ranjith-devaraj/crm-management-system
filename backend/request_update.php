<?php
require_once "db.php";
require_once "helpers.php";

$d = getJSON();

$id = $d['id'] ?? 0;
$status = $d['status'] ?? '';

if (!$id || !$status) {
  respond(["success" => false, "message" => "Invalid data"], 400);
}

// 🔥 Get request details
$stmt = $conn->prepare("SELECT * FROM requests WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();
$res = $stmt->get_result();

if (!$row = $res->fetch_assoc()) {
  respond(["success" => false, "message" => "Request not found"], 404);
}

// 🔥 Update request status
$update = $conn->prepare("UPDATE requests SET status=? WHERE id=?");
$update->bind_param("si", $status, $id);
$update->execute();


// 🔥 IF APPROVED → ADD TO CUSTOMERS
if ($status === "Approved") {

  $company = $row['service']; // or map properly
  $owner = $row['client_email'];
  $client_email = $row['client_email'];
  $notes = $row['description'];

  // 🔥 prevent duplicate
  $check = $conn->prepare("SELECT id FROM customers WHERE client_email=?");
  $check->bind_param("s", $client_email);
  $check->execute();

  if ($check->get_result()->num_rows === 0) {

    $stmt2 = $conn->prepare("
      INSERT INTO customers (company, owner, status, client_email, notes)
      VALUES (?, ?, 'In Progress', ?, ?)
    ");

    $stmt2->bind_param("ssss", $company, $owner, $client_email, $notes);
    $stmt2->execute();
  }
}

respond(["success" => true]);