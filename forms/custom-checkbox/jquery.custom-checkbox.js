/**
 * @projectDescription: jQuery plugin for replacing default checkboxes with custom ones.
 * @version: 1.1
 */
(function($){
	
	$.fn.customCheckbox = function(opts){
		opts = $.extend({
			customCheckbox: 'customCheckbox',
			elem:			'div',
			checked:		'checked'
		}, opts);
			
		return this.each(function(){
			if(opts.elem == 'a'){opts.elem = 'a href="#"';}
			
			var $this = $(this),
				$checkbox = $this.find('input')
					.hide()
					.click(function(){
						toggle();
					}),
				$customCheckbox = $('<' + opts.elem + ' tabIndex="0" role="checkbox" aria-checked="false" class="' + opts.customCheckbox + '" />')
					.prependTo($this)
					.click(function(e){
						e.preventDefault();
						toggle(true);
					});
					
			$this.bind('togglecheckbox', function(){
				toggle(true);
			});
			
			if($checkbox.is(':checked')){
				check(true);
			}
			
			$customCheckbox.keyup(function(e){
				if(e.keyCode == 32){ //space key
					toggle(true);
				}
			});
			/**
			 * Toggles a checkbox by changing its state to the opposite
			 * 
			 * @param: {boolean} customClick - whether the custom or real checkbox was clicked
			 */
			function toggle(customClick){
				if($checkbox.is(':checked')){
					check(!customClick);
				}
				else{
					check(customClick);
				}
			}
			/**
			 * Adds or removes the 'checked' class, and sets the 'checked' attribute of the actual checkbox
			 * 
			 * @param: {string} checked - value of 'checked' attribute
			 */
			function check(checked){
				$customCheckbox.toggleClass(opts.checked);
				if(checked){
					$checkbox.attr('checked', 'checked');
					$customCheckbox.attr('aria-checked', 'true');
					$this.trigger('checkedcheckbox');
				}
				else{
					$checkbox.attr('checked', '');
					$customCheckbox.attr('aria-checked', 'false');
					$this.trigger('uncheckedcheckbox');
				}
			}
		});
	}
	
})(jQuery);