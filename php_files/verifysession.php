<?php
    session_start();
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/text');
    
    $starturl = "http://127.0.0.1:8888/";
    if($_SESSION['access'] <= 0) {
        if($_SERVER['HTTP_REFERER'] == "{$starturl}home.html") {
            session_destroy();
            return true;
        }
    } else if($_SESSION['access'] == 1) {
        if($_SERVER['HTTP_REFERER'] == "{$starturl}admin.html") {
            session_destroy();
            return true;
        }
    } else if($_SESSION['access'] == 2) {
        if($_SERVER['HTTP_REFERER'] == "{$starturl}ringleader.html") {
            session_destroy();
            return true;
        }
    } else if($_SESSION['access'] == 3) {
        if($_SERVER['HTTP_REFERER'] == "{$starturl}judge.html") {
            session_destroy();
            return true;
        }
    }
    echo "denied";
    session_destroy();
    return false;
?>
