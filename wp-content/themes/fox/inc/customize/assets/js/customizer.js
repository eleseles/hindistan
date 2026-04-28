/**
 * @since 1.0
 * https://jscolor.com/docs/#doc-install-add-data-jscolor
 */
( function( $, api ) {

    var css = {};

    /**
     * select: jQuery('select')
     * set up font array for it when we select it
     * ========================================================================================
     */
    window.font_ui = function( select, std ) {

        if ( std.indexOf( '"' ) >= 0 ) {
            std = std.replaceAll( '"', '' )
        } else if ( std.indexOf( "'" ) >= 0 ) {
            std = std.replaceAll( "'", '' )
        }

        var selected_option = select.find( 'option[value="' + std + '"]' );
        if ( selected_option.length ) {
            selected_option.prop( 'selected', true )
        } else {
            select.append( '<option value="' + std + '" selected>' + std + '</option>' )
        }

        select.on( 'click', function() {
            if ( select.data( 'google_fonts_init' ) ) {
                return;
            }
            var data = []
            select.find( 'option' ).each(function() {
                data.push({
                    id: $( this ).val(),
                    text: $( this ).text()
                })
            })
            if ( ! window.google_fonts ) {
                window.google_fonts = []
                $.getJSON( FOX_CUSTOMIZE.google_fonts_json_url, function(jd) {
                    for ( var item of jd.items ) {
                        window.google_fonts.push( item.family )
                        if ( std != item.family ) {
                            data.push({
                                id: item.family,
                                text: item.family,
                            })
                        }
                    }
                    select.data( 'google_fonts_init', true )
                    select.select2({
                        data: data
                    }).select2('open');
                });
            } else {
                for ( var face of window.google_fonts ) {
                    if ( std != face ) {
                        data.push({
                            id: face,
                            text: face,
                        })
                    }
                }
                select.data( 'google_fonts_init', true )
                select.select2({
                    data: data
                }).select2('open');
            }

        })

        // if this change, it must be clicked before, ie. the google fonts must be loaded before
        // api.previewer.bind( 'ready',function(){

            /**
             * ON CHANGE LOAD FONTS
             */
            select.on( 'change', function() {

                var face = select.val()
                if ( ! window.google_fonts.includes( face ) ) {
                    return;
                }
                api.previewer.send( 'load-font', face )

            })

        // });

    }

    /**
     * COLOR PICKER
     * container is selector
     * ========================================================================================
     */
    window.fox_colorpicker = function( container ) {
        var div = container.find( '.colorpicker56' ),
            input = div.find( 'input[type="hidden"]' ),
            btn = div.find( '.colorpicker56__button' )

        btn.css('background',input.val())

        var pickr = new Pickr({
            default: input.val() ? input.val() : '#42445a',
            el: btn.get(0),
            theme: 'nano',
            swatches: [
                '#D0021B',
                '#F5A623',
                '#f8e61b',
                '#8B572A',
                '#7ED321',
                '#417505',
                '#BD10E0',
                '#9013FE',
                '#4A90E2',
                '#50E3C2',
                '#B8E986',
                '#000000',
                '#4A4A4A',
                '#9B9B9B'
            ],
            components: {
        
                // Main components
                palette: true,
                preview: true,
                opacity: true,
                hue: true,
        
                // Input / output Options
                interaction: {
                    input: true,
                    clear: true,
                }
            },
            useAsButton: true,
        });
        pickr.on( 'change', function( color, source, instance ) {
            var hex_color = color.toHEXA().toString()
            input.val( hex_color )
            btn.css('background', hex_color )    
            input.trigger('change')
        });
        pickr.on( 'clear', function( color, source, instance ) {
            input.val('')
            btn.css('background', '' )    
            input.trigger('change')
        });
    }

    /**
     * IMAGE
     * ========================================================================================
     */
    window.fox_image_upload = function( container ) {

        // on init
        var input_src = container.find( '.uploader56__src' ),
            holder = container.find( '.uploader56__image' )
        if ( ! holder.find( 'img' ).length && input_src.length ) {
            var src = input_src.val()
            if ( src ) {
                holder.prepend( '<img src="' + src + '" />' )
            }
        }

        container.on( 'click', '.uploader56__button', function( e ) {
            e.preventDefault()
            var button = $( this ),
                wrapper = button.closest( '.uploader56' ),
                holder = wrapper.find( '.uploader56__image' ),
                input = wrapper.find( '.uploader56__result' ) // this holds the key
                input_src = wrapper.find( '.uploader56__src' ) // this is image src, we'll use for many purposes

            // Extend the wp.media object
            var mediaUploader = wp.media.frames.file_frame = wp.media({
                title: 'Choose Image',
                button: {
                    text: 'Choose Image',
                }, 
                multiple: false,
                library : {
                    type : 'image',
                },
            });
            if ( ! mediaUploader ) {
                console.error( 'cant load the media uploader' )
                return
            }

            // When a file is selected, grab the URL and set it as the text field's value
            mediaUploader.on('select', function() {
                
                var attachment = mediaUploader.state().get('selection').first().toJSON();
                if ( ! attachment.type == 'image' ) {
                    return;
                }
                input.val( attachment.id )
                holder.find('img').remove();
                if ( attachment.sizes.medium ) {
                    holder.prepend( '<img src="' + attachment.sizes.medium.url + '" />' );
                } else {
                    holder.prepend( '<img src="' + attachment.url + '" />' );
                }
                if ( input_src.length ) {
                    input_src.val( attachment.url )
                }

                // we must trigger change AFTER input_src has been set
                input.trigger('change')
                    
                if ( button.is( 'button' ) ) {
                    button.text( 'Change Image' );
                } else {
                    button.val( 'Change Image' );
                }
            });
            
            // Open the uploader dialog
            mediaUploader.open();
        
        });

        // REMOVE THE IMAGE
        container.on( 'click', '.uploader56__image__remove', function( e ) {
            e.preventDefault()
            var wrapper = $( this ).closest( '.uploader56' ),
                holder = wrapper.find( '.uploader56__image' ),
                input = wrapper.find( 'input[type="hidden"]' ) // this holds the key
            if ( holder.find( 'img' ).length ) {
                holder.find( 'img' ).remove()
            }
            input.val( '' ).trigger( 'change' )
        })

    }

    /**
     * SORTABLE
     * ========================================================================================
     */
    window.fox_sortable = function( container ) {

        var table = container.find( '.sortable56__table' ),
            input = container.find( 'input[type="hidden"]' ),
            value = input.val()
        if ( typeof value === 'string' ) {
            value = value.split(',')
        }

        var update_result = function() {
            result = []
            container.find( '.sortable56__table .sortable56__element' ).each(function(){
                result.push( $( this ).data('element'))
            })
            // set value via input
            input.val( result.join( ',' ) ).trigger( 'change' )
        }    

        /** ---      sortable */
        container.find( '.sortable56__table, .sortable56__elements' ).sortable({
            items : '.sortable56__element',
            placeholder: "sortable-placeholder",
            connectWith: container.find( '.sortable56__table, .sortable56__elements' ),
            update: function( event, ui ) {
                update_result();
            },
        });

        /* --- when remove by close button */
        container.on( 'click', '.sortable56__element .x', function( e ) {
            e.preventDefault()
            $( this ).parent().appendTo( container.find( '.sortable56__elements' ) );
            update_result();
        });

        /** ---      init */
        if ( typeof value !== 'object' ) {
            value = []
        }
        for ( var ele of value ) {
            var get_ele = container.find( '.sortable56__element[data-element="' + ele + '"]' )
            if ( ! get_ele.length ) {
                continue
            }
            get_ele.appendTo( table )
        }

    }

    /**
     * FONTS
     * ====================================================================================
     */
    api.controlConstructor.fox56_fonts = api.Control.extend({
        ready: function() {
            var control = this,
                container = this.container,
                setting_name = control.id,
                value = control.setting()

            $( container ).on( 'fox_init', function() {
                font_ui( $( container ).find( 'select' ), value )
            });
            
        }
    })

    /**
     * MULTICHECKBOX
     * ====================================================================================
     */
    api.controlConstructor.fox56_multicheckbox = api.Control.extend({
        ready: function() {
            var control = this,
                container = this.container,
                setting_name = control.id,
                value = control.setting()

            if ( typeof value !== 'object' ) {
                value = []
            }
            // init
            for ( var k of value ) {
                $( container ).find( 'input[type="checkbox"][value="' + k + '"]' ).prop( 'checked', true )
            }

            // on change
            $( container ).on( 'change', 'input[type="checkbox"]', function() {
                var result = []
                $( container ).find( 'input[type="checkbox"]:checked' ).each(function(){
                    result.push( $( this ).val() )
                })
                control.setting.set( result )
            })
        }
    })

    /**
     * SORTABLE
     * ====================================================================================
     */
    api.controlConstructor.sortable = api.Control.extend({
        ready: function() {
            var control = this,
                container = this.container,
                value = control.setting(),
                table = $( container ).find( '.sortable56__table' )

            var update_result = function() {
                result = []
                $( container ).find( '.sortable56__table .sortable56__element' ).each(function(){
                    result.push( $( this ).data('element'))
                })
                control.setting.set( result )
            }    

            $( container ).on( 'fox_init', function() {

                /** ----------------------------      sortable */
                $( container ).find( '.sortable56__table, .sortable56__elements' ).sortable({
                    items : '.sortable56__element',
                    placeholder: "sortable-placeholder",
                    connectWith: $( container ).find( '.sortable56__table, .sortable56__elements' ),
                    update: function( event, ui ) {
                        update_result();
                    },
                });

                /* --- when remove by close button */
                container.on( 'click', '.sortable56__element .x', function( e ) {
                    e.preventDefault()
                    $( this ).parent().appendTo( container.find( '.sortable56__elements' ) )
                    update_result();
                });

                /** ----------------------------      init */
                if ( typeof value !== 'object' ) {
                    value = []
                }
                for ( var ele of value ) {
                    var get_ele = $( container ).find( '.sortable56__element[data-element="' + ele + '"]' )
                    if ( ! get_ele.length ) {
                        continue
                    }
                    get_ele.appendTo( table )
                }
            })
            
        }
    })

    /**
     * RADIO IMAGE
     * ====================================================================================
     */
    api.controlConstructor.fox56_radio_image = api.Control.extend({
        ready: function() {
            var control = this,
                container = this.container,
                setting_name = control.id,
                value = control.setting()

            $( container ).on( 'fox_init', function() {
                // just set value on init
                var should_checked = $( container ).find( 'input[type="radio"][value="' + value + '"]' )
                if ( should_checked.length ) {
                    should_checked.prop('checked', true)
                }
            });

        },
    });

    /**
     * IMAGE
     * ====================================================================================
     */
    api.controlConstructor.fox56_image = api.Control.extend({
        ready: function() {
            var control = this,
                container = this.container,
                setting_name = control.id,
                value = control.setting()

            $( container ).on( 'fox_init', function() {    
                fox_image_upload( $( container ) )    
            });
        }
    })

    /**
     * COLOR
     * ====================================================================================
     */
    api.controlConstructor.fox56_color = api.Control.extend({
        ready: function() {
            var control = this,
                container = this.container,
                setting_name = control.id,
                value = control.setting()
        
            $( container ).on( 'fox_init', function() {    
                fox_colorpicker( $( container ) )
            });
        },
    });

    /**
     * GROUP
     * ====================================================================================
     */
    api.controlConstructor.group = api.Control.extend({
        ready: function() {
            var control = this,
                container = this.container,
                setting_name = control.id,
                value = control.setting()

            /**
             * -------------------------    UPDATE INPUT CORRECTLY WHEN SETTING BEING CHANGED
             */    
            control.setting.bind( function( newval ) {
                $( container ).find( '[data-group-id]' ).each(function(){
                    var key = $( this ).data( 'group-id' )
                    if ( undefined === newval[key] ) {
                        newval[key] = ''
                    }
                    $( this ).val( newval[key] )
                });
            })

            $( container ).on( 'fox_init', function() {    
                /**
                 * -------------------------    POPULATE DATA CORRECTLY
                 */
                $( container ).find( '[data-group-id]' ).each(function(){
                    var key = $( this ).data( 'group-id' )
                    if ( undefined === value[key] ) {
                        value[key] = ''
                    }
                    $( this ).val( value[key] )
                });
                
                /**
                 * FONT FACE PROBLEM 
                 */
                $( container ).find( '[data-group-id="face"]' ).each(function() {
                    var select = $( this )
                    font_ui( select, value.face )
                });

                /**
                 * -------------------------    COLOR PICKER
                 */
                $( container ).find( '.group56__item--color' ).each(function() {
                    fox_colorpicker( $( this ) )
                });

                /**
                 * -------------------------    IMAGE UPLOADER
                 */
                $( container ).find( '.group56__item--image' ).each(function() {
                    fox_image_upload( $( this ) )
                });

                /**
                 * -------------------------    UPDATE VALUE ON INPUT CHANGE
                 */
                var sum = function() {
                    var data = {}
                    $( container ).find( '[data-group-id]' ).each(function(){
                        var key = $( this ).data( 'group-id' )
                        data[key] = $( this ).val()
                    })
                    api( setting_name ).set( data )
                }
                $( container ).on( 'change', '[data-group-id]', function() {
                    sum()
                });

            });

        }

    })

    /**
     * BUILDER
     * note, while control.settings is way more redundant because we have a lot of unused preload settings
     * so we need to use only on-the-table settings, we call visible_settings
     * ====================================================================================
     */
    var time = Date.now()
    api.controlConstructor.fox56_builder = api.Control.extend({
		ready: function() {
            var control = this,
                container = this.container
                values = control.settings,
                sectionlist = values.sectionlist(), // [ section_1, section_2.. ],
                preload_sectionlist = values.preload_sectionlist(), // [ section_4343fdsf, section_fdsjds.. ]
                deps = control.params.field_dependencies // this is condition list
                control.reverse_impact_fields = {} // this is reverse impact list, ie. setting --> fields it affects
            
            $( container ).on( 'fox_init', function() {

                var placeholder_section = $( container ).find( '.section56[data-id="section__placeholder"]' ),
                    placeholder_section_id = 'section__placeholder'

                /* VALUE OF FIELD
                ================================================== */
                var get_val = function( section, field_id ) {
                    var wrapper = section.find( '.section56__field[data-id="' + field_id +'"]' ),
                        type = wrapper.data( 'type' ),
                        input = wrapper.find( '[data-field-id="' + field_id + '"]' )

                        /* -------------    text style */    
                    if ( 'text' == type || 'textarea' == type || 'select' == type || 'number' == type || 'color' == type || 'image' == type || 'hidden' == type ) {
                        return input.val()

                        /* -------------    radio */
                    } else if ( 'radio' == type || 'radio_image' == type ) {
                        var checked = wrapper.find( '[data-field-id="' + field_id + '"]:checked' )
                        if ( checked.length ) {
                            return checked.val()
                        }

                        /* -------------    checkbox */
                    } else if ( 'checkbox' == type ) {

                        return input.prop( 'checked' )

                        /* -------------    multicheckbox */
                    } else if ( 'multicheckbox' == type ) {
                        var collect = []
                        input.each(function() {
                            if ( $( this ).prop( 'checked') ) {
                                collect.push( $( this ).val() )
                            }
                        })
                        return collect

                    } else if ( 'multiselect' == type ) {

                        var collect = []
                        input.find( 'option' ).each(function() {
                            if ( $( this ).prop( 'selected') ) {
                                collect.push( $( this ).val() )
                            }
                        })
                        return collect

                    } else if ( 'group' == type ) {

                        var collect = {}
                        wrapper.find( '[data-group-id]' ).each(function() {
                            var sub_key = $( this ).data( 'group-id' ),
                                sub_value = $( this ).val()
                            collect[ sub_key ] = sub_value    
                        })

                        return collect

                    } else if ( 'sortable' == type ) {

                        var val = input.val()
                        if ( ! val ) {
                            return []
                        } else {
                            return val.split(',')
                        }

                    }
                }
                var set_val = function( section, field_id, value ) {
                    // special case __src
                    if ( field_id.indexOf( '__src' ) > -1 ) {
                        section.find( '[data-field-id="' + field_id + '"]' ).val( value )
                        return;
                    }
                    var wrapper = section.find( '.section56__field[data-id="' + field_id +'"]' ),
                        type = wrapper.data( 'type' ),
                        input = wrapper.find( '[data-field-id="' + field_id + '"]' )

                        /* -------------    text style */    
                    if ( 'text' == type || 'textarea' == type || 'select' == type || 'number' == type || 'color' == type || 'image' == type || 'hidden' == type ) {

                        input.val( value )

                        /* -------------    radio style */
                    } else if ( 'radio' == type || 'radio_image' == type ) {
                        input.prop( 'checked', false )
                        var right_input = wrapper.find( '[data-field-id="' + field_id + '"][value="' + value + '"]' )
                        if ( right_input.length ) {
                            right_input.prop( 'checked', true )
                        }

                        /* -------------    checkbox */
                    } else if ( 'checkbox' == type ) {
                        if ( value ) {
                            input.prop( 'checked', true )
                        } else {
                            input.prop( 'checked', false )
                        }

                        /* -------------    multicheckbox */
                    } else if ( 'multicheckbox' == type ) {
                        if ( typeof value === 'Object' ) {
                            value = Object.values( value )
                        } else if ( typeof value === 'string' ) {
                            value = value.split(',')
                        }
                        if ( typeof value !== 'object' ) {
                            console.log( 'expect array value' )
                            return;
                        }
                        input.each(function(){
                            if ( value.includes( $(this).val() ) ) {
                                $( this ).prop( 'checked', true )
                            } else {
                                $( this ).prop( 'checked', false )
                            }
                        })
                    } else if ( 'multiselect' == type ) {
                        if ( typeof value === 'Object' ) {
                            value = Object.values( value )
                        } else if ( typeof value === 'string' ) {
                            value = value.split(',')
                        }
                        if ( typeof value !== 'object' ) {
                            console.log( 'expect array value' )
                            return;
                        }
                        input.find( 'option' ).each(function() {
                            if ( value.includes( $(this).val() ) ) {
                                $( this ).prop( 'selected', true )
                            } else {
                                $( this ).prop( 'selected', false )
                            }
                        })
                    } else if ( 'sortable' == type ) {
                        
                        input.val( value )

                    } else if ( 'group' == type ) {

                        wrapper.find( '[data-group-id]' ).each(function() {
                            var sub_key = $( this ).data( 'group-id' ),
                                sub_value = value[ sub_key ]

                            if ( 'face' != sub_key ) {
                                if ( undefined === sub_value ) {
                                    sub_value = ''
                                }
                                $( this ).val( sub_value )
                            } else {
                                if ( ! sub_value ) {
                                    sub_value = ''
                                }
                                font_ui( $( this ), sub_value )
                            }

                        })
                    }
                }

                /**
                 * RETURN data {}
                 */
                var get_section_data = function( section, change_type = 'refresh' ) {
                    var data = {}
                    section.find( '[data-field-id]' ).each( function() {
                        var key = $( this ).data( 'field-id' )
                        if ( $( this ).data('change') != change_type ) {
                            return
                        }
                        /**
                         * special case for __src
                         */
                        if ( key.indexOf( '__src' ) > -1 ) {
                            data[key] = $( this ).val()
                        } else {
                            data[key] = get_val( section, key )
                        }
                    })
                    return data
                } 
                
                /* ON CHANGE OF EACH SECTION
                this function detects the change of field inputs
                change -> detect refresh group (heading, ad, primary, section_css..)
                then we'll trigger api( setting_name ).set( value ) correctly
                ================================================== */
                function on_change( section ) {
                    var section_id = section.data( 'id' ),
                        section_css_id = section_id + '__css'
                    section.on( 'change', '[data-field-id], [data-group-id]', function() {

                        var newval = $( this ).val(),
                            setting_name = $( this ).data( 'field-id' ),
                            field = control.params.fields[ setting_name ]

                        if ( field ) {
                            std_affects_arr = field.std_affects
                            if ( std_affects_arr ) {

                                var affects_settings = std_affects_arr[ newval ]
                                // if we have default settings for this value
                                if ( undefined != affects_settings ) {
                                    for ( var affected_setting in affects_settings ) {
                                        var affected_std = affects_settings[ affected_setting ]
                                        set_val( section, affected_setting, affected_std, )
                                    }
                                    // trigger change
                                    // section.find( '.section56__field[id="' + affected_setting + '"]' ).find( '[data-field-id], [data-group-id]' ).trigger( 'change' )
                                }

                            }
                        }

                        var change_type = $( this ).data( 'change' )
                        if ( 'refresh' == change_type ) {
                            api( section_id ).set( get_section_data( section, 'refresh' ) )

                        // CSS change type    
                        } else {
                            var value = get_section_data( section, 'css' )
                            api( section_css_id ).set( value )
                        }
                    });
                }

                /* TOGGLE
                ================================================== */
                var toggle = function( section ) {

                    var setup = function() {

                        if ( ! section.data( 'setup' ) ) {

                            /**
                             * SET UP JAVASCRIPT STUFFS
                             */
                            ui( section )
                            // std_affects( section )
                            on_change( section )
                            run_tab( section )
                            run_inner_tab( section )
                            run_dependencies( section )
                            section.data( 'setup', true )
                            
                        }

                    }

                    $( section ).on( 'click', '.section56__name', function( e ) {
                        e.preventDefault()
                        
                        // except the edit button
                        if ( $( e.target ).is( '.section56__action-menu' ) || $( e.target ).closest( '.section56__action-menu' ).length ) {
                            setup()
                            return
                        }
                        
                        var title = $( this ),
                            next_content = title.parent().next( '.section56__content' ),
                            section = title.closest( '.section56' )
                        
                        // collapse it
                        if ( next_content.hasClass( 'active' ) ) {

                            next_content.slideUp( 'fast' ).removeClass( 'active' )
                            section.removeClass( 'active' )

                        // expand it    
                        } else {

                            setup()

                            // 01 - close all others
                            $( container ).find( '.section56' ).removeClass( 'active' )
                            $( container ).find( '.section56__content.active' ).slideUp( 'fast' ).removeClass( 'active' )

                            // 02 - open this
                            next_content.slideDown( 'fast' ).addClass( 'active' )
                            section.addClass( 'active' )
                        }
                        
                    });
                }

                /* UI
                ================================================== */
                var ui = function( section ) {

                    /**
                     * -------------------------    IMAGE
                     */
                    section.find( '.section56__field[data-type="image"]' ).each(function(){
                        fox_image_upload( $( this ) )
                    })
                    
                    /**
                     * -------------------------    COLOR PICKER
                     */
                    section.find( '.section56__field[data-type="color"], .section56__field__group__item--color' ).each(function() {
                        fox_colorpicker( $( this ) )
                    });

                    /**
                     * -------------------------    SORTABLE
                     */
                    section.find( '.section56__field[data-type="sortable"]' ).each( function() {
                        fox_sortable( $( this ) )
                    })

                }

                /* TAB
                ================================================== */
                var run_tab = function( section ) {
                    var tab_field_update = function( tab ) {
                        section.find( '.section56__field[data-tab]' ).each(function() {
                            var the_tab = $( this ).data( 'tab' )
                            if ( the_tab == tab ) {
                                $( this ).removeClass( 'hide--sectiontab' )
                            } else {
                                $( this ).addClass( 'hide--sectiontab' )
                            }
                        });
                    }
                    section.on( 'click', '.section56__tabs a', function( e ) {
                        e.preventDefault()
                        var a = $( this ),
                            tab = a.parent().data( 'tab' ),
                            tabs = a.closest( '.section56__tabs' )
                        
                        tabs.find( 'li' ).removeClass( 'active' )
                        a.parent().addClass( 'active' )
                        
                        tab_field_update( tab )
                        
                    });

                    // on init
                    var tab = section.find( '.section56__tabs li.active' ).data( 'tab' )
                    tab_field_update( tab )
                }

                /* INNER TABS
                ================================================== */
                var run_inner_tab = function( section ) {
                    var inner_tabs_update = function( tabs, tab ) {
                        section.find( '.section56__field[data-inner_tabs="' + tabs +'"]' ).each(function() {
                            var the_tab = $( this ).data( 'inner_tab' )
                            if ( the_tab == tab ) {
                                $( this ).removeClass( 'hide--innertab' )
                            } else {
                                $( this ).addClass( 'hide--innertab' )
                            }
                        });
                    }
                    section.on( 'click', '.section56__inner-tabs a', function( e ) {

                        e.preventDefault()
                        var a = $( this ),
                            tab = a.data( 'tab' ),
                            tabs = a.closest( '.section56__inner-tabs' ),
                            tabs_name = tabs.data( 'tabs' )
                        
                        tabs.find( 'a' ).removeClass( 'active' )
                        a.addClass( 'active' )

                        inner_tabs_update( tabs_name, tab )
                        
                    });

                    section.find( '.section56__inner-tabs' ).each( function() {
                        var tabs = $( this ).data( 'tabs' ),
                            tab = $(this).find( '.active' ).data( 'tab')

                        inner_tabs_update( tabs, tab )
                    })
                }

                /* CONDITIONAL
                ================================================== */
                var reverse_conditional = {},
                    conditional = {}
                for ( var setting_name in control.params.fields ) {
                    var condition = control.params.fields[ setting_name ].condition
                    if ( ! condition ) {
                        continue
                    }
                    conditional[ setting_name ] = condition
                    for ( var source_setting in condition ) {
                        if ( undefined === reverse_conditional[ source_setting ] ) {
                            reverse_conditional[ source_setting ] = []
                        }
                    }
                    reverse_conditional[ source_setting ].push( setting_name )
                }
                
                // check all of its conditions
                // section_value so that we don't need to re-compute it
                var set_visibility = function( section, section_value, setting_name ) {
                    var condition = conditional[ setting_name ]
                    if ( ! condition ) {
                        return;
                    }
                    // only show if all conditionns held
                    var hold = true
                    for ( var source_setting in condition ) {
                        var expected_value = condition[ source_setting ],
                            value = section_value[ source_setting ]
                        if ( typeof expected_value == 'object' ) {
                            if ( ! expected_value.includes( value ) ) {
                                hold = false
                                break; // 1 is enough
                            }
                        } else {
                            if ( expected_value !== value ) {
                                hold = false
                                break; // 1 is enough
                            }
                        }
                    }
                    if ( hold ) {
                        section.find( '.section56__field[data-id="' + setting_name + '"]' ).removeClass( 'hide--condition' )
                    } else {
                        section.find( '.section56__field[data-id="' + setting_name + '"]' ).addClass( 'hide--condition' )
                    }
                }

                var run_dependencies = function( section ) {

                    var section_id = section.data( 'id' ),
                        section_value = api( section_id )(),
                        section_css_value = api( section_id + '__css' )(),
                        section_combined_value = {...section_value, ...section_css_value}

                    // 01 - set up
                    for ( var setting_name in conditional ) {
                        set_visibility( section, section_combined_value, setting_name )
                    }

                    // 02 - bind changes section_ids
                    api( section_id, function( value ) {
                        value.bind( function( newval ) {
                            var section = $( container ).find( '.section56[data-id="' + value.id + '"]' )

                            section_value = api( value.id )(),
                            section_css_value = api( value.id + '__css' )(),
                            section_combined_value = {...section_value, ...section_css_value}

                            for ( var setting_name in conditional ) {
                                set_visibility( section, section_combined_value, setting_name )
                            }    
                        })
                    })

                }

                /* UPDATE SECTIONLIST
                ================================================== */
                var section_list_update = function() {

                    var current_sectionlist = []
                    $( container ).find( '.builder56__sections > .section56' ).each(function() {
                        var section_id = $( this ).data( 'id' )
                        if ( section_id === placeholder_section_id ){
                            return
                        }
                        current_sectionlist.push( section_id )
                    })
                    control.settings.sectionlist.set( current_sectionlist )

                }

                /* MENU EDIT/DEL/DUP
                ================================================== */
                var meta_actions = function( section ) {

                    /**
                     * menu button
                     */
                    section.on( 'click', '.section56__action-menu__btn', function( e ) {
                        e.preventDefault()
                        
                        // close everything
                        $( container ).find( '.section56__action-menu ul' ).hide()
                        $( container ).find( '.section56' ).css( 'z-index', '' )
                        
                        var a = $( this )
                        section.css( 'z-index', '100' );
                        a.next( 'ul' ).toggle()
                    })

                    /**
                     * edit name
                     */
                    section.on( 'click', '.section56__edit-name', function( e ) {
                    
                        var self = $( this )
                        
                        e.preventDefault()
                        self.closest( '.section56__name' ).addClass( 'inedit' )
                        
                        // close menu
                        $( '.section56__action-menu ul' ).hide()
                        
                        setTimeout(function(){
                            self.closest( '.section56__name' ).find( '.section56__name__input' ).focus()
                        }, 100 )
                        
                    })

                    /**
                     * delete
                     */
                    section.on( 'click', '.section56__delete', function( e ) {
                    
                        e.preventDefault();
                                
                        // close menu
                        $( '.section56__action-menu ul' ).hide()
                        
                        var section_name = section.find( '.section56__name__input' ).val()
                        if ( '' == section_name ) {
                            section_name = 'this section'
                        }
                        answer = confirm( 'Are you sure to remove "' + section_name + '"?' );
                        if ( answer)  {
                            section.slideUp( 'fast', function() {
                                section.remove()
                                section_list_update();
                            })
                        }
        
                    });
                }
                
                /**
                 * todo57
                 * make it work easier without having to find all elements
                 * close is a global thing, not per/section
                 */
                $( container ).on( 'click', function( e ) {

                    // close action menu
                    if ( ! $( e.target ).is( '.section56__action-menu' ) && ! $( e.target ).closest( '.section56__action-menu' ).length ) {
                        $( '.section56__action-menu ul' ).hide()
                        $( '.section56' ).css( 'z-index', '' )
                    }

                    // close edit name mode
                    if ( ! $( e.target ).is( '.section56__name' ) && ! $( e.target ).closest( '.section56__name' ).length ) {
                        $( '.section56__name' ).removeClass( 'inedit' )
                    }
                });

                /* SEND SECTION CSS
                ================================================== */
                var send_css = function( section ) {
                    var section_id = section.data( 'id' )
                    api.previewer.send( 'section-added', {
                        'builder_id' : control.id, 
                        'section_id' : section_id, 
                        'section_value' : api( section_id + '__css' )()
                    })
                }

                /* EDIT NAME
                ================================================== */
                var run_new_section = function( new_section_id, params = {} ) {

                    var section_setting = api( new_section_id ),
                        section_css_setting = api( new_section_id + '__css' )

                    // this is case we add/duplicate
                    if ( params.values ) {
                        var section_value = params.values.refresh
                        var section_css_value = params.values.css

                        // set the value
                        section_setting.set( section_value )
                        section_css_setting.set( section_css_value )
                    } else {
                        var section_value = section_setting(),
                            section_css_value = section_css_setting()
                    }

                    var section_combined_value = { ...section_value, ...section_css_value };

                    var new_section = placeholder_section.clone()
                        new_section_html = new_section.html()
                        /** replace section__placeholder by the section id */
                    new_section_html = new_section_html.replaceAll( placeholder_section_id, new_section_id )
                    new_section.html( new_section_html )
                    new_section.attr( 'data-id', new_section_id )
                    
                        /** insert it */
                    if ( params.placeafter ) {
                        new_section.insertAfter( params.placeafter )
                    } else {
                        $( container ).find( '.builder56__sections' ).append( new_section )
                    }

                    /** populate data */
                    new_section.find( '[data-field-id]' ).each( function() {
                        var key = $( this ).data( 'field-id' )
                        if ( undefined === section_combined_value[key]) {
                            return;
                        }
                        set_val( new_section, key, section_combined_value[key] )
                    });

                    toggle( new_section )
                    meta_actions( new_section )
                    send_css( new_section )

                    /*
                    run_dependencies( setting_list ) */

                }

                /* GENERATE NEW ID
                ================================================== */
                var generate_section_id = function() {
                    var new_section_id;
                    while ( 1 ) {
                        if ( ! Object.keys( preload_sectionlist ).length ) {
                            break
                        }
                        var new_section_id = Object.values( preload_sectionlist ).pop()
                        if ( ! $(container).find( '.section56[data-id="' + new_section_id + '"]' ).length ) {
                            break;
                        }
                    }
                    if ( ! new_section_id ) {
                        api.previewer.save()
                        window.shouldReload = true
                        return;
                    }
                    return new_section_id
                }

                /* POPULATE SECTIONS
                ================================================== */
                for ( var new_section_id of sectionlist ) {
                    run_new_section( new_section_id )
                }

                /* ADD / DUPLICATE
                ================================================== */
                // build default
                var section_std = {
                    refresh : {},
                    css: {
                        section_name: 'New Section',
                    }
                }
                for ( var field_id in control.params.fields ) {
                    var field = control.params.fields[ field_id ]
                    if ( 'html' === field.type ) {
                        continue
                    }
                    if ( undefined === field.std ) {
                        continue
                    }
                    if ( undefined === field.css ) {
                        section_std.refresh[ field_id ] = field.std
                    } else {
                        section_std.css[ field_id ] = field.std
                    }
                }

                $( container ).on( 'click', '.builder56__add-section', function() {
                    var new_section_id = generate_section_id()
                    if ( ! new_section_id ) {
                        return;
                    }
                    run_new_section( new_section_id, {
                        values: section_std
                    })
                    section_list_update();
                })

                $( container ).on( 'click', '.section56__duplicate', function( e ) {
                    
                    // hide all menus
                    e.preventDefault()
                    $( container ).find( '.section56__action-menu ul' ).hide()
                    $( container ).find( '.section56' ).css( 'z-index', '' )
                    
                    var section = $( this ).closest( '.section56' ),
                        section_id = section.data( 'id' ),
                        section_css_id = section_id + '__css',
                        values = {
                            'refresh' : api( section_id )(),
                            'css': api( section_css_id )()
                        }
                    values.css.section_name += ' -- Cloned'
                    var new_section_id = generate_section_id()
                    run_new_section( new_section_id, {
                        values: values,
                        placeafter: section,
                    })
                    section_list_update();
                })

                /* SORTABLE
                ================================================== */
                var section_sortable = function() {
                
                    $( container ).find( '.builder56__sections' ).sortable({
                        items : '> .section56',
                        placeholder: "sortable-placeholder",
                        handle: ".section56__name",
                        // when it changed, it changes the sections_order element
                        update: function( event, ui ) {
                            section_list_update()
                        }
                    })
                    
                }
                section_sortable()

            }); // end of $( container ).on( 'fox_init', function() {
            
		}
	});
    
    var time = Date.now()

    /**
     * documents about api
     * https://wordpress.stackexchange.com/questions/280561/customizer-instantiating-settings-and-controls-via-javascript
     * https://gist.github.com/westonruter/0e98d8e507ddb18c0371935f2c6929c1
     * 
     * lots of examples here: https://gist.github.com/westonruter
     */
    api.bind( 'ready', function() {

        /**
         * this is reload action when we add new section
         */
        api.bind( 'saved', function() {
            if ( window.shouldReload ) {
                location.reload()
            }
        });
        
        var settings = api.settings.settings;

        /**
         * setting_name => CSS, eg. body_typography => [ ]
         * section_css_id => CSS array
         */
        window.css = {}
        window.builder_css = {}
        window.update_css = function() {
            
            /**
             * we have 2 sources for CSS: builder.fields and css from a normal element
             */
            _.each( api.settings.controls, function( option ) {
                
                if ( 'fox56_builder' == option.type ) {

                    var css = {}
                    for ( var field_id in option.fields ) {
                        var field = option.fields[ field_id ]
                        if ( ! field.css ) {
                            continue
                        }
                        for ( var j in field.css ) {
                            single_css = field.css[j]
                            single_css.selector = single_css.selector.replace(/\n/g, " ")
                            field.css[j] = single_css
                        }
                        css[ field_id ] = field.css
                    }
                    var sectionlist = api( option.settings.sectionlist )()
                    window.builder_css[ option.id ] = {
                        css: css,
                        sectionlist: sectionlist,
                    }
                    // send the value as well
                    for ( var section_id of sectionlist ) {
                        window.builder_css[ option.id ][ section_id ] = api( section_id + '__css' )()
                    }
                } else if ( option.css ) {
                    /**
                     * we need to send value as well
                     */
                    window.css[ option.settings.default ] = option.css
                } else {
                    return;
                }
            });

            api.previewer.bind( 'ready', function() {
                api.previewer.send( 'window_css', window.css )
                api.previewer.send( 'window_builder_css', window.builder_css )
            });

        }

        // onload
        update_css()
        
    });

    /* HEADER BUILDER
    ================================================================================ */
    api.bind( 'ready', function() {

        var init_headerbuilder = function() {
            var parts_refresh = function( container ) {
                container.find( '.hb56__part' ).each(function() {
                    var part = $( this ),
                        currentElements = []
                    if ( undefined === part.data( 'elements' ) ) {
                        part.data( 'elements', [] )
                    }
                        
                    part.find( '.hb56__element' ).each(function(){
                        currentElements.push( $( this ).data('element') )
                    })

                    // trigger changes when it's being changed
                    if ( currentElements !== part.data('elements') ) {
                        part.data( 'elements', currentElements )
                        data_part = part.data( 'part' )
                        api( data_part + '_elements' ).set( currentElements ) // this trigger changes
                    }

                })
            }

            /* ------------------------     layout adjustments */
            var sections = [ 'topbar', 'main_header', 'header_bottom', 'header_mobile' ]
            for ( var section of sections ) {
                if ( 'header_mobile' == section ) {
                    container = $( '.hb56--mobile' )
                } else {
                    container = $( '.hb56--desktop' )
                }

                /**
                 * on init
                 */
                var newval = api( section + '_layout' )()

                /* ----------------------       set the col correctly */
                var cols = newval.split('-'),
                    cols_num = cols.length
                if ( 1 == cols_num ) {
                    cols = [ '01' ].concat( cols ).concat( ['01'] )
                } else if ( 2 == cols_num ) {
                    cols.splice(1,0, '01' )
                }
                $( '.hb56__' + section ).find( '.col' ).each(function(index) {
                    var col = cols[index],
                        col_cl = col.split('')
                    $( this ).removeClass( 'col-1-2 col-1-3 col-1-4 col-1-5 col-1-6 col-2-3 col-2-5 col-3-4 col-3-5 col-4-5 col-5-6 col-1-1 col-0-1' )
                    $( this ).addClass( 'col-' + col_cl[0] + '-' + col_cl[1] )

                    /* ----------------------       move elements when layout become zero */
                    if ( '0' == col_cl[0] ) {
                        $( this ).find( '.hb56__element' ).appendTo( container.find('.hb56__elements') )
                    }
                });

                /**
                 * when changed
                 */
                api( section + '_layout', function( value ) {
                    value.bind( function(newval) {

                        var section = value.id.replace( '_layout', '' ),
                            container = $( '.hb56__' + section ).closest( '.hb56' )

                        /* ----------------------       set the col correctly */
                        var cols = newval.split('-'),
                            cols_num = cols.length
                        if ( 1 == cols_num ) {
                            cols = [ '01' ].concat( cols ).concat( ['01'] )
                        } else if ( 2 == cols_num ) {
                            cols.splice(1,0, '01' )
                        }
                        $( '.hb56__' + section ).find( '.col' ).each(function(index) {
                            var col = cols[index],
                                col_cl = col.split('')
                            $( this ).removeClass( 'col-1-2 col-1-3 col-1-4 col-1-5 col-1-6 col-2-3 col-2-5 col-3-4 col-3-5 col-4-5 col-5-6 col-1-1 col-0-1' )
                            $( this ).addClass( 'col-' + col_cl[0] + '-' + col_cl[1] )

                            /* ----------------------       move elements when layout become zero */
                            if ( '0' == col_cl[0] ) {
                                $( this ).find( '.hb56__element' ).appendTo( container.find('.hb56__elements') )
                            }
                        })
                        
                    })
                })
            }

            /* ------------------------     edit section */
            $( '.hb56' ).on( 'click', '.hb56__name', function( e ) {
                e.preventDefault()
                var part = $( this ).data( 'part' )
                api.section( part ).focus()
            });

            /* ------------------------     edit element */
            $( '.hb56__element i' ).on( 'click', function( e ) {
                e.preventDefault()
                var ele = $( this ).parent(),
                    ele_name = ele.data( 'element' )
                var name_to_section_map = {
                    'hamburger' : 'header_hamburger',
                    'nav' : 'header_nav',
                    'logo' : 'title_tagline',
                    'social' : 'header_social',
                    'search' : 'header_search',
                    'cart' : 'header_cart',
                    'html1' : 'header_html',
                    'html2' : 'header_html',
                    'html3' : 'header_html',
                    'darkmode' : 'design_darkmode',
                }
                var section_name = name_to_section_map[ ele_name ]
                api.section( section_name ).focus()
            });

            /* ------------------------     init header parts */
            $( '.hb56__part' ).each(function() {
                var part = $( this ),
                    part_id = part.data( 'part' ),
                    elements_setting = api( part_id + '_elements' )
                    container = part.closest( '.hb56' )
                if ( ! elements_setting ) {
                    return;
                }
                elements = elements_setting()
                if ( typeof elements == 'string' ) {
                    elements = [ elements ]
                }
                if ( ! typeof elements == 'object' ) {
                    return
                }
                for ( var element of elements ) {
                    container.find( '.hb56__element[data-element="' + element + '"]' ).appendTo( part )
                }
            });

            var screens = [ 'desktop', 'mobile' ],
                funcs = {
                    desktop: function() { parts_refresh( $( '.hb56--desktop' ) ) },
                    mobile: function() { parts_refresh( $( '.hb56--mobile' ) ) },
                }
            for ( var screen of screens ) {

                var container = $( '.hb56--' + screen ),
                    container_selector = '.hb56--' + screen

                /* ------------------------     sortable */
                container.find( '.hb56__part, .hb56__elements' ).sortable({
                    items : '.hb56__element',
                    placeholder: "sortable-placeholder",
                    connectWith: container.find( '.hb56__part, .hb56__elements' ),
                    update: funcs[ screen ],
                });

            } // each screen
        } // init_headerbuilder() function

        /* ------------------------     activate header builder when panel section opened */
        window.header_builder_init = false
        api.panel( 'header' ).expanded.bind( function( isExpanding ) {
            if(isExpanding) {
                $( '.hb56' ).addClass( 'active' )
                if ( ! window.header_builder_init ) {
                    init_headerbuilder()
                    window.header_builder_init = true
                }
            } else {
                $( '.hb56' ).removeClass( 'active' )
            }
        });

        api.section( 'header_offcanvas' ).expanded.bind( function( isExpanding ) {
            if(isExpanding) {
                $( '.hb56' ).removeClass( 'active' )
            }
        });
        
	});

    /**
     * CONDITIONAL
     * ====================================================================================
     */
    api.bind( 'ready', function() {

        var reverse_conditional = {}
        for ( var setting_name in FOX_CUSTOMIZE.conditional ) {
            var condition = FOX_CUSTOMIZE.conditional[ setting_name ]
            for ( var source_setting in condition ) {
                if ( undefined === reverse_conditional[ source_setting ] ) {
                    reverse_conditional[ source_setting ] = []
                }
            }
            reverse_conditional[ source_setting ].push( setting_name )
        }
        
        // check all of its conditions
        var set_visibility = function( setting_name ) {
            var condition = FOX_CUSTOMIZE.conditional[ setting_name ]
            if ( ! condition ) {
                return;
            }
            // only show if all conditionns held
            var hold = true
            for ( var source_setting in condition ) {
                /*if ( ! api( source_setting ) ) {
                    console.log( source_setting )
                }*/
                var expected_value = condition[ source_setting ],
                    value = api( source_setting )()
                if ( typeof expected_value == 'object' ) {
                    if ( ! expected_value.includes( value ) ) {
                        hold = false
                        break; // 1 is enough
                    }
                } else {
                    if ( expected_value !== value ) {
                        hold = false
                        break; // 1 is enough
                    }
                }
            }
            if ( hold ) {
                if ( ! api.control( setting_name ) ) {
                    console.log( setting_name )
                }
                api.control( setting_name ).container.removeClass( 'hide--condition' )
            } else {
                api.control( setting_name ).container.addClass( 'hide--condition' )
            }
        }

        /**
         * set it in 1st place
         */
        for ( var setting_name in FOX_CUSTOMIZE.conditional ) {
            set_visibility( setting_name )
        }

        /**
         * bind changes
         */
        for ( var setting_name in reverse_conditional ) {
            api( setting_name, function( value ) {
                value.bind( function( newval ) {
                    for ( var affected_id of reverse_conditional[ value.id ] ) {
                        set_visibility( affected_id )
                    }
                })
            })
        }

	});

    /**
     * STD AFFECTS
     * ====================================================================================
     */
    api.bind( 'ready', function() {

        // setting_name = layout
        // std_affects_arr = grid: { column: .. , post_style: .., postbox: }, list: { column, post_style }
        // newval: grid, list
        for ( var setting_name in FOX_CUSTOMIZE.std_affects ) {
            api( setting_name, function( value ) {
                value.bind( function( newval ) {
                    var std_affects_arr = FOX_CUSTOMIZE.std_affects[ value.id ];
                    if ( undefined === std_affects_arr ) {
                        return;
                    }
                    for ( var k in std_affects_arr ) {
                        var v = std_affects_arr[ k ]
                        if ( undefined === v[ newval ] ) {
                            continue
                        }
                        api( k ).set( v[ newval ] )
                    }
                })
            })
        }

	});

    /**
     * TABS
     * ====================================================================================
     */
    api.bind( 'ready', function() {

        var tabs_update = function( tabs, tab ) {
            var affected_settings = []
            for ( var tabkey in FOX_CUSTOMIZE.tabs[ tabs ] ) {
                if ( undefined === FOX_CUSTOMIZE.tabs[tabs][ tabkey ] ) {
                    FOX_CUSTOMIZE.tabs[tabs][ tabkey ] = []
                }
                affected_settings = affected_settings.concat( FOX_CUSTOMIZE.tabs[tabs][ tabkey ] )
            }
            for ( var affected_setting of affected_settings ) {
                if ( FOX_CUSTOMIZE.tabs[tabs][ tab ].includes( affected_setting ) ) {
                    api.control( affected_setting ).container.removeClass( 'hide--innertab' )
                } else {
                    api.control( affected_setting ).container.addClass( 'hide--innertab' )
                }
            }
        }

        // on init
        for ( var tabs in FOX_CUSTOMIZE.tabs ) {
            // active the first one
            var tab_active = FOX_CUSTOMIZE.tabs[ tabs ].tab_active
            if ( ! tab_active ) {
                continue
            }
            delete FOX_CUSTOMIZE.tabs[ tabs ].tab_active
            tabs_update( tabs, tab_active )
        }
        $( '.tabs56' ).on( 'click', 'a', function(e) {
            e.preventDefault()
            var a = $( this ),
                tab = a.data( 'tab' ),
                tabs_wrapper = a.closest( '.tabs56' ),
                tabs = tabs_wrapper.data( 'tabs' )

            tabs_wrapper.find('a').removeClass('active')    
            a.addClass('active')
            tabs_update( tabs, tab )
        })
        
    });

    /**
     * OFFCANVAS ACTIVE PANEL
     * HEADER MOBILE
     * SIDEDOCK
     * ====================================================================================
     */
    api.bind( 'ready', function() {

        api.previewer.bind( 'ready', function() {
            
            /* off canvas
            ------------------------------------------------------ */
            api.section( 'header_offcanvas' ).expanded.bind(function (isExpanded) {
                if( isExpanded ) {
                    api.previewer.send( 'show_offcanvas' );
                } else {
                    api.previewer.send( 'hide_offcanvas' );
                }
            });
            
            /* mobile header
            ------------------------------------------------------ */
            api.section( 'header_mobile' ).expanded.bind(function (isExpanded) {
                if( isExpanded ) {
                    wp.customize.previewedDevice.set( 'mobile' );
                } else {
                    wp.customize.previewedDevice.set( 'desktop' );
                }
            });

            /* side dock
            ------------------------------------------------------ */
            api.section( 'single_sidedock' ).expanded.bind(function (isExpanded) {
                if( isExpanded ) {
                    api.previewer.send( 'show_single_sidedock' );
                } else {
                    api.previewer.send( 'hide_single_sidedock' );
                }
            });
            
        });
    });

    /**
     * init things only on section open
     */
    var time = Date.now()
    api.bind( 'ready', function() {
        console.log( Date.now() - time  + 'ms to load' )
        api.section.each( function ( section ) {
            section.expanded.bind( function( isExpanding ) {
                if(isExpanding) {
                    if ( ! $( section.contentContainer ).data( 'fox_section_init' ) ) {
                        $( section.contentContainer ).trigger( 'fox_section_init' )
                        $( section.contentContainer ).data( 'fox_section_init', true )
                    }
                    $( section.contentContainer ).find( '.customize-control' ).each(function(){
                        var li = $( this )
                        if ( ! li.data( 'fox_init' ) ) {
                            li.data( 'fox_init', true )
                            li.trigger( 'fox_init' )
                        }
                    })
                }
            });

            $( section.contentContainer ).on( 'fox_section_init', function() {
                $( section.contentContainer ).find( '.hastip' ).tooltipster({});
            })

        });
    })

    /**
     * HINTs
     * ====================================================================================
     */
    api.bind( 'ready', function() {

        $( '#customize-header-actions' ).append( '<input type="search" placeholder="Search option.." class="goto" tabindex="1" onfocus="this.select()" />' );

        var swap = function( json ) {
            var ret = {};
            for(var key in json){
            ret[json[key]] = key;
            }
            return ret;
        }

        var hintlist = {}
        for ( var id in api.settings.controls ) {
            if ( id.substring( 0, 7 ) == 'widget_' ) {
                continue
            }
            var label = api.settings.controls[ id ].hint
            if ( ! label ) {
                label = api.settings.controls[ id ].label
            }
            if ( ! label ) {
                label = api.settings.controls[ id ].heading
            }
            if ( ! label ) {
                continue;
            }
            hintlist[ id ] = label.toLowerCase()
        }

        var goto_input = $( '.goto' ),
            keywords = Object.values( hintlist ),
            hint_reverse = swap( hintlist ),
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

    });
    
})( jQuery, wp.customize );