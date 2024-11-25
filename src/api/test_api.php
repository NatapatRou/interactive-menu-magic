<?php
    $API = require_once __DIR__ . "/api.php";
    header("Content-Type: application/json");
    header("Access-Control-Allow-Origin: *");

    $result =  $API->select_all_user();
    echo $result[0]['fname'];
?>
