<?php
    /* gets the row from datatable with the player's given ID
     *  INPUT: player_id = id of the player you want
     *  OUTPUT: string row with all the values comma-separated */
    header('Access-Control-Allow-Origin: *');

    $link = (include 'connect.php');
    $sql = "SELECT * FROM sport_poomsae WHERE Player_Id={$_POST['player_id']}";

    if ($result=mysqli_query($link,$sql))
    {
        $row = $result->fetch_row();
        echo implode(", ", $row);
    }
?>
