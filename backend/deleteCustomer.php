<?php
require_once "db.php";
require_once "helpers.php";

$d = getJSON();
$id = (int)($d['id'] ?? 0);
if (!$id) respond(["success"=>false,"message"=>"id required"], 400);

$stmt = $conn->prepare("DELETE FROM customers WHERE id=?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) respond(["success"=>true]);
respond(["success"=>false], 500);