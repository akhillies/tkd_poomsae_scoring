<?php
    header('Access-Control-Allow-Origin: *');

    $link = (include 'connect.php');

    $pin = (array_key_exists('pin', $_POST) ? $_POST['pin'] : "audience");
        
    $sql = "SELECT url FROM passwords WHERE password='$pin'";
    if ($result=mysqli_query($link,$sql))
    {
        if($row = $result->fetch_assoc()) { 
            $response_array['status'] = 'success';  
            $response_array['message'] = "YAY :D";
            $response_array['info']['url'] = $row['url'];
        } else {
            $response_array['status'] = 'failed';  
            $response_array['message'] = "Wrong password";  
        }
    }
    else
    {
        $response_array['status'] = 'failed';  
        $response_array['message'] = "Query failed";  
    }
    header('Content-type: application/json');
    echo json_encode($response_array);
?>

