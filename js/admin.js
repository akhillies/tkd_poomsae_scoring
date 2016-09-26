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
                        $('#delete-athlete').text("Deleted!").removeClass("btn-danger").addClass("btn-success");
                        setTimeout(function () {
                            $('#delete-athlete').text("Delete Athlete").addClass("btn-danger").removeClass("btn-success")
                            $searchAthleteForm[0].reset();
                            $editAthleteForm[0].reset();
                            $editAthleteForm.fadeOut(fadeTime);
                        }, fadeTime);
                    }
                    else if(dt.status == 'failed')
                    {
                        $('#delete-athlete').text("Failed!").removeClass("btn-danger").addClass("btn-failure");
                        setTimeout(function () {
                            $('#delete-athlete').text("Delete Athlete").addClass("btn-danger").removeClass("btn-failure")
                        }, fadeTime);
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
                    fadeOutIn([$('#impossible-division'), $('#empty-division')], [], function () {
                        $addDivisionForm[0].reset();
                    });
                }
                else if(dt.status == 'noplayers')
                {
                    fadeOutIn([$('#impossible-division')], [$('#empty-division')]);
                    buttonRespondFail($('#add-division'));
                }
                else if(dt.status == 'badround')
                {
                    fadeOutIn([$('#empty-division')], [$('#impossible-division')]);
                    buttonRespondFail($('#add-division'));
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

    $('form[name="search-division"]').submit(function(event) {
        event.preventDefault();
        var searchFormElems = $('form[name="search-division"]')[0].elements;        
        var $moveForm = $('form[name="move-division"]');
        if($('#find-division').text() == "Find Another Division")
        {
            $('#find-division').text("Find Division");
            searchFormElems.division.disabled = false;
            searchFormElems.round.disabled = false;
            searchFormElems.genderMale.disabled = false;
            searchFormElems.genderFemale.disabled = false;
            $('form[name="search-division"]')[0].reset();
            $moveForm.fadeOut(fadeTime);
            $("#division-no-added").fadeOut(fadeTime);
            $("#division-no-found").fadeOut(fadeTime);
            $('#athleteDivision').fadeOut(fadeTime);
        }
        else
        {
            $.ajax({
                type: 'POST',
                dataType: "text",
                url: link + "lookupDivision.php",
                data: {
                    division: searchFormElems.division.value,
                    round: searchFormElems.round.value,
                    gender: searchFormElems.gender.value,
                },
                success: function(data) {
                    var dt = JSON.parse(data);
                    if(dt.status == 'success') 
                    {
                        $("#division-no-added").fadeOut(fadeTime);
                        $("#division-no-found").fadeOut(fadeTime);
                        $moveForm.fadeIn(fadeTime);
                        var info = dt.info;
                        searchFormElems.division.disabled = true;
                        searchFormElems.round.disabled = true;
                        searchFormElems.genderMale.disabled = true;
                        searchFormElems.genderFemale.disabled = true;
                        var moveFormElems = $moveForm[0].elements;
                        moveFormElems.ring.value = info.ring;
                        $('#find-division').text("Find Another Division");
                        if(info.athletes)
                        {
                            moveFormElems.numplay.value = info.athletes.length;
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
                            moveFormElems.numplay.value = 0;
                            $("#divisionTable").html("<h2>No Athletes in this Division</h2>");
                        }
                        $('#athleteDivision').fadeIn(fadeTime);
                    }
                    else if(dt.status == 'nosuchelement')
                    {
                        $("#division-no-added").fadeIn(fadeTime);
                        $("#division-no-found").fadeOut(fadeTime);
                        $moveForm.fadeOut(fadeTime)
                        $('#athleteDivision').fadeOut(fadeTime);
                    }
                    else if(dt.status == 'failed')
                    {
                        $("#division-no-added").fadeOut(fadeTime);
                        $("#division-no-found").fadeIn(fadeTime);
                        $moveForm.fadeOut(fadeTime)
                        $('#athleteDivision').fadeOut(fadeTime);
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


    $('form[name="move-division"]').submit(function(event) {
        var searchFormElems = $('form[name="search-division"]')[0].elements;        
        var moveFormElems = $('form[name="move-division"]')[0].elements;        
        event.preventDefault();
        $.ajax({
            type: 'POST',
            dataType: "text",
            url: link + "moveDivision.php",
            data: {
                ring: moveFormElems.ring.value,
                division: searchFormElems.division.value,
                round: searchFormElems.round.value,
                gender: searchFormElems.gender.value,
            },
            success: function(data) {
                var dt = JSON.parse(data);
                if(dt.status == 'success')
                {
                    buttonRespondSuccess($('#move-division'))
                    setTimeout(function () {
                        $('form[name="search-division"]')[0].reset();
                        $('form[name="move-division"]').fadeOut(fadeTime)[0].reset();
                        $('#athleteDivision').fadeOut(fadeTime, function() {
                            $('#divisionTable').html("");
                        });
                        $('#find-division').text("Find Division");
                        searchFormElems.division.disabled = false;
                        searchFormElems.round.disabled = false;
                        searchFormElems.genderMale.disabled = false;
                        searchFormElems.genderFemale.disabled = false;
                    }, 1500);
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
                        $('#remove-division').text("Success!").removeClass("btn-danger").addClass("btn-success");
                        setTimeout(function () {
                            $('#remove-division').text("Remove Division").addClass("btn-danger").removeClass("btn-success")
                            $('form[name="search-division"]')[0].reset();
                            $('form[name="move-division"]').fadeOut(fadeTime)[0].reset();
                            $('#athleteDivision').fadeOut(fadeTime);
                        }, 1500);
                    } 
                    else if(dt.status == 'failed') 
                    {
                        $('#remove-division').text("Failed!").removeClass("btn-danger").addClass("btn-failure");
                        setTimeout(function () {
                            $('#remove-division').text("Remove Division").addClass("btn-danger").removeClass("btn-failure")
                        }, 1500);
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

    $('form[name="record-score"]').submit(function(event) {
        event.preventDefault();
        var formElems = $('form[name="record-score"]')[0].elements;        
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
                    $('form[name="record-score"]')[0].reset();
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

    $('form[name="find-score-by-id"]').submit(function(event) {
        event.preventDefault();
        $("#athleteScores").fadeOut(fadeTime);
        $.ajax({
            type: 'POST',
            dataType: "text",
            url: link + "scoreById.php",
            data: {
                id: $('form[name="find-score-by-id"]')[0].elements.id.value,
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
