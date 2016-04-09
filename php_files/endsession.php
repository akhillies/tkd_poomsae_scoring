<?php
    $_SESSION = array();
    if(session_status() == PHP_SESSION_ACTIVE) {
        session_destroy();
    }
?>
