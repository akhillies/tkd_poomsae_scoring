// Functionality of the audience page
//modify the script to fit implementation

$(document).ready(function() {
    $('#results').DataTable( {
        "processing": true,
        "serverSide": true,
        "ajax": "../server_side/scripts/server_processing.php"
    } );
} );