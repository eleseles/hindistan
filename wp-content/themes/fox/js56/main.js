!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){function i(){var b,c,d={height:f.innerHeight,width:f.innerWidth};return d.height||(b=e.compatMode,(b||!a.support.boxModel)&&(c="CSS1Compat"===b?g:e.body,d={height:c.clientHeight,width:c.clientWidth})),d}function j(){return{top:f.pageYOffset||g.scrollTop||e.body.scrollTop,left:f.pageXOffset||g.scrollLeft||e.body.scrollLeft}}function k(){if(b.length){var e=0,f=a.map(b,function(a){var b=a.data.selector,c=a.$element;return b?c.find(b):c});for(c=c||i(),d=d||j();e<b.length;e++)if(a.contains(g,f[e][0])){var h=a(f[e]),k={height:h[0].offsetHeight,width:h[0].offsetWidth},l=h.offset(),m=h.data("inview");if(!d||!c)return;l.top+k.height>d.top&&l.top<d.top+c.height&&l.left+k.width>d.left&&l.left<d.left+c.width?m||h.data("inview",!0).trigger("inview",[!0]):m&&h.data("inview",!1).trigger("inview",[!1])}}}var c,d,h,b=[],e=document,f=window,g=e.documentElement;a.event.special.inview={add:function(c){b.push({data:c,$element:a(this),element:this}),!h&&b.length&&(h=setInterval(k,250))},remove:function(a){for(var c=0;c<b.length;c++){var d=b[c];if(d.element===this&&d.data.guid===a.guid){b.splice(c,1);break}}b.length||(clearInterval(h),h=null)}},a(f).on("scroll resize scrollstop",function(){c=d=null}),!g.addEventListener&&g.attachEvent&&g.attachEvent("onfocusin",function(){d=null})});

/**
 * since 5.6
 */
const $ = jQuery

/* Debounce
--------------------------------------------------------------------------------------------- */
window.debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

/**
 * WooCommerce Quantity Buttons
 * @since 2.4
 */
$( document ).ready( function(){
    
    var insert_quan = function() {

        // Quantity buttons
        $( 'div.quantity:not(.buttons-added), td.quantity:not(.buttons-added)' )
        .addClass( 'buttons-added' )
        .append( '<input type="button" value="+" class="plus" />' )
        .prepend( '<input type="button" value="-" class="minus" />' );

        // Set min value
        $( 'input.qty:not(.product-quantity input.qty)' ).each ( function() {
            var qty = $( this ),
                min = parseFloat( qty.attr( 'min' ) );
            if ( min && min > 0 && parseFloat( qty.val() ) < min ) {
                qty.val( min );
            }
        });
        
    }
    
    insert_quan();
    
    $( document.body ).on( 'updated_cart_totals', function(){
        insert_quan()
    })

    // Handle click event
    $( document ).on( 'click', '.plus, .minus', function() {

            // Get values
        var qty = $( this ).closest( '.quantity' ).find( '.qty' ),
            currentQty = parseFloat( qty.val() ),
            max = parseFloat( qty.attr( 'max' ) ),
            min = parseFloat( qty.attr( 'min' ) ),
            step = qty.attr( 'step' );

        // Format values
        if ( !currentQty || currentQty === '' || currentQty === 'NaN' ) currentQty = 0;
        if ( max === '' || max === 'NaN' ) max = '';
        if ( min === '' || min === 'NaN' ) min = 0;
        if ( step === 'any' || step === '' || step === undefined || parseFloat( step ) === 'NaN' ) step = 1;

        // Change the value
        if ( $( this ).is( '.plus' ) ) {

            if ( max && ( max == currentQty || currentQty > max ) ) {
                qty.val( max );
            } else {
                qty.val( currentQty + parseFloat( step ) );
            }

        } else {

            if ( min && ( min == currentQty || currentQty < min ) ) {
                qty.val( min );
            } else if ( currentQty > 0 ) {
                qty.val( currentQty - parseFloat( step ) );
            }

        }

        // Trigger change event
        qty.trigger( 'change' );

    });

})

/* LIGHTBOX
==========================================================================================  */
var gallery_args = {
    type: 'image',
    delegate: 'a',
    gallery: {
        enabled: true,
        tCounter: '%curr% / <span class="total">%total%</span>',
        arrowMarkup : '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"><i class="ic56-chevron-thin-%dir%"></i></button>',
    },
    removalDelay : 400,
    tLoading : WITHEMES56.l10n.loading ? WITHEMES56.l10n.loading : 'Loading...',
    image: {
        // options for image content type
        titleSrc: function(item) {
            var text = item.el.closest( 'figure' ).find( 'figcaption' );
            if ( ! text.length ) return '';

            text = text.html();

            if ( text.split( ' ' ).length > 12 ) {
                return '<p class="lightbox-caption-long">' + text + '</p>';
            } else {
                return '<p class="lightbox-caption-short">' + text + '</p>';
            }
        }
    },
    closeBtnInside : true,
    closeMarkup : '<button title="%title%" type="button" class="mfp-close"><i class="ic56-close"></i></button>',
    callbacks: {

        beforeOpen: function() {
            $( 'html' ).addClass( 'lightbox-open' )
        },
        afterClose: function() {
            $( 'html' ).removeClass( 'lightbox-open' )
        },
        imageLoadComplete: function() {	
            var self = this;
            setTimeout(function() { self.wrap.addClass('mfp-image-loaded'); }, 16);
        }

    }
}
var run_lightbox = function( selector = null ) {

    if ( ! selector ) {
        selector = $( 'body' )
    }

    if ( ! WITHEMES56.enable_lightbox ) {
        return
    }

    if ( ! $().magnificPopup ) {
        return;
    }
    
    /* ------------------------------ video type */
    selector.find( '.open-video-lightbox' ).magnificPopup({
        type: 'iframe',
    });

    /* ------------------------------ grid gallery */
    selector.find( '.gallery56--lightbox' ).each(function() {
        var wrapper = $( this )
        wrapper.magnificPopup( gallery_args )
    });

    /* ------------------------------ single post gallery */
    selector.find( '.single56__content .wp-block-gallery, .gallery' ).each(function(){
        var wrapper = $( this )
        var as = wrapper.find( 'a' ).filter(function(index){
            var href = $( this ).attr('href');
            if (href) {
                href = href.toLowerCase()
            }
            var extension = href.split('.').pop(),
                img_extensions = [ 'jpg', 'gif', 'jpeg', 'png', 'bmp', 'svg', 'webp', 'tiff' ]
            return img_extensions.includes( extension )
        })
        var new_args = gallery_args
        new_args.delegate = null
        if ( ! as.length ) {
            return;
        }
        as.magnificPopup( new_args )
    });

    /* ------------------------------ single images */
    selector.find( '.wp-block-image a, .align-left a, .align-right a, .align-center a, .align-stretch a, .align-wide a, .align-none a' ).each(function(){

        // hmm, is this an efficient method?
        if ( $( this ).closest( '.wp-block-gallery' ).length ) {
            return
        }

        var href = $( this ).attr('href');
        if ( ! href ) {
            return;
        }
        href = href.toLowerCase()
        var extension = href.split('.').pop()
        var img_extensions = [ 'jpg', 'gif', 'jpeg', 'png', 'bmp', 'svg', 'webp', 'tiff' ]
        if ( ! img_extensions.includes( extension ) ) {
            return;
        }
        var new_args = gallery_args
        new_args.gallery = { enabled: false }
        new_args.removalDelay = 0
        $( this ).magnificPopup( new_args )
    })

}

/* DARK MODE
==================================================================================== */
function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

var cookie_prefix2 = 'fox_' + WITHEMES56.site_id + '_'
$( document ).ready(function() {
    $( document ).on( 'click', '.lamp56', function(e) {
        $( 'body' ).toggleClass( 'darkmode' );
        if ( $( 'body' ).hasClass( 'darkmode' ) ) {
            createCookie( cookie_prefix2 + 'user_darkmode', 'dark' );
        } else {
            createCookie( cookie_prefix2 + 'user_darkmode', 'light' );
        }
    });
});

/* THUMBNAIL SHOWING EFFECT
 * since 6.0.9
==================================================================================== */
$( document ).ready(function() {
    $( '.thumbnail56--hasshowing' ).each(function() {
        var thumbnail = $( this )
        thumbnail.on('inview', function(e, isInView) {
            if (isInView) {
                thumbnail.addClass( 'inview' )
            }
          });
    })
});

/* SCROLL DOWN
==================================================================================== */
$( document ).ready(function() {
    
    $( document ).on( 'click', '.scroll-down-btn', function( e ) {
        e.preventDefault();
        var hero = $( this ).closest( '.hero56' );
        if ( ! hero.length ) {
            return;
        }
        
        var scrollTop = hero.offset().top + $( window ).outerHeight();
        if ( $( '#wpadminbar' ).length ) {
            scrollTop = scrollTop - $( '#wpadminbar' ).outerHeight();
        }
        
        $( "html, body").animate({ scrollTop: scrollTop + 'px' }, 300 , 'linear' );
        
    });
    
});

/* SIDE DOCK
==================================================================================== */
$( document ).ready(function() {

    var doc = $( '.sidedock56' );
    if ( ! doc.length ) {
        return;
    }
    if ( ! $( '#wi-footer,.footer-elementor' ).length ) {
        return;
    }
    var close = doc.find( '.close' );
    $( '#wi-footer,.footer-elementor' ).each(function(){
        var footer = $( this )
        footer.on( 'inview', function(e,isInvew){
            if ( isInvew ) {
                if ( ! doc.data('never-show')) {
                    doc.addClass( 'shown' )
                }
            }
        })
    })
    
    // Setup Animation
    doc.find( '.sidedock56__post' ).each(function( i ) {
        $( this ).css({
            '-webkit-transition-delay': ( 400 + 80 * i + 'ms' ),
            'transition-delay': ( 400 + 80 * i + 'ms' ),
        });
    });

    // close
    $( document ).on( 'click', '.sidedock56 .close', function(e){
        e.preventDefault()
        doc
        .removeClass( 'shown' )
        .addClass( 'dont-show-me-again' )
        .data( 'never-show', true )
    })
});

/* PROGRESS
==================================================================================== */
$( document ).ready(function() {
    
    var progress = $( '.progress56' ),
        postContent = $( '.single56__post_content' );
    if ( ! progress.length ) return;
    if ( ! postContent.length ) return;

    // move it to header
    if ( progress.hasClass( 'progress56--header' ) ) {
        var sticky_header = $( '.masthead--sticky' );
        if ( sticky_header.length ) {
            progress.appendTo( sticky_header.find( '.masthead__wrapper' ) )

        // otherwise, move it to top
        } else {
            progress.removeClass( 'progress56--header' )
            progress.addClass( 'progress56--top' )
        }
    }

    var offsetBottom = postContent.offset().top + postContent.outerHeight();
    
    var getMax = function() {
        return offsetBottom;
    }

    var getValue = function(){
        var top = $( window ).scrollTop();
        if ( top > getMax() ) return getMax();
        else return top;
    }

    progress.attr( 'max', getMax() );

    $(document).on('scroll', function(){
        // On scroll only Value attr needs to be calculated
        progress.attr({ value: getValue() });
    });
    
    var run = function() {
        // too short
        /*
        if ( postContent.outerHeight() < $( window ).height() ) {
            progress.hide();
            return;
        } else {
            progress.show();
        }
        */
        
        offsetBottom = postContent.offset().top + postContent.outerHeight();
        progress.attr( 'max', offsetBottom );
    }
    run()
    
    // re-calculate offsetBottom on resize
    $( window ).resize( debounce( function() {
        run();
    }, 100 ) );
    
})

/* CAROUSEL
since 5.6
==================================================================================== */
function run_carousel( selector = null ) {

    if ( ! $().flickity ) {
        return
    }

    if ( selector ) {
        selector = selector.find( '.carousel56' )
    } else {
        selector = jQuery( '.carousel56' )
    }
    selector.each(function() {
        var wrapper = $( this ),
            main_carousel = wrapper.find( '.main-carousel' ),
            options = wrapper.data( 'options')

        main_carousel.on( 'ready.flickity', function() {
            
            main_carousel.addClass( 'carousel-ready' )

            if ( ! WITHEMES56.enable_lightbox ) {
                return
            }
            if ( ! $().magnificPopup ) {
                return;
            }

            var as = main_carousel.find( 'a' ).filter(function(index){
                var href = $( this ).attr('href');
                if (href) {
                    href = href.toLowerCase()
                }
                var extension = href.split('.').pop(),
                    img_extensions = [ 'jpg', 'gif', 'jpeg', 'png', 'bmp', 'svg', 'webp', 'tiff' ]
                return img_extensions.includes( extension )
            })
            var new_args = gallery_args
            new_args.delegate = null
            if ( ! as.length ) {
                return;
            }
            as.magnificPopup( new_args )

        });

        main_carousel.flickity( options );
    });

}

/* MASONRY
since 5.6
==================================================================================== */
function run_masonry( selector = null ) {
    if ( selector ) {
        selector = selector.find( '.masonry56' )
    } else {
        selector = jQuery( '.masonry56' )
    }
    selector.each(function() {

        var wrapper = jQuery( this ),
            std = {
                columnWidth: '.grid-sizer',
                percentPosition: true,
                initLayout: false,
            },
            options = wrapper.data( 'options' )
            options = jQuery.extend( std, options );

        wrapper.imagesLoaded( function() {
        
            var grid = wrapper.find( '.main-masonry' ).masonry( options );
            grid.masonry( 'on', 'layoutComplete', function() {
                wrapper.addClass( 'loaded' );

                wrapper.find( '.masonry-cell' ).each(function() {
                    var item = $( this )
                    item.on( 'inview', function( e, isInview ){
                        if ( isInview ) {
                            item.addClass( 'inview' )
                        }
                    })
                }); // each

            });
        
            grid.masonry();

        });

    });
}

/* STICKY SIDEBAR
since 5.6
==================================================================================== */
function run_sticky_sidebar( selector = null ) {
    if ( ! $().theiaStickySidebar ) return;
    if ( selector ) {
        selector = selector.find( '.hassidebar--sticky' )
    } else {
        selector = $( '.hassidebar--sticky' )
    }
    selector.each(function() {
        var wrapper = $( this )
        wrapper.find( '.primary56, .secondary56' ).theiaStickySidebar({
            minWidth: 1024,
        })
    });
}

/* classic search
==================================================================================== */
$( document ).ready(function($) {

    /* classic search
    ------------------------------------ */
    var classic_search_close = function() {
        $( '.search-wrapper-classic' ).slideUp('fast','linear');
    }

    /* -------------------  click search button */
    $( document ).on( 'click', '.search-btn-classic', function( e ) {
        e.preventDefault()
        var btn = $( this ),
            header_row = $( '.main_header56' ) // we always append it to the main section
        if ( ! header_row.length ) {
            return;
        }
        if ( ! $( '.search-wrapper-classic' ).length ) {
            return;
        }
        
        var container = header_row.find( '.container' )
        if ( ! container.length ) {
            return;
        }
        container = container.first();
        if ( ! container.find( '>.search-wrapper-classic' ).length ) {
            container.prepend( $( '.search-wrapper-classic' ).first() )
        }
        var wrapper = container.find( '>.search-wrapper-classic' );
        $("html, body").animate({ scrollTop: 0 }, 400 , 'linear');
        wrapper.slideDown( 200 ,function() {
            wrapper.find( '.s' ).focus();
        })
    });

    /* -------------------  click outside to close it */
    $( document ).on( 'click', function( e ) {
        if ( ! $( '.search-wrapper-classic' ).length ) {
            return;
        }
        
        var currentTarget = $( e.target );
        if ( currentTarget.is( '.search-wrapper-classic, .search-btn-classic' ) || currentTarget.closest( '.search-wrapper-classic, .search-btn-classic' ).length ) {
        } else {
            classic_search_close()
        }
        
    })

    /* -------------------  close by esc key */
    $( document ).on( 'keydown', function( e ) {
        // ESCAPE key pressed
        if (e.keyCode == 27) {
            if ( ! $( '.search-wrapper-classic' ).length ) {
                return;
            }
            classic_search_close()
        }
    });

});

/* flying search
==================================================================================== */
$( document ).ready(function() {
        
    var modal_search_open = function() {
        $( 'html' ).addClass( 'in-modal-search56' );
    }

    var modal_search_close = function() {
        $( 'html' ).removeClass( 'in-modal-search56' );
    }
    
    /* open by click 
    ------------------------------------ */
    $( document ).on( 'click', '.search-btn-modal', function( e ) {
        
        /**
         * set up
         */
        if ( ! $( '.search-wrapper-modal' ).length ) {
            return;
        }
        var wrapper = $( 'body > .search-wrapper-modal' )
        if ( ! wrapper.length ) {
            $( 'body' ).append( $( '.search-wrapper-modal' ).first() )
            wrapper = $( 'body > .search-wrapper-modal' )
        }
        wrapper = wrapper.first()
    
        setTimeout(function() {
            modal_search_open();
        }, 100 );
        setTimeout(function() {
            wrapper.find( '.s' ).focus();
        }, 150 );

    });
    
    /* close by click the close button
    ------------------------------------ */
    $( document ).on( 'click', '.search-modal-close-btn', function( e ) {
        
        e.preventDefault()
        modal_search_close()
        
    });
    
    /* close by the key
    ------------------------------------ */
    $( document ).on( 'keydown', function( e ) {
        // ESCAPE key pressed
        if (e.keyCode == 27) {
            modal_search_close()
        }
    });
    
});

/* off canvas open
==========================================================================================  */
$( document ).ready(function(){
    
    // hamburger is a toggle class
    $( document ).on( 'click', '.hamburger', function() {
        $( 'html' ).toggleClass( 'on-offcanvas' )
    });

    $( document ).on( 'click', '.close-offcanvas, .offcanvas56__overlay', function() {
        $( 'html' ).removeClass( 'on-offcanvas' )
    });
    
    /* close by the key
    ------------------------------------ */
    $( document ).on( 'keydown', function( e ) {
        // ESCAPE key pressed
        if (e.keyCode == 27) {
            $( 'html' ).removeClass( 'on-offcanvas' )
        }
    });

    /* animation
    ------------------------------------ */
    $( '.offcanvas56--hasanimation' ).find( '.offcanvasnav56 ul.menu > li, .offcanvas56__social, .offcanvas56__search, .widget' ).each(function(index) {
        $( this ).css({
            transitionDelay : -400 + 400 * Math.pow(index + 1, 1/3) + 'ms',
        })
    })

});

/* off canvas menu
==========================================================================================  */
$( document ).ready(function() {
    
    $( document ).on( 'click', '.offcanvasnav56 .mk', function( e ) {
        e.preventDefault()
        var li = $( this ).closest( 'li' ),
            ul = li.find( '> ul' )
        if ( ! ul.length ) {
            return;
        }
        if ( li.hasClass( 'active') ) {
            ul.slideUp('fast','linear')
            li.removeClass( 'active' )
        } else {
            ul.slideDown('fast','linear')
            li.addClass( 'active' )
        }
    });
    
    /* close by the key
    ------------------------------------ */
    $( document ).on( 'keydown', function( e ) {
        // ESCAPE key pressed
        if (e.keyCode == 27) {
            $( 'html' ).removeClass( 'on-offcanvas' )
        }
    });
    
});

/* STICKY HEADER
==========================================================================================  */
$( document ).ready(function() {
    var masthead = $( '.masthead--sticky' )
    if ( ! masthead.length ) {
        return;
    }
    var wrapper = masthead.find( '.masthead__wrapper' ),
        header_top = masthead.offset().top,
        header_h = wrapper.outerHeight(),
        delay_distance = 220,
        sticky_point = header_top + header_h + delay_distance,
        hide_point = header_top + header_h

    // masthead.css( 'height', header_h )
    window.addEventListener('resize', debounce( function() {
        wrapper.removeClass('is-sticky before-sticky') // to recalculate the height
        // masthead.css( 'height',masthead.outerHeight() )
        readAndUpdatePage()
    }, 50) );

    var scheduledAnimationFrame;
    function readAndUpdatePage() {
        var windowTop = window.scrollY;
        if ( windowTop > sticky_point ) {
            wrapper.addClass('before-sticky is-sticky');
            masthead.css( 'height', header_h )
        } else if ( windowTop > hide_point ) {
            wrapper.removeClass('is-sticky');
            wrapper.addClass('before-sticky');
            masthead.css( 'height',header_h )
        } else {
            wrapper.removeClass('is-sticky before-sticky');
            masthead.css( 'height', '' )
            // update the header height
            // header_h = wrapper.outerHeight()
        }
        scheduledAnimationFrame = false;
    }    

    var onscroll = function() {

        // Store the scroll value for laterz.
        var windowTop = window.scrollY;

        // Prevent multiple rAF callbacks.
        if (scheduledAnimationFrame){
            return;
        }

        scheduledAnimationFrame = true;
        requestAnimationFrame(readAndUpdatePage);
    }
    //  readAndUpdatePage()
    window.addEventListener('scroll', onscroll);
});

/* SCROLL TOP
==========================================================================================  */
$( document ).ready(function() {
    $( document ).on( 'click', '.scrollup56, a[href="#top"]', function( e ) {
        e.preventDefault()
        $("html, body").animate({ scrollTop: 0 }, 400 , 'linear');
		return false;     
    })

    var scheduledAnimationFrame = false
    var readAndUpdatePage = function() {
        if ( window.scrollY > 200) {
            $('.scrollup56').addClass('shown');
        } else {
            $('.scrollup56').removeClass('shown');
        }
        scheduledAnimationFrame = false;
    }

    var onscroll = function() {

        // Prevent multiple rAF callbacks.
        if (scheduledAnimationFrame){
            return;
        }

        scheduledAnimationFrame = true;
        requestAnimationFrame(readAndUpdatePage);
    }
    readAndUpdatePage()
    window.addEventListener('scroll', onscroll);

});

/* HEADER MIN STICKY
==========================================================================================  */
var run_minimal_header_sticky = function( selector = null ) {

    if ( ! $( '.minimal-header' ).length ) {
        return;
    }

    var scheduledAnimationFrame = false,
        vh = $( window ).outerHeight();
    var readAndUpdatePage = function() {
        if ( window.scrollY > vh ) {
            $( '.minimal-header' ).removeClass( 'top-mode' );
        } else {
            $( '.minimal-header' ).addClass( 'top-mode' );
        }
        scheduledAnimationFrame = false;
    }

    var onscroll = function() {

        // Prevent multiple rAF callbacks.
        if (scheduledAnimationFrame){
            return;
        }

        scheduledAnimationFrame = true;
        requestAnimationFrame(readAndUpdatePage);
    }
    readAndUpdatePage()
    window.addEventListener('scroll', onscroll);
    
}

/* HEADER MEGA
==========================================================================================  */
var run_header_mega = function( selector = null ) {

    /* --------------------------------     set up mega menu */
    var setup_mega = function( container ) {

        var outerContainer = container.closest( '.container' )
        if ( ! outerContainer.length ) {
            return;
        }
            
        var setup_position = debounce( function() {
            var outerContainerLeft = outerContainer.offset().left,
                outerContainerWidth = outerContainer.outerWidth()

            container.find( 'ul.menu > li.mega' ).each(function() {

                var li = $( this ),
                    ul = li.find( '>ul' )
                    
                if ( ! ul.length ) {
                    return;
                }
                li.removeClass( 'mega-loaded' )

                /* ------------------- column */
                var col = ul.find( ' > li' ).length;
                if ( li.hasClass( 'menu-item-object-category' ) ) col = 3;
                if ( ! col ) {
                    return;
                }

                if ( col > 0 ) {
                    li.addClass( 'column-' + col );
                }
                if ( col >= 4 ) {

                    li.addClass( 'mega-full' );
                    ul.css('width', outerContainerWidth)
                    var translateX = li.offset().left - outerContainerLeft

                } else {
                
                    /* ------------------- adjust the position of menu correctly */
                    var dropdown_width = ul.outerWidth(),
                        translateX = dropdown_width/2 - li.outerWidth()/2 - 30, // the ideal one, 60 is a small factor
                        li_away_left = li.offset().left - outerContainerLeft,
                        li_away_right = outerContainerWidth - ( li_away_left + li.outerWidth() )

                    // this means it's way too left, so don't translate left too much
                    if ( li_away_left < translateX ) {
                        translateX = li_away_left - 40
                    
                    // this means it's way too right, so we translate left as much as we can
                    } else if ( li_away_right < translateX ) {
                        translateX = dropdown_width - ( outerContainerWidth - li_away_left ) + 40
                    }

                }

                ul.css({
                    transform: 'translate(-' + translateX + 'px,0)',
                })

                // only show up after loading
                li.addClass( 'mega-loaded' )

            })
        }, 200 );
        setup_position()
        $( window ).on( 'resize', setup_position )
    }

    $( '.mainnav, .header-builder .widget_nav_menu, .el-nav.hnav > .nav-inner' ).each(function(){
        setup_mega( $( this ) )
    })
    
}

/* SHARE
==========================================================================================  */
var run_share = function( selector = null ) {
    var Config = {
        Width: 800,
        Height: 600
    };

    $( document ).on( 'click', '.share56 a', function( e ) {
        // popup position
        var a = $( this ),
            px = Math.floor(((screen.availWidth || 1024) - Config.Width) / 2),
            py = Math.floor(((screen.availHeight || 700) - Config.Height) / 2);
        
        if ( ! a.attr( 'href')) {
            return;
        }

        // open popup
        var popup = window.open(a.attr('href'), "social", 
            "width="+Config.Width+",height="+Config.Height+
            ",left="+px+",top="+py+
            ",location=0,menubar=0,toolbar=0,status=0,scrollbars=1,resizable=1");
        if (popup) {
            popup.focus();
            e.preventDefault()
            e.returnValue = false;
        }
    
        return !!popup;
    });
}

/* AUTHOR BOX
==========================================================================================  */
var run_authorbox = function( selector = null ) {
    
    $( document ).on( 'click', '.authorbox56__tabs a ', function( e ) {
        e.preventDefault();
        
        var btn = $( this ),
            tabs = btn.parent(),
            tab = btn.data('tab'),
            box = btn.closest( '.authorbox56' )
        
        if ( ! tabs.length || ! box.length ) {
            return;
        }
        tabs.find( 'a' ).removeClass( 'active' )
        btn.addClass( 'active' )
        
        // content active
        box.find( '.authorbox56__content' ).removeClass( 'active' );
        box.find( '.authorbox56__content[data-tab="' + tab + '"]' ).addClass( 'active' );
    });
}

/* FITVIDS
==========================================================================================  */
jQuery( document ).ready(function( $ ) {
    if ( ! $().fitVids ) {
        return;
    }

    $( document, '.media-container' ).fitVids();
});

/* FINAL INIT
==========================================================================================  */
$( document ).ready(function($) {
    run_lightbox();
    run_masonry();
    run_carousel();
    run_sticky_sidebar();
    run_header_mega();
    run_minimal_header_sticky();
    run_share();
    run_authorbox();
});
$( document ).on( 'partial-refresh', function( e, partial_id, selector_str ) {
    var selector = $( selector_str )
    if ( selector.length ) {
        run_masonry( selector )
        run_carousel( selector );
        run_sticky_sidebar( selector )
        run_header_mega( selector )
        run_minimal_header_sticky( selector )
        run_share( selector )
        run_authorbox( selector );
        run_lightbox( selector );
    }
});
jQuery( window ).on( 'elementor/frontend/init', function() {
    elementorFrontend.hooks.addAction( 'frontend/element_ready/fox_nav.default', function( $scope, $ ) {
        run_header_mega()
    })
})
var time = Date.now()
jQuery(document).ready(function(){
    console.log( Date.now() - time + 'ms to ready' )
})
















jQuery.event.special.touchstart = {
    setup: function( _, ns, handle ) {
        this.addEventListener("touchstart", handle, { passive: !ns.includes("noPreventDefault") });
    }
};
jQuery.event.special.touchmove = {
    setup: function( _, ns, handle ) {
        this.addEventListener("touchmove", handle, { passive: !ns.includes("noPreventDefault") });
    }
};
jQuery.event.special.wheel = {
    setup: function( _, ns, handle ){
        this.addEventListener("wheel", handle, { passive: true });
    }
};
jQuery.event.special.mousewheel = {
    setup: function( _, ns, handle ){
        this.addEventListener("mousewheel", handle, { passive: true });
    }
};