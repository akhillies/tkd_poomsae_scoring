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
                   $(".everything #presscore").innerHTML(0);
                },
                updateSpeed: function()
                {
                    $(".everything #speednum").innerHTML($(".everything #speedin").attr("value"));
                }
            };
        })();


$(document).ready(function()
        {
            $(".everything #speedin").onChange(that.updater.updateSpeed);
        });
