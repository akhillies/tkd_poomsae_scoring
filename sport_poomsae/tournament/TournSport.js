var that = this;

var updater = (function()
        {
            var minor = 0;
            var major = 0;
            var spd = 0.0;
            var str = 0.0;
            var eng = 0.0;
            var presScore = 0.0;
            var accScore = 4.0;
            var totalScore = 4.0;

            var grabValue = function(html)
            {
                txt = html.trim()
                var len = txt.length;
                return txt.substring(len - 3);
            }
			

            var updateMajorDisp = function(i)
            {
                //console.log("updated major disp");
                major = Math.max(major + i, 0);
                $("#majorcount").html(major);
                if(major <= 0)
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
                minor = Math.max(minor + i, 0);
                $("#minorcount").html(minor); 
                if(minor <= 0)
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
                presScore = (spd + str + eng);
                $("#presscore").html(presScore.toFixed(1));
                updateTotal();
                if(presScore >= 1.5 && spd >= 0.5 && str >= 0.5 && eng >= 0.5)
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
                accScore = Math.max(0, 4 - 0.1 * minor - 0.3 * major);
                $("#accscore").html(accScore.toFixed(1)); 
                updateTotal();
            }

            var updateTotal = function()
            {
                totalScore = presScore + accScore;
                $("#totalscore").html(totalScore.toFixed(1));
                $("#finalscore").html(totalScore.toFixed(1));
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
                    var id = "speed" + (spd*10).toString();
                    $("#" + id).removeClass("active");
                    spd = parseFloat(grabValue(dombutton.innerHTML));
                    $("#speednum").html(spd.toFixed(1));
                    updatePres();
                },
                updateStrength: function(dombutton)
                {
                    var id = "strength" + (str*10).toString();
                    $("#" + id).removeClass("active");
                    str = parseFloat(grabValue(dombutton.innerHTML));
                    $("#strengthnum").html(str.toFixed(1));
                    updatePres();
                },
                updateEnergy: function(dombutton)
                {
                    var id = "energy" + (eng*10).toString();
                    $("#" + id).removeClass("active");
                    eng = parseFloat(grabValue(dombutton.innerHTML));
                    $("#energynum").html(eng.toFixed(1));
                    updatePres();
                },


                updatePoomName: function(dombutton)
                {
                    $("#poomsae-name").html(dombutton.innerHTML);
                },
            
				resetScore: function()
				{
					minor = 0;
            		major = 0;
                    updateMajorDisp(0);
					updateMinorDisp(0);

                    var id = "speed" + (spd*10).toString();
                    $("#" + id).removeClass("active");
                    spd = 0.0;
                    $("#speednum").html(spd.toFixed(1));
                    id = "strength" + (str*10).toString();
                    $("#" + id).removeClass("active");
                    str = 0.0;
                    $("#strengthnum").html(str.toFixed(1));
                    id = "energy" + (eng*10).toString();
                    $("#" + id).removeClass("active");
                    eng = 0.0;
                    $("#energynum").html(eng.toFixed(1));
					updatePres();

                    $("#submitscore").modal("hide");

                    //location.reload();
				},
                updateSubmit: function()
                {
                    if(presScore < 1.5 || spd < 0.5 || str < 0.5 || eng < 0.5)
                    {
                        alert("Please enter a valid Presentation score");
                    }
                }
            };
        })();


$(document).ready(function()
        {
        
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
