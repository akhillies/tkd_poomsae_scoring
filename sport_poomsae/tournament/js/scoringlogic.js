window.onload=$(function()
    {
        FastClick.attach(document.body);
    });

var that = this;
var link = localStorage.link;
var info = JSON.parse(localStorage.info);
var ind = 0;
var scores = {
    minor: 0,
    major: 0,
    spd: 0.0,
    str: 0.0,
    eng: 0.0,
    presScore: 0.0,
    accScore: 4.0,
    totalScore: 4.0
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

var updater = (function ()
{

    var grabValue = function(html)
    {
        var txt = html.trim()
        return txt.substring(txt.length - 3);
    }

    var updateMajorDisp = function(i)
    {
        //console.log("updated major disp");
        that.scores.major = Math.max(that.scores.major + i, 0);
        $("#majorcount").html(that.scores.major);
        if(that.scores.major <= 0)
        {
            $("#undomajorbutton").attr("disabled", true);
        }
        else
        {
            $("#undomajorbutton").removeAttr("disabled");
        }

        updateAccScore();
    }

    var updateMinorDisp = function(i)
    {
        //console.log("updated minor disp")
        that.scores.minor = Math.max(that.scores.minor + i, 0);
        $("#minorcount").html(that.scores.minor); 
        if(that.scores.minor <= 0)
        {
            $("#undominorbutton").attr("disabled", true);
        }
        else
        {
            $("#undominorbutton").removeAttr("disabled");
        }

        updateAccScore();
    }

    var updatePres = function()
    {
        that.scores.presScore = (that.scores.spd + that.scores.str + that.scores.eng);
        $("#presscore").html(that.scores.presScore.toFixed(1));
        updateTotal();
        if(that.scores.presScore >= 1.5 && that.scores.spd >= 0.5 && that.scores.str >= 0.5 && that.scores.eng >= 0.5)
        {
            $("#scoresubmit").removeAttr("disabled");
        }
        else
        {
            $("#scoresubmit").attr("disabled", true);
        }
    }

    var updateAccScore = function()
    {
        //console.log("updated acc score");
        that.scores.accScore = Math.max(0, 4 - 0.1 * that.scores.minor - 0.3 * that.scores.major);
        $("#accscore").html(that.scores.accScore.toFixed(1)); 
        updateTotal();
    }

    var updateTotal = function()
    {
        that.scores.totalScore = that.scores.presScore + that.scores.accScore;
        $("#totalscore").html(that.scores.totalScore.toFixed(1));
        $("#finaltotal").html(that.scores.totalScore.toFixed(1));
        localStorage.setItem('scores', JSON.stringify(that.scores));
    }

    return {
        addMinor: function() 
        {
            //console.log("added minor");
            updateMinorDisp(1);
        },
        subMinor: function()
        {
            //console.log("subbed minor");
            updateMinorDisp(-1);
        },
        addMajor: function() 
        {
            //console.log("added Major");
            updateMajorDisp(1);
        },
        subMajor: function()
        {
            //console.log("subbed Major");
            updateMajorDisp(-1);
        },
        updateSpeed: function(dombutton)
        {
            var id = "speed" + (that.scores.spd*10).toString();
            $("#" + id).removeClass("active");
            that.scores.spd = parseFloat(grabValue(dombutton.innerHTML));
            $("#speednum").html(that.scores.spd.toFixed(1));
            updatePres();
        },
        updateStrength: function(dombutton)
        {
            var id = "strength" + (that.scores.str*10).toString();
            $("#" + id).removeClass("active");
            that.scores.str = parseFloat(grabValue(dombutton.innerHTML));
            $("#strengthnum").html(that.scores.str.toFixed(1));
            updatePres();
        },
        updateEnergy: function(dombutton)
        {
            var id = "energy" + (that.scores.eng*10).toString();
            $("#" + id).removeClass("active");
            that.scores.eng = parseFloat(grabValue(dombutton.innerHTML));
            $("#energynum").html(that.scores.eng.toFixed(1));
            updatePres();
        },

        restoreScore: function()
        {
            updateMajorDisp(0);
            updateMinorDisp(0);

            var id = "speed" + (that.scores.spd*10).toString();
            $("#" + id).addClass("active");
            $("#speednum").html(that.scores.spd.toFixed(1));
            id = "strength" + (that.scores.str*10).toString();
            $("#" + id).addClass("active");
            $("#strengthnum").html(that.scores.str.toFixed(1));
            id = "energy" + (that.scores.eng*10).toString();
            $("#" + id).addClass("active");
            $("#energynum").html(that.scores.eng.toFixed(1));
            updatePres();
        },

        resetScore: function()
        {
            that.scores.minor = 0;
            that.scores.major = 0;
            updateMajorDisp(0);
            updateMinorDisp(0);

            var id = "speed" + (that.scores.spd*10).toString();
            $("#" + id).removeClass("active");
            that.scores.spd = 0.0;
            $("#speednum").html(that.scores.spd.toFixed(1));
            id = "strength" + (that.scores.str*10).toString();
            $("#" + id).removeClass("active");
            that.scores.str = 0.0;
            $("#strengthnum").html(that.scores.str.toFixed(1));
            id = "energy" + (that.scores.eng*10).toString();
            $("#" + id).removeClass("active");
            that.scores.eng = 0.0;
            $("#energynum").html(that.scores.eng.toFixed(1));
            updatePres();
            
            localStorage.setItem('scores', JSON.stringify(that.scores));

            $("#submitscore").modal("hide");
            if(ind >= info.athletes.length) {
                window.location.href = "../../html/judge.html"
            }
            //location.reload();
        },
        updateSubmit: function()
        {
            if(that.scores.presScore < 1.5 || that.scores.spd < 0.5 || that.scores.str < 0.5 || that.scores.eng < 0.5)
            {
                alert("Please enter a valid Presentation score.");
            }
            else{
                $("#finalpres").html(that.scores.presScore.toFixed(1));
                $("#finalacc").html(that.scores.accScore.toFixed(1));

                $.ajax({
                    type: 'POST',
                    dataType: "text",
                    url: link + "recordScore.php",
                    data: {
                        id: that.info.athletes[ind].id,
                        judge: that.info.judge,
                        poomsae: that.info.poomsae,
                        score: that.scores.totalScore,
                    },
                    success: function(data) {
                        var dt = JSON.parse(data);
                        if(dt.status == 'success') {
                            localStorage.index = ++ind;
                            that.updater.updatePlayer();
                        } else {
                            alert("Failed to record score: " + JSON.stringify(data));
                        }

                    },
                    error: function(data) {
                        alert("something went seriously wrong, got a bad response: " + JSON.stringify(data));
                    }
                });

            }
        },
        updatePlayer: function() {
            var name = that.info.athletes[ind].fname + " " + that.info.athletes[ind].lname;
            $("#athlete-name").html(name);
        }
    };
})();


$(document).ready(function()
{
    var scor = localStorage.getItem('scores');
    if(scor)
    {
        that.scores = JSON.parse(scor);
        that.updater.restoreScore();
    }
    else
    {
        localStorage.setItem('scores', JSON.stringify(that.scores));
    }

    ind = localStorage.index;
    if(!ind) {
        ind = 0;
    }
    
    $("#majorbutton").click(that.updater.addMajor);
    $("#minorbutton").click(that.updater.addMinor);
    $("#undomajorbutton").click(that.updater.subMajor);
    $("#undominorbutton").click(that.updater.subMinor);
    $("#resetplayer").click(that.updater.resetScore);
    $("#resetbutton").click(that.updater.resetScore);
    $("#scoresubmit").click(that.updater.updateSubmit);

    $("#judge-num").html(info.judge)
    $("#division").html(gender(info.gender) + " " + division(info.division) + " " + round(info.round));
    that.updater.updatePlayer();
    
    $(".speedin").click(function()
    {
        that.updater.updateSpeed(this);
    });
    $(".strengthin").click(function()
    {
        that.updater.updateStrength(this);
    });
    $(".energyin").click(function()
    {
        that.updater.updateEnergy(this);
    });
});
