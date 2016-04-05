<?php
    /* gets the row from datatable with the player's given ID
     *  INPUT: player_id = id of the player you want
     *  OUTPUT: string row with all the values comma-separated */
    header('Access-Control-Allow-Origin: *');

    $link = (include 'connect.php');
    $sql = "SELECT * FROM competitors WHERE id={$_POST['id']}";

    if ($result=mysqli_query($link,$sql))
    {
        $row = $result->fetch_assoc();
        $response_array['status'] = 'success';  
        $response_array['message'] = "YAY :D";  
        $response_array[info] = $row;
    } else {
        $response_array['status'] = 'failed';  
        $response_array['message'] = "Unable to get player - maybe Player does not exist?";
    }        

    header('Content-type: application/json');
    echo json_encode($response_array);
?>



