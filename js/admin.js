if(sessionStorage.allowed != "./admin.html") {
    sessionStorage.removeItem("allowed");
    window.location.replace("./home.html");
}

var link = localStorage.link;
var ajaxFail = function(e) {
                alert("Failed to add with ajax:  " + JSON.stringify(e));
                console.log(e);
            };

$.ajax({
    url: link + "verifysession.php",
    success: function(data) {
        if(data) {
            sessionStorage.removeItem("allowed");
            window.location.replace("./home.html");
        }
    },
    failure: ajaxFail
});


var gender = function(int) {
    switch(int) {
        case '1':
            return "Male";
        case '2':
            return "Female";
        default:
            return "";
    }
}

var round = function(int) {
    switch(int) {
        case '1':
            return "Preliminaries";
        case '2':
            return "Semi-Finals";
        case '3':
            return "Finals";
        default:
            return "";
    }
};

var division = function(int) {
    switch(int) {
        case '1':
            return "Youth";
        case '2':
            return "Cadet";
        case '3':
            return "Junior";
        case '4':
            return "Senior 1";
        case '5':
            return "Senior 2";
        case '6':
            return "Master 1";
        case '7':
            return "Master 2";
        case '8':
            return "Master 3";
        defaut:
            return "";
    }    
};

$(function() {
    $("body").fadeIn(500);
    
    $('form[name="add-athlete"]').submit(function(event) {
        event.preventDefault();
        var formElems = $('form[name="add-athlete"]')[0].elements;
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
                school: formElems.school.value,
                division: formElems.division.value
            },
            success: function(data) {
                var dt = JSON.parse(data);
                if(dt.status == 'success') {
                    $('#add-athlete').text("Success!").removeClass("btn-primary").addClass("btn-success");
                    setTimeout(function () {
                        $('#add-athlete').text("Add Athelete").addClass("btn-primary").removeClass("btn-success")
                    }, 1500);
                    $('form[name="add-athlete"]')[0].reset();
                } else if(dt.status == 'failed') {
                    $('#add-athlete').text("Failed!").removeClass("btn-primary").addClass("btn-failure");
                    setTimeout(function () {
                        $('#add-athlete').text("Add Athelete").addClass("btn-primary").removeClass("btn-failure")
                    }, 1500);
                } else {
                    alert("add went seriously wrong, got a bad response: " + data);
                }
            },
            error: ajaxFail
        });
        return false;
    }); 

    $('form[name="search-athlete"]').submit(function(event) {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            dataType: "text",
            url: link + "get.php",
            data: {
                id: $('form[name="search-athlete"]')[0].elements.search.value 
            },
            success: function(data) {
                var dt = JSON.parse(data);
                if(dt.status == 'success') {
                    $("#player-no-exist").fadeOut(500);
                    $("#player-no-found").fadeOut(500);
                    var $form = $('form[name="edit-athlete"]').fadeIn(500);
                    var formElems = $form[0].elements;
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
                } else if(dt.status == 'nosuchelement') {
                    $("#player-no-exist").fadeIn(500);
                    $("#player-no-found").fadeOut(500);
                    $('form[name="edit-athlete"]').fadeOut(500)
                } else if(dt.status == 'failed') {
                    $("#player-no-exist").fadeOut(500);
                    $("#player-no-found").fadeIn(500);
                    $('form[name="edit-athlete"]').fadeOut(500)
                }else {
                    alert("get went seriously wrong, got a bad response: " + data);
                }

            },
            error: ajaxFail
        });

    });

    $('form[name="edit-athlete"]').submit(function(event) {
        event.preventDefault();
        var formElems = $('form[name="edit-athlete"]')[0].elements;
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
                if(dt.status == 'success') {
                    $('#edit-athlete').text("Success!").removeClass("btn-primary").addClass("btn-success");
                    setTimeout(function () {
                        $('#edit-athlete').text("Edit Athelete").addClass("btn-primary").removeClass("btn-success")
                        $('form[name="search-athlete"]')[0].reset();
                        $('form[name="edit-athlete"]')[0].reset();
                        $('form[name="edit-athlete"]').fadeOut(500);
                    }, 1500);
                } else if(dt.status == 'failed') {
                    $('#edit-athlete').text("Failed!").removeClass("btn-primary").addClass("btn-failure");
                    setTimeout(function () {
                        $('#edit-athlete').text("Edit Athelete").addClass("btn-primary").removeClass("btn-failure")
                    }, 1500);
                } else {
                    alert("add went seriously wrong, got a bad response: " + data);
                }
            },
            error: ajaxFail
        });
        return false;
    });

    $("#delete-athlete").click(function(e) {
        e.preventDefault();
        if(confirm("Are you sure you want to delete this athlete? This action cannot be taken back!")) {
            $.ajax({
                type: 'POST',
                dataType: "text",
                url: link + "delete.php",
                data: {
                    id: $('form[name="edit-athlete"]')[0].elements.id.value, 
                },
                success: function(data) {
                    var dt = JSON.parse(data);
                    if(dt.status == 'success') {
                        $('#delete-athlete').text("Deleted!").removeClass("btn-danger").addClass("btn-success");
                        setTimeout(function () {
                            $('#delete-athlete').text("Delete Athelete").addClass("btn-danger").removeClass("btn-success")
                            $('form[name="search-athlete"]')[0].reset();
                            $('form[name="edit-athlete"]')[0].reset();
                            $('form[name="edit-athlete"]').fadeOut(500);
                        }, 1500);
                    } else if(dt.status == 'failed') {
                        $('#delete-athlete').text("Failed!").removeClass("btn-danger").addClass("btn-failure");
                        setTimeout(function () {
                            $('#delete-athlete').text("Delete Athelete").addClass("btn-danger").removeClass("btn-failure")
                        }, 1500);
                    } else {
                        alert("add went seriously wrong, got a bad response: " + data);
                    }
                },
                error: ajaxFail
            });
        }
    });


    $('form[name="add-division"]').submit(function(event) {
        var formElems = $('form[name="add-division"]')[0].elements;        
        $('#impossible-division').fadeOut(500);
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
                console.log(dt.sql);
                if(dt.status == 'success') {
                    $('#add-division').text("Success!").removeClass("btn-primary").addClass("btn-success");
                    setTimeout(function () {
                        $('#add-division').text("Add Division").addClass("btn-primary").removeClass("btn-success")
                        $('form[name="add-division"]')[0].reset();
                    }, 1500);
                    
                } else if(dt.status == 'noplayers') {
                    $('#add-division').text("Division has no competitors!!!").removeClass("btn-primary").addClass("btn-failure");
                    setTimeout(function () {
                        $('#add-division').text("Add Division").addClass("btn-primary").removeClass("btn-failure")
                    }, 2500);
                } else if(dt.status == 'badround') {
                    $('#impossible-division').fadeIn(500);
                    $('#add-division').text("Failed!").removeClass("btn-primary").addClass("btn-failure");
                    setTimeout(function () {
                        $('#add-division').text("Add Division").addClass("btn-primary").removeClass("btn-failure");
                    }, 2500);
                } else if(dt.status == 'failed') {
                    $('#add-division').text("Failed!").removeClass("btn-primary").addClass("btn-failure");
                    setTimeout(function () {
                        $('#add-division').text("Add Division").addClass("btn-primary").removeClass("btn-failure");
                    }, 1500);
                } else {
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
        if($('#find-division').text() == "Find Another Division") {
            $('#find-division').text("Find Division");
            searchFormElems.division.disabled = false;
            searchFormElems.round.disabled = false;
            searchFormElems.genderMale.disabled = false;
            searchFormElems.genderFemale.disabled = false;
            $('form[name="search-division"]')[0].reset();
            $moveForm.fadeOut(500);
            $("#division-no-added").fadeOut(500);
            $("#division-no-found").fadeOut(500);
            $('#athleteDivision').fadeOut(500);
        } else {
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
                    if(dt.status == 'success') {
                        $("#division-no-added").fadeOut(500);
                        $("#division-no-found").fadeOut(500);
                        $moveForm.fadeIn(500);
                        var info = dt.info;
                        searchFormElems.division.disabled = true;
                        searchFormElems.round.disabled = true;
                        searchFormElems.genderMale.disabled = true;
                        searchFormElems.genderFemale.disabled = true;
                        var moveFormElems = $moveForm[0].elements;
                        moveFormElems.ring.value = info.ring;
                        $('#find-division').text("Find Another Division");
                        if(info.athletes) {
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
                        } else {
                            moveFormElems.numplay.value = 0;
                            $("#divisionTable").html("<h2>No Athletes in this Division</h2>");
                        }
                        $('#athleteDivision').fadeIn(500);
                    } else if(dt.status == 'nosuchelement') {
                        $("#division-no-added").fadeIn(500);
                        $("#division-no-found").fadeOut(500);
                        $moveForm.fadeOut(500)
                        $('#athleteDivision').fadeOut(500);
                    } else if(dt.status == 'failed') {
                        $("#division-no-added").fadeOut(500);
                        $("#division-no-found").fadeIn(500);
                        $moveForm.fadeOut(500)
                        $('#athleteDivision').fadeOut(500);
                    } else {
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
                if(dt.status == 'success') {
                    $('#move-division').text("Success!").removeClass("btn-primary").addClass("btn-success");
                    setTimeout(function () {
                        $('#move-division').text("Move Division").addClass("btn-primary").removeClass("btn-success")
                        $('form[name="search-division"]')[0].reset();
                        $('form[name="move-division"]').fadeOut(500)[0].reset();
                        $('#athleteDivision').fadeOut(500, function() {
                            $('#divisionTable').html("");
                        });
                        $('#find-division').text("Find Division");
                        searchFormElems.division.disabled = false;
                        searchFormElems.round.disabled = false;
                        searchFormElems.genderMale.disabled = false;
                        searchFormElems.genderFemale.disabled = false;
                    }, 1500);
                } else if(dt.status == 'failed') {
                    $('#move-division').text("Failed!").removeClass("btn-primary").addClass("btn-failure");
                    setTimeout(function () {
                        $('#move-division').text("Move Division").addClass("btn-primary").removeClass("btn-failure")
                    }, 1500);
                } else {
                    alert("add went seriously wrong, got a bad response: " + data);
                }
            },
            error: ajaxFail
        });
        return false;
    });

    $("#remove-division").click(function(e) {
        e.preventDefault();
        if(confirm("Are you sure you want to remove this division? There is no undo-ing this action!")) {
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
                    if(dt.status == 'success') {
                        $('#remove-division').text("Success!").removeClass("btn-danger").addClass("btn-success");
                        setTimeout(function () {
                            $('#remove-division').text("Remove Division").addClass("btn-danger").removeClass("btn-success")
                            $('form[name="search-division"]')[0].reset();
                            $('form[name="move-division"]').fadeOut(500)[0].reset();
                            $('#athleteDivision').fadeOut(500);
                        }, 1500);
                    } else if(dt.status == 'failed') {
                        $('#remove-division').text("Failed!").removeClass("btn-danger").addClass("btn-failure");
                        setTimeout(function () {
                            $('#remove-division').text("Remove Division").addClass("btn-danger").removeClass("btn-failure")
                        }, 1500);
                    } else {
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
                if(dt.status == 'success') {
                    $('#record-score').text("Success!").removeClass("btn-primary").addClass("btn-success");
                    setTimeout(function () {
                        $('#record-score').text("Record Score").addClass("btn-primary").removeClass("btn-success")
                    }, 1500);
                    $('form[name="record-score"]')[0].reset();
                } else if(dt.status == 'failed') {
                    $('#record-score').text("Failed!").removeClass("btn-primary").addClass("btn-failure");
                    setTimeout(function () {
                        $('#record-score').text("Record Score").addClass("btn-primary").removeClass("btn-failure")
                    }, 1500);
                } else {
                    alert("get went seriously wrong, got a bad response: " + data);
                }

            },
            error: ajaxFail
        });
    });

    $('form[name="find-score-by-id"]').submit(function(event) {
        event.preventDefault();
        $("#athleteScores").fadeOut(500);
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
                    $('form[name="change-score"]').fadeIn(500);
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
                console.log(dt.sql);
                if(dt.status == 'success') {
                    $('#score-by-division').text("Success!").removeClass("btn-primary").addClass("btn-success");
                    setTimeout(function () {
                        $('#score-by-division').text("Get Scores").addClass("btn-primary").removeClass("btn-success")
                    }, 1500);
                    if(dt.info) {
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
                    } else {
                        $("#scoresTable").html("<h2>No scores for given division</h2>");
                    }
                    $("#athleteScores").fadeIn(500);
                    $('form[name="change-score"]').fadeIn(500);
                } else if(dt.status == 'failed') {
                    $('#score-by-division').text("Failed!").removeClass("btn-primary").addClass("btn-failure");
                    setTimeout(function () {
                        $('#score-by-division').text("Get Scores").addClass("btn-primary").removeClass("btn-failure")
                    }, 1500);
                } else {
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
                if(dt.status == 'success') {
                    $('#change-score').text("Success!").removeClass("btn-primary").addClass("btn-success");
                    setTimeout(function () {
                        $('#change-score').text("Change Score").addClass("btn-primary").removeClass("btn-success")
                    }, 1500);
                    $('form[name="change-score"]')[0].reset();
                } else if(dt.status == 'failed') {
                    $('#change-score').text("Failed!").removeClass("btn-primary").addClass("btn-failure");
                    setTimeout(function () {
                        $('#change-score').text("Change Score").addClass("btn-primary").removeClass("btn-failure")
                    }, 1500);
                } else {
                    alert("get went seriously wrong, got a bad response: " + data);
                }

            },

            error: ajaxFail
        });
    });

    $("#delete-score").click(function(e) {
        e.preventDefault();
        if(confirm("Are you sure you want to delete this score? This action cannot be undone!")) {
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
                    if(dt.status == 'success') {
                        $('#delete-score').text("Success!").removeClass("btn-danger").addClass("btn-success");
                        setTimeout(function () {
                            $('#delete-score').text("Delete Score").addClass("btn-danger").removeClass("btn-success")
                        }, 1500);
                        $('form[name="change-score"]')[0].reset();
                    } else if(dt.status == 'failed') {
                        $('#delete-score').text("Failed!").removeClass("btn-danger").addClass("btn-failure");
                        setTimeout(function () {
                            $('#delete-score').text("Delete Score").addClass("btn-danger").removeClass("btn-failure")
                        }, 1500);
                    } else {
                        alert("get went seriously wrong, got a bad response: " + data);
                    }

                },
                error: ajaxFail
            });
        }
    });
});
