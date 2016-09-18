<?php
    session_start();
    header('Access-Control-Allow-Origin: *');
    header('Content-type: application/json');

    $link = (include 'connect.php');
    if(!$link) {
        echo "{'status':'noaccess', 'msg':'wtf why are you here', 'link':'{$link}'}";
        exit();
    }

    // comparator for scores (-1 if sc1 is smaller, 1 if bigger, 0 if same)    
    function cmpfscore($sc1, $sc2) {
        if ($sc1['tfscore'] == $sc2['tfscore']) {
            return 0;
        }
        return ($sc1['tfscore'] > $sc2['tfscore']) ? -1 : 1;
    }

    // grabbing all scores for passed in division/gender/round
    $sql = "SELECT * FROM scores WHERE division={$_POST['division']} AND gender={$_POST['gender']} AND round={$_POST['round']} ORDER BY id, poomsae, judge";
    if ($result=mysqli_query($link,$sql))
    {
        // gather all players with scores into a single array (ordered by id then poomsae)
        $i = 0;
        while ($row = $result->fetch_assoc())
        {
            $scores[$i] = $row;
            $i += 1;
        }

        // gather and calculate final scores
        if($scores)
        {
            $idList = [];
            $index = -1;
            foreach ($scores as $scr) {
                // new id meaning we have moved to next player
                if($scoringInfo[$index]['id'] != $scr['id']) {
                    $index += 1;
                    $scoringInfo[$index]['id'] = $scr['id'];
                    $scoringInfo[$index]['gender'] = $scr['gender'];
                    $scoringInfo[$index]['division'] = $scr['division'];
                    $scoringInfo[$index]['round'] = $scr['round'];

                    // $scr['poomsae'] shoud be 1, meaning first poomsae for new player
                    $scoringInfo[$index]['poomsae'][$scr['poomsae']]['min'] = 10;
                    $scoringInfo[$index]['poomsae'][$scr['poomsae']]['max'] = 0;

                    // keep track of ids of players who have scores in this division/round
                    $idList[$index] = $scr['id'];
                }
                // new poomsae meaning we have moved to next poomsae for same player
                if($scr['poomsae'] > count($scoringInfo[$index]['poomsae'])) {
                    // $scr['poomsae'] should be 2 for second poomsae
                    $scoringInfo[$index]['poomsae'][$scr['poomsae']]['min'] = 10;
                    $scoringInfo[$index]['poomsae'][$scr['poomsae']]['max'] = 0;
                }

                // assign scores to the poomsae, calculating total, min, and max
                $s = floatval($scr['score']);
                $scoringInfo[$index]['poomsae'][$scr['poomsae']]['tscore'] += $s;
                $min = $scoringInfo[$index]['poomsae'][$scr['poomsae']]['min'];
                $min = $min > $s ? $s : $min;
                $scoringInfo[$index]['poomsae'][$scr['poomsae']]['min'] = $min;
                $max = $scoringInfo[$index]['poomsae'][$scr['poomsae']]['max'];
                $max = $max < $s ? $s : $max;
                $scoringInfo[$index]['poomsae'][$scr['poomsae']]['max'] = $max;

                // counting number of scores for each poomsae
                $scoringInfo[$index]['poomsae'][$scr['poomsae']]['judges'] += 1;

                // if more than 5 judges, then we need to take out highest/lowest scores
                    // and then average them
                if($scoringInfo[$index]['poomsae'][$scr['poomsae']]['judges'] >= 5) { 
                    $scoringInfo[$index]['poomsae'][$scr['poomsae']]['fscore'] = ($scoringInfo[$index]['poomsae'][$scr['poomsae']]['tscore'] - $min - $max) / ($scoringInfo[$index]['poomsae'][$scr['poomsae']]['judges'] - 2);
                } else {
                    $scoringInfo[$index]['poomsae'][$scr['poomsae']]['fscore'] = $scoringInfo[$index]['poomsae'][$scr['poomsae']]['tscore'] / $scoringInfo[$index]['poomsae'][$scr['poomsae']]['judges'];
                }

                // calculate the final score between all poomsaes
                $scoringInfo[$index]['tfscore'] = 0;
                for($i = 1; $i <= $scr['poomsae']; $i++) {
                    $scoringInfo[$index]['tfscore'] += $scoringInfo[$index]['poomsae'][$i]['fscore'];
                }
                $scoringInfo[$index]['tfscore'] /= $scr['poomsae'];
            }

            // grab the names of all the players whose final scores were calculated
            $index = 0;
            $sql2 = "SELECT fname, lname FROM competitors WHERE id IN (" . implode(",", $idList) . ")";
            if ($result2=mysqli_query($link,$sql2)) {
                while ($row2 = $result2->fetch_assoc()) {
                    $scoringInfo[$index]['name'] = $row2['fname'] . " " . $row2['lname'];
                    $index += 1;
                }
            }

            // sort all the players by the final scores
            usort($scoringInfo, "cmpfscore");

            // return the scores (and all info related to it)
            $response_array['status'] = 'success'; 
            $response_array['message'] = "YAY :D";        
            $response_array['info'] = $scoringInfo;
        } else {
            // no scores were found
            $response_array['status'] = 'success'; 
            $response_array['message'] = "No Scores";        
            $response_array['info'] = [];
        }
    } else {
        // query failed
        $response_array['status'] = 'failed';  
        $response_array['message'] = "Unable to get scores";
    }        

    echo json_encode($response_array);
?>
