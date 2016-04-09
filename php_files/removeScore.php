<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');
    
    session_start();
    $link = (include 'connect.php');
    if(!$link) {
        echo "{'status':'noaccess', 'msg':'wtf why are you here', 'link':'{$link}'}";
        exit();
    }

    
    $id = (array_key_exists('id', $_POST) ? $_POST['id'] : 0);
    $round = (array_key_exists('round', $_POST) ? $_POST['round'] : 0);
    $judge = (array_key_exists('judge', $_POST) ? $_POST['judge'] : 0);
    $poomsae = (array_key_exists('poomsae', $_POST) ? $_POST['poomsae'] : 0);

    $sql = "DELETE FROM scores WHERE id=$id AND round=$round AND judge=$judge AND poomsae=$poomsae";

    if ($result=mysqli_query($link,$sql))
    {
        $response_array['status'] = 'success';
        $response_array['message'] = "just deleted score";
    } else {
        $response_array['status'] = 'failed';  
        $response_array['message'] = "Unable to delete score - maybe score does not exist";
    } 

    echo json_encode($response_array);
?>

