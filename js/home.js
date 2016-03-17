sessionStorage.removeItem("allowed");

var link = 'http://127.0.0.1:8888/php_files/';
var ajaxFail = function(e) {
                alert("Failed to add with ajax:  " + e);
                console.log(e);
            };
$(document).ready(function() {
    $('form[name="enter-pin"]').submit(function(event) {
        event.preventDefault();
        $.ajax({
            type: 'POST',
            dataType: "text",
            url: link + "pinRedirect.php",
            data: {
                pin: $('form[name="enter-pin"]')[0].elements.pin.value 
            },
            success: function(data) {
                var dt = JSON.parse(data);
                if(dt.status == 'success') {
                    if(dt.info.url == null) {
                        $("#enter-key").text("Invalid Key").removeClass("btn-primary").addClass("btn-failure");
                        setTimeout(function () {
                            $('#enter-key').text("Sign In").addClass("btn-primary").removeClass("btn-failure")
                        }, 1500);
                    } else {
                        localStorage.link = link;
                        sessionStorage.allowed = dt.info.url;
                        window.location.replace(dt.info.url);
                    }
                } else if(dt.status == 'failed') {
                    $("#enter-key").text("Invalid Key").removeClass("btn-primary").addClass("btn-failure");
                    setTimeout(function () {
                        $('#enter-key').text("Sign In").addClass("btn-primary").removeClass("btn-failure")
                    }, 1500);
                }else {
                    alert("went seriously wrong, got a bad response: " + data);
                }

            },
            error: ajaxFail
        });

    });
});
