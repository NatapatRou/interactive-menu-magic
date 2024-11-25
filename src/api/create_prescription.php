<?php
// create_presciption.php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // Allowed HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"); // Allowed headers
// Database connection
$API = require_once __DIR__ . "/api.php";



