var link = 'http://127.0.0.1:8888/php_files/';

$(function() {
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
                    var info = dt.info;
                    $('#add-athlete').text("Success!").removeClass("btn-primary").addClass("btn-success");
                    setTimeout(function () {
                        $('#add-athlete').text("Add Athelete").addClass("btn-primary").removeClass("btn-success")
                    }, 1500);
                    $('form[name="add-athelete"]').reset();
                    
                    $('#res_id').text(info.id);
                    $('#res_fname').text(info.fname);
                    $('#res_mname').text(info.mname);
                    $('#res_lname').text(info.lname);
                    $('#res_age').text(info.age);
                    $('#res_division').text(info.division);
                    if(info.gender == 1) {
                        $('#res_gender').text("Male");
                    } else {
                        $('#res_gender').text("Female");
                    }
                    $('#res_school').text(info.school);
                    $('#res_round').text(info.round);
                    $('#res_belt').text(info.belt);

                } else if(dt.status == 'failed') {
                    $('#add-athlete').text("Failed!").removeClass("btn-primary").addClass("btn-failure");
                    setTimeout(function () {
                        $('#add-athlete').text("Add Athelete").addClass("btn-primary").removeClass("btn-failure")
                    }, 1500);
                } else {
                    alert("add went seriously wrong, got a bad response: " + data);
                }
            },
            error: function(e) {
                alert("Failed to add with ajax:  " + e);
                console.log(e);
            }

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
                id: $('form[name="search-athlete"]')[0].elements.search.value, 
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
            error: function(e) {
                alert("Failed to get with ajax:  " + e);
                console.log(e);
            }
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
                    var info = dt.info;
                    $('#edit-athlete').text("Success!").removeClass("btn-primary").addClass("btn-success");
                    setTimeout(function () {
                        $('#edit-athlete').text("Edit Athelete").addClass("btn-primary").removeClass("btn-success")
                        $('form[name="edit-athlete"]').fadeOut(500);
                        $('form[name="edit-athlete"]')[0].reset();
                    }, 1500);
                    
                    // $('#res_id').text(info.id);
                    // $('#res_fname').text(info.fname);
                    // $('#res_mname').text(info.mname);
                    // $('#res_lname').text(info.lname);
                    // $('#res_age').text(info.age);
                    // $('#res_division').text(info.division);
                    // if(info.gender == 1) {
                    //     $('#res_gender').text("Male");
                    // } else {
                    //     $('#res_gender').text("Female");
                    // }
                    // $('#res_school').text(info.school);
                    // $('#res_round').text(info.round);
                    // $('#res_belt').text(info.belt);

                } else if(dt.status == 'failed') {
                    $('#edit-athlete').text("Failed!").removeClass("btn-primary").addClass("btn-failure");
                    setTimeout(function () {
                        $('#edit-athlete').text("Edit Athelete").addClass("btn-primary").removeClass("btn-failure")
                    }, 1500);
                } else {
                    alert("add went seriously wrong, got a bad response: " + data);
                }
            },
            error: function(e) {
                alert("Failed to add with ajax:  " + e);
                console.log(e);
            }

        });
        return false;
    }); 

});
