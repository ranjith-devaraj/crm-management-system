<?php
require_once "db.php";
require_once "helpers.php";

$d = getJSON();
$email = $d['email'] ?? '';
$service = $d['service'] ?? '';
$desc = $d['description'] ?? '';

if (!$email || !$service) respond(["success"=>false,"message"=>"required"], 400);

$stmt = $conn->prepare("INSERT INTO requests (client_email, service, description) VALUES (?,?,?)");
$stmt->bind_param("sss", $email, $service, $desc);

if ($stmt->execute()) respond(["success"=>true]);
respond(["success"=>false], 500);