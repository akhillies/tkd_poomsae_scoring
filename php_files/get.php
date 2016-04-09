<?php
    /* gets the row from datatable with the player's given ID
     *  INPUT: player_id = id of the player you want
     *  OUTPUT: string row with all the values comma-separated */
    session_start();
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    $link = (include 'connect.php');
    if(!$link) {
        echo "{'status':'noaccess', 'msg':'wtf why are you here', 'link':'{$link}'}";
        exit();
    }

    $sql = "SELECT * FROM competitors WHERE id={$_POST['id']}";

    if ($result=mysqli_query($link,$sql))
    {
        $row = $result->fetch_assoc();
        if($row != null) {
            $response_array['status'] = 'success';  
            $response_array['message'] = "YAY :D";
            $response_array[info] = $row;
        } else {
            $response_array['status'] = 'nosuchelement';  
            $response_array['message'] = "awww :/";
        }
    } else {
        $response_array['status'] = 'failed';  
        $response_array['message'] = "Unable to get player - maybe Player does not exist?";
    }        

    echo json_encode($response_array);
    session_destroy();
?>




