// Functionality of the audience page
//modify the script to fit implementation
var link = localStorage.link;

var gender = function(int) {
    switch(int) {
        case '1':
            return "Male";
        case '2':
            return "Female";
        default:
            return "";
    }
}
var round = function(int) {
    switch(int) {
        case '1':
            return "Preliminaries";
        case '2':
            return "Semi-Finals";
        case '3':
            return "Finals";
        default:
            return "";
    }
};

var make2dec = function(int) {
    return Math.round(int * 100)/100;
}

var division = function(int) {
    switch(int) {
        case '1':
            return "Youth";
        case '2':
            return "Cadet";
        case '3':
            return "Junior";
        case '4':
            return "Senior 1";
        case '5':
            return "Senior 2";
        case '6':
            return "Master 1";
        case '7':
            return "Master 2";
        case '8':
            return "Master 3";
        defaut:
            return "";
    }    
};


$(document).ready(function() {
    $('#results').DataTable( {
        processing: true,
        serverSide: true,
        ajax: {
            url: link + "viewFinalScores.php",
            type: "POST",
            data: {
                division: 4,
                gender: 2,
                round: 2,
            },
            dataSrc: "info"
        },
        columns: [
            { data: "name" },
            { data: "gender", render: gender},
            { data: "division", render: division},
            { data: "round", render: round},
            { data: "tfscore", render: make2dec}
        ]    
    });
});
