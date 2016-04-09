<?php
    session_unset(); 
    if (session_status() != PHP_SESSION_NONE) {
        session_destroy();
    }
?>
