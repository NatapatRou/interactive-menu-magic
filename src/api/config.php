<?php
class Connect extends PDO {
    public function __construct()
    {
        $dsn = "mysql:host=mysql-db;dbname=drug_dispense;charset=utf8";
        $username = "root";
        $password = "root";

        try {
            parent::__construct($dsn, $username, $password, [
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (PDOException $e) {
            // Handle connection error
            echo "Database connection failed: " . $e->getMessage();
            exit;
        }
    }
}
?>
