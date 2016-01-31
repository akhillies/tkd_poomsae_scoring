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

    $sql = "UPDATE sport_poomsae SET Ring=0";

    if (mysqli_query($link,$sql))
    {
        echo "SUCESS";
  }


?>
