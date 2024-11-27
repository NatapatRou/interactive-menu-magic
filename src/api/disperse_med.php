<?php
session_start();
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: GET, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json");

require_once __DIR__ . '/config.php';


$conn = new Connect();
$data = json_decode(file_get_contents("php://input"), true);
try
{
    $pharmacist_id = $_SESSION['id'];
    $prescription_id = $data['prescriptionId'];
    $medication_id = $_GET['med_id'];

    // reduce med in stock
    $update_medication = "UPDATE Medication SET quantity_in_stock =  quantity_in_stock - 1 WHERE medication_id = :medication_id";
    $update_med_stmt = $conn->prepare($update_medication);
    $update_med_stmt->bindParam('medication_id', $medication_id);
    $update_med_stmt->execute();
    
    // update prescription status
    $update_prescription_sql = "UPDATE Prescription SET status = 'Dispensed' WHERE prescription_id = :prescription_id";
    $update_prescription_stmt = $conn->prepare($update_prescription_sql);
    $update_prescription_stmt->bindParam(':prescription_id', $prescription_id);
    $update_prescription_stmt->execute();

    // update pharmacist status
    $update_pharmacist_status = "UPDATE Pharmacist SET status = 'Available' WHERE id = :pharmacist_id";
    $update_pharmacist_stmt = $conn->prepare($update_pharmacist_status);
    $update_pharmacist_stmt->bindParam(':pharmacist_id', $pharmacist_id);
    $update_pharmacist_stmt->execute();


    echo json_encode(["status" => "success", "message" => "Prescription dispense successfully"]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Error: " . $e->getMessage()]);
}

?>
