<?php
    header('Access-Control-Allow-Origin: *');

    $link = (include 'connect.php');

    $ring = (array_key_exists('ring', $_POST) ? $_POST['ring'] : 0);
    $division = (array_key_exists('division', $_POST) ? $_POST['division'] : 0);
    $round = (array_key_exists('round', $_POST) ? $_POST['round'] : 0);
    $priority = (array_key_exists('priority', $_POST) ? $_POST['priority'] : 0);
    $gender = (array_key_exists('gender', $_POST) ? $_POST['gender'] : 0);

    $sql = "INSERT INTO rings (ring, division, round, priority, gender) VALUES ('$ring', '$division', '$round', '$priority', '$gender')";
    if ($result=mysqli_query($link,$sql))
    {
        $response_array['status'] = 'success';  
        $response_array['message'] = "yay?"; 
        $response_array['info']['ring'] = $ring;
        $response_array['info']['division'] = $division;
        $response_array['info']['round'] = $round;
        $response_array['info']['priority'] = $priority;
        $response_array['info']['gender'] = $gender;

        $sql2 = "SELECT COUNT(*) AS count FROM competitors WHERE division='{$division}' AND gender='{$gender}'";
        if ($result2=mysqli_query($link,$sql2))
        {
            $index = $result2->fetch_assoc().count;
            if($index <= 4) {
                $curr_round = 3;
            } else if ($index <= 8) {
                $curr_round = 2;
            } else {
                $curr_round = 1;
            }
            $sql3 = "UPDATE division SET current_round='$curr_round', num_competitors='$index' WHERE division='$division' AND gender='$gender'";
            if ($result3=mysqli_query($link,$sql3))
            {
                $sql4 = "UPDATE competitors SET round='$curr_round' WHERE division='$division' AND gender='$gender'";
                if ($result4=mysqli_query($link,$sql4))
                {
                    $response_array['message'] = "ALL OF IT WORKED :D"; 
                } else {
                    $response_array['message'] = "Unable to update players with new round";
                }
            } else {
                $response_array['message'] = "Unable to create division";
            }
        } else {
            $response_array['message'] = "Unable to find competitors in division";
        }
    } else {
        $response_array['status'] = 'failed';  
        $response_array['message'] = "Unable to add division - maybe division was already added?";
    }


    header('Content-type: application/json');
    echo json_encode($response_array);
?>
