<?php
session_start();
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: GET, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json");

require_once __DIR__ . '/config.php';

$db = new Connect;

$query = "SELECT medication_id, name, description FROM Medication";
$stmt = $db->prepare($query);
$stmt->execute();

$select_Medication = $stmt->fetchAll(PDO::FETCH_ASSOC); //Convert from PDOStatement Object to multidimentional array
echo json_encode($select_Medication);
?>
