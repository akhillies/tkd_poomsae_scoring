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
			

            var updateMajorDisp = function()
            {
                //console.log("updated major disp");
                $(".everything #majorcount").html(major);
            }

            var updateMinorDisp = function()
            {
                //console.log("updated minor disp")
                $(".everything #minorcount").html(minor); 
            }

            var updatePres = function()
            {
                presScore = (spd + str + eng);
                $(".everything #presscore").html(presScore.toFixed(1));
                updateTotal();
                if(presScore >= 1.5 && spd >= 0.5 && str >= 0.5 && eng >= 0.5)
                {
                    $(".everything #scoresubmit").removeAttr("disabled");
                }
            }

            var updateAccScore = function()
            {
                //console.log("updated acc score");
                accScore = Math.max(0, 4 - 0.1 * minor - 0.3 * major);
                $(".everything #accscore").html(accScore.toFixed(1)); 
                updateTotal();
            }

            var updateTotal = function()
            {
                totalScore = presScore + accScore;
                $(".everything #totalscore").html(totalScore.toFixed(1));
                $(".everything #finalscore").html(totalScore.toFixed(1));
            }
			

            return {
                addMinor: function() 
                {
                    //console.log("added minor");
                	minor += 1;
                	updateAccScore();
                    updateMinorDisp();
                    $(".everything #undominorbutton").removeAttr("disabled");
                },
                subMinor: function()
                {
                    //console.log("subbed minor");
                    if (minor > 0) {
                        minor -= 1;
                        updateAccScore();
                        updateMinorDisp();
                    }
                    if(minor <= 0)
                    {
                        $(".everything #undominorbutton").attr("disabled", true);
                    }
                },
                addMajor: function() 
                {
                    //console.log("added Major");
                	major += 1;
                    updateAccScore();
                    updateMajorDisp();
                    $(".everything #undomajorbutton").removeAttr("disabled");
                },
                subMajor: function()
                {
                    //console.log("subbed Major");
                    if (major > 0) {
                        major -= 1;
                        updateAccScore();
                        updateMajorDisp();
                    }
                    if(major <= 0)
                    {
                        $(".everything #undomajorbutton").attr("disabled", true);
                    }
                },
                updateSpeed: function(dombutton)
                {
                    var id = "speed" + (spd*10).toString();
                    $(".everything #" + id).removeClass("active");
                    spd = parseFloat(grabValue(dombutton.innerHTML));
                    $(".everything #speednum").html(spd.toFixed(1));
                    updatePres();
                },
                updateStrength: function(dombutton)
                {
                    var id = "strength" + (str*10).toString();
                    $(".everything #" + id).removeClass("active");
                    str = parseFloat(grabValue(dombutton.innerHTML));
                    $(".everything #strengthnum").html(str.toFixed(1));
                    updatePres();
                },
                updateEnergy: function(dombutton)
                {
                    var id = "energy" + (eng*10).toString();
                    $(".everything #" + id).removeClass("active");
                    eng = parseFloat(grabValue(dombutton.innerHTML));
                    $(".everything #energynum").html(eng.toFixed(1));
                    updatePres();
                },
				resetScore: function()
				{
					minor = 0;
            		major = 0;
                    updateMajorDisp();
					updateMinorDisp();

                    var id = "speed" + (spd*10).toString();
                    $(".everything #" + id).removeClass("active");
                    spd = 0.0;
                    $(".everything #speednum").html(spd.toFixed(1));
                    id = "strength" + (str*10).toString();
                    $(".everything #" + id).removeClass("active");
                    str = 0.0;
                    $(".everything #strengthnum").html(str.toFixed(1));
                    id = "energy" + (eng*10).toString();
                    $(".everything #" + id).removeClass("active");
                    eng = 0.0;
                    $(".everything #energynum").html(eng.toFixed(1));

					updateAccScore();
					updatePres();

                    $(".everything #submitscore").modal("hide");

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
        
            $(".everything #majorbutton").click(that.updater.addMajor);
            $(".everything #minorbutton").click(that.updater.addMinor);
            $(".everything #undomajorbutton").click(that.updater.subMajor);
            $(".everything #undominorbutton").click(that.updater.subMinor);
			$(".everything #resetbutton").click(that.updater.resetScore);
            
            $(".everything .speedin").click(function()
			{
				that.updater.updateSpeed(this);
			});
            $(".everything .strengthin").click(function()
			{
				that.updater.updateStrength(this);
			});
            $(".everything .energyin").click(function()
			{
				that.updater.updateEnergy(this);
			});

            $(".everything #scoresubmit").click(that.updater.updateSubmit);
        });
