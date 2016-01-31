<?php
    header('Access-Control-Allow-Origin: *');
    $player = $_POST['player'];

    $jsonOldStr = file_get_contents('players.json');
    $data = json_decode($jsonOldStr);

    $data[$player['player_id']] = $player;

    $jsonNewStr = json_encode($data);
    file_put_contents('players.json', $newJsonString);
?>
