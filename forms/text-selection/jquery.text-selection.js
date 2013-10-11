/** 
 * @projectDescription: Sets or returns the current text selection. 
 * N.B. This extension is currently only designed for use with text inputs.
 * @version: 1.0
 */
(function($){
	/**
	 * select text - abstracts away browser specific text slection code
	 * 
	 * @param: {HTMLElement} elem - html element
	 * @param: {Integer} start - start index of character to start selection on
	 * @param: {Integer} end - end index of character to end selection on
	 * @returns: {Boolean} true if browser supports text selection. otherwise false
	 */
	function setSelected(elem, start, end){
			var value = '';
			if(elem.tagName.toLowerCase() == 'input'){
				value = elem.value;
			}
			if(!end){
				end = value.length;
			}
			if(elem.createTextRange){//IE
				var range = elem.createTextRange();
				range.moveStart("character", start);
				range.moveEnd("character", value.length - end);//0 index from end
				range.select();	
				return true;
			}else if(elem.setSelectionRange){//FF
				elem.setSelectionRange(start, end);
				return true;
			}else{
				return false;
			}		
	}
	
	/**
	 * get selected text
	 * 
	 * @param: {HTMLElement} elem - html element
	 * @returns {String} the currently selected text
	 */
	function getSelected(elem){
		var selectedText = '';
		if (document.selection){//IE
			var sel = document.selection.createRange();
			selectedText = sel.text;
		}
		else if (typeof elem.selectionStart != 'undefined'){//FF
			var startPos = elem.selectionStart;
			var endPos = elem.selectionEnd;
			selectedText = elem.value.substring(startPos, endPos)
			if(!selectedText){ selectedText == '' }; 
		}
		return selectedText;
	}
	
	$.fn.selection = function(start, end){
		this.each(function(){
			if (arguments.length > 0) {
				setSelected(this, start, end);
				return this;
			}
			else {
				return getSelected(this);
			}
		})
	}
	
})(jQuery);
