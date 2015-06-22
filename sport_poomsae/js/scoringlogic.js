window.onload=$(function()
    {
        FastClick.attach(document.body);
    });

var that = this;

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
        $("#finalscore").html(that.scores.totalScore.toFixed(1));
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

        updatePoomName: function(dombutton)
        {
            $("#poomsae-name").html(dombutton.innerHTML);
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

            //location.reload();
        },
        updateSubmit: function()
        {
            if(that.scores.presScore < 1.5 || that.scores.spd < 0.5 || that.scores.str < 0.5 || that.scores.eng < 0.5)
            {
                alert("Please enter a valid Presentation score.");
            }
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
    //provision for a window.matchMedia method here; no need for it at this moment
    
    // Enter key now removes focus from athlete-name box
    $(window).keydown(function(event)
        {
            if(event.keyCode == 13) {
                event.preventDefault();
                $('.athlete-name').blur();
                return false;
            }
        });

    $("#majorbutton").click(that.updater.addMajor);
    $("#minorbutton").click(that.updater.addMinor);
    $("#undomajorbutton").click(that.updater.subMajor);
    $("#undominorbutton").click(that.updater.subMinor);
    $("#resetbutton").click(that.updater.resetScore);

    $("#scoresubmit").click(that.updater.updateSubmit);

    
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

    $(".poom-names").click(function()
    {
        that.updater.updatePoomName(this);
    });
});
