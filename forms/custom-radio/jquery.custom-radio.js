/**
 * @projectDescription: jQuery plugin for replacing default radio groups with custom ones.
 * @version: 1.1
 */
(function($){
	
	$.fn.customRadio = function(opts){
		opts = $.extend({
			node:			'.radio',
			elem:			'div',
			customRadio:	'customRadio',
			checked:		'checked'
		}, opts);
			
		return this.each(function(){
			var $this = $(this).attr('role', 'radiogroup'),
				$nodes = $this.find(opts.node);
				
			if(opts.elem == 'a'){opts.elem = 'a href="#"';}
				
			$nodes.each(function(i){
				var $this = $(this),
					$customRadio = $('<' + opts.elem + ' style="display:block;" tabIndex="0" role="radio" aria-checked="false" class="' + opts.customRadio + '" />')
						.prependTo($(this))
						.click(function(e){
							e.preventDefault();
							$this.find('input').click();
						}),
					$radio = $(this)
						.find('input')
						.hide()
						.click(function(){
							check(i);
						});
				
				if($.browser.msie && $.browser.version.substr(0,1)<9){ //ie<9 doesn't fire click events on hidden inputs
					$(this).find('label').click(function(){
						$radio.click();
					});
				}
					
				$this.bind('checkradio', function(e, index){
					check(index);
				});
				
				$customRadio.keyup(function(e){
					if(e.keyCode == 32){ //space key
						$radio.click();
					}
				});
			});
			
			var $customRadios = $this.find('.' + opts.customRadio);
			
			$nodes.each(function(i){
				if($(this).find('input').is(':checked')){
					check(i);
				}
			});
			
			/**
			 * Checks the radio button with the index and unchecks all the others.
			 * 
			 * @param: index {Int} - index of radio button to check
			 */
			function check(index){
				$nodes.each(function(i){
					if(i == index){
						$(this).find('.' + opts.customRadio)
							.addClass(opts.checked)
							.attr('aria-checked', 'true')
							.focus();
					}
					else{
						$(this).find('.' + opts.customRadio)
							.removeClass(opts.checked)
							.attr('aria-checked', 'false');
					}
				});
				$this.trigger('checkedradio', index);
				$this.find('input').eq(index).attr('checked', 'checked');
			}
		});
	}
	
})(jQuery);