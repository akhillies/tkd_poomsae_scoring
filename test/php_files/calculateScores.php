<?php
    header('Access-Control-Allow-Origin: *');

    $link = (include 'connect.php');

    function cmpfscore($sc1, $sc2) {
        if ($sc1['fscore'] == $sc2['fscore']) {
            return 0;
        }
        return ($sc1['fscore'] < $sc2['fscore']) ? -1 : 1;
    }

    $sql = "SELECT * FROM scores WHERE division={$_POST['division']} AND gender={$_POST['gender']} AND round={$_POST['round']} ORDER BY id, poomsae, judge";
    if ($result=mysqli_query($link,$sql))
    {
        $index = 0;
        while ($row = $result->fetch_assoc())
        {
            $scores[$index] = $row;
            $index += 1;
        }
        $index = -1;
        foreach ($scores as $scr) {
            if($scoringInfo[$index]['id'] != $scr['id'] || $scoringInfo[$index]['poomsae'] != $scr['poomsae']) {
                $index += 1;
                $scoringInfo[$index]['id'] = $scr['id'];
                $scoringInfo[$index]['gender'] = $scr['gender'];
                $scoringInfo[$index]['division'] = $scr['division'];
                $scoringInfo[$index]['round'] = $scr['round'];
                $scoringInfo[$index]['poomsae'] = $scr['poomsae'];
                $scoringInfo[$index]['min'] = 10;
                $scoringInfo[$index]['max'] = 0;
            }
            $s = floatval($scr['score']);
            $scoringInfo[$index]['tscore'] += $s;
            $min = $scoringInfo[$index]['min'];
            $scoringInfo[$index]['min'] = $min > $s ? $s : $min;
            $max = $scoringInfo[$index]['max'];
            $scoringInfo[$index]['max'] = $max < $s ? $s : $max;
            $scoringInfo[$index]['judges'] += 1;
            $scoringInfo[$index]['fscore'] = ($scoringInfo[$index]['tscore'] - $scoringInfo[$index]['min'] - $scoringInfo[$index]['max']) / ($scoringInfo[$index]['judges'] - 2);
        }
        usort($scoringInfo, "cmpfscore");
        if($_POST['confirmed'] == 1) {
            // update the competitors who move on so they are in the next round
            // update division to the next round - if its the final round, update the division with winner id
        } else {
            $response_array['status'] = 'success'; 
            $response_array['message'] = "YAY :D";        
            $response_array['info'] = $scoringInfo;
        }
    } else {
        $response_array['status'] = 'failed';  
        $response_array['message'] = "Unable to get scores - maybe no player with that id has scores?";
    }        

    header('Content-type: application/json');
    echo json_encode($response_array);
?>

