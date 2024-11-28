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

   // Begin a transaction
    $conn->beginTransaction();   

    // Get medication id which related to this prescription form medication_detail
    $med_get = "SELECT medication_id FROM Medication_detail WHERE prescription_id = :prescription_id";
    $med_get_stmt = $conn->prepare($med_get);
    $med_get_stmt->bindParam(':prescription_id', $prescription_id);
    $med_get_stmt->execute();
    
    $med_id_arr = $med_get_stmt->fetchAll(PDO::FETCH_ASSOC);
    // reduce med in stock
    foreach($med_id_arr AS $med_id){
    // echo "<script>console.log('Debug Objects: " . $med_id['medication_id'] . "' );</script>";
        $update_medication = "UPDATE Medication SET quantity_in_stock =  quantity_in_stock - 1 WHERE medication_id = :medication_id";
        $update_med_stmt = $conn->prepare($update_medication);
        $update_med_stmt->bindParam('medication_id', $med_id['medication_id']);
        $update_med_stmt->execute();
    }
    
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

    $conn->commit();   

    echo json_encode(["status" => "success", "message" => "Prescription dispense successfully"]);

} catch (PDOException $e) {
    $conn->rollBack();
    echo json_encode(["status" => "error", "message" => "Error: " . $e->getMessage()]);
}

?>
