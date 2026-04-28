jQuery( function ( $ ) {
	'use strict';

	var wrapper = $( '.demo-browser' ),
        running = false;
    
    if ( ! wrapper.length ) return;
    
    /**
     * RUN IMPORT
     * args is neccessary args needed to run importings
     * item is a jQuery selector of wrap
     * @since 4.0
     */
    var run_import = function( args ) {
        
        // if running
        if ( running ) return false;
        
        if ( ! args.slug ) return;
        
        // if it's not in predefined demo
        if ( ! FOX_IMPORT.demos[ args.slug ] ) return;
        
        /**
         * set up new data
         */
        var data = new FormData();
        
        data.append( 'action', 'ocdi_import_demo_data' );
		data.append( 'security', FOX_IMPORT.ajax_nonce );
		data.append( 'selected', args.slug );
        data.append( 'import', args.import );
        
        demoAjaxCall( data );
        
        // add active class to the demo item being imported
        $( '.demo[data-demo="' + args.slug + '"]' ).addClass( 'active' );
        
	}
    
    function start_loading( data ) {
        
        /**
         * set up loading environment
         */
        wrapper.addClass( 'loading loading-' + data.get( 'import' ) );
        running = true;
        
    }
    
    function end_loading() {
    
        /**
         * set up loading environment
         */
        wrapper
        .removeClass( 'loading' )
        .find( '.demo' )
        .removeClass( 'active' );
        running = false;
        
    }
    
    function show_message( msg ) {
        wrapper.find( '.message' ).html( msg );
    }
    
    var hide_message = function() {
        wrapper.find( '.message' ).html( '' );
    }
    
    /**
     * AJAX CALL DATA
     */
    function demoAjaxCall( data ) {
        
        $.ajax({
			method:      'POST',
			url:         FOX_IMPORT.ajax_url,
			data:        data,
			contentType: false,
			processData: false,
			beforeSend:  function() {
                
                start_loading( data );
                hide_message()
                
			}
		})
		.done( function( response ) {
            
            console.log( response );
            
			if ( 'undefined' !== typeof response.status && 'newAJAX' === response.status ) {
				demoAjaxCall( data );
			}
            
			else if ( 'undefined' !== typeof response.status && 'customizerAJAX' === response.status ) {
				// Fix for data.set and data.delete, which they are not supported in some browsers.
				var newData = new FormData();
				newData.append( 'action', 'ocdi_import_customizer_data' );
				newData.append( 'security', FOX_IMPORT.ajax_nonce );

				demoAjaxCall( newData );
			}
			else if ( 'undefined' !== typeof response.status && 'afterAllImportAJAX' === response.status ) {
				// Fix for data.set and data.delete, which they are not supported in some browsers.
				var newData = new FormData();
				newData.append( 'action', 'ocdi_after_import_data' );
				newData.append( 'security', FOX_IMPORT.ajax_nonce );
				demoAjaxCall( newData );
			}
			else if ( 'undefined' !== typeof response.message ) {
                
				show_message( response.message );
				end_loading();

				// Trigger custom event, when FOXOCDI import is complete.
				$( document ).trigger( 'ocdiImportComplete' );
			}
			else {
                
                show_message( response );
                end_loading();
                
			}
		})
		.fail( function( error ) {
            
            console.error( error );
            
            show_message( error.statusText + ' (' + error.status + ')' );
            end_loading();
            
		});
        
    }
    
    /**
     * Start Binding Events
     */
    $( document ).on( 'click', '.fox-import-btn', function( e ) {
        var btn = $( this ),
            item = btn.closest( '.demo' );
        e.preventDefault();
        var args = {
            import: btn.data( 'import' ),
            slug: btn.data( 'slug' )
        }
        
        displayConfirmationPopup( args, item );
        
    });

	/**
	 * Display the confirmation popup.
	 *
	 * @param int selectedImportID The selected import ID.
	 * @param obj $itemContainer The jQuery selected item container object.
	 */
	function displayConfirmationPopup( args, item ) {
        
        var btn_text = ''
        if ( args.import == 'uninstall' ) {
            btn_text = FOX_IMPORT.texts.dialog_uninstall
        } else {
            btn_text = FOX_IMPORT.texts.dialog_yes
        }
        
		var $dialogContiner         = $( '#js-ocdi-modal-content' );
		var currentFilePreviewImage = FOX_IMPORT.demos[ args.slug ]['image'] || '';
		var previewImageContent     = '';
		var importNotice            = FOX_IMPORT.demos[ args.slug ]['notice'] || '';
		var importNoticeContent     = '';
        var dialogOptions           = $.extend(
			{
				'dialogClass': 'wp-dialog',
				'resizable':   false,
				'height':      'auto',
				'modal':       true
			},
			FOX_IMPORT.dialog_options,
			{
				'buttons':
				[
					{
						text: FOX_IMPORT.texts.dialog_no,
						click: function() {
							$(this).dialog('close');
						}
					},
					{
						text: btn_text,
						class: 'button  button-primary',
						click: function() {
							$(this).dialog('close');
                            run_import( args );
						}
					}
				]
			});
        
        // in case we only import settings
        if ( args.import == 'settings' ) {
            importNotice = FOX_IMPORT.texts.import_settings;
        } else if ( args.import == 'uninstall' ) {
            importNotice = FOX_IMPORT.texts.uninstall_note;
        }

		if ( '' === currentFilePreviewImage ) {
			previewImageContent = '<p>' + FOX_IMPORT.texts.missing_preview_image + '</p>';
		}
		else {
			previewImageContent = '<div class="ocdi__modal-image-container"><img src="' + currentFilePreviewImage + '" /></div>'
		}

		// Prepare notice output.
		if( '' !== importNotice ) {
			importNoticeContent = '<div class="ocdi__modal-notice  ocdi__demo-import-notice ocdi-notice-' + args.import +'">' + importNotice + '</div>';
		}

		// Populate the dialog content.
		$dialogContiner.prop( 'title', FOX_IMPORT.texts.dialog_title );
		$dialogContiner.html(
			'<p class="ocdi__modal-item-title">' + FOX_IMPORT.demos[ args.slug ]['name'] + '</p>' +
			previewImageContent +
			importNoticeContent
		);

		// Display the confirmation popup.
		$dialogContiner.dialog( dialogOptions );
	}
    
} );
