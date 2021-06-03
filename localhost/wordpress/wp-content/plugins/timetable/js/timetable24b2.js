jQuery(document).ready(function($){
	var tt_atts = $.parseJSON($(".timetable_atts").val());
	$(".tt_tabs").bind("tabsbeforeactivate", function(event, ui){
		if(ui.newTab.length)
		{
			if(ui.newTab[0].parentNode.className.indexOf("all_filters")===-1)
				$("html, body").animate({scrollTop: $("#"+$(ui.newTab).children("a").attr("id")).offset().top}, 400);
			else
			{
				if($(".events_categories_filter").length)
					$("html, body").animate({scrollTop: $(".events_categories_filter").offset().top}, 400);
				else if($(".events_filter").length)
					$("html, body").animate({scrollTop: $(".events_filter").offset().top}, 400);
			}
		}
	});
	
	$(".tt_tabs").on("tabsactivate", function(event, ui){
		ui.newPanel.find(".image_carousel").trigger("configuration", ["debug", false, true]);
	});
	
	$(".tt_tabs_navigation a").click(function(event){
		var $this = $(this);
		$this.parent().parent().find("li").removeClass("ui-tabs-active");
		$this.parent().addClass("ui-tabs-active");
	});
	
	$(".tt_tabs").tabs({
		event: "change",
		show: true,
		create: function(event, ui){
			$("html, body").scrollTop(0);
			if($(".tt_tabs_navigation.all_filters").length && window.location.href.indexOf("book-event-hour-")===-1)
			{
				if(ui.tab.length && $(".tt_tabs_navigation.events_categories_filter a[href='" + ui.tab[0].children[0].hash + "']").length)
					$(".tt_tabs_navigation.events_categories_filter a[href='" + ui.tab[0].children[0].hash + "']").parent().addClass("ui-tabs-active");
				else
					$(".tt_tabs_navigation.events_categories_filter li:first-child a").parent().addClass("ui-tabs-active");
				
				if(ui.tab.length && $(".tt_tabs_navigation.events_filter a[href='" + ui.tab[0].children[0].hash + "']").length)
					$(".tt_tabs_navigation.events_filter a[href='" + ui.tab[0].children[0].hash + "']").parent().addClass("ui-tabs-active");
				else
					$(".tt_tabs_navigation.events_filter li:first-child a").parent().addClass("ui-tabs-active");
			}
		}
	});
	
	//browser history
	$(".tt_tabs .ui-tabs-nav a").click(function(){
		if($(this).attr("href").substr(0,4)!="http")
			$.bbq.pushState($(this).attr("href"));
		else
			window.location.href = $(this).attr("href");
	});
	
	//tabs box navigation
	$(".tabs_box_navigation").mouseover(function(){
		$(this).find("ul").removeClass("tabs_box_navigation_hidden");
	});
	
	$(".tabs_box_navigation a").click(function(event){
		if($.param.fragment()==$(this).attr("href").replace("#", "") || ($.param.fragment()=="" && $(this).attr("href").replace("#", "").substr(0, 10)=="all-events"))
			event.preventDefault();
		$(this).parent().parent().find(".selected").removeClass("selected");
		$(this).parent().addClass("selected");
		$(this).parent().parent().parent().children('label').text($(this).text());
		$(this).parent().parent().addClass("tabs_box_navigation_hidden");
	});
	
	$(".tt_tabs_navigation:not(.all_filter) a, .tabs_box_navigation:not(.all_filter) a").click(function(event){
		event.preventDefault();
		var $this = $(this);
		var hash = $this.attr("href");
		var sharpIdx = (window.location.href.indexOf("#")!==-1 ? window.location.href.indexOf("#") : window.location.href.length);
		var event_str = ($(".events_filter .selected a").length ? $(".events_filter .selected a").attr("href").replace("#", "") : ($(".events_filter .ui-tabs-active a").length ? $(".events_filter .ui-tabs-active a").attr("href").replace("#", "") : ""));
		var events_category_str = ($(".events_categories_filter .selected a").length ? $(".events_categories_filter .selected a").attr("href").replace("#", "") : ($(".events_categories_filter .ui-tabs-active a").length ? $(".events_categories_filter .ui-tabs-active a").attr("href").replace("#", "") : ""));
		$("#tt_error_message").addClass("tt_hide");
		if(event_str!=="" && events_category_str!=="")
		{
			if((event_str!=="all-events" && events_category_str!=="all-events" && $("[id='" + event_str + "'][class*='tt-event-category-" + events_category_str.toLowerCase() +"']").length) || (events_category_str==="all-events"))
				window.location.href = escape_str(window.location.href.substr(0, sharpIdx)) + decodeURIComponent("#" + event_str);
			else if(event_str==="all-events" && events_category_str!=="all-events")
				window.location.href = escape_str(window.location.href.substr(0, sharpIdx)) + decodeURIComponent("#" + events_category_str);
			else
			{
				window.location.href = escape_str(window.location.href.substr(0, sharpIdx)) + "#";
				$(".tt_tabs").tabs("option", "collapsible", true);
				$(".tt_tabs").tabs("option", "active", false);
				$("#tt_error_message").removeClass("tt_hide");
			}
		}
		else
			window.location.href = escape_str(window.location.href.substr(0, sharpIdx)) + decodeURIComponent(hash);
		//window.location.hash is causing issues on Safari, because of that
		//it's necessary to use window.location.href
	});
	
	if($(".events_categories_filter li.ui-tabs-active").length && $(".events_filter li.ui-tabs-active").length)	
		$(".events_filter li.ui-tabs-active a").click();
	
	//hashchange
	$(window).bind("hashchange", function(event){
		var param_fragment = escape_str($.param.fragment());
		//some browsers will have the URL fragment already encoded, 
		//while others will not, thus it's necessary to handle both cases.
		
		//URL fragment is already encoded:
		$(".tabs_box_navigation a[href='#" + param_fragment + "']").trigger("click");
		$(".tt_tabs .ui-tabs-nav [href='#" + param_fragment + "']").trigger("change");
		//URL fragment must be encoded:
		$(".tabs_box_navigation a[href='#" + encodeURIComponent(param_fragment) + "']").trigger("click");
		$(".tt_tabs .ui-tabs-nav [href='#" + encodeURIComponent(param_fragment) + "']").trigger("change");
	}).trigger("hashchange");
	
	//tooltip
	$(".tt_tooltip").bind("mouseover click", function(){
		var attachTo = $(this);
		if($(this).is(".event_container"))
			attachTo = $(this).parent();
		var tooltip_text = $(this).children(".tt_tooltip_text");
		
		tooltip_text.css("width", $(this).outerWidth() + "px");
		tooltip_text.css("height", tooltip_text.height() + "px");
		tooltip_text.css({"top":  -(tooltip_text.parent().offset().top-attachTo.offset().top+tooltip_text.innerHeight()) + "px", "left": 0 + "px"});
	});
	
	//upcoming events
	$(".tt_upcoming_events").each(function(){
		var self = $(this);
		var autoscroll = 0;
		var elementClasses = $(this).attr("class").split(" ");
		for(var i=0; i<elementClasses.length; i++)
		{
			if(elementClasses[i].indexOf("autoscroll-")!=-1)
				autoscroll = elementClasses[i].replace("autoscroll-", "");
		}
		self.carouFredSel({
			direction: "up",
			items: {
				visible: (self.children().length>2 ? 3 : self.children().length),
				height: "variable"
			},
			scroll: {
				items: 1,
				easing: "swing",
				pauseOnHover: true
			},
			prev: {button: self.next().children("#upcoming_event_prev")},
			next: {button: self.next().children("#upcoming_event_next")},
			auto: {
				play: (parseInt(autoscroll) ? true : false)
			}
		});
		
		self.find("li a.tt_upcoming_events_event_container, li>span").hover(function(){
			self.trigger("configuration", ["debug", false, true]);
		},
		function(){
			setTimeout(function(){
				self.trigger("configuration", ["debug", false, true]);
			}, 1);
		});
	});
	$(window).resize(function(){
		$(".tt_upcoming_events").trigger("configuration", ["debug", false, true]);
	});
	
	//timetable row heights
	/*var maxHeight = Math.max.apply(null, $(".timetable:visible tr td:first-child").map(function ()
	{
		return $(this).height();
	}).get());
	$(".timetable:visible tr td").css("height", maxHeight);
	//timetable height fix
	$(".timetable .event").each(function(){
		if($(this).children(".event_container").length>1)
		{
			var childrenHeight = 0;
			$(this).children(".event_container").not(":last").each(function(){
				childrenHeight += $(this).innerHeight();
			});
			var height = $(this).height()-childrenHeight-($(this).parent().parent().width()<=750 ? 9 : 22);
			if(height>$(this).children(".event_container").last().height())
				$(this).children(".event_container").last().css("height", height + "px");
		}
	});*/
	
	//show/hide event hours on mobile device
	$(document.body).on("click", ".tt_timetable.small .plus.box_header", function(event) {
		var $this = $(this);
		var $list = $this.next("ul.tt_items_list");
		$list.slideDown(500);
		$this.removeClass("plus");
		$this.addClass("minus");
	});
	$(document.body).on("click", ".tt_timetable.small .minus.box_header", function(event) {
		var $this = $(this);
		var $list = $this.next("ul.tt_items_list");
		$list.slideUp(500, function() {
			$this.removeClass("minus");
			$this.addClass("plus");
		});
	});
	
	$(document.body).on("click touchstart", ".event_hour_booking", function(event) {
		event.preventDefault();
		var $this = $(this);
		var $booking_popup = $("#tt_booking_popup_message");
		var $booking_popup_message = $booking_popup.find(".tt_booking_message");
		var $booking_popup_preloader = $booking_popup.find(".tt_preloader");
		var event_hour_id = $this.attr("data-event-hour-id");
		var redirect_url = window.location.href;
		if(redirect_url.indexOf("#")===-1)
			redirect_url = redirect_url + "#book-event-hour-" + event_hour_id;
		else
			redirect_url = redirect_url.substr(0, redirect_url.indexOf("#")) + "#book-event-hour-" + event_hour_id;
		
		if($this.hasClass("unavailable") || $this.hasClass("booked"))
			return;
		
		$booking_popup_message.html("");
		$booking_popup.removeClass("tt_hide");
		$booking_popup_preloader.removeClass("tt_hide");
		resize_booking_popup();
		$booking_popup_message.attr("data-event-hour-id", event_hour_id);
		
		$.post(tt_config.ajaxurl,
			{
				action: "timetable_ajax_event_hour_details",
				redirect_url: redirect_url,
				event_hour_id: event_hour_id,
				booking_popup_message_template: tt_atts.booking_popup_message,
				booking_popup_label: tt_atts.booking_popup_label,
				cancel_popup_label: tt_atts.cancel_popup_label,
				continue_popup_label: tt_atts.continue_popup_label,
				login_popup_label: tt_atts.login_popup_label,
			},
			function(result){
				$booking_popup_preloader.addClass("tt_hide");
				var indexStart = result.indexOf("timetable_start")+15;
				var indexEnd = result.indexOf("timetable_end")-indexStart;
				result = $.parseJSON(result.substr(indexStart, indexEnd));
				if(typeof(result.msg!=="undefined"))
				{
					if(!result.error)
						$booking_popup_message.html(result.msg);
					else
					{
						$booking_popup_message.html("<p>" + result.msg + "</p><div><a href='#' class='tt_btn cancel'>Cancel</a></div>");
					}
					resize_booking_popup();
				}
			},
			"html"
		);
	});
	
	$(document.body).on("click touchstart", "#tt_booking_popup_message .tt_btn.book", function(event)
	{
		event.preventDefault();
		var $booking_popup = $("#tt_booking_popup_message");
		var $booking_popup_message = $booking_popup.find(".tt_booking_message");
		var $booking_popup_preloader = $booking_popup.find(".tt_preloader");		
		var event_hour_id = $booking_popup_message.attr("data-event-hour-id");
		
		$booking_popup_message.html("");
		$booking_popup_preloader.removeClass("tt_hide");
		resize_booking_popup();
		
		$.post(tt_config.ajaxurl,
			{
				action: "timetable_ajax_event_hour_booking",
				event_hour_id: event_hour_id,
				cancel_popup_label: tt_atts.cancel_popup_label,
				continue_popup_label: tt_atts.continue_popup_label,
				booking_popup_thank_you_message_template: tt_atts.booking_popup_thank_you_message,
			},
			function(result){
				$booking_popup_preloader.addClass("tt_hide");
				var indexStart = result.indexOf("timetable_start")+15;
				var indexEnd = result.indexOf("timetable_end")-indexStart;
				result = $.parseJSON(result.substr(indexStart, indexEnd));
				if(typeof(result.msg!=="undefined"))
				{
					if(!result.error)
					{
						$booking_popup_message.html(result.msg);
						
						var booked_button_html = 
							'<a href="#"' + 
							' class="event_hour_booking id-' + event_hour_id + ' booked ' + tt_atts.show_booking_button + '"' + 
							' style="' + (tt_atts.booked_text_color.length && tt_atts.booked_text_color.toUpperCase()!='AAAAAA' ? ' color:#' + tt_atts.booked_text_color + ' !important;' : "") + (tt_atts.booked_bg_color.length && tt_atts.booked_bg_color.toUpperCase()!='EEEEEE' ? '" background-color:#"' + tt_atts.booked_bg_color + ' !important;' : '') + '"' + 
							' title="' + tt_atts.booked_label + '">' + 
								tt_atts.booked_label + 
							'</a>';
						
						$(".event_hour_booking.id-" + event_hour_id).replaceWith(booked_button_html);
						
						if(typeof(result.remaining_places)!=="undefined")
						{
							if(result.remaining_places>0)
								$(".available_slots.id-" + event_hour_id + "").html("<span class='count'> " + result.remaining_places + "</span> " + result.available_slots_label);
							else
								$(".available_slots.id-" + event_hour_id + "").remove();
						}
					}
					else
					{
						$booking_popup_message.html("<p>" + result.msg + "</p><div><a href='#' class='tt_btn cancel'>" + tt_atts.cancel_popup_label + "</a></div>");
					}
					resize_booking_popup();
				}
			},
			"html"
		);
	});
	
	$(document.body).on("click touchstart", "#tt_booking_popup_message", function(event) {
		var target = $(event.target);
		if(target.is($(this)))
			close_booking_popup();
	});
	
	$(document.body).on("click touchstart", ".tt_btn.cancel,.tt_btn.continue", function(event) {
		event.preventDefault();
		close_booking_popup();
	});
	
	function close_booking_popup()
	{
		$("#tt_booking_popup_message").addClass("tt_hide");
		$("#tt_booking_popup_message .tt_booking_message").css("height", "");
		if(window.location.href.indexOf("book-event-hour-")!==-1)
			window.location.href = window.location.href.substr(0, window.location.href.indexOf("#"));
	}
	
	function resize_booking_popup()
	{
		var $booking_popup_message_wrapper = $("#tt_booking_popup_message .tt_booking_message_wrapper");
		var popup_message_height = $booking_popup_message_wrapper.outerHeight();
		var popup_message_height_auto = $booking_popup_message_wrapper.css("height", "").outerHeight();
		var window_height = $(window).outerHeight();
		var popup_message_height_new;
		if(popup_message_height_auto+40<window_height)
		{
			popup_message_height_new = popup_message_height_auto;
			$booking_popup_message_wrapper.css({
				"overflow-y": ""
			});
		}
		else
		{
			popup_message_height_new = window_height-40;
			$booking_popup_message_wrapper.css({
				"overflow-y": "scroll"
			});
		}
		
		$booking_popup_message_wrapper.css("height", popup_message_height);
		if(popup_message_height!=popup_message_height_new)
			$booking_popup_message_wrapper.stop(false, true).animate({'height': popup_message_height_new}, 200);
	}
	$(window).resize(resize_booking_popup);
	window.addEventListener("orientationchange", resize_booking_popup);
	
	if(window.location.href.indexOf("book-event-hour-")!==-1)
	{ 
		var event_hour_id = window.location.href.substr(window.location.href.indexOf("book-event-hour-")+16);
		if($("a.event_hour_booking.id-" + event_hour_id).eq(0).length)
			$("a.event_hour_booking.id-" + event_hour_id).eq(0).click();
	}
	
	function escape_str($text)
	{
		return $("<div/>").text($text).html();
	}
	
	$("form.tt_generate_pdf").on("submit", function(event) {
		var $this=$(this),
			$timetable_copy,
			timetable_html;

		$timetable_copy = $(".tt_tabs div.ui-tabs-panel:visible").find(".tt_timetable.small").clone();
		$timetable_copy = $this.closest(".tt_wrapper").find(".tt_tabs div.ui-tabs-panel:visible .tt_timetable.small").clone();
		$timetable_copy.find("*").attr("style", "");	//helps to remove the colors
		timetable_html = $timetable_copy[0].outerHTML;
		if($("body").hasClass("rtl"))
			timetable_html = "<div class='rtl'>" + timetable_html + "</div>";
		$this.find("textarea[name='tt_pdf_html_content']").val(timetable_html);
		return true;
	});
});