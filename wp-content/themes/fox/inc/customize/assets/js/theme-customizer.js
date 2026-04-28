/**
 * This file adds some LIVE to the Theme Customizer live preview. To leverage
 * this, set your custom settings to 'postMessage' and then add your handling
 * here. Your javascript should grab settings from customizer controls, and 
 * then make any necessary changes to the page using jQuery.
 */
( function( $ ) {
    
    var api = wp.customize

    /* LIVE CSS
    ============================================================================= */
	api.bind( 'preview-ready', function() {

        // Inline CSS not exists, insert it to <head />
        var style = $( '#css-preview' );
        if ( ! style.length ) {
            style = $( '<style id="css-preview" />' );
            // to make it the last element
            $( 'head' ).append( style );
        }

        window.css = {}
        window.builder_css = {}
        window.sumup = function() {
            style.html( collect_builder_pieces() + collect_normal_pieces() )
        }
        window.collect_normal_pieces = function() {
            pieces = []
            for ( var setting_name in window.css ) {
                var css_piecce = window.css[ setting_name ]
                for ( var single_piece of css_piecce ) {
                    
                    // get the latest value here
                    if ( single_piece.id ) {
                        var value = api( single_piece.id )()
                        if ( single_piece.field ) {
                            if ( undefined !== value[ single_piece.field ] ) {
                                value = value[ single_piece.field ]
                            } else {
                                continue
                            }
                        }
                        if ( single_piece.use ) {
                            if ( undefined !== value[ single_piece.use ] ) {
                                value = value[ single_piece.use ]
                            } else {
                                continue
                            }
                        }
                        var final_value = value
                    } else {
                        var final_value = single_piece.value 
                    }

                    if ( '' === final_value ) {
                        continue
                    }
                    if ( undefined === final_value ) {
                        continue
                    }

                    // unit
                    if ( single_piece.unit && ! isNaN( final_value ) ) {
                        final_value += single_piece.unit
                    }
                    // css pattern
                    if ( single_piece.value_pattern ) {
                        final_value = single_piece.value_pattern.replaceAll( '$', final_value )
                    }

                    if ( single_piece.media_query ) {
                        var piece = single_piece.media_query + '{' + single_piece.selector + '{' + single_piece.property + ':' + final_value + '}' + '}'
                    } else {
                        var piece = single_piece.selector + '{' + single_piece.property + ':' + final_value + '}'
                    }
                    pieces.push( piece )
                }
            }
            pieces = pieces.join( '' )
            return pieces
        }

        window.collect_builder_pieces = function() {
            pieces = []
            for ( var builder_id in window.builder_css ) {
                for ( var section_id in window.builder_css[ builder_id ] ) {
                    var section_css = window.builder_css[builder_id][ section_id ]
                    for ( var field_id in section_css ) {
                        css_arr = section_css[ field_id ]
                        for ( var single_piece of css_arr ) {
                            if ( '' === single_piece.value ) {
                                continue
                            }
                            if ( undefined === single_piece.value ) {
                                continue
                            }
                            /**
                             * value filter
                             */
                            var final_value = single_piece.value
                            // unit
                            if ( single_piece.unit && ! isNaN( final_value ) ) {
                                final_value += single_piece.unit
                            }
                            // css pattern
                            if ( single_piece.value_pattern ) {
                                final_value = single_piece.value_pattern.replaceAll( '$', final_value )
                            }
                            if ( single_piece.media_query ) {
                                var piece = single_piece.media_query + '{' + single_piece.selector + '{' + single_piece.property + ':' + final_value + '}' + '}'
                            } else {
                                var piece = single_piece.selector + '{' + single_piece.property + ':' + final_value + '}'
                            }
                            pieces.push( piece )
                        }
                    }
                }
            }
            pieces = pieces.join( '' )
            return pieces
        }

        api.preview.bind( 'window_css', function( data ) {
            window.css = data
            
            // watch the changes
            for ( var setting_name in window.css ) {
                api( setting_name, function( value ) {
                    value.setting_name = setting_name
                    value.bind( function(newval) {
                        sumup()
                    })
                })
            }

            // on init to get updated css
        })

        /**
         * css is template
         */
        window.init_builder_section_css = function( builder_id, section_id, section_value, css ) {
            /**
             * STEP 1: set up section_css from css template
             */
            var section_css = {}
            for ( var field_id in css ) {
                css_arr = css[ field_id ]
                field_value = section_value[ field_id ]
                new_css_arr = []
                for ( var i in css_arr ) {
                    single_css = {}
                    for ( var k in css_arr[i] ) {
                        single_css[k] = css_arr[i][k]
                    }
                    single_css.selector = single_css.selector.replaceAll( '{{section}}', section_id )
                    if ( undefined !== field_value ) {
                        if ( single_css.use ) {
                            single_css.value = field_value[ single_css.use ]
                        } else {
                            single_css.value = field_value
                        }
                    }
                    new_css_arr.push( single_css )
                }
                section_css[field_id] = new_css_arr
            }
            window.builder_css[ builder_id ][ section_id ] = section_css

            /**
             * STEP 2: bind value change
             */
            api( section_id + '__css', function( section ) {
                // name value whatever tf but id, DO NOT value.id = section_id =)))))))
                section.section_id = section_id
                section.builder_id = builder_id
                section.css = section_css
                
                section.bind( function( newval ) {

                    // fill the value
                    for ( var field_id in section.css ) {
                        css_arr = section.css[ field_id ]
                        field_value = newval[ field_id ]
                        for ( var i in css_arr ) {
                            single_css = css_arr[i]
                            use = single_css.use
                            if ( use ) {
                                single_css.value = field_value[use]
                            } else {
                                single_css.value = field_value
                            }
                            css_arr[i] = single_css
                        }
                        section.css[field_id] = css_arr
                    }

                    window.builder_css[section.builder_id][section.section_id] = section.css
                    sumup()

                })
            })
        }

        api.preview.bind( 'window_builder_css', function( data ) {

            // this is map home_builder => { section_1 => { field_1 => .. }, section_2 => .. }
            window.builder_css = {}
            window.css_template = {}

            for ( var builder_id in data ) {
                window.builder_css[ builder_id ] = {}
                
                var sectionlist = data[builder_id].sectionlist,
                    css = data[ builder_id ].css
                
                // save the CSS template for later use
                window.css_template[ builder_id ] = css
                for ( var section_id of sectionlist ) {

                    section_value = data[builder_id][ section_id ]

                    init_builder_section_css( builder_id, section_id, section_value, css )
                    section_css = window.builder_css[ builder_id ][ section_id ]

                }    
            }

        })

        api.preview.bind( 'section-added', function( data ) {
            var css = window.css_template[ data.builder_id ]
            init_builder_section_css( data.builder_id, data.section_id, data.section_value, css )
            sumup()
        });

	});

    /* SECTION LIST ON CHANGE
    ============================================================================= */
    api.bind( 'preview-ready', function() {
        
        var sectionlist = api( 'h[sectionlist]' )(),
            preload_sectionlist = api( 'h[preload_sectionlist]' )(),
            combined_sectionlist = sectionlist.concat( preload_sectionlist )
        
        for ( var section_id of combined_sectionlist ) {
            api( section_id, function( value ) {
                value.bind( function( newval ) {

                    var section_element = $( '.' + value.id )
                    if ( ! section_element.length ) {
                        return;
                    }

                    // sidebar position
                    var sidebar_position = newval.sidebar_position
                    section_element.removeClass( 'hassidebar--right hassidebar--left' )
                    if ( newval.sidebar ) {
                        section_element.addClass( 'hassidebar--' + sidebar_position )
                    }

                    // section sidebar
                    section_element.removeClass( 'hassidebar--sticky' )
                    if ( newval.sidebar ) {
                        section_element.addClass( 'hassidebar' )
                        section_element.removeClass( 'section56--nosidebar' )

                        // sticky
                        if ( newval.sidebar_sticky ) {
                            section_element.addClass( 'hassidebar--sticky' )
                        }
                    } else {
                        section_element.removeClass( 'hassidebar' )
                        section_element.addClass( 'section56--nosidebar' )
                    }

                    // section hide
                    if ( newval.hide ) {
                        section_element.addClass( 'section56--disable' )
                    } else {
                        section_element.removeClass( 'section56--disable' )
                    }

                    // responsiveness
                    section_element.addClass( 'disable--desktop disable--tablet disable--mobile' )
                    for ( var device of newval.responsiveness ) {
                        section_element.removeClass( 'disable--' + device )
                    }

                    // stretch
                    section_element.removeClass( 'section56--stretch-content section56--stretch-fullwidth section56--stretch-narrow' )
                    section_element.addClass( 'section56--stretch-' + newval.stretch )
                    
                } );
            })
        }

    });

    /* FONTS LOAD
    @todo57: we will load google fonts array to put fallback fonts correctly
    ============================================================================= */
    api( 'body_font', function( value ) {
        value.bind( function( newval ) {
            var root = ':root{--font-body:' + newval + '}'
            root = '<style>' + root + '</style>'
            jQuery( 'head' ).append( root )
        } );
    });

    api( 'heading_font', function( value ) {
        value.bind( function( newval ) {
            var root = ':root{--font-heading:' + newval + '}'
            root = '<style>' + root + '</style>'
            jQuery( 'head' ).append( root )
        } );
    });

    api( 'nav_font', function( value ) {
        value.bind( function( newval ) {
            var root = ':root{--font-nav:' + newval + '}'
            root = '<style>' + root + '</style>'
            jQuery( 'head' ).append( root )
        } );
    });

    api( 'custom_1_font', function( value ) {
        value.bind( function( newval ) {
            var root = ':root{--font-custom-1:' + newval + '}'
            root = '<style>' + root + '</style>'
            jQuery( 'head' ).append( root )
        } );
    });

    api( 'custom_2_font', function( value ) {
        value.bind( function( newval ) {
            var root = ':root{--font-custom-2:' + newval + '}'
            root = '<style>' + root + '</style>'
            jQuery( 'head' ).append( root )
        } );
    });

    api( 'accent_color', function( value ) {
        value.bind( function( newval ) {
            var root = ':root{--accent-color:' + newval + '}'
            root = '<style>' + root + '</style>'
            jQuery( 'head' ).append( root )
        } );
    });

    api.bind( 'preview-ready', function() {
        api.preview.bind( 'load-font', function( face ) {
            console.log( face )
            var face_plus_version = face.replaceAll( ' ', '+' )
            $( 'head' ).append( '<link href="https://fonts.googleapis.com/css?family=' + face_plus_version + ':100,100italic,200,200italic,300,300italic,regular,italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic" rel="stylesheet" />' )
        })
    });

    /* LAYOUT
    ============================================================================= */
    api( 'layout_boxed', function( value ) {
        value.bind( function( newval ) {
            if ( newval ) {
                jQuery( 'body' ).addClass( 'layout-boxed' )
            } else {
                jQuery( 'body' ).removeClass( 'layout-boxed' )
            }
        } );
    });

    /* TOPBAR
    ============================================================================= */
    var sections = [ 'topbar', 'main_header', 'header_bottom' ]
    for ( var section of sections ) {
        // stretch
        api( section + '_stretch', function( value ) {
            value.bind(function(newval){
                var section = value.id.replace( '_stretch', '' )
                var selector = '.' + section + '56__container'
                $( selector ).removeClass( 'stretch--full stretch--content' )
                $( selector ).addClass( 'stretch--' + newval )
            })
        })
        // text skin
        api( section + '_text_skin', function( value ) {
            value.bind(function(newval){
                var section = value.id.replace( '_text_skin', '' )
                var selector = '.' + section + '56__container'
                $( selector ).removeClass( 'textskin--light textskin--dark' )
                $( selector ).addClass( 'textskin--' + newval )
            })
        })
    }

    /* SINGLE HEADER ALIGN
    ============================================================================= */
    api( 'single_header_align', function( value ) {
        value.bind( function( newval ) {
            jQuery( '.single56__header' ).removeClass( 'align-left align-center align-right' ).addClass( 'align-' + newval )
        } );
    });

    /* off-canvas showing up when we customizing it
    ============================================================================= */
    wp.customize.bind( 'preview-ready', function() {
        wp.customize.preview.bind( 'show_offcanvas', function() {
            $( 'html' ).addClass( 'in-offcanvas-permanent' )
        });

        wp.customize.preview.bind( 'hide_offcanvas', function() {
            $( 'html' ).removeClass( 'in-offcanvas-permanent' )
        });
    });

    /* single side dock
    ============================================================================= */
    api.bind( 'preview-ready', function() {
        wp.customize.preview.bind( 'show_single_sidedock', function() {
            $( 'html' ).addClass( 'in-single-sidedock-permanent' )
        });

        wp.customize.preview.bind( 'hide_single_sidedock', function() {
            $( 'html' ).removeClass( 'in-single-sidedock-permanent' )
        });
    });

    /* PARTIAL SELECTIVE TO FRONTEND
    ============================================================================= */
    api.bind( 'preview-ready', function() {
        
        api.selectiveRefresh.bind( 'partial-content-rendered', function( placement ) {
            /*
                placement.partial.id "section_1_layout"
                placement.partial.params
                    primarySetting: "fox56_section_1_layout"
                    selector: ".section--1  .primary56"
                placement.addedContent "html content goes here"
            */
           jQuery( document ).trigger( 'partial-refresh', [ placement.partial.id, placement.partial.params.selector ])

        } );
        
	});
    
})( jQuery );