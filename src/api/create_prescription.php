<?php
session_start();
// create_presciption.php

// CORS Headers
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Include required files
require_once __DIR__ . '/config.php';
$API = require_once __DIR__ . "/api.php";

$conn = new Connect();
$data = json_decode(file_get_contents("php://input"), true);
try {
    $available_crew = $API->select_first_available();
    $pharmacist_id = $available_crew[1]['id'];
    $sym_id = $_GET["sym_id"];
    
    $sql = "INSERT INTO Prescription 
                (doctor_id, patient_id, pharmacist_id, medication_id, date_issued, status, notes)
            VALUES 
                (:doctor_id, :patient_id, :pharmacist_id, :medication_id, CURDATE(), 'Pending', :notes)";

    $insert_stmt = $conn->prepare($sql);

    $insert_stmt->bindParam(':doctor_id', $_SESSION['id']);
    $insert_stmt->bindParam(':patient_id', $data['patientId']);
    $insert_stmt->bindParam(':pharmacist_id', $pharmacist_id);
    $insert_stmt->bindParam(':medication_id', $data['medicineId']); 
    $insert_stmt->bindParam(':notes', $data['prescription']);
    $insert_stmt->execute();
    
    $update_phar = "UPDATE Pharmacist SET status = 'Unavailable' WHERE id = :pharmacist_id ";
    $update_stmt = $conn->prepare($update_phar);
    $update_stmt->bindParam(':pharmacist_id', $pharmacist_id);
    $update_stmt->execute();

    $update_sym = "UPDATE Symptom_statement SET status = 'Confirmed' WHERE sym_id = :sym_id";
    $update_sym_stmt = $conn->prepare($update_sym);
    $update_sym_stmt->bindParam(':sym_id', $sym_id);
    $update_sym_stmt->execute();

    $update_doc = "UPDATE Doctor SET status = 'Available' WHERE id = :doctor_id ";
    $update_doc_stmt = $conn->prepare($update_doc);
    $update_doc_stmt->bindParam(':doctor_id', $_SESSION['id']);
    $update_doc_stmt->execute();
    
    echo json_encode(["status" => "success", "message" => "Prescription created successfully"]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Invalid data"]);
}
