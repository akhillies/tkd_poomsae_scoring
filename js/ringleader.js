startPage("ringleader");

$(function() {
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
                    var player = dt.info;
                    fadeOutIn([$("#player-no-exist"), $("#player-no-found")],
                        [$form],
                        function() {
                            var formElems = $form[0].elements;
                            formElems.id.value = player.id;
                            formElems.first_name.value = player.fname;
                            formElems.middle_name.value = player.mname;
                            formElems.last_name.value = player.lname;
                            formElems.age.value = player.age;
                            formElems.gender.value = player.gender;
                            formElems.belt.value = player.belt;
                            formElems.school.value = player.school;
                            formElems.division.value = player.division;
                            formElems.round.value = player.round;
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
        if($('#select-ring').text() == "Select Another Ring")
        {
            $('#select-ring').text("Select Ring");
            $('#select-division').text("Select Division/Round");
            $('form[name="select-division"] input[name="division"]').prop("disabled", false);
            $selectRingForm[0].reset();
            $selectRingForm[0].elements.ring.disabled = false;  
            fadeOutIn([$('#selectDivision'), $('#athleteDivision'), $("#scoreDivision")]);
        }
        else
        {
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
                            $('#select-division').prop("disabled", false);
                        }
                        else
                        {
                            $("#divisionTable").html("<h2>No Divisions in this Ring</h2>");
                            $('#select-division').prop("disabled", true);
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
    var $selectDivisionInputs = null;
    $selectDivisionForm.submit(function(event) {
        event.preventDefault();
        $selectDivisionInputs = $('form[name="select-division"] input[name="division"]');
        if($('#select-division').text() == "Choose Another Division/Round")
        {
            $('#select-division').text("Choose Division/Round");
            $selectDivisionInputs.prop("disabled", false);
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
                            $selectDivisionInputs.prop("disabled", true);
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
                            $selectDivisionInputs.prop("disabled", true);
                            $('#select-division').text("Choose Another Division/Round");
                            if(dt.info)
                            {
                                var tablebody = "";
                                dt.info.forEach(function(score, index, array) {
                                    for(var poom in score.poomsae)
                                    {
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
                            }
                            else
                            {
                                $("#scoresList").html("<h2>No scores for given division/round</h2>");

                            }
                            $("#scoreDivision").fadeIn(fadeTime);
                        }
                        else if(dt.status == 'failed')
                        {
                            $("#scoreDivision").fadeOut(fadeTime);
                        }
                        else
                        {
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
        if(orderings.size == $(".priority").size())
        {
            var items = $('form[name="select-division"]')[0].elements.division.value.split('-');
            $.ajax({
                type: 'POST',
                dataType: "text",
                url: link + "setNextDivision.php",
                data: {
                    ring: $selectRingForm[0].elements.ring.value,
                    division: items[1],
                    gender: items[2],
                    round: items[3],
                    orderings: Array.from(orderings),
                    ids: Array.from(ids)
                },
                success: function(data) {
                    var dt = JSON.parse(data);
                    if(dt.status == 'success')
                    {
                        buttonRespondSuccess($('#set-division'));
                        fadeOutIn([$('#selectDivision'), $('#athleteDivision')], [], function() {
                            $('#select-division').text("Select Division/Round");
                            $selectDivisionForm[0].reset();
                            $('#divisionTable').html("");
                            $('#athleteTable').html("");
                        });
                        $('#select-ring').text("Select Ring");
                        $selectRingForm[0].elements.ring.disabled = false;
                        $selectRingForm[0].reset();
                    }
                    else if(dt.status == 'failed')
                    {
                        buttonRespondFail($('#set-division'));
                    }
                    else
                    {
                        alert("add went seriously wrong, got a bad response: " + data);
                    }
                },
                error: ajaxFail
            });
        }
        else
        {
            $('#set-division').text("Need Unique Numbers!!").removeClass("btn-primary").addClass("btn-failure");
            setTimeout(function () {
                $('#set-division').text("Confirm next round").addClass("btn-primary").removeClass("btn-failure")
            }, fadeTime * 4);
        }
    });


    $('form[name="finish-division"]').submit(function(event) {
        event.preventDefault();
        var items = $selectDivisionForm[0].elements.division.value.split('-');
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
                if(dt.status == 'success')
                {
                    buttonRespondSuccess($('#finish-division'));
                    fadeOutIn([$('#selectDivision'), $('#scoreDivision')], [], function() {
                        $('#select-division').text("Select Division/Round");
                        $selectDivisionForm[0].reset();
                        $('#divisionTable').html("");
                        $('#scoresList').html("");
                    });
                    $('#select-ring').text("Select Ring");
                    $selectRingForm[0].elements.ring.disabled = false;
                    $selectRingForm[0].reset();
                }
                else if(dt.status == 'failed')
                {
                    buttonRespondFail($('#finish-division'));
                }
                else
                {
                    alert("add went seriously wrong, got a bad response: " + data);
                }
            },
            error: ajaxFail
        });
    });


    var $scoreByIdForm = $('form[name="find-score-by-id"]');
    $scoreByIdForm.submit(function(event) {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            dataType: "text",
            url: link + "scoreById.php",
            data: {
                id: $scoreByIdForm[0].elements.id.value,
            },
            success: function(data) {
                var dt = JSON.parse(data);
                if(dt.status == 'success')
                {
                    buttonRespondSuccess($('#score-by-id'));
                    fadeOutIn([], [$("#athleteScores")], function() {
                        $("#athleteScores .viewIndividual").prop("hidden", false);
                        $("#athleteScores .viewFinal").prop("hidden", true);
                        $("#scoresTable").html(scoreArrayToTable(dt.info));
                    });
                }
                else if(dt.status == 'failed')
                {
                    buttonRespondFail($('#score-by-id'));
                }
                else
                {
                    alert("get went seriously wrong, got a bad response: " + data);
                }
            },
            error: ajaxFail
        });
    });

    var $scoresByDivisionForm = $('form[name="find-score-by-division"]');
    $scoresByDivisionForm.submit(function(event) {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            dataType: "text",
            url: link + "scoreByDivision.php",
            data: {
                gender: $scoresByDivisionForm[0].elements.gender.value,
                division: $scoresByDivisionForm[0].elements.division.value,
                round: $scoresByDivisionForm[0].elements.round.value,
            },
            success: function(data) {
                var dt = JSON.parse(data);
                if(dt.status == 'success')
                {
                    buttonRespondSuccess($('#score-by-division'));
                    fadeOutIn([], [$("#athleteScores")], function() {
                        $("#athleteScores .viewIndividual").prop("hidden", false);
                        $("#athleteScores .viewFinal").prop("hidden", true);
                        if(dt.info)
                        {
                            $("#scoresTable").html(scoreArrayToTable(dt.info.scores));
                        }
                        else
                        {
                            $("#scoresTable").html("<h2>No scores for given division</h2>");
                        }
                    });
                } 
                else if(dt.status == 'failed')
                {
                    buttonRespondFail($('#score-by-division'));
                    $("#athleteScores").fadeOut(fadeTime);
                }
                else
                {
                    alert("get went seriously wrong, got a bad response: " + data);
                }
            },
            error: ajaxFail
        });
    });

    $('#final-score-by-division').click(function(event) {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            dataType: "text",
            url: link + "calculateScores.php",
            data: {
                gender: $scoresByDivisionForm[0].elements.gender.value,
                division: $scoresByDivisionForm[0].elements.division.value,
                round: $scoresByDivisionForm[0].elements.round.value,
                confirmed: 0
            },
            success: function(data) {
                var dt = JSON.parse(data);
                if(dt.status == 'success')
                {
                    buttonRespondSuccess($('#final-score-by-division'));
                    fadeOutIn([], [$("#athleteScores")], function() {
                        $("#athleteScores .viewIndividual").prop("hidden", true);
                        $("#athleteScores .viewFinal").prop("hidden", false);
                        if(dt.info)
                        {
                            var tablebody = "";
                            dt.info.forEach(function(score, index, array) {
                                tablebody += '<tr>';
                                tablebody += '<th scole="row">' + score.id + "</th>";
                                tablebody += '<td>' + score.name + "</td>";
                                tablebody += '<td>' + gender(score.gender) + "</td>";
                                tablebody += '<td>' + division(score.division) + "</td>";
                                tablebody += '<td>' + round(score.round) + "</td>";
                                tablebody += '<td>' + score.poomsae[1].fscore + "</td>";
                                if(score.poomsae[2])
                                {   
                                    tablebody += '<td>' + score.poomsae[2].fscore + "</td>";
                                }
                                else
                                {
                                    tablebody += '<td>N/A</td>';
                                }
                                tablebody += '<td>' + make2dec(score.tfscore) + "</td>";
                                tablebody += '</tr>';
                            });
                            $("#scoresTable").html(tablebody);
                        }
                        else
                        {
                            $("#scoresTable").html("<h2>No scores for given division</h2>");
                        }
                    });
                }
                else if(dt.status == 'failed')
                {
                    buttonRespondFail($('#final-score-by-division'));
                    $("#athleteScores").fadeOut(fadeTime);
                }
                else
                {
                    alert("get went seriously wrong, got a bad response: " + data);
                }
            },
            error: ajaxFail
        });
    });
});

