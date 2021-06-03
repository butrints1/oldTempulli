jQuery( document ).ready(function($) {

  // Logo Slider
  $( '.lswss-logo-showcase' ).each(function( index ) {
    
    var slider_id   = $(this).attr('id');
    var logo_conf   = $.parseJSON( $(this).closest('.lswss-logo-carousel-wrap').find('.lswss-carousel-conf').attr('data-conf') );

    if( typeof(slider_id) != 'undefined' && slider_id != '' ) {
        jQuery('#'+slider_id).slick({
			slidesToShow    	: parseInt(logo_conf.slide_to_show),
            slidesToScroll    	: parseInt(logo_conf.slide_to_column),
            centerMode  		: (logo_conf.centermode) == "true" ? true : false,
            dots        		: (logo_conf.pagination) == "true" ? true : false,
            arrows      		: (logo_conf.arrow) == "true" ? true : false,
            infinite      		: (logo_conf.loop) == "true" ? true : false,
            speed       		: parseInt(logo_conf.speed),
            autoplay      		: (logo_conf.autoplay) == "true" ? true : false,           
            autoplaySpeed   	: parseInt(logo_conf.autoplay_speed),
    		pauseOnFocus        : true,
    		centerPadding		: parseInt(logo_conf.space_between),
            rtl               	: (Lswss.is_rtl == 1) ? true : false,
            mobileFirst       	: (Lswss.is_mobile == 1) ? true : false,
            responsive: [{
              breakpoint: 1023,
              settings: {
                slidesToShow  : parseInt(logo_conf.slide_to_show_ipad),
                slidesToScroll  : 1
              }
            },{
              breakpoint: 640,
              settings: {
                slidesToShow  : parseInt(logo_conf.slide_to_show_tablet),
                slidesToScroll  : 1
              }
            },{
              breakpoint: 479,
              settings: {
                slidesToShow  : parseInt(logo_conf.slide_to_show_mobile),
                slidesToScroll  : 1
              }
            },{
              breakpoint: 319,
              settings: {
                slidesToShow: parseInt(logo_conf.slide_to_show_mobile),
                slidesToScroll: 1
              }
            }]
      });
    }
  });
});