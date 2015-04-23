var updater = (function()
        {
            var minor = 0;
            var major = 0;

            function addMinor() 
            {
                minor += 1;
            }
            function subMinor()
            {
                major -= 1;
            }
            function addMajor() 
            {
                minor += 1;
            }
            function subMajor()
            {
                major -= 1;
            }
            
            function updatePoom()
            {
                return 0 - 0.1 * minor - 0.3 * major;
            }

            function updatePres()
            {
               $(".everything #presscore").innerHTML(0);
            }

            function updateSpeed()
            {
                $(".everything #speednum").innerHTML($(".everything #speedin").attr("value"));
            }
        })();


$(document).ready(function()
        {
            $(".everything #speedin").onChange(updater.updateSpeed);
        });
