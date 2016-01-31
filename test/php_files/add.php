<?php
    /* adds the given player to the datatable
     *  INPUT: all the player data needed
     *  OUTPUT: player data that was added */
    header('Access-Control-Allow-Origin: *');

    $link = (include 'connect.php');

    $first_name = (array_key_exists('first_name', $_POST) ? $_POST['first_name'] : 'unknown');
    $last_name = (array_key_exists('last_name', $_POST) ? $_POST['last_name'] : "unknown");
    $middle_name = (array_key_exists('middle_name', $_POST) ? $_POST['middle_name'] : '');
    $player_id = (array_key_exists('player_id', $_POST) ? $_POST['player_id'] : 0);
    $age = (array_key_exists('age', $_POST) ? $_POST['age'] : 0);
    $belt = (array_key_exists('belt', $_POST) ? $_POST['belt'] : "unknown");
    $division = (array_key_exists('division', $_POST) ? $_POST['division'] : "unknown");
    $ring = (array_key_exists('ring', $_POST) ? $_POST['ring'] : 0);
        
    $sql = "INSERT INTO sport_poomsae (First_Name, Last_Name, Middle_Name, Player_Id, Age, Belt, Division, Ring, Score_1, Score_2, Score_3, Score_4, Score_5) VALUES ('$first_name', '$last_name', '$middle_name', $player_id, $age, '$belt', '$division', $ring, 0, 0, 0, 0, 0)";
    if (mysqli_query($link,$sql))
    {
        $row = "{$first_name}, {$last_name}, {$middle_name}, {$player_id}, {$age}, {$belt}, {$division}, {$ring}";
        echo $row;
    }
?>
