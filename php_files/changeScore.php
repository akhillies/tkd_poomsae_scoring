<?php
    session_start();
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');
    
    $link = (include 'connect.php');
    if(!$link) {
        echo "{'status':'noaccess', 'msg':'wtf why are you here', 'link':'{$link}'}";
        exit();
    }

    $id = (array_key_exists('id', $_POST) ? $_POST['id'] : 0);
    $round = (array_key_exists('round', $_POST) ? $_POST['round'] : 0);
    $score = (array_key_exists('score', $_POST) ? $_POST['score'] : 0);
    $judge = (array_key_exists('judge', $_POST) ? $_POST['judge'] : 0);
    $poomsae = (array_key_exists('poomsae', $_POST) ? $_POST['poomsae'] : 0);
    $sql = "SELECT * FROM competitors WHERE id=$id"; 

    if ($result=mysqli_query($link,$sql))
    {
        $row = $result->fetch_assoc();
        if($row != null)
        {
            $sql2 = "UPDATE scores SET id='$id', division='{$row['division']}', round='$round', gender='{$row['division']}', judge='$judge', poomsae='$poomsae', score='$score' WHERE id='$id' AND judge='$judge' AND poomsae='$poomsae' AND round='$round'";
            if ($result2=mysqli_query($link,$sql2))
            {
                $response_array['status'] = 'success';
                $response_array['message'] = "just updated score";
                $response_array['info']['division'] = $row['division'];
                $response_array['info']['round'] = $round;
                $response_array['info']['gender'] = $row['gender'];
                $response_array['info']['id'] = $id;
                $response_array['info']['judge'] = $judge;
                $response_array['info']['poomsae'] = $poosmae;
                $response_array['info']['score'] = $score;
            } else {
                $response_array['status'] = 'failed';  
                $response_array['message'] = "could not update score";
            }
        } else {
            $response_array['status'] = 'failed';  
            $response_array['message'] = "the player does not exist";
        }
    } else {
        $response_array['status'] = 'failed';  
        $response_array['message'] = "Unable to change score - the player does not exist?";
    }
    
    echo json_encode($response_array);
?>


