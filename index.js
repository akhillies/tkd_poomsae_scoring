var that = this;

var updater = (function()
        {
            var minor = 0;
            var major = 0;
            var spd = 0.0;
            var str = 0.0;
            var eng = 0.0;
            var presScore = 0;
            var accScore = 4;
            var totalScore;

            var updateMajorDisp = function()
            {
                $(".everything #majorcount").html(major); 
            }

            var updateMinorDisp = function()
            {
                $(".everything #minorcount").html(minor); 
            }

            var updatePres = function()
            {
                spd = parseFloat($(".everything #speedin").val());
                str = parseFloat($(".everything #strengthin").val());
                eng = parseFloat($(".everything #energyin").val());
                presScore = spd + str + eng;
                $(".everything #presscore").html(presScore);
                updateTotal();

            }

            var updateAccScore = function()
            {
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
                    if (accScore >=0.1) {
                        minor += 1;
                        updateAccScore();
                        updateMinorDisp();
                    }

                },
                subMinor: function()
                {
                    if (minor > 0) {
                        minor -= 1;
                        updateAccScore();
                        updateMinorDisp();
                    }

                },
                addMajor: function() 
                {
                    if (accScore >=0.3) {
                        major += 1;
                        updateAccScore();
                        updateMajorDisp();
                    }

                },
                subMajor: function()
                {
                    if (major > 0) {
                        major -= 1;
                        updateAccScore();
                        updateMajorDisp();
                    }

                },
                updateSpeed: function()
                {
                    $(".everything #speednum").html($(".everything #speedin").val());
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
            $(".everything #speedin")[0].oninput = that.updater.updateSpeed;
            $(".everything #strengthin")[0].oninput = that.updater.updateStrength;
            $(".everything #energyin")[0].oninput = that.updater.updateEnergy;
        
            $(".everything #majorbutton").click(that.updater.addMajor);
            $(".everything #minorbutton").click(that.updater.addMinor);
            $(".everything #undomajorbutton").click(that.updater.subMajor);
            $(".everything #undominorbutton").click(that.updater.subMinor);




        });
