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
        
        $query = "DELETE FROM Symptom_statement WHERE sym_id = :sym_id AND patient_id = :patient_id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':sym_id', $symptom_id);
        $stmt->bindParam(':patient_id', $patient_id);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Symptom deleted successfully"]);
        } else {
            throw new Exception("Failed to delete symptom");
        }
    } catch(Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>