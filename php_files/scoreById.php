<?php
    session_start();
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    $link = (include 'connect.php');
    if(!$link) {
        echo "{'status':'noaccess', 'msg':'wtf why are you here', 'link':'{$link}'}";
        exit();
    }

    $idList = [];
    $sql = "SELECT * FROM scores WHERE id={$_POST['id']} ORDER BY round, poomsae, judge";
    if ($result=mysqli_query($link,$sql))
    {
        $response_array['status'] = 'success'; 
        $response_array['message'] = "YAY :D";        
        $index = 0;
        while ($row = $result->fetch_assoc())
        {
            $response_array['info']['scores'][$index] = $row;
            $idList[$index] = $row['id'];
            
            $index = $index + 1;
        }

        $sql2 = "SELECT fname, lname FROM competitors WHERE id IN (" . implode(",", $idList) . ")";
        if ($result2=mysqli_query($link,$sql2)) {
            if($row2 = $result2->fetch_assoc()) {
                while($index > 0) {
                    $index -= 1;
                    $response_array['info']['scores'][$index]['name'] = $row2['fname'] . " " . $row2['lname'];
                }
            }
        }
    } else {
        $response_array['status'] = 'failed';  
        $response_array['message'] = "Unable to get scores - maybe no player with that id has scores?";
    }        

    echo json_encode($response_array);
?>
