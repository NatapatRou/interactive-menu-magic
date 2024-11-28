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
    $medicine_arr = (array)$data['medicineIds'];
    // var_dump($medicine_arr);
   // Begin a transaction
    $conn->beginTransaction();   

    $sql = "INSERT INTO Prescription 
                (doctor_id, patient_id, pharmacist_id, date_issued, status, notes)
            VALUES 
                (:doctor_id, :patient_id, :pharmacist_id, CURDATE(), 'Pending', :notes)";

    $insert_stmt = $conn->prepare($sql);

    $insert_stmt->bindParam(':doctor_id', $_SESSION['id']);
    $insert_stmt->bindParam(':patient_id', $data['patientId']);
    $insert_stmt->bindParam(':pharmacist_id', $pharmacist_id);
    $insert_stmt->bindParam(':notes', $data['prescription']);
    $insert_stmt->execute();

    // get created prescription id which last inserted my THIS $conn object
    $inserted_prescriptionId = $conn->lastInsertId();
    // echo "<script>console.log('Debug Objects: " . $inserted_prescriptionId . "' );</script>";
    $update_sql = "UPDATE Pharmacist SET status = 'Unavailable' WHERE id = :pharmacist_id ";
    $update_stmt = $conn->prepare($update_sql);
    $update_stmt->bindParam(':pharmacist_id', $pharmacist_id);
    $update_stmt->execute();

    // update symptom statement
    $update_sym = "UPDATE Symptom_statement SET status = 'Confirmed' WHERE sym_id = :sym_id";
    $update_sym_stmt = $conn->prepare($update_sym);
    $update_sym_stmt->bindParam(':sym_id', $sym_id);
    $update_sym_stmt->execute();
    
    // update doctor to available
    $update_doc = "UPDATE Doctor SET status = 'Available' WHERE id = :doctor_id ";
    $update_doc_stmt = $conn->prepare($update_doc);
    $update_doc_stmt->bindParam(':doctor_id', $_SESSION['id']);
    $update_doc_stmt->execute();
    $insert_med_detail = "INSERT INTO Medication_detail (prescription_id, medication_id) 
                          VALUES (:prescription_id, :medication_id)";
    $insert_med_stmt = $conn->prepare($insert_med_detail);

    foreach($medicine_arr AS $med_key => $med_id){
        $insert_med_stmt->bindParam(':prescription_id', $inserted_prescriptionId);
        $insert_med_stmt->bindParam(':medication_id', $med_id);
        $insert_med_stmt->execute();
    }
    

  // Commit the transaction if all operations succeed
    $conn->commit();

    echo json_encode(["status" => "success", "message" => "Prescription created successfully"]);
} catch (Exception $e) {
// Rollback the transaction if any operation fails
    $conn->rollBack();
    echo json_encode(["status" => "error", "message" => "Invalid data"]);
}
