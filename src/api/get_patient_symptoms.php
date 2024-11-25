<?php
session_start();
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: GET, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json");

require_once __DIR__ . '/config.php';

try {
    $db = new Connect;
    $patient_id = $_SESSION['id'];
    
    $query = "SELECT sym_id, date_issued, sym_description FROM Symptom_statement WHERE patient_id = :patient_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':patient_id', $patient_id);
    $stmt->execute();
    
    $symptoms = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($symptoms);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>