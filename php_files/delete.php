<?php
    session_start();
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    $link = (include 'connect.php');
    if(!$link) {
        echo "{'status':'noaccess', 'msg':'wtf why are you here', 'link':'{$link}'}";
        exit();
    }

    $sql = "DELETE FROM competitors WHERE id={$_POST['id']}";

    if ($result=mysqli_query($link,$sql))
    {
        $response_array['status'] = 'success';  
        $response_array['message'] = "YAY :D";
        $sql2 = "DELETE FROM scores WHERE id={$_POST['id']}";
        mysqli_query($link,$sql2);
    } else {
        $response_array['status'] = 'failed';  
        $response_array['message'] = "Unable to delete player - maybe Player does not exist?";
    }        

    echo json_encode($response_array);
    session_destroy();
?>
