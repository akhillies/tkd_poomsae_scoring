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
                $()
            }
        })();


$(document).ready(function()
        {
            
        });
