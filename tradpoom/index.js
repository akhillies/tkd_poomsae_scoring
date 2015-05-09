var that = this;

var scoreinfo = (function()
        {
            var integer = 0;
            var decimal = 0;

            var scoreupdate = function() {
                var score = integer + "." + decimal;
                if(integer >= 10) {
                    score = integer + ".0";
                }
                $(".tradpoom .formtitle span").html(score);
                $(".tradpoom #finalscorescreen #finalscore").html(score);
            };

            return {
                updateInts: function(i) {
                    integer = i;
                    scoreupdate();
                },
                updateDecs: function(d) {
                    decimal = d;
                    scoreupdate();
                }
            }
        })();
        
$(document).ready(function()
        {
            $(".tradpoom #integer").change(function()
                {
                    scoreinfo.updateInts($(this).val());
                });
            $(".tradpoom #decimal").change(function()
                {
                    scoreinfo.updateDecs($(this).val());
                });

        });
