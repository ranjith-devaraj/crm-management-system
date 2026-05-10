<?php
require_once "db.php";

// totals
$total = $conn->query("SELECT COUNT(*) c FROM customers")->fetch_assoc()['c'];
$inProgress = $conn->query("SELECT COUNT(*) c FROM customers WHERE status='In Progress'")->fetch_assoc()['c'];
$completed = $conn->query("SELECT COUNT(*) c FROM customers WHERE status='Completed'")->fetch_assoc()['c'];

// status distribution
$res = $conn->query("SELECT status, COUNT(*) as value FROM customers GROUP BY status");
$status = [];
while ($r = $res->fetch_assoc()) {
  $status[] = ["name"=>$r['status'], "value"=>(int)$r['value']];
}

// monthly (by created_at)
$res = $conn->query("
  SELECT DATE_FORMAT(created_at, '%b') as month, COUNT(*) as customers
  FROM customers
  GROUP BY DATE_FORMAT(created_at, '%Y-%m')
  ORDER BY MIN(created_at)
");
$monthly = [];
while ($r = $res->fetch_assoc()) {
  $monthly[] = ["month"=>$r['month'], "customers"=>(int)$r['customers']];
}

echo json_encode([
  "success"=>true,
  "total"=>(int)$total,
  "inProgress"=>(int)$inProgress,
  "completed"=>(int)$completed,
  "status"=>$status,
  "monthly"=>$monthly
]);