var link = "";
var fadeTime = 500;

function gender(int)
{
    switch(int)
    {
        case '1':
            return "Male";
        case '2':
            return "Female";
        default:
            return "";
    }
}

function division(int)
{
    switch(int)
    {
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

function round(int)
{
    switch(int)
    {
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

function make2dec(int)
{
    return Math.round(int * 100)/100;
}

function startPage(pageName)
{
    if(sessionStorage.allowed != "./" + pageName + ".html")
    {
        sessionStorage.removeItem("allowed");
        window.location.replace("./home.html");
    }
    
    link = localStorage.link;

    $.ajax({
        url: link + "verifysession.php",
        success: function(data) {
            if(data)
            {
                sessionStorage.removeItem("allowed");
                window.location.replace("./home.html");
            }
        },
        failure: ajaxFail
    });
}

function ajaxFail(e)
{
    alert("Failed to add with ajax:  " + JSON.stringify(e));
    console.log(e);
};

function populateAthleteInfo(formElems, player)
{
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
}

function scoreArrayToTable(scores)
{
    if(scores)
    {
        var tablebody = "";
        scores.forEach(function(score, index, array) {
            tablebody += '<tr>';
            tablebody += '<th scole="row">' + score.id + "</th>";
            tablebody += '<td>' + score.name + "</td>";
            tablebody += '<td>' + gender(score.gender) + "</td>";
            tablebody += '<td>' + division(score.division) + "</td>";
            tablebody += '<td>' + round(score.round) + "</td>";
            tablebody += '<td>' + score.judge + "</td>";
            tablebody += '<td>' + score.poomsae + "</td>";
            tablebody += '<td>' + score.score + "</td>";
            tablebody += '</tr>';
        });
        return tablebody;
    }
    else
    {
        return "<h2>No scores for given division</h2>";
    }
}

function fadeOutIn(fadeOut, fadeIn, afterFadeOut)
{
    if(!afterFadeOut)
    {
        afterFadeOut = function(){};
    }
    if(fadeOut && fadeIn)
    {
        fadeOut.forEach(function(toFadeOut) {
            toFadeOut.fadeOut(fadeTime);
        });
        fadeIn.forEach(function(toFadeIn) {
            toFadeIn.fadeOut(fadeTime);
        });
        setTimeout(function() {
            afterFadeOut();
            fadeIn.forEach(function(toFadeIn) {
                toFadeIn.fadeIn(fadeTime);
            });
        }, fadeTime);
    }
    else if(fadeIn)
    {
        fadeIn.forEach(function(toFadeIn) {
            toFadeIn.fadeOut(fadeTime);
        });
        setTimeout(function() {
            afterFadeOut();
            fadeIn.forEach(function(toFadeIn) {
                toFadeIn.fadeIn(fadeTime);
            });
        }, fadeTime);
    }
    else if(fadeOut)
    {
        fadeOut.forEach(function(toFadeOut) {
            toFadeOut.fadeOut(fadeTime);
        });
    }
}
