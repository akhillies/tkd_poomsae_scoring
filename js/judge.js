if(sessionStorage.allowed != "./judge.html") {
    sessionStorage.removeItem("allowed");
    window.location.replace("./home.html");
}

var link = localStorage.link;
var ajaxFail = function(e) {
                alert("Failed to add with ajax:  " + e);
                console.log(e);
            };
var test;
$(function() {
    $('form[name="select-group"]').submit(function(event) {
        event.preventDefault();
        var formElems = $('form[name="select-group"]')[0].elements;
        $('#select-group').text("Gathering data...").removeClass("btn-primary").addClass("btn-success");
        $.ajax({
            type: 'POST',
            dataType: "text",
            url: link + "lookupDivision.php",
            data: {
                gender: formElems.gender.value,
                round: formElems.round.value,
                division: formElems.division.value
            },
            success: function(data) {
                var dt = JSON.parse(data);
                if(dt.status == 'success') {
                    dt.info.judge = formElems.judge.value;
                    dt.info.poomsae = formElems.poomsae.value;
                    localStorage.info = JSON.stringify(dt.info);
                    test = dt.info;
                    window.location.replace("./sport_poomsae/personal/index.html");
                } else if(dt.status == 'failed') {
                    $('#select-group').text("Failed!").removeClass("btn-primary").addClass("btn-failure");
                    setTimeout(function () {
                        $('#add-athlete').text("Select Group").addClass("btn-primary").removeClass("btn-failure")
                    }, 1500);
                } else {
                    alert("add went seriously wrong, got a bad response: " + data);
                }
            },
            error: ajaxFail
        });
        return false;
    }); 

});
