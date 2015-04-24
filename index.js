var that = this;

var updater = (function()
        {
            var minor = 0;
            var major = 0;
            var spd = 0;
            var str = 0;
            var eng = 0;
            var presScore = 0;
            var poomScore = 4;
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
                presScore = spd + stg + eng;
                $(".everything #presscore").html(presScore);
            }

            var updatePoomScore = function()
            {
                poomScore = max(0, 4 - 0.1 * minor - 0.3 * major)
                $(".everything #poomscore").html(poomScore); 
            }

            var updateTotal = function()
            {
                totalScore = presScore + poomScore;
                $(".everything #totalscore").html(totalScore);
            }

            return {
                addMinor: function() 
                {
                    minor += 1;
                    updatePoomScore();
                    updateMajorDisp();
                },
                subMinor: function()
                {
                    minor -= 1;
                    updatePoomScore();
                    updateMinorDisp();

                },
                addMajor: function() 
                {
                    major += 1;
                    updatePoomScore();

                },
                subMajor: function()
                {
                    major -= 1;
                    updatePoomScore();

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
            $(".everything #undominorbutton").click(that.updater.subMajor);
        });
