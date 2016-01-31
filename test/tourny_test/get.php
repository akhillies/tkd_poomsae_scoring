<?php
    header('Access-Control-Allow-Origin: *');
    $jsonStr = file_get_contents('players.json');
    $data = json_decode($jsonStr);

    if($_POST['player_id'])
    {
        echo $data[$_POST['player_id']];
    }
    else
    {
        echo $data;
    }
?>
