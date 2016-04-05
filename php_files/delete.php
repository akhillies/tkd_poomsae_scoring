<?php
    header('Access-Control-Allow-Origin: *');

    $link = (include 'connect.php');
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

    header('Content-type: application/json');
    echo json_encode($response_array);
?>
