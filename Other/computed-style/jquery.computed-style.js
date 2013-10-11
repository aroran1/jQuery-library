/** 
 * @projectDescription: jQuery extension to get computed CSS styles
 * @version: 1.0
 */

(function($){

	/**
	 * Function for fetching computed style information about an element. N.B that way style
	 * information is stored internally does not always reflect the source. Representations
	 * may also vary cross-browser.
	 * @param {HTMLElement} elem element to get style information for
	 * @param {String} strCssRule css property rule in either cammel case or hyphenated
	 * @return {String} the properties value
	 */
	function getStyle(elem, strCssRule){
		var elem = (elem.get) ? elem.get(0) : elem;
		var strValue = "";
		try{
			strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
				return p1.toUpperCase();
			});
		}
		catch(e){}
		if(document.defaultView && document.defaultView.getComputedStyle){
			strValue = document.defaultView.getComputedStyle(elem, "")[strCssRule];
		}
		else if(elem.currentStyle){
			strValue = elem.currentStyle[strCssRule];
		}
		return strValue;
	}
	
	$.fn.getCompStyle = function(property){
		return getStyle(this[0], property);
	}
	
})(jQuery);
