<?php
    include 'endsession.php';
    session_start();
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    $_SESSION['access'] = 0;
    $link = (include 'connect.php');
    if(!$link) {
        echo "{'status':'noaccess', 'msg':'wtf why are you here', 'link':'{$link}'}";
        exit();
    }


    $pin = (array_key_exists('pin', $_POST) ? $_POST['pin'] : "audience");
    $sql = "SELECT url, access_level FROM passwords WHERE password='$pin'";
    if ($result=mysqli_query($link,$sql))
    {
        if($row = $result->fetch_assoc()) { 
            $response_array['status'] = 'success';  
            $response_array['message'] = "YAY :D";
            $response_array['info']['url'] = $row['url'];
            ini_set('session.use_cookies', 1);
            ini_set('session.use_only_cookies', 1);
            $_SESSION['access'] = $row['access_level'];
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
    echo json_encode($response_array);
?>

