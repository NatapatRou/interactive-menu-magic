<?php
// login.php

if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.gc_maxlifetime', 3600); // 1-hour session data lifetime
    session_start(); // start session
}

header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:8080"); // have to specify client, since wildcard * can be harmful
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Allowed HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"); // Allowed headers
// Database connection
require_once __DIR__ . "/config.php";
$API = require_once __DIR__ . "/api.php";
$conn = new Connect();
// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['username'], $data['password'])){
    $username = $data['username'];
    $password = $data['password'];
}
$get_pass = "";
$auth_data = $API->select_all_user();
try{
    // Itterate for each data in array -> auth_data[0] and so on... as a $results vatiable
    foreach($auth_data as $results){
        if($username == $results['email']){ // check only mail
            # if no session create new session, session start if login successfully
            if (isset($results['fname'])) {
                $key = $results['fname'];
            }
            if (isset($results['id'])) {
                $_SESSION['id'] = $results['id'];
            }
            if (isset($results['role'])){
                $_SESSION['role'] = $results['role'];
            }
            // echo send json to font , response role because use role to decided which form we gonna go to
            break;
        }
    }
    # check if the email is in which role and try to query for password individual.
    
    // var_dump($_SESSION);
    switch($_SESSION['role']){
        case "Patient":
            $get_pass = "SELECT AES_DECRYPT( password, SHA1(:key)) AS password FROM Patient WHERE id = :patient_id";
            // $get_pass = "SELECT password FROM Patient WHERE id = :patient_id ";
            $stmt = $conn->prepare($get_pass);
            $stmt->bindParam(':patient_id', $_SESSION['id']);
            break;
        case "Doctor":
            $get_pass = "SELECT AES_DECRYPT( password, SHA1(:key) AS password FROM Doctor WHERE id = :doctor_id";
            $stmt = $conn->prepare($get_pass);
            $stmt->bindParam(':doctor_id', $_SESSION['id']);
            break;
        case "Pharmacist":
            $get_pass = "SELECT AES_DECRYPT( password, SHA1(:key) AS password FROM Pharmacist WHERE id = :pharmacist_id";
            $stmt = $conn->prepare($get_pass);
            $stmt->bindParam(':pharmacist_id', $_SESSION['id']);
            break;
        default:
            $get_pass = '';
    }

    $stmt->bindParam(':key', $key);
    if($stmt->execute()){
        #select password
        $pass_arr = $stmt->fetch(PDO::FETCH_ASSOC); 
        $check_pass = $pass_arr['password'];
        if($password == $check_pass){
            echo json_encode(["status" => "success", "message" => "User login successfully", "role" => $results['role'], "Session_id" => $_SESSION['id']]);
        }
        else{
            echo json_encode(["status" => "fail", "message" => "Incorrect password"]);
        }
    } 
    // if use php password hash use this method
    // if($stmt->execute()){
    //     #select password
    //     $pass_arr = $stmt->fetch(PDO::FETCH_ASSOC); 
    //     $check_pass = $pass_arr['password'];
    //     # since it's one time hash we need to use this method to check password
    //     if (password_verify($password, $check_pass)){
    //         echo json_encode(["status" => "success", "message" => "User login successfully", "role" => $results['role'], "Session_id" => $_SESSION['id']]);
    //     }else{
    //         echo json_encode(["status" => "fail", "message" => "Incorrect password"]);
    //     }
    // } 

} catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error: " . $e->getMessage()]);
}

