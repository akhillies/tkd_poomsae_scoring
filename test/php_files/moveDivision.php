<?php
    header('Access-Control-Allow-Origin: *');
    $link = (include 'connect.php');
    
    $ring = (array_key_exists('ring', $_POST) ? $_POST['ring'] : 0);
    $division = (array_key_exists('division', $_POST) ? $_POST['division'] : 0);
    $round = (array_key_exists('round', $_POST) ? $_POST['round'] : 0);
    $priority = (array_key_exists('priority', $_POST) ? $_POST['priority'] : 0);
    
    $sql = "UPDATE rings SET ring='$ring', division='$division', round='$round', priority='$priority' WHERE division={$_POST['division']} AND gender={$_POST['gender']} AND round={$_POST['round']}";

    if ($result=mysqli_query($link,$sql))
    {
        $response_array['status'] = 'success';  
        $response_array['message'] = "YAY :D";
        $response_array['info']['ring'] = $ring;
        $response_array['info']['division'] = $division;
        $response_array['info']['round'] = $round;
        $response_array['info']['priority'] = $priority;
    } else {
        $response_array['status'] = 'failed';  
        $response_array['message'] = "Unable to get division - maybe division was not added?";
    } 

    header('Content-type: application/json');
    echo json_encode($response_array);
?>
