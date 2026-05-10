<?php
function getJSON() {
  $raw = file_get_contents("php://input");
  return json_decode($raw, true) ?? [];
}

function respond($arr, $code = 200) {
  http_response_code($code);
  echo json_encode($arr);
  exit();
}