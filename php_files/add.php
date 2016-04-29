<?php
    /* adds the given player to the datatable
     *  INPUT: all the player data needed
     *  OUTPUT: player data that was added */
    session_start();
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    $link = (include 'connect.php');
    if(!$link) {
        echo "{'status':'noaccess', 'msg':'wtf why are you here', 'link':'{$link}'}";
        exit();
    }

    $first_name = mysql_real_escape_string(array_key_exists('first_name', $_POST) ? $_POST['first_name'] : 'unknown');
    $last_name = mysql_real_escape_string(array_key_exists('last_name', $_POST) ? $_POST['last_name'] : "unknown");
    $middle_name = mysql_real_escape_string(array_key_exists('middle_name', $_POST) ? $_POST['middle_name'] : '');
    $id = htmlspecialchars(array_key_exists('id', $_POST) ? $_POST['id'] : 0);
    $age = htmlspecialchars(array_key_exists('age', $_POST) ? $_POST['age'] : 0);
    $belt = htmlspecialchars(array_key_exists('belt', $_POST) ? $_POST['belt'] : "black");
    $division = htmlspecialchars(array_key_exists('division', $_POST) ? $_POST['division'] : 0);
    $round = htmlspecialchars(array_key_exists('round', $_POST) ? $_POST['round'] : 0);
    $gender = htmlspecialchars(array_key_exists('gender', $_POST) ? $_POST['gender'] : 0);
    $school = htmlspecialchars(array_key_exists('school', $_POST) ? $_POST['school'] : "unknown");
        
    $sql = "INSERT INTO competitors (fname, lname, mname, id, age, belt, division, gender, round, school) VALUES ('$first_name', '$last_name', '$middle_name', $id, $age, '$belt', '$division', $gender, '$round', '$school')";
    if (mysqli_query($link,$sql))
    {
        $response_array['status'] = 'success';  
        $response_array['message'] = "YAY :D";
        $response_array['info']['id'] = $id;
        $response_array['info']['fname'] = $first_name;
        $response_array['info']['mname'] = $middle_name;
        $response_array['info']['lname'] = $last_name;
        $response_array['info']['age'] = $age;
        $response_array['info']['belt'] = $belt;
        $response_array['info']['division'] = $division;
        $response_array['info']['round'] = $round;
        $response_array['info']['gender'] = $gender;
        $response_array['info']['school'] = $school;
    }
    else
    {
        $response_array['status'] = 'failed';  
        $response_array['message'] = "Unable to add player - maybe Player's ID was already taken?";  
    }
    
    echo json_encode($response_array);
?>
