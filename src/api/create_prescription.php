<?php
session_start();
// create_presciption.php
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Allowed HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"); // Allowed headers
// Database connection
//
require_once __DIR__ . '/config.php';
$API = require_once __DIR__ . "/api.php";
$conn = new Connect();
$data = json_decode(file_get_contents("php://input"), true);
$avaiable_crew = $API->select_first_available();
$pharmacist_id = $avaiable_crew[1]['id']; 

$sql_sym = "INSERT INTO Prescription ( doctor_id, patient_id, pharmacist_id, medication_id, date_issued, status, notes )
    VALUES (:doctor_id,:patient_id,:pharmacist_id,:medication_id,CURDATE(),'Pending',:notes)";
$sym_stmt = $conn->prepare($sql_sym);

$sym_stmt->bindParam(':doctor_id', $_SESSION['id']);
$sym_stmt->bindParam(':patient_id', $data['patientId']);
$sym_stmt->bindParam(':pharmacist_id', $pharmacist_id);
$sym_stmt->bindParam(':medication_id', $data['medicineId']);
$sym_stmt->bindParam(':notes', $data['prescription']);

$sym_stmt->execute();
echo json_encode(["status" => "success", "message" => "Create Prescription successfully"]);