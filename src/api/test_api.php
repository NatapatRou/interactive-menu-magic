<?php
    $API = require_once __DIR__ . "/api.php";
    header("Content-Type: application/json");
    header("Access-Control-Allow-Origin: *");

    $result =  $API->select_first_available();
    echo $result[0]['id'];
?>
