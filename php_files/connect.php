<?php
    /* adds the given player to the datatable
     *  INPUT: all the player data needed
     *  OUTPUT: player data that was added */
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
    
    return $link;
?>



