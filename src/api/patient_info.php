<?php
    // Declare $API explicitly to avoid LSP warnings
    /** @var API|null $API */
    $API = null;
    require_once __DIR__ . "/api.php";
    echo $API->select_patience();
?>
