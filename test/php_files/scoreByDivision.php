<?php
    header('Access-Control-Allow-Origin: *');

    $link = (include 'connect.php');
    $sql = "SELECT * FROM scores WHERE division={$_POST['division']} AND gender={$_POST['gender']} AND round={$_POST['round']} ORDER BY id, poomsae, judge";
$response_array['sql'] = $sql;
    if ($result=mysqli_query($link,$sql))
    {
        $response_array['status'] = 'success'; 
        $response_array['message'] = "YAY :D";        
        $index = 0;
        while ($row = $result->fetch_assoc())
        {
            $response_array['info']['scores'][$index] = $row;
            $index = $index + 1;
        }
    } else {
        $response_array['status'] = 'failed';  
        $response_array['message'] = "Unable to get scores - maybe no player with that id has scores?";
    }        

    header('Content-type: application/json');
    echo json_encode($response_array);
?>
