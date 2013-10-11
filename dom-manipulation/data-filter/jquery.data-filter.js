/*
 * @projectDescription jQuery plugin for filtering content via tab selection
 * @version 1.2
 * 
 */

(function($){
	
	$.fn.dataFilter = function(opts) {
		
		opts = $.extend({
			duration: 0,
			filterElements: 'div',
			includeNoDataElems: false,
			html5: false
		}, opts);
		
		var $obj = this;
		$obj.busy = false;
		
		return this.each(function() {
			$obj.find('.tabs').show();
			$obj.find('.tabs a').bind('click', function(e) {
				if(!$obj.busy) {
					filter(getDataAttributes(e.target));
					
					$obj.find('.tabs li.selected').removeClass('selected');
					$(this).parent().addClass('selected');
				}
				return false;
			});				
		});
		
		/*
		 * Creates a jQuery statement for selecting elements whose data attributes match.
		 * Shows matching elements and hides unmatching elements. 
		 * 
		 * @param: {object} data - the data attributes to be filtered against
		 */
		function filter(data) {
			var matchedElements = opts.filterElements;
			
			for(attr in data) {
				if(opts.html5) {
					matchedElements += '[' + attr + '=' + data[attr] + ']';					
				}
				else {
					matchedElements += '.' + attr + '_' + data[attr];										
				}
			}
			
			for(attr in data) {
				if(opts.html5) {
					matchedElements += ',' + opts.filterElements + '[' + attr + '=all]';
				}
				else {
					matchedElements += ',' + opts.filterElements + '.' + attr + '_all';
				}
			}
			
			if($obj.find(matchedElements).is(':hidden') || $obj.find(opts.filterElements).not(matchedElements).is(':visible')) {
				$obj.busy = true;			
				$obj.find(matchedElements+':hidden').slideDown(opts.duration, function() {
					if($obj.find(opts.filterElements+':visible').not(matchedElements).length > 0) {
						$obj.find(opts.filterElements+':visible').not(matchedElements).slideUp(opts.duration, function() {
							$obj.busy = false;
						});	
					}
					else {
						$obj.busy = false;
					}
				});				
			}
		}
		
		/*
		 * Loops through the DOM attributes of an HTML element and puts any that begin with 'data-' into an object 
		 * 
		 * @param: {HTMLElement} elem - a single DOM element. e.g. the target of a click event 
		 * @returns: {object} data - the data attribute name and values of the element
		 */
		function getDataAttributes(elem) {
			var data = {};

			if(opts.html5) {
				for(var i=0;i<elem.attributes.length;i++) {
					if(elem.attributes.item(i).nodeName.slice(0,5) === 'data-') {
						data[elem.attributes.item(i).nodeName] = elem.attributes.item(i).nodeValue;
					}
				}				
			}
			else {
				var classes = elem.className.split(" ");
				for(var i=0;i<classes.length;i++) {
					classes[i].split("=");
					if(classes[i].slice(0,5) === 'data-') {
						data[classes[i].split("_")[0]] = classes[i].split("_")[1];
					}
				}				
			}
			
			return data;							
		}
		
	};
	
})(jQuery);
