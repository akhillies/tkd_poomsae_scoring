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

    $sql = "SELECT * FROM competitors WHERE id=$id"; 
    if ($result=mysqli_query($link,$sql))
    {
        $row = $result->fetch_assoc();
        if($row != null)
        {
            $score = (array_key_exists('score', $_POST) ? $_POST['score'] : 0);
            $judge = (array_key_exists('judge', $_POST) ? $_POST['judge'] : 0);
            $poomsae = (array_key_exists('poomsae', $_POST) ? $_POST['poomsae'] : 0);

            $division = $row['division'];
            $round = $row['round'];
            $gender = $row['gender'];
            
            $sql2 = "INSERT INTO scores (id, division, round, gender, judge, poomsae, score) VALUES ($id, $division, $round, $gender, $judge, $poomsae, '$score')";
            if ($result2=mysqli_query($link,$sql2))
            {
                $response_array['status'] = 'success';
                $response_array['message'] = "just got scored";
                $response_array['info']['id'] = $id;
                $response_array['info']['division'] = $division;
                $response_array['info']['round'] = $round;
                $response_array['info']['gender'] = $gender;
                $response_array['info']['judge'] = $judge;
                $response_array['info']['poomsae'] = $poosmae;
                $response_array['info']['score'] = $score;
            } else {
                $response_array['status'] = 'failed';  
                $response_array['message'] = "could not record score";
            }
        } else {
            $response_array['status'] = 'failed';  
            $response_array['message'] = "this player does not exist!";
        }
    } else {
        $response_array['status'] = 'failed';  
        $response_array['message'] = "Unable to add score - maybe score was already given for the player?";
    } 

    echo json_encode($response_array);
?>
