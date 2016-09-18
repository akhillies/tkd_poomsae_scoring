startPage("ringleader");

$(function() {
    $("body").fadeIn(500);
    
    var $searchAthleteByIdForm = $('form[name="search-athlete-by-id"]');
    $searchAthleteByIdForm.submit(function(event) {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            dataType: "text",
            url: link + "get.php",
            data: {
                id: $searchAthleteByIdForm[0].elements.search.value 
            },
            success: function(data) {
                var dt = JSON.parse(data);
                var $form = $('form[name="view-athlete"]');
                if(dt.status == 'success')
                {
                    fadeOutIn([$("#player-no-exist"), $("#player-no-found")],
                        [$form],
                        function() {
                            populateAthleteInfo($form[0].elements, dt.info);
                        });
                }
                else if(dt.status == 'nosuchelement')
                {
                    fadeOutIn([$("#player-no-found"), $form], [$("#player-no-exist")]);
                }
                else if(dt.status == 'failed')
                {
                    fadeOutIn([$("#player-no-exist"), $form], [$("#player-no-found")]);
                }
                else
                {
                    fadeOutIn([$("#player-no-exist"), $("#player-no-found"), $form]);
                    alert("get went seriously wrong, got a bad response: " + data);
                }

            },
            error: ajaxFail
        });

    });


    var $selectRingForm = $('form[name="select-ring"]');
    $selectRingForm.submit(function(event) {
        event.preventDefault();
        if($('#select-ring').text() == "Select Another Ring") {
            $('#select-ring').text("Select Ring");
            $('#select-division').text("Select Division/Round");
            $('form[name="select-division"] input[name="division"]').removeAttr("disabled");
            $selectRingForm[0].reset();
            $selectRingForm[0].elements.ring.disabled = false;  
            fadeOutIn([$('#selectDivision'), $('#athleteDivision')]);
        } else {
            $.ajax({
                type: 'POST',
                dataType: "text",
                url: link + "viewRing.php",
                data: {
                    ring: $selectRingForm[0].elements.ring.value,
                },
                success: function(data) {
                    var dt = JSON.parse(data);
                    if(dt.status == 'success')
                    {
                        $selectRingForm[0].elements.ring.disabled = true;
                        var info = dt.info;
                        $('#select-ring').text("Select Another Ring");
                        if(info && info.divisions) 
                        {
                            var tablebody = "";
                            info.divisions.forEach(function(divis, index, array) {
                                tablebody += '<tr>';
                                tablebody += '<td>' + division(divis.division) + "</td>";
                                tablebody += '<td>' + gender(divis.gender) + "</td>";
                                tablebody += '<td>' + round(divis.round) + "</td>";

                                var id = "division" + index;
                                tablebody += '<td>' + '<input type="radio" name="division" id="' + id + '" value="' + ('n-' + divis.division + '-' + divis.gender + '-' + divis.round) + '" required';
                                if(divis.finished == 1)
                                {
                                    tablebody += ' disabled';
                                }
                                tablebody += '>' + '</td>';

                                tablebody += '<td>' + '<input type="radio" name="division" id="' + id + '" value="' + ('f-' + divis.division + '-' + divis.gender + '-' + divis.round) + '" required';
                                if(divis.finished == 1)
                                {
                                    tablebody += ' disabled';
                                }
                                tablebody += '>' + '</td>';
                            
                                tablebody += '</tr>';
                            });
                            $("#divisionTable").html(tablebody);
                        }
                        else
                        {
                            $("#divisionTable").html("<h2>No Divisions in this Ring</h2>");
                        }
                        $('#selectDivision').fadeIn(fadeTime);
                    }
                    else if(dt.status == 'failed')
                    {
                        $('#selectDivision').fadeOut(fadeTime);
                    }
                    else
                    {
                        $('#selectDivision').fadeOut(fadeTime);
                        alert("get went seriously wrong, got a bad response: " + data);
                    }

                },
                error: ajaxFail
            });
        }
    });

    var $selectDivisionForm = $('form[name="select-division"]');
    $selectDivisionForm.submit(function(event) {
        event.preventDefault();
        if($('#select-division').text() == "Choose Another Division/Round")
        {
            $('#select-division').text("Choose Division/Round");
            $('form[name="select-division"] input[name="division"]').removeAttr("disabled");
            $selectDivisionForm[0].reset();
            fadeOutIn([$('#athleteDivision'), $('#scoreDivision')]);
        }
        else
        {
            var items = $selectDivisionForm[0].elements.division.value.split('-');
            if(items[0] == 'n')
            {
                $.ajax({
                    type: 'POST',
                    dataType: "text",
                    url: link + "lookupDivision.php",
                    data: {
                        division: items[1],
                        gender: items[2],
                        round: items[3],
                    },
                    success: function(data) {
                        var dt = JSON.parse(data);
                        if(dt.status == 'success')
                        {
                            $('form[name="select-division"] input[name="division"]').attr("disabled", "true");
                            $('#select-division').text("Choose Another Division/Round");
                            var info = dt.info;
                            fadeOutIn([], [$("#athleteDivision")], function() {
                                if(info.athletes)
                                {
                                    var tablebody = "";
                                    info.athletes.forEach(function(athlete, index, array) {
                                        tablebody += '<tr>';
                                        tablebody += '<th scole="row">' + athlete.id + "</th>";
                                        tablebody += '<td>' + athlete.fname + "</td>";
                                        tablebody += '<td>' + athlete.mname + "</td>";
                                        tablebody += '<td>' + athlete.lname + "</td>";
                                        tablebody += '<td>' + gender(athlete.gender) + "</td>";
                                        tablebody += '<td>' + athlete.age + "</td>";
                                        tablebody += '<td>' + division(athlete.division) + "</td>";
                                        tablebody += '<td>' + round(athlete.round) + "</td>";

                                        var id = "ordering" + index;
                                        tablebody += '<td>' + '<div class="form-group"><label class="sr-only" for="' + id + '">Order</label><input id="' + id + '" name="' + athlete.id + '" type="number" class="form-control input-sm priority" value=' + (index+1) + ' placeholder=0 required></div>' + "</td>";    
                                        tablebody += '</tr>';
                                    });
                                    $("#athleteTable").html(tablebody);
                                }
                                else
                                {
                                    $("#athleteTable").html("<h2>No Athletes in this Division</h2>");
                                }
                            });
                        }
                        else if(dt.status == 'nosuchelement')
                        {
                            fadeOutIn([$("#division-no-found"), $('#athleteDivision')], [$("#division-no-added")]);
                        }
                        else if(dt.status == 'failed')
                        {
                            fadeOutIn([$("#division-no-added"), $('#athleteDivision')], [$("#division-no-found")]);
                        }
                        else
                        {
                            alert("get went seriously wrong, got a bad response: " + data);
                            fadeOutIn([$("#division-no-found"), $('#athleteDivision'), $("#division-no-added")]);
                        }
                    },
                    error: ajaxFail
                });
            }
            else if(items[0] == 'f') 
            {
                $.ajax({
                    type: 'POST',
                    dataType: "text",
                    url: link + "calculateScores.php",
                    data: {
                        division: items[1],
                        gender: items[2],
                        round: items[3],
                        confirmed: 0,
                    },
                    success: function(data) {
                        var dt = JSON.parse(data);
                        if(dt.status == 'success')
                        {
                            $('form[name="select-division"] input[name="division"]').attr("disabled", "true");
                            $('#select-division').text("Choose Another Division/Round");
                            if(dt.info) {
                                var tablebody = "";
                                dt.info.forEach(function(score, index, array) {
                                    for(var poom in score.poomsae) {
                                        tablebody += '<tr>';
                                        tablebody += '<th scole="row">' + score.id + "</th>";
                                        tablebody += '<td>' + score.name + "</th>";
                                        tablebody += '<td>' + gender(score.gender) + "</td>";
                                        tablebody += '<td>' + division(score.division) + "</td>";
                                        tablebody += '<td>' + round(score.round) + "</td>";
                                        tablebody += '<td>' + poom + "</td>";
                                        tablebody += '<td>' + score.poomsae[poom].judges + "</td>";
                                        tablebody += '<td>' + make2dec(score.poomsae[poom].tscore) + "</td>";
                                        tablebody += '<td>' + make2dec(score.poomsae[poom].min) + "</td>";
                                        tablebody += '<td>' + make2dec(score.poomsae[poom].max) + "</td>";
                                        tablebody += '<td>' + make2dec(score.poomsae[poom].fscore) + "</td>";
                                        tablebody += '</tr>';
                                    }
                                });
                                $("#scoresList").html(tablebody);
                            } else {
                                $("#scoresList").html("<h2>No scores for given division/round</h2>");

                            }
                            $("#scoreDivision").fadeIn(fadeTime);
                        } else if(dt.status == 'failed') {
                            $("#scoreDivision").fadeOut(fadeTime);
                        } else {
                            $("#scoreDivision").fadeOut(fadeTime);
                            alert("get went seriously wrong, got a bad response: " + data);
                        }
                    },
                    error: ajaxFail
                });
            }
        }
    });

    $('form[name="set-division"]').submit(function(event) {
        event.preventDefault();

        var orderings = new Set();
        var ids = new Set();
        $(".priority").each(function(index, order) {
            orderings.add(order.value);
            ids.add(order.name);
        });
        if(orderings.size == $(".priority").size()) {
            var items = $('form[name="select-division"]')[0].elements.division.value.split('-');
            $.ajax({
                type: 'POST',
                dataType: "text",
                url: link + "setNextDivision.php",
                data: {
                    ring: $('form[name="select-ring"]')[0].elements.ring.value,
                    division: items[1],
                    gender: items[2],
                    round: items[3],
                    orderings: Array.from(orderings),
                    ids: Array.from(ids)
                },
                success: function(data) {
                    var dt = JSON.parse(data);
                    if(dt.status == 'success') {
                        $('#set-division').text("Success!").removeClass("btn-primary").addClass("btn-success");
                        setTimeout(function () {
                            $('#select-division').text("Select Division/Round");
                            $('#set-division').text("Confirm next round").addClass("btn-primary").removeClass("btn-success")
                            $('form[name="select-division"]')[0].reset();
                            $('#selectDivision').fadeOut(500, function() {
                                $('#divisionTable').html("");
                            });
                            $('#athleteDivision').fadeOut(500, function() {
                                $('#athleteTable').html("");
                            });
                        }, 1500);
                        $('#select-ring').text("Select Ring");
                        $('form[name="select-ring"]')[0].elements.ring.disabled = false;
                        $('form[name="select-ring"]')[0].reset();
                    } else if(dt.status == 'failed') {
                        $('#set-division').text("Failed!").removeClass("btn-primary").addClass("btn-failure");
                        setTimeout(function () {
                            $('#set-division').text("Confirm next round").addClass("btn-primary").removeClass("btn-failure")
                        }, 1500);
                    } else {
                        alert("add went seriously wrong, got a bad response: " + data);
                    }
                },
                error: ajaxFail
            });
        } else {
            $('#set-division').text("Need Unique Numbers!!").removeClass("btn-primary").addClass("btn-failure");
            setTimeout(function () {
                $('#set-division').text("Confirm next round").addClass("btn-primary").removeClass("btn-failure")
            }, 2500);
        }
    });


    $('form[name="finish-division"]').submit(function(event) {
        event.preventDefault();
        var items = $('form[name="select-division"]')[0].elements.division.value.split('-');
        $.ajax({
            type: 'POST',
            dataType: "text",
            url: link + "calculateScores.php",
            data: {
                division: items[1],
                gender: items[2],
                round: items[3],
                confirmed: 1,
            },
            success: function(data) {
                var dt = JSON.parse(data);
                if(dt.status == 'success') {
                    $('#finish-division').text("Success!").removeClass("btn-primary").addClass("btn-success");
                    setTimeout(function () {
                        $('#select-division').text("Select Division/Round");
                        $('#finish-division').text("Confirm round finished").addClass("btn-primary").removeClass("btn-success")
                        $('form[name="select-division"]')[0].reset();
                        $('#selectDivision').fadeOut(500, function() {
                            $('#divisionTable').html("");
                        });
                        $('#scoreDivision').fadeOut(500, function() {
                            $('#scoresList').html("");
                        });
                    }, 1500);
                    $('#select-ring').text("Select Ring");
                    $('form[name="select-ring"]')[0].elements.ring.disabled = false;
                    $('form[name="select-ring"]')[0].reset();
                } else if(dt.status == 'failed') {
                    $('#finish-division').text("Failed!").removeClass("btn-primary").addClass("btn-failure");
                    setTimeout(function () {
                        $('#finish-division').text("Confirm round finished").addClass("btn-primary").removeClass("btn-failure")
                    }, 1500);
                } else {
                    alert("add went seriously wrong, got a bad response: " + data);
                }
            },
            error: ajaxFail
        });
    });


    $('form[name="find-score-by-id"]').submit(function(event) {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            dataType: "text",
            url: link + "scoreById.php",
            data: {
                id: $('form[name="find-score-by-id"]')[0].elements.id.value,
            },
            success: function(data) {
                var dt = JSON.parse(data);
                if(dt.status == 'success') {
                    $('#score-by-id').text("Success!").removeClass("btn-primary").addClass("btn-success");
                    setTimeout(function () {
                        $('#score-by-id').text("Get Scores").addClass("btn-primary").removeClass("btn-success")
                    }, 1500);
                    if(dt.info) {
                        var tablebody = "";
                        dt.info.scores.forEach(function(score, index, array) {
                            tablebody += '<tr>';
                            tablebody += '<th scole="row">' + score.id + "</th>";
                            tablebody += '<td>' + score.name + "</td>";
                            tablebody += '<td>' + gender(score.gender) + "</td>";
                            tablebody += '<td>' + division(score.division) + "</td>";
                            tablebody += '<td>' + round(score.round) + "</td>";
                            tablebody += '<td>' + score.judge + "</td>";
                            tablebody += '<td>' + score.poomsae + "</td>";
                            tablebody += '<td>' + score.score + "</td>";
                            tablebody += '</tr>';
                        });
                        $("#scoresTable").html(tablebody);
                    } else {
                        $("#scoresTable").html("<h2>No scores for given athlete</h2>");
                    }
                    $("#athleteScores").fadeIn(500);
                } else if(dt.status == 'failed') {
                    $('#score-by-id').text("Failed!").removeClass("btn-primary").addClass("btn-failure");
                    setTimeout(function () {
                        $('#score-by-id').text("Get Scores").addClass("btn-primary").removeClass("btn-failure")
                    }, 1500);
                } else {
                    alert("get went seriously wrong, got a bad response: " + data);
                }

            },
            error: ajaxFail
        });
    });

    $('form[name="find-score-by-division"]').submit(function(event) {
        event.preventDefault();
        $("#athleteScores").fadeOut(500);
        $.ajax({
            type: 'POST',
            dataType: "text",
            url: link + "scoreByDivision.php",
            data: {
                gender: $('form[name="find-score-by-division"]')[0].elements.gender.value,
                division: $('form[name="find-score-by-division"]')[0].elements.division.value,
                round: $('form[name="find-score-by-division"]')[0].elements.round.value,
            },
            success: function(data) {
                var dt = JSON.parse(data);
                if(dt.status == 'success') {
                    $('#score-by-division').text("Success!").removeClass("btn-primary").addClass("btn-success");
                    setTimeout(function () {
                        $('#score-by-division').text("Get Scores").addClass("btn-primary").removeClass("btn-success")
                    }, 1500);
                    if(dt.info) {
                        $("#scoresTable").html(scoreArrayToTable(dt.info.scores));
                    } else {
                        $("#scoresTable").html("<h2>No scores for given division</h2>");
                    }
                    $("#athleteScores").fadeIn(500);
                } else if(dt.status == 'failed') {
                    $('#score-by-division').text("Failed!").removeClass("btn-primary").addClass("btn-failure");
                    setTimeout(function () {
                        $('#score-by-division').text("Get Scores").addClass("btn-primary").removeClass("btn-failure")
                    }, 1500);
                    $("#athleteScores").fadeOut(500);
                } else {
                    alert("get went seriously wrong, got a bad response: " + data);
                }
            },
            error: ajaxFail
        });
    });

    $('#final-score-by-division').click(function(event) {
        event.preventDefault();
        $("#athleteScores").fadeOut(500);
        $.ajax({
            type: 'POST',
            dataType: "text",
            url: link + "calculateScores.php",
            data: {
                gender: $('form[name="find-score-by-division"]')[0].elements.gender.value,
                division: $('form[name="find-score-by-division"]')[0].elements.division.value,
                round: $('form[name="find-score-by-division"]')[0].elements.round.value,
                confirmed: 0
            },
            success: function(data) {
                var dt = JSON.parse(data);
                if(dt.status == 'success') {
                    $('#final-score-by-division').text("Success!").removeClass("btn-primary").addClass("btn-success");
                    setTimeout(function () {
                        $('#final-score-by-division').text("Get Final Scores").addClass("btn-primary").removeClass("btn-success")
                    }, 1500);
                    if(dt.info) {
                        $("#scoresTable").html(scoreArrayToTable(dt.info.scores));
                    }
                    $("#athleteScores").fadeIn(500);
                } else if(dt.status == 'failed') {
                    $('#final-score-by-division').text("Failed!").removeClass("btn-primary").addClass("btn-failure");
                    setTimeout(function () {
                        $('#final-score-by-division').text("Get Scores").addClass("btn-primary").removeClass("btn-failure")
                    }, 1500);
                    $("#athleteScores").fadeOut(500);
                } else {
                    alert("get went seriously wrong, got a bad response: " + data);
                }
            },
            error: ajaxFail
        });
    });
});

