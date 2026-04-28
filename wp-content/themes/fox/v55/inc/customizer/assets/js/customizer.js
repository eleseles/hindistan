/**
 * @since 1.0
 */
( function( $, api ) {
    
    var css = {};
        
    // MULTICHECKBOX
    // ========================
	api.controlConstructor.multicheckbox = api.Control.extend({
		ready: function() {
            var control = this,
                container = this.container,
                hidden = this.container.find( '.checkbox-result' ),
				inputs = this.container.find( 'input[type="checkbox"]' ),
                values = control.setting();
            
            if ( 'string' === typeof values ) values = values.split( ',' );
            
            /**
             * sum up the changes
             */
            var sumup = function() {
                
                var checkbox_values = container.find( 'input[type="checkbox"]:checked' ).map(
                    function(){
                        return this.value;
                    }
                ).get().join( ',' );
                
                control.setting.set( checkbox_values );
                
            }
            
            inputs.each(function(){
                var checked = values.indexOf( $(this).attr( 'value' ) ) > -1;
                $( this ).prop( 'checked', checked );
                $( this ).on( 'change', sumup );
            });
            
            // set default
            if ( 'string' !== typeof values ) values = values.join( ',' );
            hidden.val( values );
            
		}
	});
    
    // MULTISELECT
    // ========================
	api.controlConstructor.multiselect = api.Control.extend({
		ready: function() {
            var control = this,
                container = this.container,
                select = this.container.find( 'select' ),
                values = control.setting();
            
            if ( 'string' === typeof values ) values = values.split( ',' );
            
            select.on( 'change', function() {
                if ( ! select.val() ) {
                    values = []
                } else {
                    values = select.val()
                }
                control.setting.set( values );
                console.log( values )
            })
            
		}
	});
    
    // MULTIPLE TEXT
    // since 4.0
    // ========================
    api.controlConstructor.multiple_text = api.Control.extend({
        
        ready: function() {
            
            var control = this,
                value = control.setting(),
                container = this.container,
                wrap = container.find( '.fox-multiple-text-control' );
            
            try {
                
                value = JSON.parse( value );
                
            } catch( err ) {
                
                value = {}
                
            }
            
            /**
             * sum up the changes
             */
            var sumup = function() {
                
                var sum = {};
                wrap.find('[data-id]').each(function() {
                    
                    var input = $( this ),
                        id = input.data( 'id' ),
                        val = input.val();
                    
                    sum[ id ] = val;
                    
                });
                
                control.setting.set( JSON.stringify( sum ) );
                
            }
            
            /**
             * initial set up and bind change event
             */
            wrap.find('[data-id]').each(function() {
                
                var input = $( this ),
                    id = input.data( 'id' ),
                    val = value[ id ];
                
                input.val( val );
                input.on( 'change', sumup );
                
            });
            
        }
        
    });
    
    // BACKGROUND
    // since 4.0
    // ========================
    api.controlConstructor.fox_background = api.Control.extend({
        
        ready: function() {
            
            var control = this,
                value = control.setting(),
                container = this.container,
                wrap = container.find( '.fox-background-control' );
            
            try {
                
                value = JSON.parse( value );
                
            } catch( err ) {
                
                value = {}
                
            }
            
            /**
             * sum up the changes
             */
            var sumup = function() {
                
                var sum = {};
                wrap.find('[data-prop]').each(function() {
                    
                    var input = $( this ),
                        prop = input.data( 'prop' ),
                        val = input.val();
                    
                    sum[ prop ] = val;
                    
                });
                
                control.setting.set( JSON.stringify( sum ) );
                
            }
            
            /**
             * initial set up and bind change event
             */
            wrap.find('[data-prop]').each(function() {
                
                var input = $( this ),
                    prop = input.data( 'prop' ),
                    val = value[ prop ];
                
                input.val( val );
                input.on( 'change', sumup );
                
                /**
                 * color
                 */
                if ( input.is( '.background-input-color' ) ) {
                    
                    input.wpColorPicker({
                        change: function( event, ui ) {
                            input.val( ui.color.toString() );
                            input.trigger( 'change' );
                        },
                    });
                    
                }
                
                /**
                 * thickbox media
                 */
                if ( input.is( '.background-input-image' ) ) {
                    
                    var uploadWrapper = input.closest( '.wi-upload-wrapper' ),
                        holder = uploadWrapper.find( '.image-holder' ),
                        button = uploadWrapper.find( '.upload-image-button' );
                    
                    if ( val ) {
                        
                        wp.media.attachment( val ).fetch().then(function (data) {
                          // preloading finished
                          // after this you can use your attachment normally
                          var url = wp.media.attachment( val ).get('url');
                            holder.prepend( '<img src="' + url + '" />' );
                        });
                        
                        var change_text = 'Change Image'
                        if ( WITHEMES_ADMIN ) {
                            change_text = WITHEMES_ADMIN.l10n.change_image
                        }
                        
                        if ( button.is( 'button' ) ) {
                            button.text( change_text );
                        } else {
                            button.val( change_text );
                        }
                        
                    }
                    
                }
                
            });
            
        }
        
    });
    
    // BOX
    // since 4.0
    // ========================
    api.controlConstructor.box = api.Control.extend({
        
        ready: function() {
            
            var control = this,
                value = control.setting(),
                container = this.container,
                wrap = container.find( '.fox-box-control-wrapper' );
            
            try {
                
                value = JSON.parse( value );
                
            } catch( err ) {
                
                value = {}
                
            }
            
            /**
             * sum up the changes
             */
            var sumup = function() {
                
                var sum = {};
                wrap.find('[data-prop]').each(function() {
                    
                    var input = $( this ),
                        prop = input.data( 'prop' ),
                        val = input.val();
                    
                    sum[ prop ] = val;
                    
                });
                
                control.setting.set( JSON.stringify( sum ) );
                
            }
            
            /**
             * initial set up and bind change event
             */
            wrap.find('[data-prop]').each(function() {
                
                var input = $( this ),
                    prop = input.data( 'prop' ),
                    val = value[ prop ];
                
                input.val( val );
                input.on( 'change', sumup );
                
                /**
                 * color
                 */
                if ( input.is( '.box-input-color' ) ) {
                    
                    input.wpColorPicker({
                        change: function( event, ui ) {
                            input.val( ui.color.toString() );
                            input.trigger( 'change' );
                        },
                    });
                    
                }
                
            });
            
            /**
             * tab control
             */
            wrap.find( '.fox-box-control-tabs' ).find( 'li' ).on( 'click', function( e ) {
                
                e.preventDefault();
                
                var li = $( this ),
                    tab = li.data( 'tab' );
                
                wrap.find( '.fox-box-control-tabs' ).find( 'li' ).removeClass( 'active' );
                wrap.find( '.fox-box-control' ).removeClass( 'active' );
                
                li.addClass( 'active' );
                wrap.find( '.fox-box-control[data-tab="' + tab + '"]' ).addClass( 'active' );
                
            });
            
        }
        
    });
    
    // TYPOGRAPHY
    // since 4.0
    // ========================
    api.controlConstructor.typography = api.Control.extend({
        
        ready: function() {
            
            var control = this,
                value = control.setting(),
                container = this.container,
                wrap = container.find( '.fox-typography' );
            
            try {
                
                value = JSON.parse( value );
                
            } catch( err ) {
                
                value = {}
                
            }
            
            /**
             * sum up the changes
             */
            var sumup = function() {
                
                var sum = {};
                wrap.find('[data-prop]').each(function() {
                    
                    var input = $( this ),
                        prop = input.data( 'prop' ),
                        val = input.val();
                    
                    sum[ prop ] = val;
                    
                });
                
                control.setting.set( JSON.stringify( sum ) );
                
            }
            
            /**
             * initial set up and bind change event
             */
            wrap.find('[data-prop]').each(function() {
                
                var input = $( this ),
                    prop = input.data( 'prop' ),
                    val = value[ prop ];
                
                input.val( val );
                input.on( 'change', sumup );
                
            });
                
        }
        
    });
    
    // SELECT FONT
    // since 4.0
    // ========================
    api.controlConstructor.select_font = api.Control.extend({
        
        ready: function() {
            
            var control = this,
                value = control.setting(),
                container = this.container,
                wrap = container.find( '.fox-select-font-wrapper' ),
                select = wrap.find( 'select' ),
                div = container.find( '.fox-select-font' ),
                input = div.find( '.font-input' ),
                params = this.params,
                type = params.type,
                source = Object.keys( FOX_CUSTOMIZER.fonts );
            
            /**
             * we're given data from theme settings
             * in this, we use that data to display corresponding weights
             * value is like Open+Sans:400,400italic
             */
            var dataToDisplay = function( value ) {
                
                if ( ! value ) return;
                
                let explode = value.split( ':' ),
                    face = explode[0], // Open+Sans
                    styles = explode[1]; // 400,400italic
                
                // first hide all
                div
                .find( '.font-weight' )
                .removeClass( 'show' );
                
                // empty face
                if ( ! face ) return;
                
                // replace + by ' '
                face = face.replace( '+', '' );
                
                // if face is not in the font array
                // then don't care about weights
                if ( undefined === FOX_CUSTOMIZER.fonts[ face ] ) {
                    input.val( face );
                    return;
                }
                
                var availableStyles = FOX_CUSTOMIZER.fonts[ face ];
                
                // put the face to input first
                input.val( face );
                
                // case regular font
                if ( ! availableStyles.length ) {
                    return;
                }
                
                if ( styles ) {
                    styles = styles.split( ',' ).map(function(e){return e.trim();});
                }
                
                // show all available styles
                $.each( availableStyles, function( k, val ) {
                    
                    // the w_val is 400 while val is 'regular'
                    let w_val = val.toLowerCase();
                    
                    if ( 'regular' == w_val ) {
                        w_val = '400';
                    } else if ( 'italic' == w_val ) {
                        w_val = '400italic'
                    }
                    
                    // show the available style
                    let availableW = div.find( '.font-weight[data-weight="' + w_val + '"]' );
                    
                    // for some reason
                    if ( ! availableW.length ) return;
                    
                    availableW.addClass( 'show' );
                    
                    // then check to the style in the value
                    if ( ! styles ) return;
                    if ( styles.includes( val ) || styles.includes( w_val ) ) {
                        availableW.find( 'input[type="checkbox"]' ).prop( 'checked', true );
                    }
                    
                
                });
                
            }
            
            // capitalize
            // why JS doesn't have this function?
            var capitalize = function( s ) {
                if ( typeof s !== 'string' ) return '';
                return s.charAt(0).toUpperCase() + s.slice(1);
            }
            var toTitleCase = function( str ) {
                let explode = str.split( ' ' );
                $.each( explode, function( k, v ) {
                    explode[k] = capitalize( v );
                });
                return explode.join( ' ' );
            }
            
            /**
             * From displays to data, set final value to control
             */
            var displayToData = function() {
                
                // collect all available data
                let value = input.val(),
                    finalValue = '',
                    weights = [];
                
                // first hide all
                div
                .find( '.font-weight' )
                .removeClass( 'show' );
                
                // no value for some reason
                if ( ! value ) {
                    input.val( '' );
                    control.setting.set('');
                    return;
                }
                
                // to capitalize, like open sans --> Open Sans
                value = toTitleCase( value );
                
                let availableStyles = FOX_CUSTOMIZER.fonts[ value ];
                
                // set final value first
                finalValue = value;
                
                // case Google Font
                if ( undefined !== availableStyles ) {
                    
                    $.each( availableStyles, function( k, val ) {
                        
                        // the w_val is 400 while val is 'regular'
                        let w_val = val.toLowerCase();

                        if ( 'regular' == w_val ) {
                            w_val = '400';
                        } else if ( 'italic' == w_val ) {
                            w_val = '400italic'
                        }

                        // show the available style
                        let availableW = div.find( '.font-weight[data-weight="' + w_val + '"]' );
                        
                        // for some reason it's not found
                        if ( ! availableW.length ) return;
                        
                        // show it
                        availableW.addClass( 'show' );
                        
                        // if this is checked
                        // add this to weights array
                        if ( availableW.find( 'input[type="checkbox"]' ).prop( 'checked' ) ) {
                            weights.push( val );
                        }
                    
                    });
                    
                }
                
                if ( weights.length ) {
                    finalValue += ( ':' + weights.join( ',' ) );
                }
                
                // finally, set the value
                control.setting.set( finalValue );
                
            }
            
            // when input changed or checkbox changed, refresh it
            div.find( '.font-weight input[type="checkbox"]' ).on( 'change', displayToData );
            input.on( 'change', displayToData );
            
            input.autocomplete({
                source: source,
                // delay: 100,
                minLength: 1,
                autoFocus: false,
                select: function( event, ui ) {
                    
                    input.val( ui.item.value );
                    setTimeout( displayToData, 50 );
                    
                },
            });
            
            // if we have select, ie. it's inherit font mode
            if ( select.length ) {
                
                // onchange
                select.on( 'change', function() {

                    let value = $( this ).val();

                    // show the custom div
                    if ( ! FOX_CUSTOMIZER.primary_fonts.includes( value ) ) {

                        div.addClass( 'show' );

                        // run to take value from input
                        displayToData();

                    // hide the custom div
                    } else {

                        // and just set it as a regular select
                        div.removeClass( 'show' );
                        control.setting.set( value );

                    }

                });

                // if not in 3 values, it's a custom font
                // then run dataToDisplay of value
                if ( ! FOX_CUSTOMIZER.primary_fonts.includes( value ) ) {

                    div.addClass( 'show' );
                    select.val( 'font_custom' );
                    dataToDisplay( value );

                // otherwise, it's just a normal font
                // set it to select
                } else {

                    select.val( value );
                    div.removeClass( 'show' );

                }
            
            // otherwise, just run dataToDisplay of initial value
            } else {
            
                div.addClass( 'show' );
                dataToDisplay( value );
                
            }
            
		}
        
    });
    
    // IMAGE RADIO
    // ========================
    api.controlConstructor.image_radio = api.Control.extend({
        
        ready: function() {
            var control = this,
                container = this.container,
                params = this.params,
                type = params.type,
                input;
            
            input = container.find( 'input[type="radio"]' );
            input.filter('[value=\'' + control.setting() + '\']').prop( 'checked', true );

            input.on( 'change', function() {
                var value = container.find( 'input[type="radio"]:checked' ).val();
                control.setting.set( value );
            });

            // when setting changes
            this.setting.bind( function ( value ) {

                input.filter('[value=\'' + value + '\']').prop( 'checked', true );

            });
		}
        
    });
    
    // HOME BUILDER
    // since 4.5
    // ========================
    api.controlConstructor.home_builder = api.Control.extend({
        
        ready: function() {
            var control = this,
                container = this.container,
                params = this.params,
                type = params.type,
                input;
            
            
            /* ------------------------------------------------------------------------------------------------------------------------
            /* Homepage Builder
            /* @since 4.5
            ------------------------------------------------------------------------------------------------------------------------ */
            var builder = $( '#builder' )
            
            // -------------------- CONDITIONAL SHOW/HIDE
            // --------------------
            var run_conditional = function( self ) {
                
                // worst case
                if ( ! self || ! self.length ) {
                    return
                }
                
                var val = self.val(),
                    field = self.closest( '.section-field' ),
                    id = field.data( 'id' ),
                    section = field.closest( '.builder-section' )
                
                // we do not do conditional for section norm
                if ( section.hasClass( 'section-norm' ) ) {
                    return
                }
                
                // case 1: value change
                if ( FOX_CUSTOMIZER.builder_fields[ id ] && 'toggle' in FOX_CUSTOMIZER.builder_fields[ id ] ) {
                    
                    toggle = FOX_CUSTOMIZER.builder_fields[ id ][ 'toggle' ]
                    
                    // hide all fields in all values
                    for ( value in toggle ) {
                        affected_ids = toggle[ value ] // array of ids
                        
                        // only check this if field is visible
                        if ( ! field.hasClass( 'outvalue' ) ) {
                            if ( value == val ) {
                                continue
                            }
                        }
                        
                        for ( var j = 0; j < affected_ids.length; j++ ) {
                            affected_id = affected_ids[ j ]
                            section.find( '.section-field[data-id="' + affected_id + '"]' ).addClass( 'outvalue' )
                        }
                    }
                    
                    // now only show fields with value val
                    // only check this if field is visible
                    if ( ! field.hasClass( 'outvalue' ) ) {
                        affected_ids = toggle[ val ] // array of ids
                        if ( affected_ids ) {
                            for ( j = 0; j < affected_ids.length; j++ ) {
                                affected_id = affected_ids[ j ]
                                section.find( '.section-field[data-id="' + affected_id + '"]' ).removeClass( 'outvalue' )
                            }
                        }
                    }
                    
                }
                
            }
            
            // -------------------- POPULATE DATA
            // --------------------
            for ( var k = 0; k < FOX_CUSTOMIZER.builder_data.length; k++ ) {
                
                var section_data = FOX_CUSTOMIZER.builder_data[ k ],
                    section_id = section_data[ 'id' ]
                
                if ( ! section_id ) {
                    section_id = k + 1
                }
                
                var is_norm = ( section_id == 'norm' )
                
                html_section = $( '.section-sample' ).clone()
                html_section.removeClass( 'section-sample' )
                
                /**
                 * adjust radio name
                 */
                html_section.find( 'input[type="radio"]' ).each(function(){
                    var self = $( this ),
                        self_name = self.attr( 'name' )
                    
                    self.attr( 'name', 'radio-' + section_id + '-' + self_name )
                })
                
                if ( is_norm ) {
                    
                    html_section.addClass( 'section-norm' )
                    
                    // remove actions from norm
                    html_section.find( '.section-action-menu' ).remove() // remove actions
                    
                    // remove unnecessary tabs
                    html_section.find( '.section-tabs' ).find( 'li[data-tab="layout"]' ).remove()
                    html_section.find( '.section-tabs' ).find( 'li[data-tab="query"]' ).remove()
                    html_section.find( '.section-tabs' ).find( 'li[data-tab="heading"]' ).addClass( 'active' )
                    
                    // remove unneccesary fields
                    html_section.find( '.section-field[data-tab="layout"]' ).remove()
                    html_section.find( '.section-field[data-tab="query"]' ).remove()
                    html_section.find( '.section-field[data-tab="heading"]' ).addClass( 'intab' )
                    
                    html_section.find( '.section-field[data-id="sidebar"]' ).remove()
                    html_section.find( '.section-field[data-id="sidebar_position"]' ).remove()
                    
                } else {
                    
                    html_section.addClass( 'section-normal' )
                    
                }
                
                // set the key
                html_section.data( 'id', section_id )
                
                html_section.appendTo( builder )
                
                // populate data
                html_section.find( '.section-field' ).each( function() {
                    
                    var field = $( this ),
                        id = field.data( 'id' ),
                        input = field.find( '.changable-field' ),
                        type = field.data( 'type' ),
                        val = section_data[ id ]
                    
                    // ie. this field doesn't have input field
                    if ( ! input.length ) {
                        return
                    }
                    
                    // case section_data doesn't have value for id
                    if ( undefined === val ) {
                        return
                    }
                    
                    if ( 'text' == type || 'textarea' == type || 'select' == type || 'multiselect' == type ) {

                        input.val( val )

                    } else if ( 'checkbox' == type ) {

                        if ( val ) {
                            input.prop('checked', true)
                        } else {
                            input.prop('checked', false)
                        }

                    } else if ( 'multicheckbox' == type ) {
                        
                        if ( ! val ) {
                            val = []
                        }

                        input.each( function() {
                            if ( val.includes( $( this ).val() ) ) {
                                $( this ).prop('checked', true)
                            } else {
                                $( this ).prop('checked', false )
                            }
                        })

                    } else if ( 'radio' == type || 'image_radio' == type ) {

                        input.each( function() {
                            if ( val == $( this ).val() ) {
                                $( this ).prop('checked', true)
                            }
                        })
                        
                    /**
                     * note: value is ID of photo so we must get the URL of photo
                     */
                    } else if ( 'image' == type ) {
                        
                        input.val( val )
                        
                        var holder = input.prev( '.image-holder' )
                        if ( ! holder.length ) {
                            return;
                        }
                        
                        var button = input.next( '.button' )
                        
                        if ( val ) {
                        
                            wp.media.attachment( val ).fetch().then(function (data) {
                              // preloading finished
                              // after this you can use your attachment normally
                              var url = wp.media.attachment( val ).get('url');
                                holder.prepend( '<img src="' + url + '" />' );
                            });

                            var change_text = 'Change Image'
                            if ( WITHEMES_ADMIN ) {
                                change_text = WITHEMES_ADMIN.l10n.change_image
                            }

                            if ( button.is( 'button' ) ) {
                                button.text( change_text );
                            } else {
                                button.val( change_text );
                            }

                        }

                    // all worst cases    
                    } else {

                        input.val( val )

                    }

                    run_conditional( input )
                    
                })

            }
            
            // -------------------- EDIT SECTION NAME
            // --------------------
            $( document ).on( 'click', '.section-edit-name', function( e ) {
                
                var self = $( this )
                
                e.preventDefault()
                self.closest( '.section-name' ).addClass( 'inedit' )
                
                // close menu
                $( '.section-action-menu ul' ).hide()
                
                setTimeout(function(){
                    self.closest( '.section-name' ).find( '.section-name-h' ).focus()
                }, 100 )
                
            })
            
            $( document ).on( 'click', function( e ) {
                if ( ! $( e.target ).is( '.section-name' ) && ! $( e.target ).closest( '.section-name' ).length ) {
                    $( '.section-name' ).removeClass( 'inedit' )
                }
            })
            
            // -------------------- SECTION ACTION MENU
            // --------------------
            $( document ).on( 'click', '.section-action-menu-btn', function( e ) {
                
                e.preventDefault()
                
                // close everything
                $( '.section-action-menu ul' ).hide()
                $( '.builder-section' ).css( 'z-index', '' )
                
                var a = $( this )
                a.closest( '.builder-section').css( 'z-index', '100' );
                a.next( 'ul' ).toggle()
                
            })
            
            $( document ).on( 'click', function( e ) {
                
                if ( ! $( e.target ).is( '.section-action-menu' ) && ! $( e.target ).closest( '.section-action-menu' ).length ) {
                    $( '.section-action-menu ul' ).hide()
                    $( '.builder-section' ).css( 'z-index', '' )
                }
                
            })
            
            // -------------------- HEADER TOGGLE
            // --------------------
            $( document ).on( 'click', '.section-name', function( e ) {
                e.preventDefault()
                
                // except the edit button
                if ( $( e.target ).is( '.section-action-menu' ) || $( e.target ).closest( '.section-action-menu' ).length ) {
                    return
                }
                
                var title = $( this ),
                    next_content = title.parent().next( '.section-content' ),
                    section = title.closest( '.builder-section' )
                
                if ( next_content.hasClass( 'active' ) ) {
                    next_content.slideUp( 'fast' ).removeClass( 'active' )
                    section.removeClass( 'active' )
                } else {
                    $( '.builder-section' ).removeClass( 'active' )
                    $( '.section-content.active' ).slideUp( 'fast' ).removeClass( 'active' )
                    next_content.slideDown( 'fast' ).addClass( 'active' )
                    section.addClass( 'active' )
                }
                
            });
            
            // -------------------- TABS
            // --------------------
            $( document ).on( 'click', '.section-tabs a', function( e ) {
                
                e.preventDefault()
                var a = $( this ),
                    tab = a.parent().data( 'tab' ),
                    tabs = a.closest( '.section-tabs' ),
                    section = a.closest( '.builder-section' )
                
                // tabs
                tabs.find( 'li' ).removeClass( 'active' )
                a.parent().addClass( 'active' )
                
                // fields
                section.find( '.section-field' ).removeClass( 'intab' )
                
                section.find( '.section-field[data-tab="' + tab + '"]' ).addClass( 'intab' )
                
            })
            
            // -------------------- TRIGGER CHANGE WHEN ANY FIELD CHANGED
            // --------------------
            $( document ).on( 'change', '.changable-field', function( e ) {
                
                var self = $( this )
                
                // don't trigger for name change
                if ( self.hasClass( 'section-name-h' ) ) {
                    return
                }
                
                run_conditional( self )
                sumup()
                
            })
            
            // -------------------- ADD SECTION
            // --------------------
            $( document ).on( 'click', '.add-section', function( e ) {
                
                e.preventDefault()
                
                var btn = $( this ),
                    position = btn.data( 'position' ),
                    currentSection = btn.closest( '.section-norm' ) // we only work with norm section
                
                if ( ! currentSection.length ) {
                    return
                }
                
                html_section = $( '.section-sample' ).clone()
                html_section.removeClass( 'section-sample' )
                
                /**
                 * adjust radio name
                 */
                var section_id = $( '.builder-section' ).length + 1
                html_section.find( 'input[type="radio"]' ).each(function(){
                    var self = $( this ),
                        self_name = self.attr( 'name' )
                    
                    self.attr( 'name', 'radio-' + section_id + '-' + self_name )
                })
                
                if ( 'after' == position ) {
                    html_section.insertAfter( currentSection )
                } else {
                    html_section.insertBefore( currentSection )
                }
                
                /* this code is to close all sections and open the newly added section
                $( '.builder-section' ).removeClass( 'active' )
                $( '.section-content.active' ).slideUp( 'fast' ).removeClass( 'active' )
                
                html_section.find( '.section-content' ).slideDown( 'fast' ).addClass( 'active' )
                html_section.addClass( 'active' )
                */
                
                // run conditional
                html_section.find( '.section-field' ).each( function() {
                    
                    var field = $( this ),
                        input = field.find( '.changable-field' )
                    
                    run_conditional( input )
                })
                
                // refresh the sortable function
                $( '#builder' ).sortable( 'refresh' )
                
                // activate sumup
                sumup()
                
                // -------------------- COLOR PICKER
                // --------------------
                // since 4.6.2.3
                $( '.builder-section:not(.section-sample) .color-picker' ).wpColorPicker({
                    change: _.throttle( function() { // For Customizer
                        $(this).trigger( 'change' );
                    }, 3000 )
                });
                
            })
            
            // -------------------- DUPLICATE / REMOVE SECTION
            // --------------------
            $( document ).on( 'click', '.section-action-menu a[data-action]', function( e ) {
                
                e.preventDefault()
                
                // close menu
                $( '.section-action-menu ul' ).hide()
                
                var self = $( this ),
                    section = self.closest( '.builder-section' ),
                    action = self.data( 'action' )
                
                switch( action ) {
                        
                    case 'duplicate' :
                        
                        // just in case
                        if ( section.hasClass( 'section-norm' ) ) {
                            return
                        }
                        
                        html_section = section.clone()
                        html_section.insertAfter( section )
                        
                        // copy all field values
                        html_section.find( '.changable-field' ).each( function() {
                            
                            var field = $( this ).closest( '.section-field' ),
                                field_id = field.data( 'id' )
                            
                            if ( $( this ).attr( 'type' ) == 'checkbox' ) {
                                
                                var thisvalue = $(this).attr( 'value')
                                
                                $( this ).prop('checked', section.find( '.section-field[data-id="' + field_id + '"] .changable-field[value="' + thisvalue + '"]' ).prop( 'checked') )
                            } else {
                                var original_value = section.find( '.section-field[data-id="' + field_id + '"] .changable-field' ).val()
                                $( this ).val( original_value )
                            }
                            
                        })
                        
                        // multicheckboxes
                        
                        // clone section name
                        html_section.find( '.section-name-h' ).val( section.find( '.section-name-h' ).val() + '[Clone]' )
                        
                        // close all sections
                        // open new section
                        $( '.builder-section' ).removeClass( 'active' )
                        // $( '.section-content.active' ).slideUp( 'fast' ).removeClass( 'active' )
                        
                        // close the new section in case it's open
                        html_section.find( '.section-content' ).hide().removeClass( 'active' )
                        html_section.removeClass( 'active' )
                        
                        // close menu
                        $( '.section-action-menu ul' ).hide()
                        
                        break;
                        
                    case 'delete' :
                        
                        // just in case
                        if ( section.hasClass( 'section-norm' ) ) {
                            return
                        }
                        
                        // close menu
                        $( '.section-action-menu ul' ).hide()
                        
                        var section_name = section.find( '.section-name-h' ).val()
                        if ( '' == section_name ) {
                            section_name = 'this section'
                        }
                        answer = confirm( 'Do you want to remove "' + section_name + '"? If you need to disable it temporarity, you can go to tab "Design" to change its visibility.' );
                        
                        if ( answer)  {
                            
                            section.slideUp( 'fast', function() {
                                section.remove()
                                sumup()
                            } )
                            
                        }
                        
                        break;
                        
                        default :
                        break;
                }
                
                // activate sumup
                sumup()
                
            });
            
            // -------------------- REORDER SORTABLE SECTIONS
            // --------------------
            var section_sortable = function() {
                
                $( '#builder' ).sortable({
                    
                    items : '> .builder-section',
                    placeholder: "sortable-placeholder",
                    handle: ".section-name",
                    
                    // when it changed, it changes the sections_order element
                    update: function( event, ui ) {
                        sumup()
                    }

                });

                $( '.section-content' ).disableSelection();
                
            }
            section_sortable()

            // -------------------- SUMUP CHANGES
            // --------------------
            var sumup = function() {

                var sum = []
                
                $( '.builder-section' ).each( function() {
                    
                    var section = $( this ),
                        section_data = {}
                    if ( section.hasClass( 'section-sample' ) ) return
                    
                    if ( section.hasClass( 'section-norm' ) ) {
                        section_data[ 'id' ] = 'norm'
                        section_data[ 'section_name' ] = 'Main Blog'
                    }
                    
                    // collect section fields
                    section.find( '.section-field' ).each( function() {
                        
                        var field = $( this ),
                            id = field.data( 'id' ),
                            input = field.find( '.changable-field' ),
                            type = field.data( 'type' ),
                            val = ''
                        
                        // ie. this field doesn't have input field
                        if ( ! input.length ) {
                            return
                        }
                        
                        if ( 'text' == type || 'textarea' == type || 'select' == type || 'multiselect' == type ) {
                            
                            val = input.val()
                            
                        } else if ( 'checkbox' == type ) {
                            
                            val = input.is(":checked") ? true : false;
                            
                        } else if ( 'multicheckbox' == type ) {
                            
                            val = []
                            field.find( '.changable-field:checked' ).each( function( ) {
                                var val_collect = $( this ).val()
                                val.push( val_collect )
                            })
                            
                        } else if ( 'radio' == type || 'image_radio' == type ) {
                            
                            input = field.find( '.changable-field:checked' )
                            if ( input.length ) {
                                val = input.val()
                            }
                            
                        // all worst cases    
                        } else {
                            
                            val = input.val()
                            
                        }
                        
                        section_data[ id ] = val
                        
                    })
                    
                    sum.push( section_data )
                    
                })
                
                control.setting.set( JSON.stringify( sum ) );

            }
            
            // -------------------- COLOR PICKER
            // --------------------
            $( '.builder-section:not(.section-sample) .color-picker' ).wpColorPicker({
                change: _.throttle( function() { // For Customizer
                    $(this).trigger( 'change' );
                }, 3000 )
            });
            
		}
        
    });
    
    /**
     * Control Toggle shows & hides optons conditionally for better UX
     *
     * @since 1.0
     */ 
    window.control_toggle = function( id, option ) {
            
        // TOGGLE OPTIONS
        //
        // Take some examples to illustrate
        // option = fox_logo_type
        // toggle = { 'text': [ 'fox_logo_size', 'fox_logo_face'], 'image' : [ 'fox_logo_width', 'fox_logo_height' ] }
        
        api.control( id, function( control ) {
        
            // Ignore options with display none state
            // Or has no toggle
            if ( 'none' == control.container.css( 'display' ) || undefined === option.toggle )
                return;

            // id = fox_logo_type
            api( id, function( setting ) {

                // value = 'text'
                // elements = [ 'fox_logo_size', 'fox_logo_face' ]
                $.each( option.toggle, function( value, elements ) {

                    // elementID = fox_logo_size
                    // each element ID should appear only once
                    $.each( elements, function( j, elementID ) {

                        api.control( elementID, function( control ) {
                            // to = current setting
                            var visibility = function ( to ) {
                                
                                // true and 'true'
                                if ( true === to ) {
                                    to = '1';
                                } else if ( false === to ) {
                                    to = '0';
                                }

                                // Hide everything except elements in current value
                                var toggle_Bool = ( to === value || ( undefined !== option.toggle[ to ] && option.toggle[ to ].indexOf( elementID ) > -1 ) );

                                var triggerEvent = toggle_Bool ? 'control_show' : 'control_hide';
                                
                                control.container
                                .toggle( toggle_Bool )
                                .trigger( triggerEvent );

                            };

                            visibility( setting.get() );

                            setting.bind( visibility );

                        }); // control

                    }); // each elements

                }); // option.toggle

            });

        }); // control

    } // funtion control_toggle
    
    /**
     * live CSS Update
     *
     * @since 1.0
     */
    window.liveCSS = function() {
        
        var cssdata = '';
        
        $.each(css, function( selector, cssComponents ) {
            
            cssdata += selector + '{';
                
            $.each( cssComponents, function( id, pair ) {
            
                // Check if this option is visible or not
                // It's pretty tricky, may we'll need better solution
                if ( $( '#customize-control-' + id ).css( 'display' ) == 'none' ) {
                    return;
                }
                
                cssdata += pair.property + ':' + pair.value + ';';
                
            });
            
            cssdata += '}';
            
        });
        
        api.previewer.send( 'update-fox-theme-style', cssdata );
        
    }
    
    /**
     * Live Preview and Conditionalize
     *
     * @since 1.0
     */
    api.bind( 'ready', function() {
        
        var settings = api.settings.settings;
        
        // Update the CSS whenever a setting is changed.
        _.each( api.settings.controls, function( option ) {
            
            var id = option.settings.default,
                transport = 'undefined' != typeof settings[id] ? settings[id].transport : '',
                selector = option.selector,
                property = option.property;
            
            // We're only interested colors
            if ( 'postMessage' == transport && 'color' == option.type && selector && property ) {
                
                if ( undefined == css[ selector ] ) {
                    css[ selector ] = {}
                }
                
                css[ selector ][ id ] = {
                    property : property,
                    value : api( id )()
                }
                
                api( id, function( value ) {
                    value.bind( function( to ) {

                        css[ selector ][ id ].value = to;
                        liveCSS();

                    });
                    
                });
                
            }
            
            /**
             * Toggle options for a better UX
             *
             * @since 1.0
             */
            api.control( id, function( control ) {
                
                if ( ! option.toggle ) return;
                
                control.container.on( 'control_show', function() {
                    control_toggle( id, option );
                }); // on show
                
                control.container.on( 'control_hide', function() {
                    
                    // value: leftright
                    // elements: left_1, left_2, right_1, right_2
                    $.each( option.toggle, function( value, elements ) {
                        
                        // elementID: // left_1
                        $.each( elements, function( j, elementID ) {
                        
                            api.control( elementID, function( control2 ) {
                                
                                control2.container
                                .hide()
                                .trigger( 'control_hide' );

                            }); // control
                            
                        });
                        
                    }); // each
                    
                }); // on show
            
            });
            
        }); // each
        
        // trigger control_toggle onload
        _.each( api.settings.controls, function( option ) {
            
            var id = option.settings.default;
            control_toggle( id, option );
            
        }); // each
        
        /**
         * homepage builder select change label
         * @since 4.3
         */
        $( 'select' ).each(function(){

            var self = $( this ),
                id = self.attr( 'id' ),
                section = self.closest( '.control-section' ),
                section_meta = section.find( '.section-meta' )
            
            // ie. the cat
            if ( id && id.match( /^_customize-input-bf_\d+_cat$/g ) ) {

                var i = id.replace( '_customize-input-bf_', '' );
                i = i.replace( '_cat', '' )
                
                self.on( 'change', function() {
                    
                    var key = self.val(),
                        val = self.find( 'option[value="'+ key+'"]' ).html()
                    
                    if ( '...' == val ) {
                        val = '---'
                    }
                    
                    var currentTitleSpan = section_meta.find( 'h3 span' ).html()

                    section_meta.find( 'h3' ).html( '<span class="customize-action">' + currentTitleSpan + '</span>: ' + val )
                    
                    var parentLi = $( 'li.control-section[aria-owns="sub-accordion-section-wi_bf_' + i + '"]')
                    parentLi.find( 'h3' ).html( val );

                });
            }


        })
        
        /**
         * Group homepage builder options into group
         * @since 4.3
         */
        $( '.customize-pane-child' ).each( function() {

            var ul = $( this ),
                id = ul.attr( 'id' )

            // page builder panel
            if ( id && id.match( /sub-accordion-section-wi_bf_\d$/g ) ) {

                var i = id.replace( 'sub-accordion-section-wi_bf_', '' )
                
                var hide_all_li = function() {
                    ul.find( 'li.customize-control:not(.customize-control-heading,.section-meta)' ).each(function(){
                        var li_id = $( this ).attr( 'id' )
                        
                        if ( li_id && li_id.match( /^customize-control-bf_\d+_cat$/g ) ) {
                            return;
                        }
                        if ( li_id && li_id.match( /^customize-control-bf_\d+_shortcode/g ) ) {
                            return;
                        }
                        if ( li_id && li_id.match( /^customize-control-bf_\d+_main_sidebar/g ) ) {
                            return;
                        }
                        if ( li_id && li_id.match( /^customize-control-bf_\d+_sidebar_layout/g ) ) {
                            return;
                        }
                        
                        $( this ).addClass( 'li-hide' )
                        
                    });
                }
                
                hide_all_li();

                ul.find( 'li.customize-control-heading' ).each( function(){

                    var li = $( this )
                    li.css( 'cursor', 'pointer' )

                    li.on( 'click', function() {

                        // hide all
                        hide_all_li();
                        
                        // active class
                        if ( li.hasClass( 'active') ) {
                            li.removeClass( 'active' )
                        } else {
                            ul.find( 'li.customize-control-heading' ).removeClass( 'active' )
                            li.addClass( 'active' )
                        }

                        var nextLi = li

                        while ( nextLi ) {

                            nextLi = nextLi.next()
                            if ( ! nextLi || ! nextLi.length || nextLi.hasClass( 'customize-control-heading' ) ) {
                                nextLi = false
                            } else {
                                if ( li.hasClass( 'active') ) {
                                    nextLi.removeClass( 'li-hide' )
                                } else {
                                    nextLi.addClass( 'li-hide' )
                                }
                            }
                        }

                    });

                })

            }


        });
        
        /**
         * Drag & Drop Builder Sections
         * @since 4.4
         */
        var sections = $( "#sub-accordion-panel-wi_homepage" ),
            sections_order_control = api( 'wi_sections_order' );
        
        // 01 - label the sections
        sections.find( '>li' ).each( function() {
            
            var li = $( this ),
                id = li.attr( 'id' )
            if ( ! id || id == undefined ) {
                return
            }
            
            var index = id.replace( 'accordion-section-wi_bf_', '' )
            if ( isNaN( index ) ) {
                if ( id == 'accordion-section-wi_main_stream' ) {
                    index = 'main'
                } else {
                    return
                }
            }
            
            // ok, now we have the index
            li.attr( 'data-index', index )
            li.find( '.accordion-section-title' ).attr( 'title', 'Drag & drop to change section orders' )
            
        });
        
        var index_result = function() {
            var indexes = []
            sections.find( '>li[data-index]' ).each(function(){
                indexes.push( $( this ).data('index') )
            })
            
            return indexes.join(',')
        }
        
        // 02 - sortable them
        sections.sortable({
            items : '>li[data-index]',
            
            axis: "y",
            
            // when it changed, it changes the sections_order element
            update: function( event, ui ) {
                
                sections.find( '>li[data-index]' ).each(function( order ) {
                    
                    var index = $( this ).data('index'),
                        section_id = 'wi_bf_' + index
                    if ( isNaN( index ) ) {
                        section_id = 'wi_main_stream'
                    }
                    
                    api.section( section_id ).priority( 10 * ( order + 1 ) )
                })
                
                setTimeout(function() {
                    sections_order_control.set( index_result() )
                }, 100 );
                
            }
            
        });
        
        // yes, dont need it
        // sections.disableSelection();
        
        /**
         * Option Search
         * @since 4.4
         */
        
        function swap( json ) {
            var ret = {};
            for(var key in json){
            ret[json[key]] = key;
            }
            return ret;
        }
        
        $( '#customize-header-actions' ).append( '<input type="search" placeholder="Search option.." class="goto" tabindex="1" onfocus="this.select()" />' );
        
        var goto_input = $( '.goto' ),
            keywords = Object.values( FOX_CUSTOMIZER.hint ),
            hint_reverse = swap( FOX_CUSTOMIZER.hint ),
            args = {
                minLength: 1,
                delay: 0,
                autoFocus: false,
                select: function( event, ui ) {
                    
                    if ( hint_reverse[ ui.item.value ] ) {
                        
                        // go to the option
                        api.control( hint_reverse[ ui.item.value ] ).focus()
                        
                        // reset the text
                        this.value = "";
                        return false;
                        
                    }
                    
                },
                classes: {
                    "ui-autocomplete": "blah"
                }
            }
        
        args.source = keywords
        
        goto_input.autocomplete( args )
        
        // cmd F bind
        window.onkeydown = function( event ) {
            
            if((event.ctrlKey || event.metaKey) && event.which == 70) {
                event.preventDefault();
                
                goto_input.focus()
            }
            
        }
        
        /**
         * Append a Documentation Link in the header
         * @since 4.5
         */
        $( '#customize-info .preview-notice' ).after( '<a href="https://docs.withemes.com/thefox/" target="_blank" class="foxdocs-link">Fox\'s Documentation <i class="dashicons dashicons-external"></i></a>' )
        
        /**
         * load dark mode styles
         * @since 4.7
         */
        var load_settings = function( options ) {
            $.each( options, function( id, value ) {

                var instance = api.instance( 'wi_' + id );
                if ( ! instance ) {
                    console.log( id );
                } else {
                    instance.set( value );
                }

            });
        }
        $( document ).on( 'click', '.load_dark_style', function( e ) {
            
            e.preventDefault()
            
            if ( confirm( 'Some current settings will be replaced by color/settings for Dark Mode. Are you sure?' ) ) {
                load_settings( FOX_CUSTOMIZER.darkmode );
            }
            
            
        })
        
    });
    
} )( jQuery, wp.customize );