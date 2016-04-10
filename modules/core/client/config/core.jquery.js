requirejs.config({
    paths: {
        "jquery": "./bower_components/jquery/jquery",
        "jquery-mobile": "./bower_components/jquery-mobile"
    }
});

require( [ "jquery", "jquery-mobile/widgets/popup" ], function( $ ) {
    require( [ "jquery-mobile/init" ], function() {
        // Do something fancy with the jQM select
    }); 
});