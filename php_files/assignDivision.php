<?php
    header('Access-Control-Allow-Origin: *');

    $link = (include 'connect.php');

    $ring = (array_key_exists('ring', $_POST) ? $_POST['ring'] : 0);
    $division = (array_key_exists('division', $_POST) ? $_POST['division'] : 0);
    $round = (array_key_exists('round', $_POST) ? $_POST['round'] : 0);
    $gender = (array_key_exists('gender', $_POST) ? $_POST['gender'] : 0);

    $sql = "SELECT COUNT(*) AS count FROM competitors WHERE division='{$division}' AND gender='{$gender}'";
    if ($result=mysqli_query($link,$sql))
    {
        $count = $result->fetch_assoc()['count'];

        if($count > 0) {
            if($count <= 8) {
                $curr_round = 3;
            } else if ($count <= 16) {
                $curr_round = 2;
            } else {
                $curr_round = 1;
            }
            if($round >= $curr_round) {
                $sql2 = "INSERT INTO rings (ring, division, round, next, gender, finished) VALUES ('$ring', '$division', '$round', '0', '$gender', '0'); ";
                $sql2 .= "UPDATE division SET current_round='$curr_round', num_competitors='$index' WHERE division='$division' AND gender='$gender'; ";
                $sql2 .= "UPDATE competitors SET round='$curr_round', priority='0' WHERE division='$division' AND gender='$gender'; ";
                if ($result2=mysqli_multi_query($link,$sql2))
                {
                    $response_array['status'] = 'success';  
                    $response_array['message'] = "ALL OF IT WORKED :D"; 
                    $response_array['info']['ring'] = $ring;
                    $response_array['info']['division'] = $division;
                    $response_array['info']['round'] = $round;
                    $response_array['info']['gender'] = $gender;
                } else {
                    $response_array['status'] = 'failed';  
                    $response_array['message'] = "Unable insert in table";
                
                }
            } else {
                $response_array['status'] = 'badround';  
                $response_array['message'] = "Division does not have enough players for round";
            }
        } else {
            $response_array['status'] = 'noplayers';
            $response_array['message'] = "no players in division, do not bother adding"; 
        }
    } else {
        $response_array['status'] = 'noplayers';
        $response_array['message'] = "Unable to find competitors in division";
    }

    header('Content-type: application/json');
    echo json_encode($response_array);
?>
