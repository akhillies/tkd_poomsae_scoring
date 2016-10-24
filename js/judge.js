startPage("judge");

$(function() {
    $("body").fadeIn(fadeTime);
   
    var $selectGroupForm = $('form[name="select-group"]');
    $selectGroupForm.submit(function(event) {
        event.preventDefault();
        var formElems = $selectGroupForm[0].elements;
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
                if(dt.status == 'success')
                {
                    dt.info.judge = formElems.judge.value;
                    dt.info.poomsae = 1;
                    localStorage.info = JSON.stringify(dt.info);
                    localStorage.index = 0;
                    window.location.replace("../scorer/index.html");
                }
                else if(dt.status == 'failed')
                {
                    buttonRespondFail($('#select-group'), function() {
                        $('#select-group').text("Select Group").removeClass("btn-info").addClass("btn-primary");
                    }, "info");
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

});
