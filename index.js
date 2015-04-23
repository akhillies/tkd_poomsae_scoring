var that = this;

var updater = (function()
        {
            var minor = 0;
            var major = 0;

            return {
                addMinor: function() 
                {
                    minor += 1;
                },
                subMinor: function()
                {
                    major -= 1;
                },
                addMajor: function() 
                {
                    minor += 1;
                },
                subMajor: function()
                {
                    major -= 1;
                },
                updatePoom: function()
                {
                    return 0 - 0.1 * minor - 0.3 * major;
                },
                updatePres: function()
                {
                   $(".everything #presscore").html(0);
                },
                updateSpeed: function()
                {
                    $(".everything #speednum").html($(".everything #speedin").val());
                },
                updateStrength: function()
                {
                    $(".everything #strengthnum").html($(".everything #strengthin").val());
                },
                updateEnergy: function()
                {
                    $(".everything #energynum").html($(".everything #energyin").val());
                }
            };
        })();


$(document).ready(function()
        {
            $(".everything #speedin")[0].oninput = that.updater.updateSpeed;
            $(".everything #strengthin")[0].oninput = that.updater.updateStrength;
            $(".everything #energyin")[0].oninput = that.updater.updateEnergy;
        });
