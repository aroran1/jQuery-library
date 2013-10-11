/**
 * @projectDescription: jQuery plugin for show/hidding a tooltip with a trigger.
 * @version: 2.1
 * @requires: jquery.fade-elem.js
 */
(function($){
	
	$.fn.tooltip = function(opts){
		opts = $.extend(true, {
			selectors: {
				trigger:	'.tooltipTrigger',
				content:	'.tooltipContent'
			},
			classes: {
				overlay: 	'tooltipOverlay',
				inner1: 	'tooltipInner1',
				inner2: 	'tooltipInner2',
				spout: 		'spout'
			},			
			event:			'click',
			active:			'active',
			duration:		'normal',
			closeContent: 	''
		}, opts);
		
		return this.each(function(){
			var $this = $(this),
				$trigger = $this.find(opts.selectors.trigger).css('cursor', 'pointer'),
				$content = $this.find(opts.selectors.content).hide(),
				$close = $('<p><a href="#">' + opts.closeContent + '</a></p>'),
				$overlay = $(
					'<div class="' + opts.classes.overlay + '">' +
						'<div class="' + opts.classes.inner1 + '">' +
							'<div class="' + opts.classes.inner2 + '">' +
								$content.html() +
								'<div class="' + opts.classes.spout + '" />' +
							'</div>' +
						'</div>' +
					'</div>'
				).appendTo($this).hide();
				
			if($content.offset().left < 0){
				$content.addClass('flipRight');
			}
			$content.remove();
			
			$trigger.bind(opts.event, function(e){
				e.preventDefault();
				toggle();
			});
			
			$this.bind('toggletooltip', function(){
				toggle();
			});
			
			if(opts.closeContent != ''){
				$overlay.find('.tooltipInner2').append($close);
				$close.find('a').click(function(e){
					e.preventDefault();
					hide();
				})
			}
			
			/**
			 * Toggles the content node and adds/removes relevant classes
			 */
			function toggle(){
				if($trigger.hasClass(opts.active)){
					hide();
				}
				else{
					show();
				}
			}
			/**
			 * Shows the content node and adds relevant classes
			 */
			function show(){
				$trigger.addClass(opts.active);
				$overlay.fadeElem({
					fadeSpeed: opts.duration,
					fadeOut: false,
					callback: function(){
						$this.trigger('onopentooltip');
					}
				});
			}
			/**
			 * Hides the content node and removes relevant classes
			 */
			function hide(){
				$trigger.removeClass(opts.active);
				$overlay.fadeElem({
					fadeSpeed: opts.duration,
					callback: function(){
						$this.trigger('onclosetooltip');
					}
				});
			}
		});
	}
	
})(jQuery);