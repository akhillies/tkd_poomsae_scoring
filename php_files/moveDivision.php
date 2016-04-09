<?php
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    session_start();
    $link = (include 'connect.php');
    if(!$link) {
        echo "{'status':'noaccess', 'msg':'wtf why are you here', 'link':'{$link}'}";
        exit();
    }

    $ring = (array_key_exists('ring', $_POST) ? $_POST['ring'] : 0);
    $division = (array_key_exists('division', $_POST) ? $_POST['division'] : 0);
    $round = (array_key_exists('round', $_POST) ? $_POST['round'] : 0);
    $gender = (array_key_exists('gender', $_POST) ? $_POST['gender'] : 0);
    $next = 1;

    $sql = "SELECT COUNT(*) AS count FROM competitors WHERE division='{$division}' AND gender='{$gender}'";
    if ($result=mysqli_query($link,$sql))
    {
        $index = $result->fetch_assoc()['count'];
        if($index > 0) {
            if($index <= 4) {
                $curr_round = 3;
            } else if ($index <= 8) {
                $curr_round = 2;
            } else {
                $curr_round = 1;
            }
            $sql2 = "UPDATE division SET current_round='$curr_round', num_competitors='$index' WHERE division='$division' AND gender='$gender'; ";
            $sql2 .= "UPDATE competitors SET round='$curr_round', next='$next' WHERE division='$division' AND gender='$gender'; ";
            $sql2 .= "UPDATE rings SET ring='$ring', next='$next' WHERE division='$division' AND gender='$gender' AND round='$round'; ";
            if ($result2=mysqli_multi_query($link,$sql2))
            {
                $response_array['status'] = 'success';  
                $response_array['message'] = "ALL OF IT WORKED :D"; 
                $response_array['info']['ring'] = $ring;
                $response_array['info']['division'] = $division;
                $response_array['info']['round'] = $round;
                $response_array['info']['next'] = $next;
                $response_array['info']['gender'] = $gender;
            } else {
                $response_array['message'] = "Unable update or insert stuff";
            
            }
        } else {
            $response_array['status'] = 'noplayers';
            $response_array['message'] = "no players in division, do not bother adding"; 
        }
    } else {
        $response_array['message'] = "Unable to find competitors in division";
    }

    echo json_encode($response_array);
?>
