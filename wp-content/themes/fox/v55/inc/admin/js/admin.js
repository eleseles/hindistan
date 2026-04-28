/**
 * global WITHEMES_ADMIN
 *
 * @since 1.0
 */
(function( window, WITHEMES_ADMIN, $ ) {
"use strict";
    
    // cache element to hold reusable elements
    WITHEMES_ADMIN.cache = {
        $document : {},
        $window   : {}
    }
    
    // Create cross browser requestAnimationFrame method:
    window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(f){setTimeout(f, 1000/60)}
    
    /**
     * Init functions
     *
     * @since 1.0
     */
    WITHEMES_ADMIN.init = function() {
        
        /**
         * cache elements for faster access
         *
         * @since 1.0
         */
        WITHEMES_ADMIN.cache.$document = $(document);
        WITHEMES_ADMIN.cache.$window = $(window);
        
        WITHEMES_ADMIN.cache.$document.on( 'ready', function() {
        
            WITHEMES_ADMIN.reInit();
            
        });
        
        /**
         * WIDGET COLOR PICKER
         * tks https://gist.github.com/rodica-andronache/54f3ea95bcaf76435e55
         * @since 4.0
         */
        function initColorPicker( widget ) {
            widget.find( '.wi-colorpicker' ).wpColorPicker({
                change: _.throttle( function() { // For Customizer
                    $(this).trigger( 'change' );
                }, 3000 )
            });
        }

        function onFormUpdate( event, widget ) {
            initColorPicker( widget );
        }

        $( document ).on( 'widget-added widget-updated', onFormUpdate );

        $( document ).on( 'ready', function() {
            $( '#widgets-right .widget:has(.wi-colorpicker)' ).each( function () {
                initColorPicker( $( this ) );
            } );
        });
        
    }
    
    /**
     * Initialize functions
     *
     * And can be used as a callback function for ajax events to reInit
     *
     * This can be used as a table of contents as well
     *
     * @since 1.0
     */
    WITHEMES_ADMIN.reInit = function() {
        
        /**
         * license validator
         * since 5.5.1
         */
        WITHEMES_ADMIN.license_actions();
        WITHEMES_ADMIN.clear_transients();
        WITHEMES_ADMIN.import_guide();
        WITHEMES_ADMIN.uninstall_demo();
        
        // Conditional Metabox
        WITHEMES_ADMIN.conditionalMetabox();
        
        WITHEMES_ADMIN.fileUpload();
     
        // image Upload
        WITHEMES_ADMIN.imageUpload();
        
        // multiple-image Upload
        WITHEMES_ADMIN.imagesUpload();
        
        // colorpicker
        WITHEMES_ADMIN.colorpicker();
        
        // Review
        WITHEMES_ADMIN.review();
        
        // tab
        WITHEMES_ADMIN.tab();
        
        // SIDEBAR
        WITHEMES_ADMIN.custom_sidebar();
        
        // POST FORMAT
        // WITHEMES_ADMIN.post_format();
        
    }
    
    WITHEMES_ADMIN.import_guide = function() {
        
        $( document ).on( 'click', '.import-settings-guide-header .button', function(e) {
            e.preventDefault();
            $('.import-settings-guide-content').slideDown('fast')
        } )
        
    }
    
    WITHEMES_ADMIN.uninstall_demo = function() {
        
        $( '.uninstall-demo-form' ).on( 'submit', function( e ) {
            e.preventDefault()
            
            // if sending..
            if ( $( this ).hasClass( 'freeze' ) ) {
                return;
            }
            
            var form = $( this ),
                action = form.find( 'input[name="action"]' ).val(),
                nonce = form.find( 'input[name="nonce"]' ).val(), 
                dataSend = {
                    action: action,
                    nonce: nonce,
                }
            
            if ( ! confirm( "Are you sure?" ) ) {
                return;
            }
            
            // Ajax call
            $.ajax({
                type: 'POST',
                url: ajaxurl,
                data: dataSend,
                dataType: 'json',
                beforeSend: function() {
                    form.addClass( 'freeze' );
                },
                success: function( response ) {
                    
                    console.log( response )
                    
                    if ( 'fail' == response.status ) {
                        
                        form.removeClass( 'freeze' );
                        form.find( '.fox-message' ).html( '<p>' + response.message + '</p>' ).show().addClass( 'fail' ).removeClass( 'success' )
                        
                    /**
                     * if success 
                     * show the success mesasge
                     * then reload
                     */
                    } else if ( 'success' == response.status ) {
                        
                        form.removeClass( 'freeze' );
                        form.find( '.fox-message' ).html( '<p>' + response.message + '</p>' ).show().addClass( 'success' ).removeClass( 'fail' )
                        
                        form.find( 'button' ).hide();
                        
                    } else {
                        form.removeClass( 'freeze' );
                        console.log( response )
                    }
                }
            });
        })
        
    }
    
    /**
     * license actions
     * since 
     */
    WITHEMES_ADMIN.license_actions = function() {
        
        $( '.license_form' ).on( 'submit', function( e ) {
            e.preventDefault()
            
            // if sending..
            if ( $( this ).hasClass( 'freeze' ) ) {
                return;
            }
            
            var form = $( this ),
                action = form.find( 'input[name="action"]' ).val(),
                purchase_code = form.find( 'input[name="purchase_code"]' ).val(),
                nonce = form.find( 'input[name="nonce"]' ).val(),
                dataSend = {
                    action: action,
                    nonce: nonce,
                    purchase_code: purchase_code,
                }
            
            if ( ! purchase_code ) {
                form.removeClass( 'freeze' );
                return;
            }
            
            // Ajax call
            $.ajax({
                type: 'POST',
                url: ajaxurl,
                data: dataSend,
                dataType: 'json',
                beforeSend: function() {
                    $( '.license_form' ).addClass( 'freeze' );
                },
                success: function( response ) {
                    if ( 'fail' == response.status ) {
                        
                        form.removeClass( 'freeze' );
                        form.find( '.fox-message' ).html( '<p>' + response.message + '</p>' ).show().addClass( 'fail' ).removeClass( 'success' )
                        
                    /**
                     * if success 
                     * show the success mesasge
                     * then reload
                     */
                    } else if ( 'success' == response.status ) {
                        
                        form.removeClass( 'freeze' );
                        
                        form.find( '.fox-message' ).html( '<p>' + response.message + ' The page will be reloaded..' + '</p>' ).show().addClass( 'success' ).removeClass( 'fail' )
                        setTimeout(function(){
                            location.reload();
                        }, 3000 )
                    } else {
                        form.removeClass( 'freeze' );
                        console.log( response )
                    }
                }
            });
        })
        
    }
    
    WITHEMES_ADMIN.clear_transients = function() {
        
        $( '.clear-transients-form' ).on( 'submit', function( e ) {
            e.preventDefault()
            
            // if sending..
            if ( $( this ).hasClass( 'freeze' ) ) {
                return;
            }
            
            var form = $( this ),
                action = form.find( 'input[name="action"]' ).val(),
                nonce = form.find( 'input[name="nonce"]' ).val(), 
                dataSend = {
                    action: action,
                    nonce: nonce,
                }
            
            // Ajax call
            $.ajax({
                type: 'POST',
                url: ajaxurl,
                data: dataSend,
                dataType: 'json',
                beforeSend: function() {
                    form.addClass( 'freeze' );
                },
                success: function( response ) {
                    if ( 'fail' == response.status ) {
                        form.removeClass( 'freeze' );
                        form.find( '.fox-message' ).html( '<p>' + response.message + '</p>' ).show().addClass( 'fail' ).removeClass( 'success' )
                        
                    /**
                     * if success 
                     * show the success mesasge
                     * then reload
                     */
                    } else if ( 'success' == response.status ) {
                        
                        form.removeClass( 'freeze' );
                        
                        form.find( '.fox-message' ).html( '<p>' + response.message + '</p>' ).show().addClass( 'success' ).removeClass( 'fail' )
                        
                    } else {
                        form.removeClass( 'freeze' );
                        console.log( response )
                    }
                }
            });
        })
        
    }
    
    /**
     * handle post format
     * synchronize 2 format options
     * @since 4.0
     */
    WITHEMES_ADMIN.post_format = function() {
        
    }
    
    // Conditional metabox
    // ========================
    WITHEMES_ADMIN.conditionalMetabox = function() {
        
        // lib required
        if ( ! $().metabox_conditionize ) {
            return;
        }
    
        $( '.wi-metabox-field[data-cond-option]' ).metabox_conditionize();
        
    }
    
    // Thickbox File Upload
    // ========================
    WITHEMES_ADMIN.fileUpload = function() {
        
        var mediaUploader
    
        // Append Image Action
        WITHEMES_ADMIN.cache.$document.on( 'click', '.upload-file-button', function( e ) {
            
            e.preventDefault();
            
            var button = $( this ),
                uploadWrapper = button.closest( '.wi-upload-wrapper' ),
                type = uploadWrapper.data( 'type' ),
                holder = uploadWrapper.find( '.file-holder' ),
                input = uploadWrapper.find( '.media-result' ),
                args = {
                    title: WITHEMES_ADMIN.l10n.choose_file,
                    button: {
                        text: WITHEMES_ADMIN.l10n.choose_file,
                    }, 
                    multiple: false,
                }
            
            if ( type ) {
                args.library = {
                    type: type,
                }
            }
            
            // Extend the wp.media object
            mediaUploader = wp.media.frames.file_frame = wp.media(args);

            // When a file is selected, grab the URL and set it as the text field's value
            mediaUploader.on( 'select', function() {
                
                var attachment = mediaUploader.state().get('selection').first().toJSON();
                
                // set value
                input.val( attachment.id );
                
                // set title value
                holder.find( '.file-name' ).html( attachment.title );
                
                // show the holder
                holder.addClass( 'has-file' );
                
                // change button text
                button.val( WITHEMES_ADMIN.l10n.change_file );
                
            });
            // Open the uploader dialog
            mediaUploader.open();
        
        });
        
        // Remove Image Action
        WITHEMES_ADMIN.cache.$document.on( 'click', '.remove-file-button', function( e ) {
            
            e.preventDefault();
            
            var remove = $( this ),
                uploadWrapper = remove.closest( '.wi-upload-wrapper' ),
                holder = uploadWrapper.find( '.file-holder' ),
                input = uploadWrapper.find( '.media-result' ),
                button = uploadWrapper.find( '.upload-file-button' );
            
            input.val('');
            holder.removeClass( 'has-file' );
            button.val( WITHEMES_ADMIN.l10n.upload_file );
            
        });
    
    }
    
    // Thickbox Image Upload
    // ========================
    WITHEMES_ADMIN.imageUpload = function() {
        
        var mediaUploader
    
        // Append Image Action
        WITHEMES_ADMIN.cache.$document.on( 'click', '.upload-image-button', function( e ) {
            
            e.preventDefault();
            
            var button = $( this ),
                uploadWrapper = button.closest( '.wi-upload-wrapper' ),
                holder = uploadWrapper.find( '.image-holder' ),
                input = uploadWrapper.find( '.media-result' );
            
            // Extend the wp.media object
            mediaUploader = wp.media.frames.file_frame = wp.media({
                title: WITHEMES_ADMIN.l10n.choose_image,
                button: {
                    text: WITHEMES_ADMIN.l10n.choose_image,
                }, 
                multiple: false,
                library : {
                    type : 'image',
                    // HERE IS THE MAGIC. Set your own post ID var
                    // uploadedTo : wp.media.view.settings.post.id
                },
            });

            // When a file is selected, grab the URL and set it as the text field's value
            mediaUploader.on('select', function() {
                
                var attachment = mediaUploader.state().get('selection').first().toJSON();
                
                if ( attachment.type == 'image' ) {

                    input
                    .val(attachment.id)
                    .trigger( 'change' );
                    holder.find('img').remove();
                    if ( attachment.sizes.medium ) {
                        holder.prepend( '<img src="' + attachment.sizes.medium.url + '" />' );
                    } else {
                        holder.prepend( '<img src="' + attachment.url + '" />' );
                    }
                    
                    if ( button.is( 'button' ) ) {
                        button.text( WITHEMES_ADMIN.l10n.change_image );
                    } else {
                        button.val( WITHEMES_ADMIN.l10n.change_image );
                    }
                    
                }

            });
            // Open the uploader dialog
            mediaUploader.open();
        
        });
        
        // Remove Image Action
        WITHEMES_ADMIN.cache.$document.on( 'click', '.remove-image-button', function( e ) {
            
            e.preventDefault();
            
            var remove = $( this ),
                uploadWrapper = remove.closest( '.wi-upload-wrapper' ),
                holder = uploadWrapper.find( '.image-holder' ),
                input = uploadWrapper.find( '.media-result' ),
                button = uploadWrapper.find( '.upload-image-button' );
            
            input
            .val('')
            .trigger( 'change' );
            holder.find( 'img' ).remove();
            
            if ( button.is( 'button' ) ) {
                button.text( WITHEMES_ADMIN.l10n.upload_image );
            } else {
                button.val( WITHEMES_ADMIN.l10n.upload_image );
            }
            
        });
    
    }
    
    // Upload Multiplage Images
    // ========================
    WITHEMES_ADMIN.imagesUpload = function() {
        
        var mediaUploader,
        
            sortableCall = function() {
            
                // sortable required
                if ( !$().sortable ) {
                    return;
                }

                $( '.images-holder' ).each(function() {

                    var $this = $( this );
                    $this.sortable({

                        placeholder: 'image-unit-placeholder', 

                        update: function(event, ui) {

                            // trigger event changed
                            var uploadWrapper = $this.closest( '.wi-upload-wrapper' );
                            uploadWrapper.trigger( 'changed' );

                        }

                    }); // sortable

                    $this.disableSelection();

                });

            },
            
            refine = function() {
            
                var uploadWrapper = $( this ),
                    holder = uploadWrapper.find( '.images-holder' ),
                    input = uploadWrapper.find( '.media-result' ),
                    id_string = [];

                // not images type
                if ( !holder.length ) {
                    return;
                }

                // otherwise, we rearrange everythings
                holder.find( '.image-unit' ).each(function() {

                    var unit = $( this ),
                        id = unit.data( 'id' );

                    id_string.push( id );

                } );

                input.val( id_string.join() );
            
            }
        
        // call sortable
        sortableCall();
        
        // refine the input the get result
        $( '.wi-upload-wrapper' ).on( 'changed', refine );
    
        // Append Image Action
        WITHEMES_ADMIN.cache.$document.on( 'click', '.upload-images-button', function( e ) {
            
            e.preventDefault();
            
            var button = $( this ),
                uploadWrapper = button.closest( '.wi-upload-wrapper' ),
                holder = uploadWrapper.find( '.images-holder' ),
                input = uploadWrapper.find( '.media-result' );
            
            // Extend the wp.media object
            mediaUploader = wp.media.frames.file_frame = wp.media({
                title: WITHEMES_ADMIN.l10n.choose_images,
                button: {
                    text: WITHEMES_ADMIN.l10n.choose_images,
                }, 
                multiple: true,
                library : {
                    type : 'image',
                    // HERE IS THE MAGIC. Set your own post ID var
                    // uploadedTo : wp.media.view.settings.post.id
                },
            });

            // When a file is selected, grab the URL and set it as the text field's value
            mediaUploader.on( 'select' , function() {
                
                var attachments = mediaUploader.state().get('selection').toJSON();
                
                var remaining_attachments = [],
                    existing_ids = [];
                if ( input.val() ) {
                    existing_ids = input.val().split(',');
                }

                // remove duplicated images
                for ( var i in attachments ) {
                    var attachment = attachments[i],
                        item = '';
                    if ( existing_ids.indexOf( attachment.id.toString() ) < 0 ) {
                        
                        item += '<figure class="image-unit" data-id="' + attachment.id + '">';
                        item += '<img src="' + attachment.sizes.thumbnail.url +'" />';
                        item += '<a href="#" class="remove-image-unit" title="' + WITHEMES_ADMIN.l10n.remove_image + '">&times;</a>';
                        item += '</figure>';
                        holder.append( item );
                        
                    }
                }
                
                uploadWrapper.trigger( 'changed' );
                input.trigger( 'change' );

            });
            
            // Open the uploader dialog
            mediaUploader.open();
        
        });
        
        // Remove Image Action
        WITHEMES_ADMIN.cache.$document.on( 'click', '.remove-image-unit', function( e ) {
            
            e.preventDefault();
            
            var remove = $( this ),
                uploadWrapper = remove.closest( '.wi-upload-wrapper' ),
                item = remove.closest( '.image-unit' );

            item.remove();
            uploadWrapper.trigger( 'changed' );
            input.trigger( 'change' );
            
        });
    
    }
    
    // Color picker
    // ========================
    WITHEMES_ADMIN.colorpicker = function() {
        
        /*
        // wpColorPicker required
        if ( ! $().wpColorPicker ) {
            return;
        }
        */
    
        $( '.colorpicker-input' ).not('[id*="__i__"]').wpColorPicker();
    
    }
    
    // Review
    // ========================
    WITHEMES_ADMIN.review = function() {
        
        var running = false;
        
        // Reorder all criteria
        var refine = function() {
            
            var list = $( this )
        
            list.find( '.review' ).each(function( i ) {
                
                var $this = $( this ),
                    criterion = $this.find( '.review-criterion' ),
                    score = $this.find( '.review-score' );
                
                $this.attr( 'data-order', i );
            
                criterion.find( 'input' ).attr({
                    id : $this.data( 'id' ) + '[' + i + ']' + '[' + criterion.data( 'property' ) + ']',
                    name : $this.data( 'id' ) + '[' + i + ']' + '[' + criterion.data( 'property' ) + ']',
                });
                
                score.find( 'input' ).attr({
                    id : $this.data( 'id' ) + '[' + i + ']' + '[' + score.data( 'property' ) + ']',
                    name : $this.data( 'id' ) + '[' + i + ']' + '[' + score.data( 'property' ) + ']',
                });
            
            });
            
            calculate_total();
            
        }
        
        // refine each time the list being changed
        $( '.review-list' ).on( 'changed', refine );
    
        // Add New Event
        WITHEMES_ADMIN.cache.$document.on( 'click', '.new-review', function( e ) {
            
            // don't do anything when running
            if ( running ) {
                return;
            }
        
            e.preventDefault();
            
            var button = $( this ),
                wrapper = button.closest( '.review-wrapper' ),
                list = wrapper.find( '.review-list' ),
                clone = list.find( '.review' ).first().clone();
            
            clone.find( 'input' ).val( '' );
            
            clone.appendTo( list );
            
            list.trigger( 'changed' );
        
        } );
        
        // Remove Event
        WITHEMES_ADMIN.cache.$document.on( 'click', '.remove-review', function( e ) {
            
            // don't do anything when running
            if ( running ) {
                return;
            }
        
            e.preventDefault();
            
            var remove = $( this ),
                list = remove.closest( '.review-list' ),
                item = remove.closest( '.review' );
            
            if ( list.find( '.review' ).length > 1 ) {
            
                item.slideUp( 200, function() {
                    item.remove();
                    list.trigger( 'changed' );
                    running = false;
                } );
            
            // DO NOT REMOVE THE LAST ITEM
            } else {
            
                // We just need to reset all inputs
                item.find( 'input' ).val( '' );
                list.trigger( 'changed' );
                running = false;
            
            }
        
        } );
        
        // Sortable
        if ( $().sortable ) {
            
            $( '.review-list' ).each( function() {
                
                var list = $( this );
                
                list.sortable({
                
                    placeholder : 'review-placeholder',
                    start : function( event, ui ) {
                        running = true;
                    },
                    update: function( event , ui ) {
                        
                        list.trigger( 'changed' );
                        running = false;
                        
                    }
                
                })
            
            });
        
        }
        
        var calculate_total = function() {
           
            var total = 0,
                num = 0;
            $( '.review-list' ).find( '.review-score' ).each(function() {
                
                var $this = $( this ),
                    value = parseFloat( $this.find( 'input[type="text"]' ).val() );
                if ( value ) {
                    total += value;
                    num++;
                }
                
            });
            
            if ( num > 0 ) total = parseFloat( total / num ).toFixed(2);
            console.log( total );
            $( '.review-total-score .review-score' ).find( 'input[type="text"]' ).val( total );
            
        }
        
        // Calculate the average
        WITHEMES_ADMIN.cache.$document.on( 'keyup', '.review-list .review-score input[type="text"]', function( e ) {
        
            calculate_total();
            
        });
    
    }
    
    /**
     * Metabox Tabs
     */
    WITHEMES_ADMIN.tab = function() {
        
        $( '.metabox-tabs' ).each(function() {
        
            var $this = $( this ),
                fields = $this.next( '.metabox-fields' );
            $this.find( 'a' ).click(function( e ) {
            
                var a = $( this),
                    href= a.data( 'href' );
                
                e.preventDefault();
                
                // active class
                $this.find( 'li' ).removeClass( 'active' );
                a.parent().addClass( 'active' );
                
                // Hide all
                fields.find( '.fox-tab-content' ).hide();
                
                // Shows fields with attr href or no tab
                fields.find( '.fox-tab-content[data-tab="' + href + '"]' ).show();
                fields.find( '.fox-tab-content[data-tab=""]' ).show();
            
            });
            
            // Click to the first item
            $this.find( 'li:first-child' ).find( 'a' ).trigger( 'click' );
        
        });
    
    }
    
    /**
     * Custom Sidebar
     * @since 4.0
     */
    WITHEMES_ADMIN.custom_sidebar = function() {
        
        var _eventRunning = false;
        
        function notify( msg, type ) {
            
            $( '.fox-notice' )
            .html( msg )
            .removeClass( 'success info error' )
            .addClass( type );
            
        }

        $( document ) .on( 'click', '.fox-add-sidebar, .fox-remove-sidebar', function( e ) {

            e.preventDefault();

            var self = this,
                $el = $(this),
                form = $el.closest( 'form' ),
                type = $el.data('type'),
                nonce = $( '[name="fox_ajax_processor_nonce"]').val(),
                
                slugField = form.find( '[name="sidebar_slug"]'),
                nameField = form.find( '[name="sidebar_name"]'),
                
                slug = $el.data( 'slug' ),
                name = $el.data( 'name' ),
                
                spinner = $('.fox-wrapper').find('.spinner'),
                table = $('#fox-table'),
                answer = '';
            
            if( 'add' == type  ) {
                
                var name = nameField.val(),
                    slug = slugField.val();

                if( '' == name && '' == slug ) {
                    notify( 'Empty name or slug', 'error' );
                    return;
                }

            } else if( 'remove' == type  ) {
                
                answer = confirm( 'Do you want to remove sidebar "' + name + '"?' );

                if( !answer )
                    return;

            }

            // if running
            if( _eventRunning )
                return;

            _eventRunning = true;
            
            spinner.fadeIn(function(){
                
                $( this ).addClass( 'is-active' );
                
            });
            
            var dataSend = {
                action: 'fox_sidebar_ajax_action',
                type: type,
                nonce: nonce,
                name : name,
                slug: slug,
            };
            
            console.log( dataSend );
            
            // Ajax call
            $.ajax({
                type: 'POST',
                url: ajaxurl,
                data: dataSend,
                
                success: function( response ) {

                    // SUCCESS ADDED
                    if( response.success && 'add' == response.data.type ) {
                        
                        // clear fields
                        nameField.val( '' );
                        slugField.val( '' );

                        table
                        .append(
                            '<tr><td>' + response.data.name + '</td><td>'
                            + response.data.slug + '</td><td><button class="button button-small fox-remove-sidebar" data-type="remove" data-slug="' 
                            + response.data.slug + '" data-name="' + response.data.name + '">Delete</button></td></tr>'
                        );
                        
                        // remove no sidebar row
                        var no_sidebar_tr = table.find( 'tr.no-sidebar-tr' );
                        if( no_sidebar_tr.length )
                            no_sidebar_tr.remove();
                        
                        notify( response.data.message, 'success' );

                    // SUCCESS REMOVED    
                    } else if( response.success && 'remove' == response.data.type ) {
                        
                        $el.closest( 'tr' ).remove();
                        
                        notify( response.data.message, 'success' );
                        
                    }

                    spinner.fadeOut(function(){
                        
                        $(this).removeClass('is-active');
                        
                    });
                    
                    _eventRunning = false;

                }
                
            });

        }); // on click action
        
    }
    
    WITHEMES_ADMIN.init();
    
    /* tooltip
     * since 5.5.4
    ------------------------------------------------------------------------------------------*/
    WITHEMES_ADMIN.tooltip = function( ele ) {
        if ( ! $().tooltipster ) {
            return;
        }
        var args = {
            theme: 'tooltipster-borderless',
            delay: 100,
            animation: 'fade',
            maxWidth: 300,
            trigger: 'hover',
        };
        ele.tooltipster( args );
    }
    $( document ).ready(function(){
        WITHEMES_ADMIN.tooltip( $( '.fox-admin-hastip' ) )
    })
    
    /* click to import template
     * since 5.5.4
    ------------------------------------------------------------------------------------------*/
    $( document ).on( 'change', 'input[name="_wi_style"]', function(e) {
        // e.preventDefault();
        var input = $( this ),
            wrapper = input.closest( '.radio-wrapper' ),
            section = input.closest( '.metabox-item-section' ),
            label = wrapper.find( 'label' ),
            slug = input.val(),
            downloaded = input.data( 'downloaded' )
        
        if ( ! section.hasClass( 'layouts-elementor' ) ) {
            return;
        }
        if ( downloaded ) {
            return;
        }
        
        if ( input.data( 'processing' ) ) {
            return;
        }
        input.data( 'processing', true )
        
        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: {
                action: 'import_single_template',
                slug: slug,
            },
            dataType: 'json',
            beforeSend: function() {
                wrapper.addClass( 'loading' )
                label.append( '<span class="downloading">Downloading..</span>' )
            },
            success: function( response ) {
                if ( response && response.status == 'success' ) {
                    input.data( 'downloaded', true )
                    input.data( 'processing', false )
                    
                    label.find( '.downloading' ).remove()
                    wrapper.removeClass( 'loading' ).addClass( 'success' )
                    wrapper.find( '.layout-item-actions' ).find( 'i' ).remove();
                    wrapper.find( '.layout-item-actions' ).prepend( response.html )
                    WITHEMES_ADMIN.tooltip( wrapper.find( '.layout-item-actions' ).find( '.fox-admin-hastip' ) )
                    
                } else {
                    input.data( 'processing', false )
                    label.find( '.downloading' ).remove()
                    wrapper.removeClass( 'loading' ).addClass( 'error' )
                }
            },
            error: function( xhr,status, err ) {
                console.log( err );
                console.log( status );
            }
        })
    })
    
})( window, WITHEMES_ADMIN, jQuery );

// Library Show Hide Conditional
// =================================================================

(function($) {
  $.fn.metabox_conditionize = function(options) {

    var settings = $.extend({
        hideJS : true,
        repeat : true,
    }, options );

    $.fn.eval = function(valueIs, valueShould, operator) {
      switch(operator) {
        case '==':
            return valueIs == valueShould;
            break;
        case '!=':
            return valueIs != valueShould;
            break;  
        case '<=':
            return valueIs <= valueShould;
            break;  
        case '<':
            return valueIs < valueShould;
            break;  
        case '>=':
            return valueIs >= valueShould;
            break;  
        case '>':
            return valueIs > valueShould;
            break;  
        case 'in':
            valueShould = valueShould.split( ',' );
            return ( typeof( valueShould ) == 'object' && $.inArray( valueIs, valueShould ) >= 0 ) ;
            break;
      }
    }

    $.fn.showOrHide = function(listenTo, listenFor, operator, $section) {
      if ($(listenTo).is('select, input[type=text]') && $.fn.eval($(listenTo).val(), listenFor, operator)) {
          $section.show(0,function(){$(this).trigger('show.wi-input');});
      }
      else if ($(listenTo + ":checked").filter(function(idx, elem){return $.fn.eval(elem.value, listenFor, operator);}).length > 0) {
          $section.show(0,function(){$(this).trigger('show.wi-input');});
      }
      else {
          $section.hide(0,function(){$(this).trigger('hide.wi-input');});
      }
    }

    return this.each( function() {
        
        // only select and input type radio
      var listenTo = "[data-id=" + $(this).data('cond-option').replace( /(:|\.|\[|\]|,)/g, "\\$1" ) + "] select, [data-id=" + $(this).data('cond-option').replace( /(:|\.|\[|\]|,)/g, "\\$1" ) + "] input[type=\"radio\"]";
      var listenFor = $(this).data('cond-value');
      var operator = $(this).data('cond-operator') ? $(this).data('cond-operator') : '==';
      var $section = $(this);

      //Set up event listener
      $(listenTo).on('change', function() {
        $.fn.showOrHide(listenTo, listenFor, operator, $section);
      });
        
        // if process repeated
        if ( settings.repeat ) {
            $(listenTo).closest('.wi-metabox-field').on('show.wi-input', function() {
                $section.show(0,function(){$(this).trigger('show.wi-input');});
                $.fn.showOrHide(listenTo, listenFor, operator, $section);
          });
            $(listenTo).closest('.wi-metabox-field').on('hide.wi-input', function() {
            $section.hide(0,function(){$(this).trigger('hide.wi-input');});
          });
        }
        
      //If setting was chosen, hide everything first...
      if (settings.hideJS) {
        $(this).hide();
      }
      //Show based on current value on page load
      $.fn.showOrHide(listenTo, listenFor, operator, $section);
    });
  }
}(jQuery));