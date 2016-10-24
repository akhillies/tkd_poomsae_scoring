startPage("admin");

$(function() {
    var $addAthleteForm = $('form[name="add-athlete"]');
    $addAthleteForm.submit(function(event) {
        event.preventDefault();
        var formElems = $addAthleteForm[0].elements;
        $.ajax({
            type: 'POST',
            dataType: "text",
            url: link + "add.php",
            data: {
                id: formElems.id.value, 
                first_name: formElems.first_name.value, 
                middle_name: formElems.middle_name.value,
                last_name: formElems.last_name.value,
                age: formElems.age.value,
                gender: formElems.gender.value,
                belt: formElems.school.belt,
                school: formElems.school.value
            },
            success: function(data) {
                var dt = JSON.parse(data);
                if(dt.status == 'success')
                {
                    buttonRespondSuccess($('#add-athlete'))
                    $addAthleteForm[0].reset();
                }
                else if(dt.status == 'failed')
                {
                    buttonRespondFail($('#add-athlete'));
                }
                else
                {
                    alert("add went seriously wrong, got a bad response: " + data);
                }
            },
            error: ajaxFail
        });
    }); 

    var $searchAthleteForm = $('form[name="search-athlete"]');
    var $editAthleteForm = $('form[name="edit-athlete"]');
    $searchAthleteForm.submit(function(event) {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            dataType: "text",
            url: link + "get.php",
            data: {
                id: $searchAthleteForm[0].elements.search.value 
            },
            success: function(data) {
                var dt = JSON.parse(data);
                if(dt.status == 'success')
                {
                    fadeOutIn([$("#player-no-exist"), $("#player-no-found")], [$editAthleteForm], function() {
                        var formElems = $editAthleteForm[0].elements;
                        var info = dt.info;
                        formElems.id.value = info.id;
                        formElems.first_name.value = info.fname;
                        formElems.middle_name.value = info.mname;
                        formElems.last_name.value = info.lname;
                        formElems.age.value = info.age;
                        formElems.gender.value = info.gender;
                        formElems.belt.value = info.belt;
                        formElems.school.value = info.school;
                        formElems.division.value = info.division;
                        formElems.round.value = info.round;
                    });
                }
                else if(dt.status == 'nosuchelement')
                {
                    fadeOutIn([$("#player-no-found"), $editAthleteForm], [$("#player-no-exist")]);
                }
                else if(dt.status == 'failed')
                {
                    fadeOutIn([$("#player-no-exist"), $editAthleteForm], [$("#player-no-found")]);
                }
                else
                {
                    alert("get went seriously wrong, got a bad response: " + data);
                }

            },
            error: ajaxFail
        });

    });

    $editAthleteForm.submit(function(event) {
        event.preventDefault();
        var formElems = $editAthleteForm[0].elements;
        $.ajax({
            type: 'POST',
            dataType: "text",
            url: link + "update.php",
            data: {
                id: formElems.id.value, 
                first_name: formElems.first_name.value, 
                middle_name: formElems.middle_name.value,
                last_name: formElems.last_name.value,
                age: formElems.age.value,
                gender: formElems.gender.value,
                belt: formElems.school.belt,
                school: formElems.school.value,
                division: formElems.division.value,
                round: formElems.round.value
            },
            success: function(data) {
                var dt = JSON.parse(data);
                if(dt.status == 'success')
                {
                    buttonRespondSuccess($('#edit-athlete'));
                    setTimeout(function () {
                        $searchAthleteForm[0].reset();
                        $editAthleteForm[0].reset();
                        $editAthleteForm.fadeOut(fadeTime);
                    }, fadeTime);
                }
                else if(dt.status == 'failed')
                {
                    buttonRespondFail($('#edit-athlete'));
                }
                else
                {
                    alert("add went seriously wrong, got a bad response: " + data);
                }
            },
            error: ajaxFail
        });
        return false;
    });

    $("#delete-athlete").click(function(e) {
        e.preventDefault();
        if(confirm("Are you sure you want to delete this athlete? This action cannot be taken back!"))
        {
            $.ajax({
                type: 'POST',
                dataType: "text",
                url: link + "delete.php",
                data: {
                    id: $editAthleteForm[0].elements.id.value, 
                },
                success: function(data) {
                    var dt = JSON.parse(data);
                    if(dt.status == 'success')
                    {
                        buttonResponseSuccess($('#delete-athlete'), function() {
                            $searchAthleteForm[0].reset();
                            $editAthleteForm[0].reset();
                            $editAthleteForm.fadeOut(fadeTime);
                        }, true);
                    }
                    else if(dt.status == 'failed')
                    {
                        buttonResponseFail($('#delete-athlete'), null, true)
                    }
                    else
                    {
                        alert("add went seriously wrong, got a bad response: " + data);
                    }
                },
                error: ajaxFail
            });
        }
    });


    var $addDivisionForm = $('form[name="add-division"]');
    $addDivisionForm.submit(function(event) {
        var formElems = $addDivisionForm[0].elements;        
        event.preventDefault();
        $.ajax({
            type: 'POST',
            dataType: "text",
            url: link + "assignDivision.php",
            data: {
                ring: formElems.ring.value,
                division: formElems.division.value,
                round: formElems.round.value,
                gender: formElems.gender.value,
            },
            success: function(data) {
                var dt = JSON.parse(data);
                if(dt.status == 'success')
                {
                    buttonRespondSuccess($('#add-division'));
                    fadeOutIn([$('#badround-division'), $('#empty-division')], [], function () {
                        $addDivisionForm[0].reset();
                    });
                }
                else if(dt.status == 'noplayers')
                {
                    buttonRespondFail($('#add-division'));
                    fadeOutIn([$('#empty-division')], [$('#empty-division')]);
                }
                else if(dt.status == 'badround')
                {
                    buttonRespondFail($('#add-division'));
                    fadeOutIn([$('#empty-division')], [$('#badround-division')]);
                }
                else if(dt.status == 'failed')
                {
                    buttonRespondFail($('#add-division'));
                }
                else
                {
                    alert("add went seriously wrong, got a bad response: " + data);
                }
            },
            error: ajaxFail
        });
        return false;
    });

    var $searchDivisionForm = $('form[name="search-division"]');
    var searchDivisionFormElems = $searchDivisionForm[0].elements;        
    var $moveDivisionForm = $('form[name="move-division"]');
    var moveDivisionFormElems = $moveDivisionForm[0].elements;
    $searchDivisionForm.submit(function(event) {
        event.preventDefault();
        if($('#find-division').text() == "Find Another Division")
        {
            $('#find-division').text("Find Division");
            searchDivisionFormElems.division.disabled = false;
            searchDivisionFormElems.round.disabled = false;
            searchDivisionFormElems.genderMale.disabled = false;
            searchDivisionFormElems.genderFemale.disabled = false;
            $searchDivisionForm[0].reset();
            fadeOutIn([$("#division-no-added"), $("#division-no-found"), $('#athleteDivision'), $moveDivisionForm]);
        }
        else
        {
            $.ajax({
                type: 'POST',
                dataType: "text",
                url: link + "lookupDivision.php",
                data: {
                    division: searchDivisionFormElems.division.value,
                    round: searchDivisionFormElems.round.value,
                    gender: searchDivisionFormElems.gender.value,
                },
                success: function(data) {
                    var dt = JSON.parse(data);
                    if(dt.status == 'success') 
                    {
                        var info = dt.info;
                        searchDivisionFormElems.division.disabled = true;
                        searchDivisionFormElems.round.disabled = true;
                        searchDivisionFormElems.genderMale.disabled = true;
                        searchDivisionFormElems.genderFemale.disabled = true;
                        moveDivisionForm.ring.value = info.ring;
                        $('#find-division').text("Find Another Division");
                        if(info.athletes)
                        {
                            moveDivisionForm.numplay.value = info.athletes.length;
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
                                tablebody += '<td>' + athlete.school + "</td>";
                                tablebody += '</tr>';
                            });
                            $("#divisionTable").html(tablebody);
                        }
                        else
                        {
                            moveDivisionFormElems.numplay.value = 0;
                            $("#divisionTable").html("<h2>No Athletes in this Division</h2>");
                        }
                        fadeOutIn([$("#division-no-found"), $("#division-no-added")], [$moveDivisionForm, $('#athleteDivision')]);
                    }
                    else if(dt.status == 'nosuchelement')
                    {
                        fadeOutIn([$("#division-no-found"), $('#athleteDivision'), $moveDivisionForm], [$("#division-no-added")]);
                    }
                    else if(dt.status == 'failed')
                    {
                        fadeOutIn([$("#division-no-added"), $('#athleteDivision'), $moveDivisionForm], [$("#division-no-found")]);
                    }
                    else
                    {
                        alert("get went seriously wrong, got a bad response: " + data);
                    }

                },
                error: ajaxFail
            });
        }
    });


    $moveDivisionForm.submit(function(event) {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            dataType: "text",
            url: link + "moveDivision.php",
            data: {
                ring: moveDivisionFormElems.ring.value,
                division: searchDivisionFormElems.division.value,
                round: searchDivisionFormElems.round.value,
                gender: searchDivisionFormElems.gender.value,
            },
            success: function(data) {
                var dt = JSON.parse(data);
                if(dt.status == 'success')
                {
                    buttonRespondSuccess($('#move-division'))
                    fadeOutIn([$moveDivisionForm, $('#athleteDivision')], [], function () {
                        $searchDivisionForm[0].reset();
                        $moveDivisionForm[0].reset();
                        $('#divisionTable').html("");
                        $('#find-division').text("Find Division");
                        searchDivisionFormElems.division.disabled = false;
                        searchDivisionFormElems.round.disabled = false;
                        searchDivisionFormElems.genderMale.disabled = false;
                        searchDivisionFormElems.genderFemale.disabled = false;
                    });
                }
                else if(dt.status == 'failed')
                {
                    buttonRespondFail($('#move-division'));
                }
                else
                {
                    alert("add went seriously wrong, got a bad response: " + data);
                }
            },
            error: ajaxFail
        });
        return false;
    });

    $("#remove-division").click(function(e) {
        e.preventDefault();
        if(confirm("Are you sure you want to remove this division? There is no undo-ing this action!"))
        {
            var formElems = $('form[name="search-division"]')[0].elements;        
            $.ajax({
                type: 'POST',
                dataType: "text",
                url: link + "removeDivision.php",
                data: {
                    division: formElems.division.value,
                    round: formElems.round.value,
                    gender: formElems.gender.value,
                },
                success: function(data) {
                    var dt = JSON.parse(data);
                    if(dt.status == 'success')
                    {
                        buttonRespondSuccess($('#remove-division'), function() {
                            $searchDivisionForm[0].reset();
                            $moveDivisionForm[0].reset();
                        }, "danger");
                        fadeOutIn([$moveDivisionForm, $('#athleteDivision')]);
                    } 
                    else if(dt.status == 'failed') 
                    {
                        buttonRespondFail($('#remove-division'), null, "danger");
                    } 
                    else 
                    {
                        alert("add went seriously wrong, got a bad response: " + data);
                    }
                },
                error: ajaxFail
            });
        }
    });

    var $recordScoreForm = $('form[name="record-score"]');
    $recordScoreForm.submit(function(event) {
        event.preventDefault();
        var formElems = $recordScoreForm[0].elements;        
        $.ajax({
            type: 'POST',
            dataType: "text",
            url: link + "recordScore.php",
            data: {
                id: formElems.id.value,
                judge: formElems.judge.value,
                poomsae: formElems.poomsae.value,
                score: formElems.score.value,
            },
            success: function(data) {
                var dt = JSON.parse(data);
                if(dt.status == 'success') 
                {
                    buttonRespondSuccess($('#record-score'));
                    $recordScoreForm[0].reset();
                } 
                else if(dt.status == 'failed')
                {
                    buttonRespondFail($('#record-score'));
                } 
                else 
                {
                    alert("get went seriously wrong, got a bad response: " + data);
                }

            },
            error: ajaxFail
        });
    });

    var $findScoreByIdForm = $('form[name="find-score-by-id"]');
    $findScoreByIdForm.submit(function(event) {
        event.preventDefault();
        $("#athleteScores").fadeOut(fadeTime);
        $.ajax({
            type: 'POST',
            dataType: "text",
            url: link + "scoreById.php",
            data: {
                id: $findScoreByIdForm=[0].elements.id.value,
            },
            success: function(data) {
                var dt = JSON.parse(data);
                if(dt.status == 'success') 
                {
                    buttonRespondSuccess($('#score-by-id'));
                    if(dt.info) 
                    {
                        var tablebody = "";
                        dt.info.scores.forEach(function(score, index, array) {
                            tablebody += '<tr>';
                            tablebody += '<th scole="row">' + score.id + "</th>";
                            tablebody += '<td>' + gender(score.gender) + "</td>";
                            tablebody += '<td>' + division(score.division) + "</td>";
                            tablebody += '<td>' + round(score.round) + "</td>";
                            tablebody += '<td>' + score.judge + "</td>";
                            tablebody += '<td>' + score.poomsae + "</td>";
                            tablebody += '<td>' + score.score + "</td>";
                            tablebody += '</tr>';
                        });
                        $("#scoresTable").html(tablebody);
                    } 
                    else 
                    {
                        $("#scoresTable").html("<h2>No scores for given athlete</h2>");
                    }
                    $("#athleteScores").fadeIn(fadeTime);
                    $('form[name="change-score"]').fadeIn(fadeTime);
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

    $('form[name="find-score-by-division"]').submit(function(event) {
        event.preventDefault();
        $("#athleteScores").fadeOut(fadeTime);
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
                console.log(dt.sql);
                if(dt.status == 'success') 
                {
                    buttonRespondSuccess($('#score-by-division'));
                    if(dt.info)
                    {
                        var tablebody = "";
                        dt.info.scores.forEach(function(score, index, array) {
                            tablebody += '<tr>';
                            tablebody += '<th scole="row">' + score.id + "</th>";
                            tablebody += '<td>' + gender(score.gender) + "</td>";
                            tablebody += '<td>' + division(score.division) + "</td>";
                            tablebody += '<td>' + round(score.round) + "</td>";
                            tablebody += '<td>' + score.judge + "</td>";
                            tablebody += '<td>' + score.poomsae + "</td>";
                            tablebody += '<td>' + score.score + "</td>";
                            tablebody += '</tr>';
                        });
                        $("#scoresTable").html(tablebody);
                    }
                    else
                    {
                        $("#scoresTable").html("<h2>No scores for given division</h2>");
                    }
                    $("#athleteScores").fadeIn(fadeTime);
                    $('form[name="change-score"]').fadeIn(fadeTime);
                }
                else if(dt.status == 'failed')
                {
                   buttonRespondFail($('#score-by-division'));
                }
                else 
                {
                    alert("get went seriously wrong, got a bad response: " + data);
                }

            },
            error: ajaxFail
        });
    });

    $('form[name="change-score"]').submit(function(event) {
        event.preventDefault();
        var formElems = $('form[name="change-score"]')[0].elements;        
        $.ajax({
            type: 'POST',
            dataType: "text",
            url: link + "changeScore.php",
            data: {
                id: formElems.id.value,
                round: formElems.round.value,
                judge: formElems.judge.value,
                poomsae: formElems.poomsae.value,
                score: formElems.score.value,
            },
            success: function(data) {
                var dt = JSON.parse(data);
                if(dt.status == 'success') 
                {
                    buttonRespondSuccess($('#change-score'));
                    $('form[name="change-score"]')[0].reset();
                } 
                else if(dt.status == 'failed') 
                {
                    buttonRespondFail($('#change-score'));
                } 
                else 
                {
                    alert("get went seriously wrong, got a bad response: " + data);
                }

            },

            error: ajaxFail
        });
    });

    $("#delete-score").click(function(e) {
        e.preventDefault();
        if(confirm("Are you sure you want to delete this score? This action cannot be undone!"))
        {
            var formElems = $('form[name="change-score"]')[0].elements;        
            $.ajax({
                type: 'POST',
                dataType: "text",
                url: link + "removeScore.php",
                data: {
                    id: formElems.id.value,
                    round: formElems.round.value,
                    judge: formElems.judge.value,
                    poomsae: formElems.poomsae.value,
                },
                success: function(data) {
                    var dt = JSON.parse(data);
                    if(dt.status == 'success') 
                    {
                        $('#delete-score').text("Success!").removeClass("btn-danger").addClass("btn-success");
                        setTimeout(function () {
                            $('#delete-score').text("Delete Score").addClass("btn-danger").removeClass("btn-success")
                        }, 1500);
                        $('form[name="change-score"]')[0].reset();
                    } 
                    else if(dt.status == 'failed')
                    {
                        $('#delete-score').text("Failed!").removeClass("btn-danger").addClass("btn-failure");
                        setTimeout(function () {
                            $('#delete-score').text("Delete Score").addClass("btn-danger").removeClass("btn-failure")
                        }, 1500);
                    }
                    else
                    {
                        alert("get went seriously wrong, got a bad response: " + data);
                    }

                },
                error: ajaxFail
            });
        }
    });
});
