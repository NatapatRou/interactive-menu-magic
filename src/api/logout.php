<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

session_start();
session_unset();  // Clear session data
session_destroy(); // Destroy the session
echo json_encode(["message" => "Logged out successfully"]);
?>
