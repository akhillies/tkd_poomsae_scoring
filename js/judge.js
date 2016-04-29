if(sessionStorage.allowed != "./judge.html") {
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

$(function() {
    $("body").fadeIn(500);
    
    $('form[name="select-group"]').submit(function(event) {
        event.preventDefault();
        var formElems = $('form[name="select-group"]')[0].elements;
        $('#select-group').text("Gathering data...").removeClass("btn-primary").addClass("btn-info");
        $.ajax({
            type: 'POST',
            dataType: "text",
            url: link + "grabDivision.php",
            data: {
                ring: formElems.ring.value
            },
            success: function(data) {
                var dt = JSON.parse(data);
                if(dt.status == 'success') {
                    dt.info.judge = formElems.judge.value;
                    dt.info.poomsae = 1;
                    localStorage.info = JSON.stringify(dt.info);
                    localStorage.index = 0;
                    window.location.replace("../scorer/index.html");
                } else if(dt.status == 'failed') {
                    $('#select-group').text("Failed!").removeClass("btn-info").addClass("btn-failure");
                    setTimeout(function () {
                        $('#select-group').text("Select Group").addClass("btn-primary").removeClass("btn-failure")
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
