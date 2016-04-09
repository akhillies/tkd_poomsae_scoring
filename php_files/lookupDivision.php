<?php
    session_start();
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');
    
    $link = (include 'connect.php');
    if(!$link) {
        echo "{'status':'noaccess', 'msg':'wtf why are you here', 'link':'{$link}'}";
        exit();
    }

    $sql = "SELECT * FROM rings WHERE division={$_POST['division']} AND gender={$_POST['gender']} AND round={$_POST['round']}";

    if ($result=mysqli_query($link,$sql))
    {
        $row = $result->fetch_assoc();
        if($row != null) {
            $response_array['status'] = 'success';  
            $response_array['message'] = "YAY :D";
            $response_array['info'] = $row;

            $sql2 = "SELECT * FROM competitors WHERE division={$_POST['division']} AND gender={$_POST['gender']} AND round={$_POST['round']}";
            if ($result2=mysqli_query($link,$sql2))
            {
                $index = 0;
                while ($row2 = $result2->fetch_assoc())
                {
                    $response_array['info']['athletes'][$index] = $row2;
                    $index = $index + 1;
                }
            }
        } else {
            $response_array['status'] = 'nosuchelement';  
            $response_array['message'] = "awww :/";
        }
    } else {
        $response_array['status'] = 'failed';  
        $response_array['message'] = "Unable to get division - maybe division was not added?";
    } 

    echo json_encode($response_array);
    session_destroy();
?>
