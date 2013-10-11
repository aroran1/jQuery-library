/*
 * @projectDescription Equalises the height of a set of HTML elements to the largest in the set
 * @version 1.0
 * 
 */

(function($){
	
	$.fn.equalHeights = function(elem) {
		
		var isIE6 = $.browser.msie && $.browser.version === '6.0';
		
		return this.each(function() {
			var $obj = $(this);
			$obj.maxHeight = 0;
			
			var $elems = elem ? $obj.find(elem) : $obj.children();
			
			$elems.each(function(i) {
				if($(this).height() > $obj.maxHeight) $obj.maxHeight = $(this).height();				
			});
			
			var heightProp = isIE6 ? 'height' : 'min-height';
			
			$elems.css(heightProp, $obj.maxHeight);
		});

	}
		
})(jQuery);
