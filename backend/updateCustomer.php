<?php
require_once "db.php";
require_once "helpers.php";

$d = getJSON();
$id = (int)($d['id'] ?? 0);
if (!$id) respond(["success"=>false,"message"=>"id required"], 400);

$company = $d['company'] ?? null;
$owner = $d['owner'] ?? null;
$status = $d['status'] ?? null;
$client_email = $d['clientEmail'] ?? null;
$password = $d['password'] ?? null;

if ($password) {
  $hash = password_hash($password, PASSWORD_BCRYPT);
  $stmt = $conn->prepare(
    "UPDATE customers SET company=?, owner=?, status=?, client_email=?, password=? WHERE id=?"
  );
  $stmt->bind_param("sssssi", $company, $owner, $status, $client_email, $hash, $id);
} else {
  $stmt = $conn->prepare(
    "UPDATE customers SET company=?, owner=?, status=?, client_email=? WHERE id=?"
  );
  $stmt->bind_param("ssssi", $company, $owner, $status, $client_email, $id);
}

if ($stmt->execute()) respond(["success"=>true]);
respond(["success"=>false], 500);