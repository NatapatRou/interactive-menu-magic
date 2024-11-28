<?php
session_start();
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: GET, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json");

require_once __DIR__ . '/config.php';
$conn = new Connect();
$pharmacist_id = $_SESSION['id'];
try{
    $sql = "SELECT p.prescription_id, p.patient_id, CONCAT(pa.fname, ' ', pa.lname) AS patient_name, p.doctor_id, p.pharmacist_id, m.medication_id, m.name AS med_name, m.description, p.notes 
    FROM Prescription p
    JOIN Patient pa
    ON p.patient_id = pa.id
    JOIN Medication m
    ON p.medication_id = m.medication_id 
    WHERE pharmacist_id = :pharmacist_id AND p.status = 'Pending'";

    $get_stmt = $conn->prepare($sql);
    $get_stmt->bindParam(':pharmacist_id', $pharmacist_id);
    $get_stmt->execute();
    
    $prescription_data = $get_stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($prescription_data);

} catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error: " . $e->getMessage()]);
}
?>
