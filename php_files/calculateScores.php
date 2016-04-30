<?php
    session_start();
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    $link = (include 'connect.php');
    if(!$link) {
        echo "{'status':'noaccess', 'msg':'wtf why are you here', 'link':'{$link}'}";
        exit();
    }

    function cmpfscore($sc1, $sc2) {
        if ($sc1['tfscore'] == $sc2['tfscore']) {
            return 0;
        }
        return ($sc1['tfscore'] > $sc2['tfscore']) ? -1 : 1;
    }

    $sql = "SELECT * FROM scores WHERE division={$_POST['division']} AND gender={$_POST['gender']} AND round={$_POST['round']} ORDER BY id, poomsae, judge";
    if ($result=mysqli_query($link,$sql))
    {
        $i = 0;
        while ($row = $result->fetch_assoc())
        {
            $scores[$i] = $row;
            $i += 1;
        }
        
        $idList = [];
        $index = -1;
        foreach ($scores as $scr) {
            if($scoringInfo[$index]['id'] != $scr['id']) {
                $index += 1;
                $scoringInfo[$index]['id'] = $scr['id'];
                $scoringInfo[$index]['gender'] = $scr['gender'];
                $scoringInfo[$index]['division'] = $scr['division'];
                $scoringInfo[$index]['round'] = $scr['round'];
                $scoringInfo[$index]['poomsae'][$scr['poomsae']]['min'] = 10;
                $scoringInfo[$index]['poomsae'][$scr['poomsae']]['max'] = 0;
                
                $idList[$index] = $scr['id'];
            }
            if($scr['poomsae'] > count($scoringInfo[$index]['poomsae'])) {
                $scoringInfo[$index]['poomsae'][$scr['poomsae']]['min'] = 10;
                $scoringInfo[$index]['poomsae'][$scr['poomsae']]['max'] = 0;
            }
            
            $s = floatval($scr['score']);
            $scoringInfo[$index]['poomsae'][$scr['poomsae']]['tscore'] += $s;
            $min = $scoringInfo[$index]['poomsae'][$scr['poomsae']]['min'];
            $min = $min > $s ? $s : $min;
            $scoringInfo[$index]['poomsae'][$scr['poomsae']]['min'] = $min;
            $max = $scoringInfo[$index]['poomsae'][$scr['poomsae']]['max'];
            $max = $max < $s ? $s : $max;
            $scoringInfo[$index]['poomsae'][$scr['poomsae']]['max'] = $max;
            $scoringInfo[$index]['poomsae'][$scr['poomsae']]['judges'] += 1;
            
            if($scoringInfo[$index]['poomsae'][$scr['poomsae']]['judges'] >= 5) { 
                $scoringInfo[$index]['poomsae'][$scr['poomsae']]['fscore'] = ($scoringInfo[$index]['poomsae'][$scr['poomsae']]['tscore'] - $min - $max) / ($scoringInfo[$index]['poomsae'][$scr['poomsae']]['judges'] - 2);
            } else {
                $scoringInfo[$index]['poomsae'][$scr['poomsae']]['fscore'] = $scoringInfo[$index]['poomsae'][$scr['poomsae']]['tscore'] / $scoringInfo[$index]['poomsae'][$scr['poomsae']]['judges'];
            }
            $scoringInfo[$index]['tfscore'] = 0;
            for($i = 1; $i <= $scr['poomsae']; $i++) {
                $scoringInfo[$index]['tfscore'] += $scoringInfo[$index]['poomsae'][$scr['poomsae']]['fscore'];
            }
            $scoringInfo[$index]['tfscore'] /= 2;
        }

        $index = 0;
        $sql2 = "SELECT fname, lname FROM competitors WHERE id IN (" . implode(",", $idList) . ")";
        if ($result2=mysqli_query($link,$sql2)) {
            while ($row2 = $result2->fetch_assoc()) {
                $scoringInfo[$index]['name'] = $row2['fname'] . " " . $row2['lname'];
                $index += 1;
            }
        }
        usort($scoringInfo, "cmpfscore");
        if($_POST['confirmed'] == 1) {
            $sql2 = "UPDATE rings SET finished=1 WHERE division={$_POST['division']} AND gender={$_POST['gender']} AND round={$_POST['round']}; ";
            // update the competitors who move on so they are in the next round
            if($index <= 8) {
                //we have a winner of division
                $numAdv = 4;
                $r = 4;

                $sql2 .= "UPDATE division SET gold='{$scoringInfo[0]['id']}'";
                if($index >= 2) {
                    $sql2 .= ", silver='{$scoringInfo[1]['id']}'";
                }
                if($index >= 3) {
                    $sql2 .= ", bronze1='{$scoringInfo[2]['id']}'";
                }
                if($index >= 4) {
                    $sql2 .= ", bronze2='{$scoringInfo[3]['id']}'";
                }

                $sql2 .= " WHERE division='{$scoringInfo[0]['division']}' AND gender='{$scoringInfo[0]['gender']}'; ";
            } else if ($index <= 16) {
                // advance top 8
                $numAdv = 8;
                $r = 3;
            } else {
                // advance half
                $numAdv = $index / 2 ;
                $r = 2;
            }
            $sql2 .= "UPDATE division SET current_round=$r WHERE division='{$scoringInfo[0]['division']}' AND gender='{$scoringInfo[0]['gender']}'; ";
            $sql2 .= "UPDATE competitors SET round=$r, priority=0 WHERE";
            for($i = 0; $i < $numAdv - 1; $i++) {
                $sql2 .= " id='{$scoringInfo[$i]['id']}' OR";
            }
            $sql2 .= " id='{$scoringInfo[$i]['id']}'";
            if ($result2=mysqli_multi_query($link,$sql2)) {
                $response_array['status'] = 'success';
                $response_array['message'] = "people have advanced :D";        
            } else {
                $response_array['status'] = 'failure';
                $response_array['message'] = "couldnt update the division to next round";        
            }
        } else {
            $response_array['status'] = 'success'; 
            $response_array['message'] = "YAY :D";        
            $response_array['info'] = $scoringInfo;
        }
    } else {
        $response_array['status'] = 'failed';  
        $response_array['message'] = "Unable to get scores - maybe no player with that id has scores?";
    }        

    echo json_encode($response_array);
?>
