<?php
    $API = require_once __DIR__ . "/api.php";
    header("Content-Type: application/json");
    header("Access-Control-Allow-Origin: application/json");
    echo $API->select_patience();
?>
