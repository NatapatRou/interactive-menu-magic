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

if (isset($data['symptoms'])){
    $symptoms = $data['symptoms'];
}
// fetch user id from session
if (isset($_SESSION['id'])){
    $user_id  = $_SESSION['id'];
}
// assign first availabe doctor or patient to prescription 
try{
    if(isset($avaiable_crew)){
        $doctor_id = $avaiable_crew[0]['id'];
    }
    // create symptoms
    $sql_sym = "INSERT INTO Symptom_statement (patient_id, doctor_id, sym_description)
    VALUES
    (:patient_id, :doctor_id, :sym_description)";

    $sym_stmt = $conn->prepare($sql_sym);

    $sym_stmt->bindParam(':patient_id', $user_id);
    $sym_stmt->bindParam(':doctor_id', $doctor_id);
    $sym_stmt->bindParam(':sym_description', $symptoms);

    $sym_stmt->execute();

    // update doctor to unavailable
    $sql_update = "UPDATE Doctor 
    SET status = 'Unavailable'
    WHERE id = :doctor_id";

    $update_stmt = $conn->prepare($sql_update);
    $update_stmt->bindParam(':doctor_id', $doctor_id);
    $update_stmt->execute();

    $_SESSION['doctor_id'] = $doctor_id;

    echo json_encode(["status" => "success", "message" => "Create symptoms successfully"]);

} catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error: " . $e->getMessage()]);
}


