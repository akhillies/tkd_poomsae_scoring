if(sessionStorage.allowed != "./ringleader.html") {
    sessionStorage.removeItem("allowed");
    window.location.replace("./home.html");
}

var link = localStorage.link;
var ajaxFail = function(e) {
                alert("Failed to add with ajax:  " + e);
                console.log(e);
            };

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
                    var $form = $('form[name="view-athlete"]').fadeIn(500);
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
                    $('form[name="view-athlete"]').fadeOut(500)
                } else if(dt.status == 'failed') {
                    $("#player-no-exist").fadeOut(500);
                    $("#player-no-found").fadeIn(500);
                    $('form[name="view-athlete"]').fadeOut(500)
                }else {
                    alert("get went seriously wrong, got a bad response: " + data);
                }

            },
            error: ajaxFail
        });

    });

    $('form[name="select-division"]').submit(function(event) {
        event.preventDefault();
        var searchFormElems = $('form[name="select-division"]')[0].elements;        
        if($('#select-division').text() == "Select Another Division") {
            $('#select-division').text("Select Division");
            searchFormElems.ring.disabled = false;
            searchFormElems.division.disabled = false;
            searchFormElems.round.disabled = false;
            searchFormElems.genderMale.disabled = false;
            searchFormElems.genderFemale.disabled = false;
            $('form[name="select-division"]')[0].reset();
            $("#division-no-added").fadeOut(500);
            $("#division-no-found").fadeOut(500);
            $('#athleteDivision').fadeOut(500);
        } else {
            $("#division-no-added").fadeOut(500);
            $("#division-no-found").fadeOut(500);
            $('#athleteDivision').fadeOut(500);
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
                        searchFormElems.ring.disabled = true;
                        searchFormElems.division.disabled = true;
                        searchFormElems.round.disabled = true;
                        searchFormElems.genderMale.disabled = true;
                        searchFormElems.genderFemale.disabled = true;
                        $("#division-no-added").fadeOut(500);
                        $("#division-no-found").fadeOut(500);
                        $("#athlete-division").fadeOut(500);
                        var info = dt.info;
                        $('#select-division').text("Select Another Division");
                        if(info.athletes) {
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

                                var id = "ordering" + index;
                                tablebody += '<td>' + '<div class="form-group"><label class="sr-only" for="' + id + '">Order</label><input id="' + id + '" name="' + athlete.id + '" type="number" class="form-control input-sm priority" value=' + athlete.priority + ' placeholder=0 required></div>' + "</td>";
                            
                                tablebody += '</tr>';
                            });
                            $("#divisionTable").html(tablebody);
                        } else {
                            $("#divisionTable").html("<h2>No Athletes in this Division</h2>");
                        }
                        $('#athleteDivision').fadeIn(500);
                    } else if(dt.status == 'nosuchelement') {
                        $("#division-no-added").fadeIn(500);
                        $("#division-no-found").fadeOut(500);
                        $('#athleteDivision').fadeOut(500);
                    } else if(dt.status == 'failed') {
                        $("#division-no-added").fadeOut(500);
                        $("#division-no-found").fadeIn(500);
                        $('#athleteDivision').fadeOut(500);
                    } else {
                        alert("get went seriously wrong, got a bad response: " + data);
                    }

                },
                error: ajaxFail
            });
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
            var formElems = $('form[name="select-division"]')[0].elements;
            $.ajax({
                type: 'POST',
                dataType: "text",
                url: link + "setNextDivision.php",
                data: {
                    ring: formElems.ring.value,
                    division: formElems.division.value,
                    round: formElems.round.value,
                    gender: formElems.gender.value,
                    orderings: Array.from(orderings),
                    ids: Array.from(ids)
                },
                success: function(data) {
                    var dt = JSON.parse(data);
                    if(dt.status == 'success') {
                        $('#set-division').text("Success!").removeClass("btn-warning").addClass("btn-success");
                        setTimeout(function () {
                            $('#select-division').text("Select Division");
                            $('#set-division').text("Set as next Division").addClass("btn-warning").removeClass("btn-success")
                            $('form[name="select-division"]')[0].reset();
                            $('#athleteDivision').fadeOut(500, function() {
                                $('#divisionTable').html("");
                            });
                        }, 1500);
                        var searchForm = $('form[name="select-division"]')[0];        
                        searchForm.elements.ring.disabled = false;
                        searchForm.elements.division.disabled = false;
                        searchForm.elements.round.disabled = false;
                        searchForm.elements.genderMale.disabled = false;
                        searchForm.elements.genderFemale.disabled = false;
                        searchForm.reset();
                    } else if(dt.status == 'failed') {
                        $('#set-division').text("Failed!").removeClass("btn-warning").addClass("btn-failure");
                        setTimeout(function () {
                            $('#set-division').text("Set as next Division").addClass("btn-warning").removeClass("btn-failure")
                        }, 1500);
                    } else {
                        alert("add went seriously wrong, got a bad response: " + data);
                    }
                },
                error: ajaxFail
            });
        } else {
            $('#set-division').text("Need Unique Numbers!!").removeClass("btn-warning").addClass("btn-failure");
            setTimeout(function () {
                $('#set-division').text("Set as next Division").addClass("btn-warning").removeClass("btn-failure")
            }, 2500);
        }
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
});

