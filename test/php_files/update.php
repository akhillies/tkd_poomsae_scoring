<?php
    /* updates the player with the given id in the datatable
     *  INPUT: player id and all the player data that will be changed
     *  OUTPUT: new player data */
    header('Access-Control-Allow-Origin: *');

    $link = (include 'connect.php');
    $sql = "SELECT * FROM sport_poomsae WHERE Player_Id={$_POST['player_id']}";

    if ($result=mysqli_query($link,$sql))
    {
        $row = $result->fetch_assoc();
    }

    $first_name = (array_key_exists('first_name', $_POST) ? $_POST['first_name'] : 'unknown');
    $last_name = (array_key_exists('last_name', $_POST) ? $_POST['last_name'] : "unknown");
    $middle_name = (array_key_exists('middle_name', $_POST) ? $_POST['middle_name'] : '');
    $player_id = (array_key_exists('player_id', $_POST) ? $_POST['player_id'] : 0);
    $age = (array_key_exists('age', $_POST) ? $_POST['age'] : 0);
    $belt = (array_key_exists('belt', $_POST) ? $_POST['belt'] : "unknown");
    $division = (array_key_exists('division', $_POST) ? $_POST['division'] : "unknown");
    $ring = (array_key_exists('ring', $_POST) ? $_POST['ring'] : 0);
        
    $sql = "UPDATE sport_poomsae SET First_Name='$first_name', Last_Name='$last_name', Middle_Name='$middle_name', Player_Id=$player_id, Age=$age, Belt='$belt', Division='$division', Ring=$ring WHERE Player_Id={$_POST['player_id']}";
    
    if (mysqli_query($link,$sql))
    {
        $row = "{$first_name}, {$last_name}, {$middle_name}, {$player_id}, {$age}, {$belt}, {$division}, {$ring}";
        echo $row;
    }
?>

