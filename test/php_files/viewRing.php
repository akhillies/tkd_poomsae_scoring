<?php
    header('Access-Control-Allow-Origin: *');
    $link = (include 'connect.php');
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

    header('Content-type: application/json');
    echo json_encode($response_array);
?>


