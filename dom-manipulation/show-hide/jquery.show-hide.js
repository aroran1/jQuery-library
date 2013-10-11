/**
 * @projectDescription: jQuery plugin for show/hidding content with a trigger.
 * @version: 1.1
 */
 
(function($){
	$.fn.showHide = function(opts) {
		opts = $.extend({
			activeClass: 	'open',
			duration: 		'normal',
			event: 			'click',
			trigger: 		'.showHideTrigger',
			content: 		'.showHideContent'
		}, opts);

		return this.each(function(i) {
			var $this = $(this),
				$trigger = $this.find(opts.trigger),
				$content = $this.find(opts.content),
				hash = window.location.hash.substr(1);
							
			$content.hide();
			
			$trigger.bind(opts.event, function(e) {
				e.preventDefault();
				toggle();
			});
			
			$this
				.bind('toggleshowhide', function(){
					toggle();
				})
				.bind('showshowhide', function(){
					show();
				})
				.bind('hideshowhide', function(){
					hide();
				})
			
			if($this.attr('id') != '' && $this.attr('id') == hash){
				toggle(true);
			}
			
			/**
			 * Toggles the content node and adds/removes relevant classes
			 * 
			 * @param: {Boolean} slide - slide $content or not
			 */
			function toggle(slide){
				if($content.is(':visible')){
					hide(slide);
				}
				else{
					show(slide);
				}
			}
			/**
			 * Show content, add active class and trigger event
			 */
			function show(slide){
				var duration = slide ? 0 : opts.duration;
				$content.slideDown(opts.duration, function(){
					$trigger.addClass(opts.activeClass);
					$this.trigger('onopenshowhide');
				});
			}
			/**
			 * Hide content, remove active class and trigger event
			 */
			function hide(slide){
				var duration = slide ? 0 : opts.duration;
				$content.slideUp(opts.duration, function(){
					$trigger.removeClass(opts.activeClass);
					$this.trigger('oncloseshowhide');
				});
			}
			
		});
		
	};
})(jQuery);
