var that = this;


var updater = (function()
        {
            var minor = 0;
            var major = 0;
            var spd = 0.0;
            var str = 0.0;
            var eng = 0.0;
            var presScore = 0;
            var accScore = 0;
            var totalScore;

            var grabValue = function(html)
            {
                txt = html.trim()
                var len = txt.length;
                return txt.substring(len - 3);
            }
			

            var updateMajorDisp = function()
            {
                console.log("updated major disp");
                $(".everything #majorcount").html(major); 
            }

            var updateMinorDisp = function()
            {
                console.log("updated minor disp")
                $(".everything #minorcount").html(minor); 
            }

            var updatePres = function()
            {
                presScore = spd + str + eng;
                $(".everything #presscore").html(presScore);
                updateTotal();

            }

            var updateAccScore = function()
            {
                console.log("updated acc score");
                accScore = Math.max(0, 4 - 0.1 * minor - 0.3 * major);
                $(".everything #accscore").html(accScore); 
                updateTotal();
            }

            var updateTotal = function()
            {
                totalScore = presScore + accScore;
                $(".everything #totalscore").html(totalScore);
            }

            return {
                addMinor: function() 
                {
                    console.log("added minor");
                    if (accScore >=0.1) {
                        minor += 1;
                        updateAccScore();
                        updateMinorDisp();
                    }

                },
                subMinor: function()
                {
                    console.log("subbed minor");
                    if (minor > 0) {
                        minor -= 1;
                        updateAccScore();
                        updateMinorDisp();
                    }

                },
                addMajor: function() 
                {
                    console.log("added Major");
                    if (accScore >=0.3) {
                        major += 1;
                        updateAccScore();
                        updateMajorDisp();
                    }

                },
                subMajor: function()
                {
                    console.log("subbed Major");
                    if (major > 0) {
                        major -= 1;
                        updateAccScore();
                        updateMajorDisp();
                    }

                },
                updateSpeed: function(dombutton)
                {
                    spd = parseFloat(grabValue(dombutton.innerHTML));
                    $(".everything #speednum").html(spd);
                    updatePres();
                },
                updateStrength: function()
                {
                    $(".everything #strengthnum").html($(".everything #strengthin").val());
                    updatePres();
                },
                updateEnergy: function()
                {
                    $(".everything #energynum").html($(".everything #energyin").val());
                    updatePres();
                }
            };
        })();


$(document).ready(function()
        {
        
            $(".everything #majorbutton").click(that.updater.addMajor);
            $(".everything #minorbutton").click(that.updater.addMinor);
            $(".everything #undomajorbutton").click(that.updater.subMajor);
            $(".everything #undominorbutton").click(that.updater.subMinor);

            
            $(".everything .speedin").click(function()
			{
				that.updater.updateSpeed(this);
			});

















        });
