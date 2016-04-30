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

        if($scores)
        {
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
            
            $response_array['status'] = 'success'; 
            $response_array['message'] = "YAY :D";        
            $response_array['info'] = $scoringInfo;
        } else {
            $response_array['status'] = 'success'; 
            $response_array['message'] = "No Scores";        
            $response_array['info'] = [];
        }
    } else {
        $response_array['status'] = 'failed';  
        $response_array['message'] = "Unable to get scores - maybe no player with that id has scores?";
    }        

    echo json_encode($response_array);
?>
