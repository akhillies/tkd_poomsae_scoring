<?php
    session_start();
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');
    
    $link = (include 'connect.php');
    if(!$link) {
        echo "{'status':'noaccess', 'msg':'wtf why are you here', 'link':'{$link}'}";
        exit();
    }

    $sql = "SELECT * FROM rings WHERE ring={$_POST['ring']}";

    if ($result=mysqli_query($link,$sql))
    {
            $index = 0;
            while ($row = $result->fetch_assoc())
            {
                $response_array['status'] = 'success';  
                $response_array['message'] = "YAY :D";
                $response_array['info']['divisions'][$index] = $row;
                $index = $index + 1;
            }
    } else {
        $response_array['status'] = 'failed';  
        $response_array['message'] = "Unable to get divisions - maybe ring does not exist?";
    } 

    echo json_encode($response_array);
?>
