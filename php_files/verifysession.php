<?php
    session_start();
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/text');
    
    $starturl = "http://127.0.0.1:8888/";
    if($_SESSION['access'] <= 0) {
        if($_SERVER['HTTP_REFERER'] == "{$starturl}html/home.html") {
            return true;
        }
    } else if($_SESSION['access'] == 1) {
        if($_SERVER['HTTP_REFERER'] == "{$starturl}html/admin.html") {
            return true;
        }
    } else if($_SESSION['access'] == 2) {
        if($_SERVER['HTTP_REFERER'] == "{$starturl}html/ringleader.html") {
            return true;
        }
    } else if($_SESSION['access'] == 3) {
        if($_SERVER['HTTP_REFERER'] == "{$starturl}html/judge.html" || $_SERVER['HTTP_REFERER'] == "{$starturl}sport_poomsae/tournament/index.html") {
            return true;
        }
    }
    /* echo "denied"; */
    return false;
?>
