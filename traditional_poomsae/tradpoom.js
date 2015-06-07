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
                $(".formtitle span").html(score);
                $("#finalscorescreen #finalscore").html(score);

                $("#submitscore").removeAttr("disabled");
            };

            return {
                updateInts: function(i) {
                    integer = i;
                    scoreupdate();
                },
                updateDecs: function(d) {
                    decimal = d;
                    scoreupdate();
                },
                resetScore: function() {
                    decimal = 0;
                    integer = 0;
                    scoreupdate();
                    $(".tradpoom #integer option:selected").removeAttr("selected");
                    $(".tradpoom #decimal option:selected").removeAttr("selected");
                    $(".tradpoom #submitscore").attr("disabled", true);
                    $(".tradpoom #finalscorescreen").modal("hide");
                }
            }
        })();
        
$(document).ready(function()
        {
            $("#integer").change(function()
                {
                    that.scoreinfo.updateInts($(this).val());
                });
            $("#decimal").change(function()
                {
                    that.scoreinfo.updateDecs($(this).val());
                });
            
            $("#resetbutton").click(that.scoreinfo.resetScore);

        });
