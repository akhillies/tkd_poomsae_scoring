<?php
    header('Access-Control-Allow-Origin: *');
    $jsonStr = file_get_contents($_POST['division'] . '.json');
    echo json_decode($jsonStr);
?>
