/* gets the row from datatable with the player's given ID */
/* INPUT: player_id = id of the player you want */
/* OUTPUT: string row with all the values comma-separated */

<?php
    header('Access-Control-Allow-Origin: *');

    $user = 'root';
    $password = 'root';
    $db = 'ucmap_tkd_scoring';
    $host = '127.0.0.1';
    $port = '8889';

    $link = mysqli_init();
    $success = mysqli_real_connect(
        $link, 
        $host,
        $user, 
        $password, 
        $db,
        $port
    );

    $sql = "SELECT * FROM sport_poomsae WHERE Player_Id={$_POST['player_id']}";


    if ($result=mysqli_query($link,$sql))
    {
        $row = $result->fetch_row();
        echo implode(", ", $row);
    }
?>

