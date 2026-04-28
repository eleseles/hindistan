/**
 * This file adds some LIVE to the Theme Customizer live preview. To leverage
 * this, set your custom settings to 'postMessage' and then add your handling
 * here. Your javascript should grab settings from customizer controls, and 
 * then make any necessary changes to the page using jQuery.
 */
( function( $ ) {
    
    var api = wp.customize,
        fontsLoaded = [],
        typekitLoaded = [];
    
    // Inline CSS not exists, insert it to <head />
    var style = $( '#color-preview' );
    if ( ! style.length ) {
        style = $( '<style id="color-preview" />' );
        $( 'head' ).append( style );
    }
    
    // FOXE CSS RULES
	api.bind( 'preview-ready', function() {
        
        // Theme CSS
		api.preview.bind( 'update-fox-theme-style', function( css ) {
            // We need only live preview CSS
			style.html( css );
		} );
        
	});
    
} )( jQuery );