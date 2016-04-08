<?php
    if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] === 'off') {
        /* header('Location: https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'], true, 301); */
        /* exit(); */
    }

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



