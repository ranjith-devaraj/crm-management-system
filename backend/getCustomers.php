<?php
require_once "db.php";
require_once "helpers.php";

$result = $conn->query("
  SELECT id, company, owner, status, client_email 
  FROM customers 
  ORDER BY id DESC
");

if (!$result) {
  respond([
    "success" => false,
    "message" => $conn->error
  ], 500);
}

$data = [];

while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

respond([
  "success" => true,
  "data" => $data
]);