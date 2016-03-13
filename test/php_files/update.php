<?php
    /* updates the player with the given id in the datatable
     *  INPUT: player id and all the player data that will be changed
     *  OUTPUT: new player data */
    header('Access-Control-Allow-Origin: *');

    $link = (include 'connect.php');
    $sql = "SELECT * FROM competitors WHERE id={$_POST['id']}";

    if ($result=mysqli_query($link,$sql)) {
        $row = $result->fetch_assoc();

        $first_name = (array_key_exists('first_name', $_POST) ? $_POST['first_name'] : 'unknown');
        $last_name = (array_key_exists('last_name', $_POST) ? $_POST['last_name'] : "unknown");
        $middle_name = (array_key_exists('middle_name', $_POST) ? $_POST['middle_name'] : '');
        $id = (array_key_exists('id', $_POST) ? $_POST['id'] : 0);
        $age = (array_key_exists('age', $_POST) ? $_POST['age'] : 0);
        $belt = (array_key_exists('belt', $_POST) ? $_POST['belt'] : "black");
        $division = (array_key_exists('division', $_POST) ? $_POST['division'] : 0);
        $round = (array_key_exists('round', $_POST) ? $_POST['round'] : 0);
        $gender = (array_key_exists('gender', $_POST) ? $_POST['gender'] : 0);
        $school = (array_key_exists('school', $_POST) ? $_POST['school'] : "unknown");
        
        $sql = "UPDATE competitors SET fname='$first_name', lname='$last_name', mname='$middle_name', id=$id, age=$age, belt='$belt',school='$school', division='$division', round='$round' WHERE id={$_POST['id']}";
        
        if ($result=mysqli_query($link,$sql)) {
            if($row != null) {
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
            } else {
                $response_array['status'] = 'nosuchelement';  
                $response_array['message'] = "awww :/";
            }
        } else {
            $response_array['status'] = 'failed';  
            $response_array['message'] = "Unable to update player - were inputs correct?";
        }
    } else {
        $response_array['status'] = 'failed';  
        $response_array['message'] = "Unable to get player - maybe Player does not exist?";
    }

    header('Content-type: application/json');
    echo json_encode($response_array);
?>

