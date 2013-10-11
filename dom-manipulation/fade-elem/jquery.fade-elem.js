/**
 * @projectDescription: jQuery plugin for fading elements
 * @version: 1.0
 */
(function($){
	$.fn.fadeElem = function(opts){
		
		opts = $.extend({
			fadeSpeed:	500,
			fadeOut:	true,
			callback:	null
		}, opts);
		
		return this.each(function(){
			if($.browser.msie && $.browser.version.substr(0,1)<9){
				if(opts.fadeOut){
					$(this).hide();
					if(opts.callback && typeof(opts.callback) == 'function'){opts.callback();}
				}
				else{
					$(this).show();
					if(opts.callback && typeof(opts.callback) == 'function'){opts.callback();}
				}
			}
			else{
				if(opts.fadeOut){
					$(this).fadeOut(opts.fadeSpeed, function(){
						if(opts.callback && typeof(opts.callback) == 'function'){opts.callback();}
					});
				}
				else{
					$(this).fadeIn(opts.fadeSpeed, function(){
						if(opts.callback && typeof(opts.callback) == 'function'){opts.callback();}
					});
				}
			}
		});
	}
		
})(jQuery);