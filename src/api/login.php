<?php
// login.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Allowed HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"); // Allowed headers
// Database connection
$API = require_once __DIR__ . "/api.php";

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['username'], $data['password'])){
    $username = $data['username'];
    $password = $data['password'];
}

$auth_data = $API->select_all_user();
try{
    // Itterate for each data in array -> auth_data[0] and so on... as a $results vatiable
    foreach($auth_data as $results){
        if($username == $results['email'] && $password == $results['password']){
            if (session_status() === PHP_SESSION_NONE) {
                ini_set('session.gc_maxlifetime', 3600); // 1-hour session data lifetime
                session_start(); // start session
            }
            $_SESSION['role'] = $results['role'];
            // echo send json to font , response role because use role to decided which form we gonna go to
            echo json_encode(["status" => "success", "message" => "User login successfully", "role" => $results['role']]);
            break;
        }
    }
} catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error: " . $e->getMessage()]);
}

