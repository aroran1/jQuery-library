/**
 * @projectDescription: jQuery plugin for limiting the maximum number of characters in a textarea
 * @version: 1.0
 */
 
(function($){

	$.fn.maxlength = function(n) {
		
		return $(this).each(function(){
			var $this = $(this);
			$this.keypress(function(e){
				if($this.val().length >= n && (e.charCode || e.keyCode) && e.which != 8 && e.which) {
					return false;
				}
			});
			$this.keyup(function(e){
				if($this.val().length > n) {
					$this.val($this.val().substr(0,n));
				}
			});
		});
	}

})(jQuery)