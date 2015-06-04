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
                $(".sportpoom #majorcount").html(major);
            }

            var updateMinorDisp = function()
            {
                //console.log("updated minor disp")
                $(".sportpoom #minorcount").html(minor); 
            }

            var updatePres = function()
            {
                presScore = (spd + str + eng);
                $(".sportpoom #presscore").html(presScore.toFixed(1));
                updateTotal();
                if(presScore >= 1.5 && spd >= 0.5 && str >= 0.5 && eng >= 0.5)
                {
                    $(".sportpoom #scoresubmit").removeAttr("disabled");
                }
            }

            var updateAccScore = function()
            {
                //console.log("updated acc score");
                accScore = Math.max(0, 4 - 0.1 * minor - 0.3 * major);
                $(".sportpoom #accscore").html(accScore.toFixed(1)); 
                updateTotal();
            }

            var updateTotal = function()
            {
                totalScore = presScore + accScore;
                $(".sportpoom #totalscore").html(totalScore.toFixed(1));
                $(".sportpoom #finalscore").html(totalScore.toFixed(1));
            }
			

            return {
                addMinor: function() 
                {
                    //console.log("added minor");
                	minor += 1;
                	updateAccScore();
                    updateMinorDisp();
                    $(".sportpoom #undominorbutton").removeAttr("disabled");
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
                        $(".sportpoom #undominorbutton").attr("disabled", true);
                    }
                },
                addMajor: function() 
                {
                    //console.log("added Major");
                	major += 1;
                    updateAccScore();
                    updateMajorDisp();
                    $(".sportpoom #undomajorbutton").removeAttr("disabled");
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
                        $(".sportpoom #undomajorbutton").attr("disabled", true);
                    }
                },
                updateSpeed: function(dombutton)
                {
                    var id = "speed" + (spd*10).toString();
                    $(".sportpoom #" + id).removeClass("active");
                    spd = parseFloat(grabValue(dombutton.innerHTML));
                    $(".sportpoom #speednum").html(spd.toFixed(1));
                    updatePres();
                },
                updateStrength: function(dombutton)
                {
                    var id = "strength" + (str*10).toString();
                    $(".sportpoom #" + id).removeClass("active");
                    str = parseFloat(grabValue(dombutton.innerHTML));
                    $(".sportpoom #strengthnum").html(str.toFixed(1));
                    updatePres();
                },
                updateEnergy: function(dombutton)
                {
                    var id = "energy" + (eng*10).toString();
                    $(".sportpoom #" + id).removeClass("active");
                    eng = parseFloat(grabValue(dombutton.innerHTML));
                    $(".sportpoom #energynum").html(eng.toFixed(1));
                    updatePres();
                },
				resetScore: function()
				{
					minor = 0;
            		major = 0;
                    updateMajorDisp();
					updateMinorDisp();

                    var id = "speed" + (spd*10).toString();
                    $(".sportpoom #" + id).removeClass("active");
                    spd = 0.0;
                    $(".sportpoom #speednum").html(spd.toFixed(1));
                    id = "strength" + (str*10).toString();
                    $(".sportpoom #" + id).removeClass("active");
                    str = 0.0;
                    $(".sportpoom #strengthnum").html(str.toFixed(1));
                    id = "energy" + (eng*10).toString();
                    $(".sportpoom #" + id).removeClass("active");
                    eng = 0.0;
                    $(".sportpoom #energynum").html(eng.toFixed(1));

					updateAccScore();
					updatePres();

                    $(".sportpoom #submitscore").modal("hide");

                    //location.reload();
				},
                updateSubmit: function()
                {
                    if(presScore < 1.5 || spd < 0.5 || str < 0.5 || eng < 0.5)
                    {
                        alert("Please enter a valid Presentation score");
                        $(".sportpoom #submitscore").modal("hide");
                    }
                }
            };
        })();


$(document).ready(function()
        {
        
            $(".sportpoom #majorbutton").click(that.updater.addMajor);
            $(".sportpoom #minorbutton").click(that.updater.addMinor);
            $(".sportpoom #undomajorbutton").click(that.updater.subMajor);
            $(".sportpoom #undominorbutton").click(that.updater.subMinor);
			$(".sportpoom #resetbutton").click(that.updater.resetScore);
            
            $(".sportpoom .speedin").click(function()
			{
				that.updater.updateSpeed(this);
			});
            $(".sportpoom .strengthin").click(function()
			{
				that.updater.updateStrength(this);
			});
            $(".sportpoom .energyin").click(function()
			{
				that.updater.updateEnergy(this);
			});

            $(".sportpoom #scoresubmit").click(that.updater.updateSubmit);
        });
