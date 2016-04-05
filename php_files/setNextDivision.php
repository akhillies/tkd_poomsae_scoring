<?php
    header('Access-Control-Allow-Origin: *');

    $link = (include 'connect.php');

    $ring = (array_key_exists('ring', $_POST) ? $_POST['ring'] : 0);
    $division = (array_key_exists('division', $_POST) ? $_POST['division'] : 0);
    $round = (array_key_exists('round', $_POST) ? $_POST['round'] : 0);
    $gender = (array_key_exists('gender', $_POST) ? $_POST['gender'] : 0);
    $orderings = (array_key_exists('orderings', $_POST) ? $_POST['orderings'] : ["0"]);
    $ids = (array_key_exists('ids', $_POST) ? $_POST['ids'] : ["0"]);

    $sql = "SELECT * FROM rings WHERE ring='$ring' AND division='$division' AND gender='$gender' AND round='$round'";
    if ($result=mysqli_query($link,$sql))
    {
        $row = $result->fetch_assoc();
        $sql2 = "UPDATE rings SET next='2' WHERE ring='$ring'; ";
        $sql2 .= "UPDATE rings SET next='1' WHERE ring='$ring' AND division='$division' AND gender='$gender' AND round='$round'; ";
        for ($i = 0; $i < count($ids); $i++) {
            $sql2 .= "UPDATE competitors SET priority='{$orderings[$i]}' WHERE id='{$ids[$i]}'; ";
        }
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
            $response_array['message'] = "Failed to update the ring/competitors with lineup";
        }
    } else {
        $response_array['status'] = 'failure';  
        $response_array['message'] = "the division/round is not in that ring!";
    }

    header('Content-type: application/json');
    echo json_encode($response_array);
?>
