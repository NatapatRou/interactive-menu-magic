<?php
// register.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Allowed HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"); // Allowed headers
// Database connection
require_once __DIR__ . '/config.php';
$conn = new Connect();

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data["fname"], $data["lname"], $data["email"], $data["password"])) {
    $fname = $data["fname"];
    $lname = $data["lname"];
    $email = $data["email"];
    $password = password_hash($data["password"], PASSWORD_BCRYPT); // Encrypt password
    $gender = $data["gender"];
    $dob = $data["date_of_birth"];
    $contact = $data["contact_info"];
    $address = $data["address"];
    $emergency_contact = $data["emergency_contact"];

    try {
        // Prepare SQL query
        $sql = "INSERT INTO Patient (fname, lname, email, password, gender, date_of_birth, contact_info, address, emergency_contact) 
                VALUES (:fname, :lname, :email, :password, :gender, :dob, :contact, :address, :emergency_contact)";
        $stmt = $conn->prepare($sql);

        // Bind parameters
        $stmt->bindParam(':fname', $fname);
        $stmt->bindParam(':lname', $lname);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':gender', $gender);
        $stmt->bindParam(':dob', $dob);
        $stmt->bindParam(':contact', $contact);
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':emergency_contact', $emergency_contact);

        // Execute the query
        $stmt->execute();

        echo json_encode(["status" => "success", "message" => "User registered successfully"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid data"]);
}
?>
