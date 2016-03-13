<?php
    header('Access-Control-Allow-Origin: *');

    $link = (include 'connect.php');

    $ring = (array_key_exists('ring', $_POST) ? $_POST['ring'] : 0);
    $division = (array_key_exists('division', $_POST) ? $_POST['division'] : 0);
    $round = (array_key_exists('round', $_POST) ? $_POST['round'] : 0);
    $priority = (array_key_exists('priority', $_POST) ? $_POST['priority'] : 0);
    $gender = (array_key_exists('gender', $_POST) ? $_POST['gender'] : 0);

    $sql = "INSERT INTO rings (ring, division, round, priority, gender) VALUES ('$ring', '$division', '$round', '$priority', '$gender')";
    if ($result=mysqli_query($link,$sql))
    {
        $response_array['status'] = 'success';  
        $response_array['message'] = "YAY :D"; 
        $response_array['info']['ring'] = $ring;
        $response_array['info']['division'] = $division;
        $response_array['info']['round'] = $round;
        $response_array['info']['priority'] = $priority;
        $response_array['info']['gender'] = $gender;
    } else {
        $response_array['status'] = 'failed';  
        $response_array['message'] = "Unable to add division - maybe division was already added?";
        $response_array['sql'] = $sql;
    }        

    header('Content-type: application/json');
    echo json_encode($response_array);
?>
