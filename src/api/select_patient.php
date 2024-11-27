<?php
session_start();
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: GET, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json");

require_once __DIR__ . '/config.php';

$db = new Connect;
$doctor_id = $_SESSION['id'];

$query = "SELECT patient_id, p.fname, p.lname, sy.sym_description FROM Patient p JOIN Symptom_statement sy ON p.id = sy.patient_id WHERE doctor_id = :doctor_id";
$stmt = $db->prepare($query);
$stmt->bindParam(':doctor_id', $doctor_id);
$stmt->execute();

$select_patient = $stmt->fetchAll(PDO::FETCH_ASSOC); //Convert from PDOStatement Object to multidimentional array
echo json_encode($select_patient);
?>
