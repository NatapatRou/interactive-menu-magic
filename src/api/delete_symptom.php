<?php
session_start();
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: GET, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json");

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        $db = new Connect;
        $patient_id = $_SESSION['id'];
        $symptom_id = $_GET['id'];
        $doctor_id = $_GET['doctor_id'];
        
        $delete_query = "DELETE FROM Symptom_statement WHERE sym_id = :sym_id AND patient_id = :patient_id";
        $delete_stmt = $db->prepare($delete_query);
        $delete_stmt->bindParam(':sym_id', $symptom_id);
        $delete_stmt->bindParam(':patient_id', $patient_id);
        
        $update_query = "UPDATE Doctor SET status = 'Available' WHERE id = :doctor_id";
        $update_stmt = $db->prepare($update_query);
        $update_stmt->bindParam(':doctor_id', $doctor_id);

        if ($delete_stmt->execute() && $update_stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Symptom deleted successfully"]);
        } else {
            throw new Exception("Failed to delete symptom");
        }
        
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
    // Should change doctor from unavailable back to available -> how to get doctor id by GET?
}
?>
