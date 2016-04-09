<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    session_start();
    $link = (include 'connect.php');
    if(!$link) {
        echo "{'status':'noaccess', 'msg':'wtf why are you here', 'link':'{$link}'}";
        exit();
    }

    $division = (array_key_exists('division', $_POST) ? $_POST['division'] : 0);
    $round = (array_key_exists('round', $_POST) ? $_POST['round'] : 0);
    $gender = (array_key_exists('gender', $_POST) ? $_POST['gender'] : 0);

    $sql = "DELETE FROM rings WHERE division='$division' AND round='$round' AND gender='$gender'";
    if ($result=mysqli_query($link,$sql))
    {
        $response_array['status'] = 'success';  
        $response_array['message'] = "YAY :D"; 
        $response_array['info']['division'] = $division;
        $response_array['info']['round'] = $round;
        $response_array['info']['gender'] = $gender;
    } else {
        $response_array['status'] = 'failed';  
        $response_array['message'] = "Unable to remove division - maybe division was never added?";
        $response_array['sql'] = $sql;
    }        

    echo json_encode($response_array);
?>

